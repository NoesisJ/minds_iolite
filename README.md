# Minds-Iolite

Information Organization Lite - 一个现代化的低代码页面设计与生成平台

## 项目概述

Minds-Iolite 是一个基于 Vue 3 和 TypeScript 构建的低代码平台，允许用户通过可视化界面设计页面，并生成可部署的前端代码，大幅降低前端开发门槛。

## 已完成功能

- ✅ 用户界面框架搭建
- ✅ 页面设计器核心功能
  - 组件拖拽与布局
  - 属性编辑器
  - 页面结构树
- ✅ 基本组件库
  - 基础组件：文本、按钮、输入框等
  - 数据组件：表格、表单等
- ✅ 页面管理
  - 创建、编辑、删除页面
  - 页面预览功能
- ✅ 阅览模式
  - 实时查看设计效果
- ✅ 本地存储
  - 页面设计自动保存
- ✅ 发布对话框基础功能
  - 多步骤向导界面
  - 页面选择功能
  - 项目设置配置
  - 生成配置选项

## 计划中的功能

- 🚧 发布功能完整实现
  - 代码生成引擎
  - 项目打包下载
- 🚧 更多组件类型
  - 图表组件
  - 高级表单组件
  - 媒体组件
- 🚧 组件模板库
  - 预设组件组合
  - 用户自定义模板
- 🚧 主题系统
  - 多主题切换
  - 自定义主题

## 可能的扩展方向

- 📌 团队协作功能
  - 多用户编辑
  - 权限管理
  - 版本控制
- 📌 API集成
  - 后端API对接
  - 数据模型设计
- 📌 CI/CD集成
  - GitHub Actions/GitLab CI 配置生成
  - 自动构建部署流程
  - 多环境部署支持
  - 一键部署到云服务
- 📌 代码导出扩展
  - 多框架支持 (React, Angular等)
  - 后端代码生成

## 技术栈

- Vue 3
- TypeScript
- Tailwind CSS
- Pinia 状态管理
- Vue Router
- Axios

## 开发设置

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 使用指南

1. 在设计器中创建新页面
2. 从组件库中拖拽组件到设计区域
3. 配置组件属性和布局
4. 使用预览功能查看设计效果
5. 通过发布功能生成可部署的项目代码

## 许可证

[MIT License]

# Minds Iolite 低代码平台

Minds Iolite是一个现代化的低代码平台，允许用户通过可视化界面设计Web应用程序，无需编写大量代码。

## 项目开发路线图

### 阶段1: 组件代码生成器 (当前重点)
- [x] 实现文本组件代码生成器
- [ ] 实现按钮组件代码生成器
- [ ] 实现图片组件代码生成器
- [ ] 实现表单组件代码生成器 (输入框、选择框等)
- [ ] 实现数据展示组件代码生成器 (表格、列表等)
- [ ] 完成页面视图组装逻辑
- [ ] 实现页面路由生成
- [ ] 生成功能性项目结构 (可运行的Vue应用)

### 阶段2: 数据集成和表单功能
- [ ] 创建数据源管理界面
- [ ] 实现API数据源连接
- [ ] 添加数据绑定功能 (组件与数据源)
- [ ] 开发表单验证系统
- [ ] 实现表单提交和数据处理
- [ ] 添加条件渲染功能
- [ ] 开发列表/表格数据分页和筛选

### 阶段3: 事件系统和交互增强
- [ ] 实现组件事件管理器
- [ ] 添加页面导航事件
- [ ] 添加数据操作事件 (增删改查)
- [ ] 开发模态框和弹窗交互
- [ ] 添加拖拽精确定位功能
- [ ] 实现组件调整手柄 (大小、位置)
- [ ] 添加组件组和布局容器

### 阶段4: 预览和调试功能
- [ ] 增强实时预览功能
- [ ] 添加组件树查看器
- [ ] 实现状态检查器
- [ ] 添加网络请求监控
- [ ] 开发移动设备响应式预览
- [ ] 添加性能分析工具
- [ ] 实现代码查看功能

### 阶段5: 业务逻辑和工作流
- [ ] 开发可视化逻辑编辑器
- [ ] 实现条件分支逻辑
- [ ] 添加循环迭代逻辑
- [ ] 开发简单工作流引擎
- [ ] 添加定时任务支持
- [ ] 实现自定义函数编辑器
- [ ] 添加变量和常量管理

