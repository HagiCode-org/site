---
title: "GitHub Issues 集成"
date: 2026-01-22
truncate: true
---

# 从零构建 GitHub Issues 集成：HagiCode 的前端直连实践

> 本文记录了在 HagiCode 平台中集成 GitHub Issues 的全过程。我们将探讨如何通过"前端直连 + 后端最小化"的架构，在保持后端轻量的同时，实现安全的 OAuth 认证与高效的 Issues 同步。

## 背景：为什么要集成 GitHub？

HagiCode 作为一个 AI 辅助开发平台，核心价值在于连接想法与实现。但在实际使用中，我们发现用户在 HagiCode 中完成了 Proposal（提案）后，往往需要手动将内容复制到 GitHub Issues 中进行项目跟踪。

这带来了几个明显的痛点：

1.  **工作流割裂**：用户需要在两个系统之间来回切换，体验不仅不流畅，还容易导致关键信息在复制粘贴的过程中丢失。
2.  **协作不便**：团队其他成员习惯在 GitHub 上查看任务，无法直接看到 HagiCode 中的提案进展。
3.  **重复劳动**：每当提案更新，就要人工去 GitHub 更新对应的 Issue，增加不必要的维护成本。

为了解决这个问题，我们决定引入 **GitHub Issues Integration** 功能，打通 HagiCode 会话与 GitHub 仓库的连接，实现"一键同步"。

## 关于 HagiCode

> 嘿，介绍一下我们正在做的东西

我们正在开发 **HagiCode** —— 一款 AI 驱动的代码智能助手，让开发体验变得更智能、更便捷、更有趣。

**智能** —— AI 全程辅助，从想法到代码，让编码效率提升数倍。**便捷** —— 多线程并发操作，充分利用资源，开发流程顺畅无阻。**有趣** —— 游戏化机制和成就系统，让编码不再枯燥，充满成就感。

