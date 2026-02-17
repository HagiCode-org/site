# astro-site Specification Delta

## MODIFIED Requirements

### Requirement: Starlight 组件在 MDX 中的渲染支持

站点 SHALL 支持 Starlight 组件(包括 Tabs 和 Aside)在 MDX 文件中正确渲染,用于提供丰富的文档交互体验。Starlight Tabs 组件 MUST 在 MDX 环境中正确渲染并提供完整的交互功能,包括标签切换、键盘导航和主题适配。

#### Scenario: Starlight Tabs 组件渲染

- **GIVEN** 文档使用了 Starlight 的 Tabs 组件
- **WHEN** MDX 文件被处理并渲染
- **THEN** Tabs 组件必须正确渲染可交互的标签界面
- **AND** 必须支持标签点击切换功能
- **AND** 必须支持键盘导航(Tab、方向键、Home、End)
- **AND** 必须在浅色和深色主题下正确显示
- **AND** 必须在移动端正确响应触摸交互

#### Scenario: Tabs 组件导入要求

- **GIVEN** 文档使用了 Starlight 的 Tabs 组件
- **WHEN** MDX 文件被处理
- **THEN** 文件必须在 frontmatter 后包含导入语句:
  ```mdx
  import { Tabs, TabItem } from '@astrojs/starlight/components';
  ```
- **AND** 缺少导入的文件必须导致构建错误
- **AND** 错误信息必须明确指出缺少的组件

#### Scenario: Tabs 组件语法规范

- **GIVEN** 文档作者在 MDX 中使用 Tabs 组件
- **WHEN** 编写标签内容
- **THEN** 必须使用以下语法规范:
  ```mdx
  <Tabs>
    <TabItem value="win" label="Windows">
      Windows 内容
    </TabItem>
    <TabItem value="mac" label="macOS">
      macOS 内容
    </TabItem>
  </Tabs>
  ```
- **AND** 每个 `TabItem` 必须包含唯一的 `value` 属性
- **AND** 每个 `TabItem` 必须包含显示用的 `label` 属性
- **AND** 标签内容可以包含任何有效的 MDX 内容(文本、代码、列表、链接等)
- **AND** 第一个标签默认为选中状态

#### Scenario: Tabs 组件嵌套内容支持

- **GIVEN** TabItem 内包含复杂内容
- **WHEN** 页面被渲染
- **THEN** 以下内容类型必须正确显示:
  - 纯文本段落
  - 代码块(带语法高亮)
  - 列表(有序和无序)
  - 链接(内部和外部)
  - Aside 组件
  - 其他 Starlight 组件
- **AND** 内容必须在标签切换时正确显示/隐藏
- **AND** 不能有内容溢出或布局错乱

#### Scenario: Tabs 组件可访问性

- **GIVEN** Tabs 组件被显示
- **WHEN** 使用辅助技术访问
- **THEN** 组件必须使用适当的 ARIA 角色(`role="tablist"`, `role="tab"`, `role="tabpanel"`)
- **AND** 必须包含 `aria-selected` 和 `aria-controls` 属性
- **AND** 必须支持键盘导航(Tab、Shift+Tab、方向键、Home、End)
- **AND** 当前选中的标签必须有视觉焦点指示器
- **AND** 颜色对比度必须 >= 4.5:1

#### Scenario: Tabs 组件在 MDX 中与 Mermaid 图表的兼容性

- **GIVEN** TabItem 内包含 Mermaid 图表代码块
- **WHEN** 页面被渲染
- **THEN** Mermaid 图表必须在标签内容中正确渲染
- **AND** 图表必须在标签切换时正确初始化
- **AND** 切换到包含图表的标签时,图表必须正确显示
- **AND** 图表主题必须与站点主题保持一致

#### Scenario: Tabs 组件 MDX 集成配置

- **GIVEN** 站点使用 @astrojs/mdx 插件
- **WHEN** astro.config.mjs 被检查
- **THEN** MDX 插件必须在 integrations 数组中配置
- **AND** Starlight 插件必须在 MDX 插件之后配置
- **AND** rehype 插件配置不得干扰组件渲染
- **AND** Content Collections 配置必须支持 .mdx 扩展名

#### Scenario: Tabs 组件构建验证

- **GIVEN** 站点被构建
- **WHEN** 运行 `npm run build:docs`
- **THEN** 包含 Tabs 组件的页面必须成功构建
- **AND** 必须没有 Tabs 相关的构建错误
- **AND** 生成的 HTML 必须包含正确的 tabs 结构
- **AND** Starlight 默认 CSS 必须正确加载