### 阶段6: 用户和权限系统
- [ ] 实现用户认证和授权
- [ ] 添加角色管理
- [ ] 开发权限控制系统
- [ ] 实现团队协作功能
- [ ] 添加版本控制和历史记录
- [ ] 开发资源共享系统
- [ ] 实现评论和反馈功能

### 阶段7: 发布和部署
- [ ] 增强发布对话框功能
- [ ] 添加静态网站发布选项
- [ ] 实现服务器部署流程
- [ ] 添加容器化部署支持
- [ ] 开发CI/CD集成
- [ ] 实现发布版本管理
- [ ] 添加发布前预检和优化

## 阶段1详细实施计划

### 组件代码生成器实现步骤

1. **修改 ProjectGenerator.ts 文件**:
   - 完善 `generatePageComponents()` 方法
   - 添加各类型组件的代码生成方法
   - 实现页面组装逻辑

2. **文本组件代码生成**:
   ```typescript
   private generateTextComponentCode(component: ComponentInstance): string {
     // 根据组件属性生成Vue组件代码
     return `<template>
       <div class="text-component" :style="styles">
         {{ content }}
       </div>
     </template>
     
     <script>
     export default {
       props: {
         content: {
           type: String,
           default: '${component.props.content || "文本内容"}'
         },
         styles: {
           type: Object,
           default: () => ({
             fontSize: '${component.styles.fontSize || "16px"}',
             color: '${component.styles.color || "#333"}',
             // 其他样式...
           })
         }
       }
     }
     </script>`;
   }
   ```

3. **页面组装逻辑**:
   ```typescript
   private generatePageViewContent(page: Page): string {
     // 生成页面组件，包含所有区域和子组件
     let imports = '';
     let components = '{';
     let template = '<div class="page-container">\n';
     
     // 处理每个区域...
     
     template += '</div>';
     
     return `<template>
       ${template}
     </template>
     
     <script>
     ${imports}
     
     export default {
       components: ${components}
     }
     </script>`;
   }
   ```

4. **路由生成**:
   ```typescript
   private generateRoutes(): string {
     // 生成Vue Router配置
     let routes = '';
     this.pages.forEach(page => {
       routes += `  {
         path: '/${page.name.toLowerCase()}',
         name: '${page.name}',
         component: () => import('../views/${page.name}.vue')
       },\n`;
     });
     
     return `import { createRouter, createWebHistory } from 'vue-router'

     const routes = [
       ${routes}
     ]
     
     const router = createRouter({
       history: createWebHistory('${this.settings.routeMode === 'history' ? '/' : '#/'}'),
       routes
     })
     
     export default router`;
   }
   ```

## 系统架构

### 组件库系统与代码生成

设计器的核心包含三个主要系统，使其能够从可视化设计到代码生成：

#### 1. 组件定义和注册系统

所有可用组件在 `src/data/componentLibrary.ts` 中定义，包括：
- 基础组件（文本、图片、按钮）
- 表单组件（输入框、选择器、复选框）
- 数据组件（表格、列表）

每个组件定义包含：
- 唯一标识ID
- 类型和分类
- 图标和显示名称
- 默认属性和样式
- 允许的容器类型

关键函数：
- `getComponentDefinition` - 根据ID获取组件定义
- `createComponentInstance` - 创建组件实例

#### 2. 组件实例化和渲染系统

当用户在设计器中拖放组件时：
1. 从左侧面板拖动组件到设计画布
2. `DesignCanvas.vue` 中的事件处理函数捕获放置事件
3. 通过 `designerStore` 创建组件实例并添加到页面区域
4. `ComponentPreview.vue` 负责根据组件类型渲染预览

#### 3. 代码生成系统

代码生成系统位于 `src/services/generator` 目录，主要包含：

- `ComponentGeneratorInterface` - 定义组件生成器接口
- 各种组件生成器实现（文本、按钮、图片等）
- 组件生成器注册表 - 管理所有生成器
- `ProjectGenerator` - 整合所有组件代码，生成完整项目

当用户发布项目时，系统会：
1. 收集所有页面和组件
2. 为每个组件调用对应生成器生成Vue组件代码
3. 生成路由配置和项目结构
4. 打包成一个完整可运行的Vue项目
