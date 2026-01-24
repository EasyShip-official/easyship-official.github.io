# Claude 指令文件

## 项目规范

本文件包含 Claude (AI 助手) 在协助开发此项目时应遵循的规范和指令。

## 提交规范

**重要**：每次完成代码修改后，必须自动进行 Git commit 操作。

提交信息格式：
```
类型: 简短描述

详细说明（如有）

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

提交类型示例：
- `添加新项目: xxx` - 新增项目
- `更新文档: xxx` - 文档更新
- `修复bug: xxx` - 问题修复
- `重构: xxx` - 代码重构
- `优化: xxx` - 性能或体验优化

## 开发规范

1. **保持 No-Build 架构**：不引入需要构建工具的依赖
2. **统一使用 Tailwind CSS CDN**：保持样式一致性
3. **中文文档**：所有 README 和注释使用中文
4. **路径规范**：
   - 项目返回主页：`../../../index.html`
   - 使用相对路径，避免硬编码
5. **独立运行**：每个项目应能独立运行，不依赖其他项目

## 项目结构

```
/
├── data/projects.json       # 项目元数据（核心配置）
├── index.html               # 主页仪表盘
└── projects/                # 按类别分组的项目
    ├── ai-tools/
    ├── productivity/
    └── experimental/
```

添加新项目时，同时更新：
1. 创建项目目录和 index.html
2. 添加项目 README.md（中文）
3. 更新 data/projects.json
4. 提交 Git commit
