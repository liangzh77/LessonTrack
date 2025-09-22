# 课程时间记录系统

一个用于记录和管理学生课程时间的 Web 应用，适合在手机浏览器中使用。

## 功能特性

- 📱 **移动端友好**: 完全响应式设计，适合手机浏览
- 👥 **学生管理**: 添加、删除学生信息
- 📅 **课程记录**: 记录每次上课的日期、时间和备注
- 🔍 **高级筛选**: 按学生、日期范围、记录数量筛选
- 📊 **数据统计**: 查看学期末统计数据
- ☁️ **云端存储**: 使用 Vercel KV 永久存储数据

## 技术栈

- **前端**: Next.js 14 + TypeScript + Tailwind CSS
- **后端**: Next.js API Routes
- **数据库**: Vercel KV (Redis)
- **部署**: Vercel

## 快速开始

### 1. 克隆项目
\`\`\`bash
git clone <your-repo-url>
cd lesson-track
\`\`\`

### 2. 安装依赖
\`\`\`bash
npm install
\`\`\`

### 3. 环境变量配置
复制 \`.env.example\` 为 \`.env.local\`，并填入你的 Vercel KV 配置：

\`\`\`bash
cp .env.example .env.local
\`\`\`

在 \`.env.local\` 中填入以下信息：
\`\`\`
KV_URL=your_kv_url_here
KV_REST_API_URL=your_kv_rest_api_url_here
KV_REST_API_TOKEN=your_kv_rest_api_token_here
KV_REST_API_READ_ONLY_TOKEN=your_kv_rest_api_read_only_token_here
\`\`\`

### 4. 本地运行
\`\`\`bash
npm run dev
\`\`\`

访问 http://localhost:3000

### 5. 部署到 Vercel

1. 在 Vercel 创建新项目
2. 连接你的 GitHub 仓库
3. 配置环境变量
4. 部署

## 使用说明

### 界面布局

1. **第一行**: 学生标签页 - 点击学生名字切换查看
2. **第二行**: 控制按钮 - 新增记录、管理学生
3. **第三行**: 过滤器 - 设置日期范围和显示数量
4. **主区域**: 课程记录列表 - 显示、修改、删除记录

### 主要功能

#### 学生管理
- 点击"管理学生"按钮
- 添加新学生或删除现有学生
- 删除学生会同时删除其所有课程记录

#### 添加课程记录
- 点击"新增记录"按钮
- 选择学生、设置日期和时间
- 可选添加备注信息

#### 筛选记录
- 按学生筛选：点击学生标签页
- 按日期筛选：设置开始和结束日期
- 限制显示数量：选择显示条数

#### 修改/删除记录
- 每条记录都有修改和删除按钮
- 修改：更新记录信息
- 删除：需要确认后才能删除

## 数据结构

### 学生 (Student)
\`\`\`typescript
{
  id: string        // 唯一标识
  name: string      // 学生姓名
  createdAt: string // 创建时间
}
\`\`\`

### 课程记录 (LessonRecord)
\`\`\`typescript
{
  id: string        // 唯一标识
  studentId: string // 学生ID
  studentName: string // 学生姓名
  date: string      // 上课日期
  time: string      // 上课时间 (可选)
  note: string      // 备注 (可选)
  createdAt: string // 创建时间
}
\`\`\`

## 开发说明

### 项目结构
\`\`\`
├── app/                 # Next.js App Router
│   ├── api/            # API 路由
│   ├── globals.css     # 全局样式
│   ├── layout.tsx      # 根布局
│   └── page.tsx        # 主页面
├── components/          # React 组件
├── lib/                # 工具库
│   └── kv.ts           # Vercel KV 数据操作
└── types/              # TypeScript 类型定义
\`\`\`

### API 端点

- \`GET /api/students\` - 获取学生列表
- \`POST /api/students\` - 添加学生
- \`DELETE /api/students?id=xxx\` - 删除学生

- \`GET /api/lessons\` - 获取课程记录
- \`POST /api/lessons\` - 添加课程记录
- \`PUT /api/lessons\` - 修改课程记录
- \`DELETE /api/lessons?id=xxx\` - 删除课程记录

- \`GET /api/stats\` - 获取统计数据

## 许可证

MIT License