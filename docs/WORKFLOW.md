# AI 驱动的网页设计工作流

> 从"看到喜欢的设计"到"完整代码落地"的全流程指南

## 概述

本文档介绍一套基于 AI 工具链的高效网页设计工作流。核心理念是：**让 AI 做重复性工作，人类专注于创意决策**。

整个流程分为 4 个阶段：

```
设计分析 → 实时预览→ 代码实现
   ↓           ↓          ↓
UI/UX Architect → Google AI Studio / Gemini → Claude Code
```

---

## 阶段一：设计分析

### 工具
**UI/UX Architect**（本扩展）

### 目标
将任意网页的视觉设计"逆向工程"为结构化的技术文档。

### 操作步骤

1. **获取目标设计**
   - 输入目标网站 URL，或
   - 截图并粘贴（Ctrl+V）到工具中

2. **选择分析范围**
   - `Single Page`：分析单个页面布局
   - `Entire Website`：分析整站设计语言

3. **选择输出模板**
   - `React Technical Spec`：生成 React + Tailwind 技术规范（推荐）
   - `Design System Extraction`：仅提取设计系统，不生成代码
   - `Semantic HTML & CSS`：生成原生 HTML/CSS 方案

4. **点击 Analyze & Generate**

### 输出内容

工具会生成包含以下内容的技术设计文档：

- **设计系统规范**：颜色、字体、间距、圆角等
- **页面分区分析**：从上到下逐个 Section 分析
- **组件架构树**：React 组件层级结构
- **布局蓝图**：ASCII 图示 + Tailwind 类名
- **Master Prompt**：可直接用于 AI 编码的完整提示词

---

## 阶段二：实时预览

