# 🚀 快速开始指南

## ✅ 调试配置已完成

### 📍 当前状态
- ✅ 项目已完整创建
- ✅ 依赖包已安装
- ✅ 调试配置已设置
- ✅ 本地模拟数据库已配置 (包含示例数据)
- ✅ Next.js 14 配置警告已修复
- ✅ 服务器运行在: `http://localhost:3002`

### 🎯 现在可以开始调试了！

#### 方法1: VSCode 调试面板
1. 按 `Ctrl+Shift+D` 打开调试面板
2. 选择 "🔧 Attach to Next.js Server"
3. 点击绿色播放按钮连接调试器

#### 方法2: 快捷键
- 直接按 `F5`，选择 "🔧 Attach to Next.js Server"

### 🔍 调试示例

#### 调试 API 接口
在 `app/api/students/route.ts` 第13行设置断点：
```typescript
export async function GET() {
  debugger; // 设置断点
  const students = await LessonTrackDB.getStudents()
  return NextResponse.json({ success: true, data: students })
}
```

#### 调试前端组件
在 `app/page.tsx` 中设置断点：
```typescript
const handleAddRecord = async (data: any) => {
  debugger; // 设置断点
  console.log('添加记录:', data)
  // ... 其他代码
}
```

### 📋 项目功能预览

访问 http://localhost:3002 查看：

1. **学生标签页**: 张三、李四 (示例数据)
2. **控制按钮**: 新增记录、管理学生
3. **筛选功能**: 按日期、学生、数量筛选
4. **课程记录**: 已有2条示例记录

### 🛠️ 开发环境说明

- **数据存储**: 使用内存模拟数据库 (开发模式)
- **生产部署**: 自动切换到 Vercel KV 数据库
- **调试端口**: 9230 (如果9229被占用)

### 🎮 常用调试快捷键

- `F5`: 继续执行
- `F9`: 切换断点
- `F10`: 单步跳过
- `F11`: 单步进入
- `Shift+F11`: 单步跳出

### 📁 关键文件位置

```
├── app/
│   ├── page.tsx           # 主页面 (设置断点调试)
│   └── api/
│       ├── students/      # 学生API (设置断点调试)
│       ├── lessons/       # 课程API (设置断点调试)
│       └── stats/         # 统计API
├── lib/
│   ├── kv.ts             # 数据库逻辑
│   └── kv-local.ts       # 本地模拟数据
├── components/           # React 组件
└── .vscode/
    └── launch.json       # 调试配置

```

### 🔄 重启调试服务器

如果需要重启服务器：
```bash
# 停止当前服务器 (Ctrl+C)
# 然后重新启动
set NODE_OPTIONS=--inspect && npm run dev
```

现在开始愉快地调试你的课程记录系统吧！🎉