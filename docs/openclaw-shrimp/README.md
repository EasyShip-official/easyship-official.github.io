# OpenClaw 养虾实践技术报告

> 文档类型：技术报告  
> 目标：记录一套基于 OpenClaw + Feishu + GitHub + Skills 的真实落地过程，重点说明**做了什么、怎么做的、踩了什么坑、当前卡点是什么**。  
> 说明：本文只保留可复用的技术经验，不写个人背景叙事，不写抒情性内容。

---

## 1. 项目目标

本轮工作的目标不是泛泛体验 OpenClaw，而是围绕一个真实运行中的远程实例，逐步把以下能力打通：

1. **Feishu 作为主交互界面**
2. **OpenClaw 作为长期在线的执行与记忆系统**
3. **ClawHub / Skills 作为能力扩展机制**
4. **GitHub 作为代码与静态内容发布面**
5. **文档沉淀为可复用 skill / reference / 静态页面资产**

在执行过程中，重点不在宣传 OpenClaw，而在于：

- 验证真实能力链路
- 找到权限边界
- 识别系统摩擦点
- 将经验沉淀成文档和 skill

---

## 2. 当前环境概况

### 2.1 运行环境

- 主机：Tencent Cloud Ubuntu 24.04.3 LTS
- OpenClaw 版本：2026.3.8
- Gateway：绑定 `127.0.0.1:18789`
- 主交互渠道：Feishu 私聊
- 当前主要模型：`openai-codex/gpt-5.4`

### 2.2 工作区设计

当前采用 OpenClaw 标准工作区 + 实际项目目录并行的方式组织：

- `SOUL.md` / `USER.md` / `MEMORY.md`
- `memory/YYYY-MM-DD.md`
- `projects/...`
- `skills/...`

这种组织方式的核心作用是：

- 将长期连续性外置到文件系统
- 避免把主聊天会话当成唯一记忆容器
- 把经验沉淀成可复用资产，而不是只留在一次对话里

---

## 3. Feishu 链路打通

### 3.1 问题：Feishu 插件工具不可见

最初的问题不是 Feishu 插件未安装，而是：

> **插件工具虽然存在，但当前会话里不可见。**

### 3.2 排查方法

依次检查：

1. Feishu channel 是否启用
2. Feishu plugin 是否安装并启用
3. `tools.allow` 是否放出了 plugin 工具组
4. Gateway 重启后工具是否重新注册

### 3.3 根因

根因确认是：

- `tools.allow` 缺少 `group:plugins`

### 3.4 修复

将 `group:plugins` 加入工具允许列表后，Feishu 插件工具才在当前会话可调用。

### 3.5 结论

这说明：

> **“渠道能用”与“插件工具可见”是两层问题。**

以后遇到类似问题，不应直接归因于插件坏了，而应先检查工具暴露策略。

---

## 4. Feishu OAuth 与真实工具验证

### 4.1 目标

验证 Feishu 用户态工具是否真的可以完成写操作，而不只是“理论上存在”。

### 4.2 方法

没有先在抽象层面讨论授权流程，而是直接调用真实 Feishu 工具，让系统自己触发 OAuth 流程。

### 4.3 实操结果

成功完成了：

- 用户授权流程验证
- 日历写入测试
- 事件创建测试

### 4.4 关键经验

> **对 Feishu 这类 OAuth 问题，真实工具调用往往比先讨论授权设计更有效。**

也就是说：

- 工具是否可见
- 用户是否已授权
- 当前操作是否真正可写

最好通过一条真实 API 路径验证，而不是靠推测。

---

## 5. F1 日历导入任务的经验

### 5.1 目标

将 2026 F1 赛季以 **session 级事件** 的形式写入 Feishu 日历，包括：

- FP
- Sprint Qualifying
- Sprint
- Qualifying
- Race

### 5.2 初始错误

最初错误地创建了：

- 按周末块状的占位型事件

这不符合“像会议一样逐场写入”的目标。

### 5.3 修正方法

采取了明确的恢复路径：

1. 删除错误的 24 条占位日程
2. 改为按 session 重建
3. 使用 `f1calendar.com` 的 session 时间数据
4. 转换到 `Asia/Shanghai (+08:00)` 后写入 Feishu

### 5.4 当前状态

已经完成部分赛站，后续赛站因为优先级变化暂时停止。

### 5.5 关键经验

- 批量写日历时，**事件模型必须先对**，否则后面只会越修越乱
- 用户要求“做完再通知”时，不能把“分批推进”说成“后台持续异步执行”
- 对长任务，必须诚实区分：
  - 当场做一批
  - 真正后台在跑

---

## 6. ClawHub 与 Skills 链路打通

### 6.1 初始问题

一开始尝试安装多个 skill 时，持续遇到：

- `Rate limit exceeded`

包括：

- `agent-browser`
- `wechat-reader`
- `self-improving-agent`

### 6.2 排查结果

当时本机并没有 ClawHub 登录态。

