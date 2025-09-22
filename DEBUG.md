# VSCode 调试指南 (Windows)

## 🚀 快速开始调试

### 方法1: 两步调试法 (推荐)

**第一步：启动调试模式的开发服务器**

在 VSCode 终端中运行：
```bash
set NODE_OPTIONS=--inspect
npm run dev
```

或者运行批处理文件：
```bash
debug.bat
```

**第二步：连接调试器**

1. 按 `F5` 或 `Ctrl+Shift+D` 打开调试面板
2. 选择 "🔧 Attach to Next.js Server"
3. 点击绿色播放按钮

### 方法2: 直接在终端启动调试

```bash
# Windows CMD
set NODE_OPTIONS=--inspect && npm run dev

# Windows PowerShell
$env:NODE_OPTIONS="--inspect"; npm run dev

# Git Bash
NODE_OPTIONS="--inspect" npm run dev
```

然后使用 "🔧 Attach to Next.js Server" 连接。

## 🎯 调试不同部分

### 调试服务端代码 (API 路由)

1. 在 API 文件中设置断点，如 `app/api/students/route.ts`
2. 启动调试服务器（方法1的第一步）
3. 使用 "🔧 Attach to Next.js Server" 连接
4. 在浏览器中发送 API 请求触发断点

### 调试客户端代码 (React 组件)

1. 在组件文件中设置断点，如 `app/page.tsx`
2. 使用 "🌐 Debug Client (Chrome)" 或 "🌐 Debug Client (Edge)"
3. 浏览器会自动打开并连接调试器

## 🛠️ 调试技巧

### 设置断点
- 点击代码行号左侧的空白处
- 或在代码中添加 `debugger;` 语句

### 检查变量
- 鼠标悬停在变量上查看值
- 在"变量"面板查看所有局部变量
- 在"监视"面板添加表达式

### 调试 API 请求
```typescript
// 在 app/api/students/route.ts 中
export async function GET() {
  debugger; // 调试器会在这里停止
  const students = await LessonTrackDB.getStudents()
  return NextResponse.json({ success: true, data: students })
}
```

### 调试 React 组件
```typescript
// 在 app/page.tsx 中
const handleAddRecord = async (data: any) => {
  debugger; // 调试器会在这里停止
  console.log('添加记录数据:', data)
  // ... 其他代码
}
```

## 🔍 常见问题解决

### 问题1: 调试器无法连接
**解决方案**: 确保开发服务器是以调试模式启动的
```bash
# 检查是否有调试端口输出
Debugger listening on ws://127.0.0.1:9229/...
```

### 问题2: 断点不生效
**解决方案**:
1. 确保文件路径正确
2. 重新启动调试会话
3. 检查 source maps 是否正确

### 问题3: 端口冲突
**解决方案**:
- 当前服务器运行在 `http://localhost:3002`
- 确保调试配置中的 URL 是正确的

## 📁 文件结构说明

```
├── .vscode/
│   ├── launch.json          # 调试配置
│   ├── settings.json        # VSCode 设置
│   └── extensions.json      # 推荐扩展
├── debug.bat               # Windows 调试启动脚本
└── DEBUG.md               # 这个文件
```

## 🎮 快捷键

- `F5`: 启动/继续调试
- `F9`: 切换断点
- `F10`: 单步跳过 (Step Over)
- `F11`: 单步进入 (Step Into)
- `Shift+F11`: 单步跳出 (Step Out)
- `Ctrl+Shift+F5`: 重启调试会话

## 💡 调试最佳实践

1. **先设置断点，再触发代码执行**
2. **使用 console.log 配合断点调试**
3. **检查网络请求的 payload 和响应**
4. **利用 VSCode 的变量监视功能**
5. **调试完成后记得移除 debugger 语句**

现在你可以高效地调试课程记录系统了！🎉