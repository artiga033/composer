# tools

此处定义各个工具的页面。

## 约定

为了动态路由能正常工作，编写这里的页面时，需要遵循以下约定：

- 文件名以 snake_case 命名，注册的组件名以 kebab-case 命名，格式为 `tools-<kebab-cased-file-name>`
- 除了 `LitElement` 外，还可以导出以下内容:
  - `name: string //msg`[^1] ：工具名称
  - `description: string //msg`：工具描述
  - `title: string //msg`：页面标题

[^1]: `string` 类型后面的 `//msg` 表示应当调用 `@lit/localize` 的 `msg` 函数以便本地化。