项目正在快速迭代中，如果你对技术写作、知识管理或者 AI 辅助开发感兴趣，欢迎来 [GitHub](https://github.com/HagiCode-org/site) 看看～

---

## 技术选型：前端直连 vs 后端代理

在设计集成方案时，摆在我们面前的有两条路：传统的"后端代理模式"和更激进的"前端直连模式"。

### 方案对比

在传统的**后端代理模式**中，前端所有的请求都要先经过我们的后端，再由后端去调用 GitHub API。这虽然逻辑集中，但给后端带来了不小的负担：

1.  **后端臃肿**：需要编写专门的 GitHub API 客户端封装，还要处理 OAuth 的复杂状态机。
2.  **Token 风险**：用户的 GitHub Token 必须存储在后端数据库中，虽然可以加密，但毕竟增加了安全风险面。
3.  **开发成本**：需要数据库迁移来存储 Token，还需要维护一套额外的同步服务。

而**前端直连模式**则要轻量得多。在这个方案中，我们只利用后端来处理最敏感的"密钥交换"环节（OAuth callback），获取到 Token 后，直接存在浏览器的 localStorage 里。后续创建 Issue、更新评论等操作，直接由前端发 HTTP 请求到 GitHub。

| 对比维度 | 后端代理模式 | 前端直连模式 |
| :--- | :--- | :--- |
| **后端复杂度** | 需要完整的 OAuth 服务和 GitHub API 客户端 | 仅需一个 OAuth 回调端点 |
| **Token 管理** | 需加密存储在数据库，有泄露风险 | 存储在浏览器，仅用户自己可见 |
| **实施成本** | 需数据库迁移、多服务开发 | 主要是前端工作量 |
| **用户体验** | 逻辑统一，但服务器延迟可能稍高 | 响应极快，直接与 GitHub 交互 |

考虑到我们要的是快速集成和最小化后端改动，**最终我们采用了"前端直连模式"**。这就像给浏览器发了一张"临时通行证"，拿到证之后，浏览器就可以自己去 GitHub 办事了，不需要每次都找后端管理员批准。

---

## 核心设计：数据流与安全

在确定架构后，我们需要设计具体的数据流。整个同步流程的核心在于如何安全地获取 Token 并高效地利用它。

### 整体架构图

整个系统可以抽象为三个角色：浏览器（前端）、HagiCode 后端、GitHub。

```text
+--------------+        +--------------+        +--------------+
|  前端 React  |        |    后端      |        |    GitHub    |
|              |        |   ASP.NET    |        |    REST API  |
|  +--------+  |        |              |        |              |
|  |  OAuth |--+--------> /callback    |        |              |
|  |  流程  |  |        |              |        |              |
|  +--------+  |        |              |        |              |
|              |        |              |        |              |
|  +--------+  |        |  +--------+  |        |  +--------+  |
|  |GitHub  |  +------------>Session |  +----------> Issues |  |
|  |API     |  |        |  |Metadata|  |        |  |        |  |
|  |直连    |  |        |  +--------+  |        |  +--------+  |
|  +--------+  |        |              |        |              |
+--------------+        +--------------+        +--------------+
```

**关键点在于**：只有 OAuth 的一小步（获取 code 换 token）需要经过后端，之后的粗活累活（创建 Issue）都是前端直接跟 GitHub 打交道。

### 同步数据流详解

当用户点击 HagiCode 界面上的"Sync to GitHub"按钮时，会发生一系列复杂的动作：

```text
用户点击 "Sync to GitHub"
         │
         ▼
1. 前端检查 localStorage 获取 GitHub Token
         │
         ▼
2. 格式化 Issue 内容（将 Proposal 转换为 Markdown）
         │
         ▼
3. 前端直接调用 GitHub API 创建/更新 Issue
         │
         ▼
4. 调用 HagiCode 后端 API 更新 Session.metadata (存储 Issue URL 等信息)
         │
         ▼
5. 后端通过 SignalR 广播 SessionUpdated 事件
         │
         ▼
6. 前端接收事件，更新 UI 显示"已同步"状态
```

### 安全设计

安全问题始终是集成第三方服务的重中之重。我们做了以下考量：

1.  **防 CSRF 攻击**：在 OAuth 跳转时，生成随机的 `state` 参数并存入 sessionStorage。回调时严格验证 state，防止请求被伪造。
2.  **Token 存储隔离**：Token 仅存储在浏览器的 `localStorage` 中，利用同源策略（Same-Origin Policy），只有 HagiCode 的脚本才能读取，避免了服务器端数据库泄露波及用户。
3.  **错误边界**：针对 GitHub API 常见的错误（如 401 Token 过期、422 验证失败、429 速率限制），设计了专门的错误处理逻辑，给用户以友好的提示。

---

## 实践：代码实现细节

纸上得来终觉浅，咱们来看看具体的代码是怎么实现的。

### 1. 后端最小化改动

后端只需要做两件事：存储同步信息、处理 OAuth 回调。

**数据库变更**
我们只需要在 `Sessions` 表增加一个 `Metadata` 列，用来存储 JSON 格式的扩展信息。

```sql
-- 添加 metadata 列到 Sessions 表
ALTER TABLE "Sessions" ADD COLUMN "Metadata" text NULL;
```

**实体与 DTO 定义**

```csharp
// src/HagiCode.DomainServices.Contracts/Entities/Session.cs
public class Session : AuditedAggregateRoot<SessionId>
{
    // ... 其他属性 ...

    /// <summary>
    /// JSON metadata for storing extension data like GitHub integration
    /// </summary>
    public string? Metadata { get; set; }
}

// DTO 定义，方便前端序列化
public class GitHubIssueMetadata
{
    public required string Owner { get; set; }
    public required string Repo { get; set; }
    public int IssueNumber { get; set; }
    public required string IssueUrl { get; set; }
    public DateTime SyncedAt { get; set; }
    public string LastSyncStatus { get; set; } = "success";
}

public class SessionMetadata
{
    public GitHubIssueMetadata? GitHubIssue { get; set; }
}
```

### 2. 前端 OAuth 流程

这是连接的入口。我们使用标准的 Authorization Code Flow。

```typescript
// src/HagiCode.Client/src/services/githubOAuth.ts

// 生成授权 URL 并跳转
export async function generateAuthUrl(): Promise<string> {
  const state = generateRandomString(); // 生成防 CSRF 的随机串
  sessionStorage.setItem('hagicode_github_state', state);
  
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: window.location.origin + '/settings?tab=github&oauth=callback',
    scope: ['repo', 'public_repo'].join(' '),
    state: state,
  });
  
  return `https://github.com/login/oauth/authorize?${params.toString()}`;
}

// 在回调页面处理 Code 换取 Token
export async function exchangeCodeForToken(code: string, state: string): Promise<GitHubToken> {
  // 1. 验证 State 防止 CSRF
  const savedState = sessionStorage.getItem('hagicode_github_state');
  if (state !== savedState) throw new Error('Invalid state parameter');

  // 2. 调用后端 API 进行 Token 交换
  // 注意：这里必须经过后端，因为需要 ClientSecret，不能暴露在前端
  const response = await fetch('/api/GitHubOAuth/callback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, state, redirectUri: window.location.origin + '/settings?tab=github&oauth=callback' }),
  });

  if (!response.ok) throw new Error('Failed to exchange token');
  
  const token = await response.json();
  
  // 3. 存入 LocalStorage
  saveToken(token);
  return token;
}
```

### 3. GitHub API 客户端封装

有了 Token 之后，我们就需要一个强有力的工具来调 GitHub API。

```typescript
// src/HagiCode.Client/src/services/githubApiClient.ts