### 6.3 处理方法

1. 先安装 ClawHub CLI
2. 用 token 完成无浏览器登录
3. 再重试 skill 安装

### 6.4 结果

登录后成功安装：

- `wechat-reader`
- `agent-browser`
- `self-improving-agent`
- `skill-creator`

### 6.5 关键经验

> **ClawHub 未登录状态下，安装请求很容易撞匿名限流。**

因此后续遇到 skill 装不上时，优先排查顺序应为：

1. ClawHub CLI 是否存在
2. 是否已登录
3. skill 本身是否被标记 suspicious
4. 当前会话是否已加载 skill
5. skill 依赖的外部二进制 / 系统依赖是否就绪

---

## 7. Browser / WeChat 阅读链路实践

### 7.1 目标

打通微信公众号文章阅读能力。

### 7.2 路线

选择的能力链是：

- `wechat-reader` skill
- `agent-browser`
- Chromium browser binaries

### 7.3 当前结果

已经完成：

- `wechat-reader` 安装
- `agent-browser` 安装
- Chromium / Headless Shell / FFmpeg 下载完成

### 7.4 当前卡点

浏览器实际启动时报错：

- 缺少系统共享库，如 `libatk-1.0.so.0`

### 7.5 根因分析

这里的链路已经证明：

- skill 已装成功
- CLI 已存在
- browser binaries 已下载
- **但系统依赖未补齐**

也就是说：

> **“skill 安装成功”不等于“能力已可用”。**

### 7.6 当前限制

由于当前 Feishu 会话未开放 `tools.elevated`，所以无法在该会话里直接做系统包安装。

### 7.7 关键经验

浏览器类能力的排查顺序应固定为：

1. skill 是否安装
2. CLI 是否可调用
3. browser binaries 是否下载
4. 系统共享库是否齐全
5. 当前执行会话是否允许安装系统依赖

---

## 8. 权限边界识别

### 8.1 当前实际权限

当前 Feishu 私聊会话已经具备：

- 普通 shell 命令执行
- 文件读写
- Web 搜索 / 网页抓取
- 插件工具调用
- ClawHub 安装与登录

但不具备：

- host 提权执行
- 系统级依赖安装
- 直接 sudo / apt 修改机器环境

### 8.2 根因

根因不是 Linux 本身权限不足，而是：

- OpenClaw 配置未开启 `tools.elevated`
- 且未对当前 Feishu provider / sender 放行

### 8.3 关键理解

> **Feishu 插件能力、普通工具能力、host 提权能力，属于三条不同的能力线。**

不能混成“Feishu 能用，所以我就应该能 sudo”。

### 8.4 结论

以后如果要让 Feishu 会话直接完成系统级安装，需要单独配置：

- `tools.elevated.enabled`
- `tools.elevated.allowFrom.feishu`

并只对白名单中的 owner open_id 放行。

---

## 9. GitHub 链路接入

### 9.1 初始状态

本机并没有显式配置 GitHub 插件，但 OpenClaw 内置了 GitHub 相关 skill：

- `github`
- `gh-issues`

### 9.2 问题

内置 `github` skill 依赖：

- `gh` CLI

而本机最初没有 `gh`。

### 9.3 处理方法

不走系统包安装，而是使用**用户态方式**直接安装 GitHub CLI：

- 下载 GitHub CLI Linux 发行包
- 解压二进制到用户目录
- 验证 `gh --version`

### 9.4 登录

随后通过 `gh auth login` 完成 GitHub 设备流登录。

### 9.5 结果

当前已经具备：

- `gh` CLI
- GitHub 登录态
- 访问 GitHub repo 列表与仓库内容的能力

### 9.6 当前已完成的一次真实操作

已完成：

1. 识别 GitHub Pages repo：`easyship-official.github.io`
2. clone 到本地
3. 添加文档到新目录
4. 创建独立页面
5. 更新首页数据源
6. commit 并 push 到远程

这说明 GitHub 内容管理链路已经真实打通，而不是停留在“能看 repo”。

---

## 10. 文档沉淀与 Skill 化

### 10.1 目标

不把经验只留在对话里，而是固化成：

- 工作区 skill
- reference 文档
- 静态网页页面

### 10.2 已创建的本地 skill

#### `openclaw-usage-guide`

这是基于：

- OpenClaw 橙皮书
- 当前工作区真实踩坑经验
- Feishu / 权限 / memory / context / token 经验

整理出来的一份 **实战导向 OpenClaw 使用指南 skill**。

### 10.3 skill 结构

当前包含：

- `SKILL.md`
- `references/orange-paper-key-notes.md`
- `references/current-system-notes.md`
- `references/memory-context-token.md`
- `references/feishu-permissions-and-diagnostics.md`

### 10.4 方法论意义

这里的重点不是“多装几个 skill”，而是：

> **把反复出现的问题固化为可触发、可复用、可增量演进的工作方法。**

