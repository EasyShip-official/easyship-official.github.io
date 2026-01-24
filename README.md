# My Lab - Personal Static Dashboard

这是一个极简风格的个人静态网页仪表盘，用于展示和管理各种前端小工具。项目采用 **No-Build** 理念，纯 HTML/JS/CSS 实现，可直接部署于 GitHub Pages。

![Dashboard Preview](https://via.placeholder.com/800x400?text=My+Lab+Dashboard+Preview)

## 项目特点

- **No-Build 架构**: 无需 Node.js、Webpack 或构建工具，纯静态文件
- **模块化组织**: 按类别分组管理项目（AI 工具、生产力工具、实验项目）
- **动态配置**: 基于 `data/projects.json` 动态渲染项目卡片，添加新项目无需修改 HTML
- **响应式设计**: 深色模式 + Tailwind CSS，适配各种设备
- **安全优先**: API Key 仅存储在本地 localStorage，代码中无硬编码密钥

## 目录结构

```
/
├── index.html                  # 主页仪表盘（入口）
├── README.md                   # 本文件
├── data/
│   └── projects.json          # 项目元数据配置（核心）
├── assets/                    # 共享资源目录
│   ├── images/                # 图片资源
│   └── fonts/                 # 字体文件
└── projects/                  # 所有项目代码
    ├── ai-tools/              # AI 相关工具
    │   ├── README.md         # 分类说明
    │   ├── ai-chat/          # AI 聊天助手
    │   └── debate-agent/     # 多智能体辩论系统
    ├── productivity/          # 生产力工具
    │   ├── README.md
    │   ├── pomodoro/         # 番茄工作法计时器
    │   └── time-converter/   # 时区转换工具
    └── experimental/          # 实验性项目
        ├── README.md
        └── lucidity-clock/   # 数字健康仪表盘
```

## 快速开始

### 本地运行

由于浏览器安全策略（CORS），直接双击 `index.html` 可能无法加载 JSON 数据。

**Python (推荐)**:
```bash
python -m http.server 8080
# 访问 http://localhost:8080
```

**Node.js**:
```bash
npx serve
# 或使用 http-server
npx http-server -p 8080
```

**VS Code**:
安装 "Live Server" 插件，右键 `index.html` → "Open with Live Server"

### 部署到 GitHub Pages

1. 将代码推送到 GitHub 仓库
2. 进入 **Settings** → **Pages**
3. Source 选择 `Deploy from a branch`，分支选择 `main`，目录 `/ (root)`
4. 保存后等待几分钟，即可通过 `https://你的用户名.github.io/` 访问

## 后续开发指南

### 添加新项目

1. **创建项目目录**:
   ```bash
   # 在对应分类下创建新项目
   mkdir -p projects/category-name/new-project
   ```

2. **开发项目代码**:
   - 在项目目录下创建 `index.html`
   - 确保项目可以独立运行
   - 添加返回主页的链接：`<a href="../../../index.html">`

3. **添加项目说明**:
   - 在项目目录下创建 `README.md`
   - 使用中文编写项目说明、功能特点、技术栈等

4. **更新配置文件**:
   编辑 `data/projects.json`，添加新项目条目：
   ```json
   {
     "id": "new-project",
     "title": "项目标题",
     "description": "简短描述",
     "icon": "🎯",
     "url": "./projects/category-name/new-project/index.html",
     "category": "category-name",
     "tags": ["标签1", "标签2"]
   }
   ```

5. **测试并提交**:
   ```bash
   # 本地测试
   python -m http.server 8080

   # 提交到 Git
   git add .
   git commit -m "添加新项目: xxx"
   git push origin main
   ```

### 创建新分类

如果现有分类无法满足需求，可以创建新分类：

1. **创建分类目录**:
   ```bash
   mkdir -p projects/new-category
   ```

2. **添加分类说明**:
   在 `projects/new-category/README.md` 中编写分类介绍

3. **在 projects.json 中使用**:
   添加项目时指定 `"category": "new-category"`

### 开发规范建议

- **保持独立性**: 每个项目应能独立运行，不依赖其他项目
- **统一样式**: 建议使用 Tailwind CSS CDN 保持视觉一致性
- **返回链接**: 每个项目都必须有返回主页的链接
- **相对路径**: 项目内资源使用相对路径，避免硬编码绝对路径
- **中文文档**: 所有 README 使用中文编写
- **本地存储**: 如需存储用户数据，优先使用 localStorage 或 sessionStorage

### 路径注意事项

在子项目中的相对路径规则：
- 返回根目录: `../../../index.html`（向上三级）
- 返回分类目录: `../../README.md`（向上两级）
- 引用 assets: `../../../assets/...`（根据实际位置调整）

### 常见问题

**Q: 为什么主页显示加载失败？**
- 检查是否使用了本地服务器（不能直接打开 HTML 文件）
- 确认 `data/projects.json` 路径正确
- 检查浏览器控制台是否有 CORS 错误

**Q: 项目点击后无法打开？**
- 检查 `projects.json` 中的 `url` 路径是否正确
- 确认项目的 `index.html` 文件存在

**Q: 返回按钮无法跳转？**
- 确保返回链接使用正确的相对路径 `../../../index.html`

## 安全与隐私

本项目为**纯静态前端应用**，无后端服务器中转。

- API Key 仅存储在浏览器本地 `localStorage`，不会上传到任何服务器
- 代码中无硬编码密钥，可以安全地提交到 GitHub
- 建议使用设置了使用限额的测试 API Key，避免直接使用主账号
- 注意 XSS 风险，谨慎引入第三方 JS 库

## License

MIT License