const GITHUB_API_BASE = 'https://api.github.com';

// 核心请求封装
async function githubApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('gh_token');
  if (!token) throw new Error('Not connected to GitHub');
  
  const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json', // 指定 API 版本
    },
  });
  
  // 错误处理逻辑
  if (!response.ok) {
    if (response.status === 401) throw new Error('GitHub Token 失效，请重新连接');
    if (response.status === 403) throw new Error('无权访问该仓库或超出速率限制');
    if (response.status === 422) throw new Error('Issue 验证失败，可能标题重复');
    throw new Error(`GitHub API Error: ${response.statusText}`);
  }
  
  return response.json();
}

// 创建 Issue
export async function createIssue(owner: string, repo: string, data: { title: string, body: string, labels: string[] }) {
  return githubApi(`/repos/${owner}/${repo}/issues`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
```

### 4. 内容格式化与同步

最后一步，就是把 HagiCode 的 Session 数据转换成 GitHub Issue 的格式。这有点像"翻译"工作。

```typescript
// 将 Session 对象转换为 Markdown 字符串
function formatIssueForSession(session: Session): string {
  let content = `# ${session.title}\n\n`;
  content += `**> HagiCode Session:** #${session.code}\n`;
  content += `**> Status:** ${session.status}\n\n`;
  content += `## Description\n\n${session.description || 'No description provided.'}\n\n`;
  
  // 如果是 Proposal 类型，添加额外字段
  if (session.type === 'proposal') {
    content += `## Chief Complaint\n\n${session.chiefComplaint || ''}\n\n`;
    // 添加一个深链接，方便从 GitHub 跳回 HagiCode
    content += `---\n\n**[View in HagiCode](hagicode://sessions/${session.id})**\n`;
  }
  
  return content;
}

// 点击同步按钮的主逻辑
const handleSync = async (session: Session) => {
  try {
    const repoInfo = parseRepositoryFromUrl(session.repoUrl); // 解析仓库 URL
    if (!repoInfo) throw new Error('Invalid repository URL');

    toast.loading('正在同步到 GitHub...');
    
    // 1. 格式化内容
    const issueBody = formatIssueForSession(session);
    
    // 2. 调用 API
    const issue = await githubApiClient.createIssue(repoInfo.owner, repoInfo.repo, {
      title: `[HagiCode] ${session.title}`,
      body: issueBody,
      labels: ['hagicode', 'proposal', `status:${session.status}`],
    });
    
    // 3. 更新 Session Metadata (保存 Issue 链接)
    await SessionsService.patchApiSessionsSessionId(session.id, {
      metadata: {
        githubIssue: {
          owner: repoInfo.owner,
          repo: repoInfo.repo,
          issueNumber: issue.number,
          issueUrl: issue.html_url,
          syncedAt: new Date().toISOString(),
        }
      }
    });

    toast.success('同步成功！');
  } catch (err) {
    console.error(err);
    toast.error('同步失败，请检查 Token 或网络');
  }
};
```

---

## 总结与展望

通过这套"前端直连"方案，我们用最少的后端代码实现了 GitHub Issues 的无缝集成。

### 收获
1.  **开发效率高**：后端改动极小，主要是数据库加一个字段和一个简单的 OAuth 回调接口，大部分逻辑都在前端完成。
2.  **安全性好**：Token 不经过服务器数据库，降低了泄露风险。
3.  **用户体验佳**：直接从前端发起请求，响应速度快，不需要经过后端中转。

### 注意事项
在实际部署时，有几个坑大家要注意：
- **OAuth App 设置**：记得在 GitHub OAuth App 设置里填正确的 `Authorization callback URL`（通常是 `http://localhost:3000/settings?tab=github&oauth=callback`）。
- **速率限制**：GitHub API 对未认证请求限制较严，但用 Token 后通常足够（5000次/小时）。
- **URL 解析**：用户输入的 Repo URL 千奇百怪，记得正则要匹配 `.git` 后缀、SSH 格式等情况。

### 后续增强
目前的功能还是单向同步（HagiCode -> GitHub）。未来我们计划通过 GitHub Webhooks 实现双向同步，比如在 GitHub 里关闭 Issue，HagiCode 这边的会话状态也能自动更新。这需要我们在后端暴露一个 Webhook 接收端点，这也是下一步要做的有趣工作。

希望这篇文章能给你的第三方集成开发带来一点灵感！如果有问题，欢迎在 [HagiCode GitHub](https://github.com/HagiCode-org/site) 上提 Issue 讨论。