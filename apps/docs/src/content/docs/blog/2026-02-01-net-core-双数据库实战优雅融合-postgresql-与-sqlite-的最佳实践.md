---
title: ".NET Core 双数据库实战：优雅融合 PostgreSQL 与 SQLite 的最佳实践"
date: 2026-02-01
---

# .NET Core 双数据库实战：让 PostgreSQL 与 SQLite 和平共处

> 在构建现代化应用时，我们经常面临这样的抉择：开发环境渴望轻量便捷，而生产环境则需要高并发与高可用。本文将分享如何在 .NET Core 项目中优雅地同时支持 PostgreSQL 和 SQLite，实现“开发用 SQLite，生产用 PG”的最佳实践。

<!-- truncate -->

## 背景

在软件开发中，环境差异化一直是困扰开发团队的难题之一。以我们正在构建的 **HagiCode** 平台为例，这是一个基于 ASP.NET Core 10 和 React 的 AI 辅助开发系统，内部集成了 Orleans 进行分布式状态管理，技术栈相当现代且复杂。

在项目初期，我们遇到了一个典型的工程痛点：开发人员希望本地环境能够“开箱即用”，不希望安装和配置繁重的 PostgreSQL 数据库；但在生产环境中，我们需要处理高并发写入和复杂的 JSON 查询，这时轻量级的 SQLite 又显得力不从心。

如何在保持代码库统一的前提下，让应用既能像客户端软件一样利用 SQLite 的便携性，又能像企业级服务一样发挥 PostgreSQL 的强悍性能？这就是本文要探讨的核心问题。

## 关于 HagiCode

本文分享的双数据库适配方案，直接来源于我们在 **HagiCode** 项目中的实战经验。HagiCode 是一个集成了 AI 提示词管理和 OpenSpec 工作流的下一代开发平台。正是为了兼顾开发者的体验和生产环境的稳定性，我们探索出了这套行之有效的架构模式。

