# Anthropic 官方 Skill Creator 深度分析

> GitHub: https://github.com/anthropics/skills  
> 路径: `skills/skill-creator/`  
> 104k ⭐ | MIT License  
> 分析日期: 2026-03-28

---

## 一、Skill 是什么

Skill Creator 是 Anthropic 官方的**技能创建工具**——用 AI 来创建 AI Skill 的 Skill。

它的功能：
- 从零创建新 Skill
- 修改和优化已有 Skill
- 运行测试评估（Eval）验证 Skill 效果
- 基准测试与方差分析
- 优化 Skill description 提升触发准确率

---

## 二、整体流程概览

1. 决定你想让这个 Skill 做什么，大致怎么做
2. 写一版草稿
3. 创建几个测试提示词，然后用"加载了这个 Skill 的 Claude"跑一遍
4. 帮助用户从定性和定量两个角度评估结果
5. 根据反馈重写 Skill
6. 重复直到满意
7. 扩大测试集，在更大规模上重试

---

## 三、Harness 哲学分析（核心）

### 1. 渐进式上下文加载（Progressive Disclosure）

Skill 使用三级加载系统：
1. **元数据**（name + description）——始终在上下文中（~100 词）
2. **SKILL.md 正文**——Skill 触发时在上下文中（理想 <500 行）
3. **捆绑资源**——按需加载（无限，脚本可执行而不加载）

**核心洞察：** 上下文不是越多越好，是越精确越好。这和 Claude Code 的 `--resume` 和 `claude.yaml` 的思路一致。

### 2. Eval 驱动迭代（Eval-Driven Iteration）

每一步都有量化基准：pass_rate、time、tokens。通过率从 65% → 75% → 85%，清楚看到进步。

**核心洞察：** 约束式反馈循环。不是拍脑袋决定 Skill 好不好，而是用客观指标验证。

### 3. Baseline 对比（with-skill vs without）

每个测试用例同时跑两个 subagent——一个有 Skill，一个没有。

**核心洞察：** 回答根本问题：**这个 Skill 到底有没有用？** 加入这个机制，比没有它的时候好多少？

### 4. Description 要"强制推"（PUSHY 原则）

> "目前 Claude 有'触发不足'的问题——该用 Skill 的时候不用。所以 description 要写得稍微'强制推'一点。"

**核心洞察：** Skill 的触发是主动行为，不是被动匹配。写得明确+强制，才能确保在需要的时候被调用。

### 5. Grader 双重职责：评产出 + 批评估本身

Grader 不仅要评分，还要批判评估本身——好的断言要能区分真正的成功和表面合规。

**核心洞察：** 元评估。很多 harness 失败不是因为机制不好，而是因为评估标准太松。

### 6. 三盒系统的影子

Skill Creator 的结构本身就是一种三盒系统：

| 盒子 | 对应阶段 | 认知功能 |
|------|---------|---------|
| **Intent Box** | 捕获意图 | 核心：用户真正想解决什么问题 |
| **Context Box** | 访谈研究 | 背景：边缘情况、依赖、限制 |
| **Eval Box** | 测试评估 | 验证：客观可衡量的成功标准 |

### 7. 时间线捕获（Timing Capture）

每次 subagent 完成后立即捕获 `total_tokens` 和 `duration_ms`。

**核心洞察：** 可观测性基础设施。没有计时就不知道优化有没有效果。Benchmark 数据要落在磁盘上。

---

## 四、Skill 创建六步

1. **Capture Intent** — 从对话历史提取，或用户补充确认
2. **Interview and Research** — 主动问边缘情况、依赖项、成功标准
3. **Write SKILL.md** — name / description（PUSHY）/ compatibility / 正文
4. **Write Test Cases** — 2-3 个真实测试提示词，先不写断言
5. **Run Evals** — 同时跑有 Skill 版和基线版，捕获计时数据
6. **Grade & Iterate** — Grader 评分，聚合 benchmark，重写，直到满意

---

## 五、Skill 结构规范

```
skill-name/
├── SKILL.md（必需）
│   ├── YAML frontmatter（name, description 必需）
│   └── Markdown 说明
└── 捆绑资源（可选）
    ├── scripts/    - 确定性/重复性任务
    ├── references/ - 按需加载的文档（>300行要加目录）
    └── assets/     - 输出中使用的文件
```

---

## 六、写作风格要点

- 指令用祈使句
- 解释为什么重要，而不是用一堆 MUST
- 先写草稿，用新鲜眼光看一遍再改进
- Description 要 PUSHY（强制推）
- SKILL.md 理想 <500 行，快到限制时拆分 references

---

## 七、Eval 数据模型

| 文件 | 作用 |
|------|------|
| `evals/evals.json` | 测试用例定义 |
| `grading.json` | Grader 评分结果 |
| `metrics.json` | 执行指标（tool calls, steps, errors） |
| `timing.json` | 计时数据（token, duration） |
| `benchmark.json` | 聚合基准（pass_rate, mean±stddev） |

---

## 八、改进循环核心逻辑

1. **从反馈中泛化** — 不要只对那几个测试例子做过度拟合，尝试不同的隐喻或模式
2. **保持提示词精简** — 删掉没有产生价值的内容，读 transcript 不只看最终产出
3. **解释 why** — 不要写全大写的 ALWAYS/NEVER，解释推理过程
4. **寻找跨用例的重复工作** — 如果 3 个测试用例都独立写了类似的脚本，Skill 应该捆绑它

---

## 九、对你的启发

### 直接可迁移

1. **Description 写 PUSHY**：明确列出触发场景，而不是猜测触发词
2. **三级加载原则**：frontmatter / 正文 / scripts & references 分层
3. **快速冒烟测试**：每次改完 Skill，跑 2-3 个真实用例，记录通过率

### 需要思考的

4. **Eval 的成本**：Anthropic 的完整流程很重。你的场景是否需要这么重？
5. **Grader 自我批判**：你的 Skill 有没有可能加类似的**自我检查**逻辑？

---

## 十、相关资源

- GitHub: https://github.com/anthropics/skills（104k ⭐）
- Skill Creator: `skills/skill-creator/SKILL.md`
- Grader Agent: `skills/skill-creator/agents/grader.md`
- Schema 定义: `skills/skill-creator/references/schemas.md`