这比单纯把信息堆进一份大文档里更适合 OpenClaw 的工作模式。

---

## 11. InStreet 接入尝试

### 11.1 目标

尝试完成最小起步：

- 注册一个 InStreet Agent 身份
- 拿到 API key
- 只读首页，不自动发言

### 11.2 已完成内容

- 阅读 InStreet 的 `skill.md`
- 阅读其 API 参考
- 理解 forum / playground / heartbeat 结构

### 11.3 实测结果

多次尝试注册：

- 中文用户名
- ASCII 用户名
- `easy-ship-claw`

均返回：

- `500 Internal Server Error`

### 11.4 结论

当前判断是：

> **InStreet 注册接口当前服务端故障，不是用户名格式问题。**

因此这条能力线暂时停止，不继续往下接入。

---

## 12. 关于 Memory / Context 的真实认识

### 12.1 理想叙事

OpenClaw 文档与社区材料通常会强调：

- 分层记忆
- pre-compaction flush
- 向量检索
- 记忆持久化

### 12.2 真实体验

实际运行中的体感是：

- 长主会话仍然会膨胀
- token 消耗会明显拖慢体验
- pre-compaction 确实存在，但不是万能解决方案

### 12.3 当前方法

因此当前采用的工作策略是：

- `MEMORY.md` 记录长期偏好与稳定事实
- `memory/YYYY-MM-DD.md` 记录 append-only daily log
- 项目资料下沉到 `projects/...`
- 主会话只做当前任务缓冲，不承载全部长期上下文

### 12.4 关键判断

> **真正可持续的连续性，更多依赖文件系统与 retrieval-first，而不是把更多历史消息硬塞进主会话。**

---

## 13. 当前已形成的稳定排查原则

### 13.1 Feishu 问题排查

按层拆：

1. channel
2. tool visibility
3. plugin enablement
4. OAuth
5. 非 Feishu 的执行层限制

### 13.2 Skill 问题排查

按链拆：

1. 是否安装成功
2. 当前会话是否已加载
3. 外部 CLI 是否存在
4. browser/runtime 是否就绪
5. 系统依赖是否齐全

### 13.3 权限问题排查

明确区分：

- `tools.allow`
- plugin exposure
- provider / sender allowlist
- `tools.elevated`

### 13.4 文档沉淀原则

- 一次性材料 → 项目文档
- 长期方法 → skill / references
- 稳定偏好 → `MEMORY.md`
- 当日事实 → `memory/YYYY-MM-DD.md`

---

## 14. 当前成果总结

截至目前，已经真实打通或部分打通的链路包括：

### 已打通

- Feishu 插件可见性
- Feishu OAuth 基本验证
- 日历真实写入测试
- ClawHub 安装与登录
- 多个 skill 安装
- GitHub CLI 安装与登录
- GitHub Pages repo clone / edit / commit / push
- 本地 skill 创建与 reference 组织
- 静态网页新增独立页面并上线

### 部分打通

- F1 日历导入（已完成部分赛站）
- browser / wechat-reader（卡在系统共享库）
- InStreet 接入（卡在对方注册接口）

### 尚未完成

- Feishu 会话中的 elevated host execution
- browser 系统依赖补齐
- 公众号全文抓取最终验证
- InStreet 最小身份接入

---

## 15. 可复用经验

这轮实践最值得复用的不是某条命令，而是以下原则：

1. **先跑真实链路，再谈抽象设计**  
   对 OAuth、插件、GitHub、技能安装这类事，真实调用比空想更快暴露问题。

2. **把问题拆层，不要把所有失败混成一个“系统坏了”**  
   渠道、工具、插件、认证、权限、系统依赖是不同层。

3. **不要把“安装成功”误判成“功能已可用”**  
   skill / CLI / binaries / shared libs / permissions 都可能分别出问题。

4. **长期连续性必须文件化**  
   不能依赖主会话永远记住。

5. **把反复出现的排查路径沉淀成 skill 或 reference**  
   这样 OpenClaw 才会逐渐变成一个越来越会工作的系统，而不是越来越长的聊天记录。

---

## 16. 后续建议

如果继续推进，这个系统后面的优先级建议是：

1. 开通或设计更安全的 `tools.elevated` 策略
2. 补齐 browser 依赖，完成公众号全文阅读闭环
3. 继续扩展 `openclaw-usage-guide`，把更多真实链路固化进去
4. 把 GitHub skill 用到真实仓库巡检与内容维护上
5. 在确认 InStreet 注册恢复后，再做最小身份接入

---

## 17. 结语

这轮工作的主要结论不是“OpenClaw 很强”，而是：

> **OpenClaw 适合被当作一套长期运行的、分层排障的、可沉淀经验的系统来建设。**

真正有价值的，不是一次性打通某个功能，而是把：

- 渠道
- 技能
- 权限
- 文档
- GitHub 发布面
- 记忆与上下文策略

逐步组织成一个越来越稳的协作系统。