欢迎访问我们的 GitHub 仓库了解项目全貌：[HagiCode-org/site](https://github.com/HagiCode-org/site)。

## 核心内容一：架构设计与统一抽象

要在 .NET Core 中实现双数据库支持，核心思想是“依赖抽象而非具体实现”。我们需要把数据库的选择权从业务代码中剥离出来，交给配置层决定。

### 设计思路

1.  **统一接口**：所有的业务逻辑都应依赖于 `DbContext` 基类或自定义的接口，而不是具体的 `PostgreSqlDbContext`。
2.  **配置驱动**：通过 `appsettings.json` 中的配置项，在应用启动时动态决定加载哪个数据库提供程序。
3.  **特性隔离**：针对 PostgreSQL 特有的功能（如 JSONB）进行适配处理，确保在 SQLite 中也能降级运行。

### 代码实现：动态上下文配置

在 ASP.NET Core 的 `Program.cs` 中，我们不应硬编码 `UseNpgsql` 或 `UseSqlite`。相反，我们应该读取配置来动态决定。

首先，定义配置类：

```csharp
public class DatabaseSettings
{
    public const string SectionName = "Database";
    
    // 数据库类型：PostgreSQL 或 SQLite
    public string DbType { get; set; } = "PostgreSQL"; 
    
    // 连接字符串
    public string ConnectionString { get; set; } = string.Empty;
}
```

然后，在 `Program.cs` 中根据配置注册服务：

```csharp
// 读取配置
var databaseSettings = builder.Configuration.GetSection(DatabaseSettings.SectionName).Get<DatabaseSettings>();

// 注册 DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    if (databaseSettings?.DbType?.ToLower() == "sqlite")
    {
        // SQLite 配置
        options.UseSqlite(databaseSettings.ConnectionString);
        
        // SQLite 的并发写入限制处理
        // 注意：在生产环境中建议开启 WAL 模式以提高并发性能
    }
    else
    {
        // PostgreSQL 配置（默认）
        options.UseNpgsql(databaseSettings.ConnectionString, npgsqlOptions =>
        {
            // 开启 JSONB 支持，这在处理 AI 对话记录时非常有用
            npgsqlOptions.UseJsonNet(); 
        });
        
        // 配置连接池重连策略
        options.EnableRetryOnFailure(3);
    }
});
```

## 核心内容二：处理差异性与迁移策略

PostgreSQL 和 SQLite 虽然都支持 SQL 标准，但在具体特性和行为上存在显著差异。如果不处理好这些差异，很可能会出现“本地跑得通，上线就报错”的尴尬情况。

### 1. JSON 类型的处理

在 HagiCode 中，我们需要存储大量的提示词和 AI 元数据，这通常涉及 JSON 列。
- **PostgreSQL**：拥有原生的 `JSONB` 类型，查询性能极佳。
- **SQLite**：没有原生的 JSON 类型（新版本有 JSON1 扩展，但对象映射上仍有差异），通常存储为 TEXT。

**解决方案**：
在 EF Core 的实体映射中，我们将其配置为可转换的类型。

```csharp
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    // 配置实体
    modelBuilder.Entity<PromptTemplate>(entity => 
    {
        entity.Property(e => e.Metadata)
              .HasColumnType("jsonb") // PG 使用 jsonb
              .HasConversion(
                  v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                  v => JsonSerializer.Deserialize<Dictionary<string, object>>(v, (JsonSerializerOptions)null)
              ); 
    });
}
```

当使用 SQLite 时，虽然 `HasColumnType("jsonb")` 会被忽略或产生警告，但由于配置了 `HasConversion`，数据会被正确地序列化和反序列化为字符串存入 TEXT 字段，从而保证了兼容性。

### 2. 迁移策略的分离

绝对不要试图让同一套 Migration 脚本同时适配 PG 和 SQLite。由于主键生成策略、索引语法等的不同，这必然会导致失败。

**推荐实践**：
维护两个迁移分支或项目。在 HagiCode 的开发流中，我们是这样处理的：

1.  **开发阶段**：主要在 SQLite 下工作。使用 `Add-Migration Init_Sqlite -OutputDir Migrations/Sqlite`。
2.  **适配阶段**：开发完一段功能后，切换连接字符串指向 PostgreSQL，执行 `Add-Migration Init_Postgres -OutputDir Migrations/Postgres`。
3.  **自动化脚本**：编写一个简单的 PowerShell 或 Bash 脚本，根据当前环境变量自动应用对应的迁移。

```bash
# 简单的部署逻辑伪代码
if [ "$DATABASE_PROVIDER" = "PostgreSQL" ]; then
    dotnet ef database update --project Migrations.Postgres
else
    dotnet ef database update --project Migrations.Sqlite
fi
```

## 核心内容三：HagiCode 的实战经验总结

在将 **HagiCode** 从单一数据库重构为双数据库支持的过程中，我们踩过一些坑，也总结了一些关键的经验，希望能给大家避坑。

### 1. 并发与事务的区别

PostgreSQL 是服务端-客户端架构，支持高并发写入，事务隔离级别非常强大。而 SQLite 是文件锁机制，写入操作会锁定整个数据库文件（除非开启 WAL 模式）。

**建议**：
在编写涉及频繁写入的业务逻辑时（例如实时保存用户的编辑状态），一定要考虑到 SQLite 的锁机制。在设计 **HagiCode** 的 OpenSpec 协作模块时，我们引入了“写前合并”机制，减少数据库的直接写入频率，从而在两种数据库下都能保持高性能。

### 2. 连接字符串的生命周期管理

PostgreSQL 的连接建立成本较高，依赖连接池。而 SQLite 连接非常轻量，但如果不及时释放，文件锁可能会导致后续操作超时。

在 `Program.cs` 中，我们可以针对不同数据库做精细化调整：

```csharp
if (databaseSettings?.DbType?.ToLower() == "sqlite")
{
    // SQLite：保持连接开启能提升性能，但要注意文件锁
    options.UseSqlite(connectionString, sqliteOptions =>
    {
        // 设置命令超时时间
        sqliteOptions.CommandTimeout(30);
    });
}
else
{
    // PG：利用连接池
    options.UseNpgsql(connectionString, npgsqlOptions =>
    {
        npgsqlOptions.MaxBatchSize(100);
        npgsqlOptions.CommandTimeout(30);
    });
}
```

### 3. 测试覆盖的重要性

很多开发者（包括我们团队早期的成员）容易犯一个错误：只在开发环境（通常是 SQLite）跑单元测试。

我们在 HagiCode 的 CI/CD 流水线中强制加入了 GitHub Action 步骤，确保每次 Pull Request 都要跑过 PostgreSQL 的集成测试。

```yaml
# .github/workflows/test.yml 示例片段
- name: Run Integration Tests (PostgreSQL)
  run: |
    docker-compose up -d db_postgres
    dotnet test --filter "Category=Integration"
```

这帮我们拦截了无数次关于 SQL 语法差异、大小写敏感性的 Bug。

## 总结

通过引入抽象层和配置驱动的依赖注入，我们在 **HagiCode** 项目中成功实现了 PostgreSQL 和 SQLite 的“双轨制”运行。这不仅极大降低了新开发者的上手门槛（不需要装 PG），也为生产环境提供了坚实的性能保障。

回顾一下关键点：
1.  **抽象至上**：业务代码不依赖具体数据库实现。
2.  **配置分离**：开发和生产使用不同的 `appsettings.json`。
3.  **迁移分离**：不要尝试一套 Migration 走天下。
4.  **特性降级**：在 SQLite 中以兼容性优先，在 PostgreSQL 中以性能优先。

这种架构模式不仅适用于 HagiCode，也适用于任何需要在轻量级开发和重量级生产之间寻找平衡的 .NET 项目。

---

如果本文对你有帮助，欢迎来 GitHub 给个 Star，或者直接体验 **HagiCode** 带来的高效开发流程：
- 来 GitHub 给个 Star：[github.com/HagiCode-org/site](https://github.com/HagiCode-org/site)
- 访问官网了解更多：[hagicode.com](https://hagicode.com)
- 观看 30 分钟实战演示：[www.bilibili.com/video/BV1pirZBuEzq/](https://www.bilibili.com/video/BV1pirZBuEzq/)
- 一键安装体验：[hagicode.com/installation/docker-compose](https://hagicode.com/installation/docker-compose)

公测已开始，欢迎安装体验！



---

感谢您的阅读,如果您觉得本文有用,快点击下方点赞按钮👍,让更多的人看到本文。

本内容采用人工智能辅助协作,经本人审核,符合本人观点与立场。

- **本文作者:** [newbe36524](https://www.newbe.pro)
- **本文链接:** [https://hagicode.com/blog/2026-02-01-dotnet-core-dual-database-postgresql-sqlite/](https://hagicode.com/blog/2026-02-01-dotnet-core-dual-database-postgresql-sqlite/)
- **版权声明:** 本博客所有文章除特别声明外,均采用 BY-NC-SA 许可协议。转载请注明出处!