# Docs Site 规范变更

## ADDED Requirements

### Requirement: Content Collections Image References

文档站点 SHOULD 使用相对路径方式引用图片资源，图片文件 MUST 存储在 `src/content/docs/img/` 目录下，并与对应的 Markdown 文件保持相对路径关系。

#### Scenario: 新建文档页面使用正确的图片引用方式

- **WHEN** 开发者在 `src/content/docs/` 下创建新的 Markdown 文档
- **AND** 需要引用图片资源
- **THEN** 图片文件 MUST 存放在 `src/content/docs/img/` 目录下
- **AND** 图片引用 MUST 使用相对路径格式 `![图片描述](./img/path/to/image.png)`
- **AND** 相对路径 MUST 从 Markdown 文件位置计算

#### Scenario: 迁移现有文档到新的图片引用方式

- **WHEN** 开发者将现有文档的图片引用从绝对路径迁移到相对路径
- **THEN** 图片文件 MUST 从 `public/img/` 移动到 `src/content/docs/img/`
- **AND** Markdown 中的引用路径 MUST 从 `/img/xxx.png` 更新为 `./img/xxx.png`
- **AND** 移动后 MUST 运行构建验证确保无 404 错误

### Requirement: Image Path Type Safety

图片引用路径 MUST 在开发阶段可被验证，构建系统 SHOULD 在编译时检测不存在的图片引用并报错。

#### Scenario: 开发时引用不存在的图片

- **WHEN** 开发者在 Markdown 中引用不存在的图片路径
- **THEN** TypeScript 类型检查或构建过程 MUST 报告错误
- **AND** 错误信息 MUST 包含具体的文件路径和行号
- **AND** 构建 MUST 失败直到路径错误被修复

#### Scenario: 重命名图片文件后的路径验证

- **WHEN** 开发者重命名 `src/content/docs/img/` 下的图片文件
- **THEN** 引用该图片的所有 Markdown 文件 MUST 显示类型错误
- **AND** 开发者 CAN 使用 IDE 的重命名功能自动更新所有引用

### Requirement: Image Directory Structure

图片资源目录结构 MUST 与内容组织保持一致，`src/content/docs/img/` 目录 SHOULD 按照功能模块组织，并支持共享资源管理。

#### Scenario: 按功能模块组织图片目录

- **WHEN** 开发者为特定功能模块添加图片
- **THEN** 图片 MUST 存放在对应的子目录中（如 `src/content/docs/img/quick-start/`）
- **AND** 目录命名 SHOULD 与内容目录结构匹配
- **AND** 允许使用描述性的子目录名称（如 `value-proposition-proposal-driven/`）

#### Scenario: 共享图片资源管理

- **WHEN** 多个文档需要引用相同的图片
- **THEN** 图片 CAN 存放在 `src/content/docs/img/shared/` 目录
- **AND** 引用时 MUST 使用正确的相对路径指向共享资源
- **AND** SHOULD 添加注释说明共享用途

## MODIFIED Requirements

### Requirement: Markdown Image References

文档页面中的图片引用 MUST 使用相对路径而非绝对路径，以确保内容与资源的关联性和类型安全。

#### Scenario: 编写包含图片的 Markdown 内容

- **WHEN** 开发者在 Markdown 文件中添加图片引用
- **THEN** MUST 使用相对路径语法 `![描述](./img/path/to/image.png)`
- **AND** MUST NOT 使用绝对路径语法 `![描述](/img/path/to/image.png)`
- **AND** 路径 MUST 相对于当前 Markdown 文件的位置

#### Scenario: IDE 自动补全图片路径

- **WHEN** 开发者在 Markdown 中输入图片引用
- **THEN** IDE SHOULD 提供可用的图片文件自动补全
- **AND** 输入完成后 SHOULD 显示图片预览（如 IDE 支持）
- **AND** 路径错误应在保存时立即显示警告

### Requirement: Static Asset Management Strategy

文档相关的静态图片资源 MUST 优先存储在内容集合目录内，而非 public 目录，以充分利用 Astro Content Collections 的类型安全优势。

#### Scenario: 新增图片资源时的存储位置选择

- **WHEN** 开发者需要添加新的图片资源
- **THEN** 如果图片是文档内容的一部分，MUST 存放在 `src/content/docs/img/`
- **AND** 如果图片是站点资源（如 favicon、logo），CAN 存放在 `public/`
- **AND** 文档贡献指南 MUST 明确说明这两种情况的区别

#### Scenario: public 和 src 目录的图片资源共存管理

- **WHEN** 站点同时存在 `public/img/` 和 `src/content/docs/img/` 两个目录
- **THEN** 文档内容 MUST 优先引用 `src/content/docs/img/` 中的图片
- **AND** `public/img/` CAN 保留用于非内容相关的图片
- **AND** SHOULD 逐步淘汰 `public/img/` 中文档相关的图片

## REMOVED Requirements

无移除的规范。

---

**迁移说明**：
- 本变更采用渐进式迁移策略，新旧方式可以共存
- 优先迁移高频访问和重要页面
- 所有新建文档 MUST 使用新的图片引用方式
- 建议使用自动化脚本辅助迁移过程
