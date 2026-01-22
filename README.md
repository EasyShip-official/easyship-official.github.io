# My Lab - Personal Static Dashboard

这是一个极简风格的个人静态网页仪表盘，用于展示和管理各种前端小工具。项目采用 **No-Build** 理念，纯 HTML/JS/CSS 实现，可直接部署于 GitHub Pages。

![Dashboard Preview](https://via.placeholder.com/800x400?text=My+Lab+Dashboard+Preview)

## 🚀 功能特点

- **Dashboard**:
  - 响应式 Bento Grid 布局（深色模式）。
  - 基于 `projects.json` 动态渲染项目卡片。
  - 纯原生 JS + Tailwind CSS (CDN)，无需 Node.js 环境。

- **AI Chat Assistant**:
  - 纯前端实现的 AI 聊天界面。
  - 支持 OpenAI 格式接口（OpenAI, DeepSeek, Moonshot 等）。
  - 支持 Markdown 渲染、代码高亮、流式响应。
  - **BYOK (Bring Your Own Key)**: 用户自行填入 API Key。

- **Debate Orchestrator (Multi-Agent)**:
  - 基于 LangChain.js 实现的多智能体辩论系统。
  - 模拟【裁判】、【正方】、【反方】三个角色的并行思考与交锋。
  - 实现“双盲立论”与“并行交叉攻辩”逻辑。

## 🛠️ 快速开始

### 1. 本地运行
由于浏览器安全策略（CORS），直接双击打开 `index.html` 可能无法加载 JSON 数据。请使用本地服务器：

**Python (推荐)**:
```bash
python -m http.server 8080
# 访问 http://localhost:8080
```

**VS Code**:
安装 "Live Server" 插件，右键 `index.html` -> "Open with Live Server"。

### 2. 部署到 GitHub Pages
1. Fork 本仓库或上传代码到你的 GitHub 仓库。
2. 进入仓库 **Settings** -> **Pages**。
3. Source 选择 `Deploy from a branch`，分支选择 `main`，目录 `/ (root)`。
4. 保存后等待几分钟，即可通过 `https://你的用户名.github.io/仓库名/` 访问。

## ⚙️ 配置说明

### 添加新项目
只需修改根目录下的 `projects.json`：

```json
{
  "id": "new-tool",
  "title": "My New Tool",
  "description": "Description here...",
  "icon": "🔧",
  "url": "./path/to/tool/index.html",
  "tags": ["Tag1", "Tag2"]
}
```

## 🔐 安全与隐私说明 (重要)

本项目为**纯静态前端应用**，没有后端服务器中转。

1.  **API Key 存储**：
    *   在 AI Chat 中输入的 API Key 仅保存在你浏览器本地的 `localStorage` 中。
    *   **Key 不会被上传**到任何第三方服务器（除了直接发送给 OpenAI 接口本身）。
    *   代码中**没有硬编码**任何 Key，因此将代码 push 到 GitHub 是安全的。

2.  **风险提示**：
    *   **XSS 风险**：请勿在项目中随意引入不可信的第三方 JS 库，否则恶意脚本可能读取你的 `localStorage`。
    *   **网络风险**：虽然请求通过 HTTPS 加密，但在企业监控或不安全网络下，Key 仍有理论泄露风险。
    *   **建议**：**强烈建议使用专门为测试生成的、设置了使用限额（Usage Limit）的 API Key**。不要直接使用余额巨大的主账号 Key。

## 📄 License
MIT License
