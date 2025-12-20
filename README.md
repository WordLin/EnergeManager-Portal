# 日程任务系统

基于 Vue 3 + TypeScript + Vite 构建的现代化日程任务管理系统。

## 功能特性

- 📅 日历视图展示日程任务
- ✅ 任务创建、编辑、删除、完成
- 🎯 任务优先级管理（1-5级）
- 📊 日程安排和调度
- 🔄 自动重新调度过期任务
- ⚙️ 工作日历配置

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **TypeScript** - 类型安全
- **Vite** - 快速构建工具
- **Pinia** - 状态管理
- **Vue Router** - 路由管理
- **Element Plus** - UI 组件库
- **Axios** - HTTP 客户端
- **Day.js** - 日期处理

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 后端 API

项目需要连接到 FastAPI 后端服务（默认运行在 http://localhost:8000）。

API 文档请参考：`D:\MyCode\2025\Python\EnergyManager_Python\docs\swagger.yaml`

