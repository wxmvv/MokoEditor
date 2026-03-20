# MokoEditor

欢迎使用 MokoEditor，一款全方位可定制的 Markdown 编辑器，支持多种视图模式，文档完全本地存储，并且拥有开放的插件开发系统。

## 特色

- 超多种定制选项以及极简的禅模式
- 完全的本地储存数据
- 多种视图模式（思维导图，演示模式）
- 开放的插件开发
- 多平台支持
- 可轻可重(可以直接打开文件，也可以建立你的储存库)

## 快速开始

要求：

- Node.js 20+
- npm 10+

安装依赖：

```bash
npm install
```

启动网页版开发环境：

```bash
npm run dev:web
```

启动 Electron 桌面开发环境：

```bash
npm run dev:electron
```

生产构建：

```bash
npm run build
```

使用已构建的前端资源启动桌面端：

```bash
npm run electron:start:prod
```

说明：

- `npm run dev:electron` 会先启动 Vite，再自动拉起 Electron，不需要手动开两个终端。
- `npm run electron:start` 是原始 Electron 开发入口，仅在你已经单独启动了 Vite 时使用。

| Dark | Light |
| --- | --- |
| ![](https://raw.githubusercontent.com/wxmvv/MokoEditor/refs/heads/main/public/shortcut-dark.png) | ![](https://raw.githubusercontent.com/wxmvv/MokoEditor/refs/heads/main/public/shortcut-light.png) |
