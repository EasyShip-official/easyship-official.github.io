# 个人主页模板

这是一个简洁、现代的个人主页模板，基于纯 HTML、CSS 和 JavaScript 构建。非常适合展示个人简介、项目经历和联系方式。

## 功能特点

- **响应式设计**：完美适配桌面、平板和移动设备。
- **简洁代码**：无需构建工具，直接修改即可使用。
- **平滑滚动**：导航栏点击自动平滑滚动到对应区域。

## 如何使用

1. **本地预览**：
   - 直接双击打开 `index.html` 文件即可在浏览器中预览。
   - 或者使用 VS Code 的 "Live Server" 插件运行。

2. **个性化修改**：
   - 打开 `index.html`，修改文字内容（如姓名、介绍、项目描述）。
   - 替换图片（如果有引用图片）。
   - 修改 `style.css` 中的 `--primary-color` 变量来改变主题色。

## 如何部署到 GitHub Pages

只需几个简单的步骤，即可将此页面免费托管在 GitHub 上：

### 1. 创建 GitHub 仓库
1. 登录 [GitHub](https://github.com/)。
2. 点击右上角的 "+" 号，选择 "New repository"。
3. 输入仓库名称（例如 `my-portfolio`），勾选 "Public"，点击 "Create repository"。

### 2. 上传代码
如果你熟悉 Git 命令行：
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/你的用户名/仓库名.git
git push -u origin main
```

或者直接在 GitHub 页面点击 "uploading an existing file"，将文件夹中的所有文件拖拽上传并提交。

### 3. 开启 GitHub Pages
1. 进入你的 GitHub 仓库页面。
2. 点击顶部的 **Settings** (设置) 选项卡。
3. 在左侧菜单栏找到 **Pages**。
4. 在 **Build and deployment** 下的 **Source** 选项中，选择 **Deploy from a branch**。
5. 在 **Branch** 选项下，选择 `main` 分支，文件夹选择 `/(root)`。
6. 点击 **Save**。

等待几分钟后，刷新页面，你会在顶部看到一个绿色的提示框，显示你的网站已上线，链接通常是 `https://你的用户名.github.io/仓库名/`。

---
祝你使用愉快！