### 工具
**Google AI Studio** (https://aistudio.google.com)

### 目标
快速验证设计效果，进行迭代调整。

### 操作步骤

1. 打开 Google AI Studio，选择 **Gemini 2.5 Flash** 或 **Pro** 模型

2. 将阶段一生成的 **Master Prompt** 完整粘贴到对话框

3. 在 Prompt 前添加以下前缀：

```
请根据以下技术规范，生成一个完整的 React 组件。
要求：
- 使用 React 19 + TypeScript + Tailwind CSS
- 所有代码放在一个文件中
- 使用 Lucide React 作为图标库
- 确保响应式设计（mobile-first）

---

[粘贴 Master Prompt]
```

4. 在 AI Studio 的代码预览窗口中实时查看效果

5. **迭代优化**：
   - "把 Hero 区域的背景改成渐变色"
   - "Card 组件需要添加 hover 阴影效果"
   - "导航栏改成透明背景 + 滚动时变白"

### 技巧

- 使用 AI Studio 的 **Canvas** 功能可以直接预览 React 代码
- 保存满意的版本到 **Saved Prompts**，方便后续复用
- 可以上传原始截图作为参考，让 AI 对比调整

---

## 阶段三：规范提取

### 工具
**Gemini** (对话模式)

### 目标
从预览效果中提取可复用的设计规范和布局系统。

### 操作步骤

当你对阶段二的效果满意后，使用以下 Prompt 提取规范：

#### Prompt A：样式规范提取

```
基于我们刚才生成的代码，请帮我提取一份完整的设计规范文档，包括：

1. **色彩系统**
   - 主色、辅助色、中性色的完整色阶（50-900）
   - 语义化颜色命名（如 primary, secondary, success, danger）
   - 对应的 Tailwind 配置代码

2. **字体系统**
   - 字体族（font-family）
   - 字重（font-weight）使用规范
   - 字号层级（h1-h6, body, caption）
   - 行高（line-height）配置

3. **间距系统**
   - 基础间距单位
   - 组件内部间距规范
   - Section 间距规范
   - 响应式间距调整

4. **组件样式变体**
   - Button: primary, secondary, ghost, destructive
   - Card: default, elevated, outlined
   - Input: default, error, disabled

请以 Tailwind CSS 配置文件格式输出 tailwind.config.js 的 theme.extend 部分。
```

#### Prompt B：布局系统提取

```
请帮我生成一份布局系统文档，包括：

1. **容器规范**
   - 最大宽度配置
   - 响应式断点设置
   - 内边距规则

2. **栅格系统**
   - 列数配置
   - 间隙（gap）规范
   - 常用布局模式

3. **页面结构模板**
   用 ASCII 图示展示以下常见页面布局：
   - Landing Page（Hero + Features + CTA + Footer）
   - Dashboard（Sidebar + Header + Main）
   - Blog/Article（Header + Content + Sidebar）

4. **Section 模板**
   为每种常见 Section 提供：
   - 结构示意图
   - 推荐的 Tailwind 类组合
   - 响应式适配方案

请将布局规范整理成可以直接复制使用的代码片段。
```

### 输出整理

将提取的规范保存为项目文档：
- `design-system.md` - 设计系统规范
- `tailwind.config.js` - Tailwind 配置
- `layout-templates.md` - 布局模板库

---

## 阶段四：代码实现 (Vibe Coding)

### 工具
**Claude Code** (终端 AI 助手)

### 目标
基于前面提取的规范，高效完成实际项目开发。

### 项目初始化 Prompt

```
我要创建一个新的 React 项目，技术栈：
- React 19 + TypeScript
- Vite 作为构建工具
- Tailwind CSS 4.0
- shadcn/ui 组件库
- Lucide React 图标

请帮我：
1. 初始化项目结构
2. 配置 Tailwind（使用以下自定义主题）：
   [粘贴阶段三的 tailwind.config.js]
3. 设置基础布局组件（Layout, Container, Section）
4. 创建常用组件模板（Button, Card, Input）
```

### 页面开发 Prompt 模板

```
请根据以下规范创建 [页面名称] 页面：

## 页面结构
[粘贴 ASCII 布局图]

## 设计要求
- 遵循项目的设计系统规范
- 使用已有的布局组件
- 确保响应式适配

## 功能需求
- [列出页面的交互功能]

## 数据结构
- [如果有，提供 Mock 数据格式]

请按 Section 拆分组件，保持代码清晰可维护。
```

### 组件开发 Prompt 模板

```
请创建一个 [组件名称] 组件：

## 设计参考
[粘贴设计规范或截图描述]

## Props 接口
- variant: 'primary' | 'secondary' | 'ghost'
- size: 'sm' | 'md' | 'lg'
- [其他需要的 props]

## 交互行为
- hover 状态
- active 状态
- disabled 状态
- loading 状态（如需要）

## 无障碍要求
- 键盘导航支持
- ARIA 属性
- 焦点管理

请使用 Tailwind CSS + cva (class-variance-authority) 实现变体管理。
```

### 实用技巧

1. **渐进式开发**：先搭建页面骨架，再填充细节
2. **组件复用**：每完成一个组件，及时提取到组件库
3. **实时预览**：使用 `yarn dev` 保持开发服务器运行，边写边看
4. **版本控制**：每完成一个功能模块就提交一次

---

## 完整工作流示例

假设你看到一个很棒的 SaaS Landing Page，想要"借鉴"它的设计：

### Step 1: 分析
```
打开 UI/UX Architect → 输入 URL → 选择 "Single Page" → Analyze
得到：技术设计文档 + Master Prompt
```

### Step 2: 预览
```
打开 Google AI Studio → 粘贴 Master Prompt → 查看生成效果
调整："把配色改成我们的品牌色" → 满意后进入下一步
```

### Step 3: 提取
```
使用 Prompt A 提取样式规范 → 保存 tailwind.config.js
使用 Prompt B 提取布局系统 → 保存布局模板
```

### Step 4: 实现
```
Claude Code: "初始化项目 + 应用设计规范"
Claude Code: "创建 Landing Page，使用刚才的布局模板"
Claude Code: "添加动画效果和交互"
```

### 最终结果
从看到设计到代码落地，全程可能只需要 **1-2 小时**。

---

## 常见问题

### Q: 这算抄袭吗？
A: 我们提取的是**设计模式和布局思路**，而非像素级复制。就像学习优秀的建筑结构，再设计自己的房子。最终代码和具体实现都是原创的。

### Q: AI 生成的代码质量如何？
A: 需要人工审查。AI 擅长快速生成结构性代码，但业务逻辑、性能优化、边界处理仍需开发者把关。

### Q: 为什么要用这么多工具？
A: 各司其职：
- UI/UX Architect：专注设计分析
- Google AI Studio：快速迭代预览
- Claude Code：专业代码实现

单一工具很难在所有环节都做到最好。

---

## 工具链总结

| 阶段 | 工具 | 输入 | 输出 |
|------|------|------|------|
| 设计分析 | UI/UX Architect | URL / 截图 | 技术设计文档 |
| 实时预览 | Google AI Studio | Master Prompt | 可视化代码预览 |
| 规范提取 | Gemini | 满意的代码 | 设计规范文档 |
| 代码实现 | Claude Code | 规范 + 需求 | 生产级代码 |

---

## 下一步

- 尝试用这个流程重构一个现有项目
- 建立团队共享的设计规范库
- 探索更多 AI 工具的组合可能性

Happy Coding!
