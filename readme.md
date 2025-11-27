# 个人博客网站

## 项目概述

这是一个基于纯前端技术栈的个人博客网站，用于展示个人信息、读书笔记、游戏记录和日常笔记。项目采用模块化设计，使用localStorage进行数据持久化，无需后端服务器支持。

## 技术栈

- **前端框架**: 原生JavaScript (ES6+)
- **样式**: CSS3 + CSS变量
- **数据存储**: localStorage
- **富文本编辑**: Pell编辑器
- **图片缩放**: medium-zoom库
- **响应式设计**: 移动优先的响应式布局

## 项目结构

```
personalweb-demo/
├── index.html              # 主页面
├── pages/                  # 其他页面
│   ├── profile.html        # 个人信息页面
│   ├── books.html          # 读书笔记页面
│   ├── games.html          # 游戏记录页面
│   └── notes.html          # 笔记页面(待实现)
├── css/                    # 样式文件
│   ├── main.css            # 主样式
│   ├── books.css           # 读书模块样式
│   └── games.css           # 游戏模块样式
├── js/                     # JavaScript文件
│   ├── state.js            # 全局状态管理
│   ├── nav.js              # 导航功能
│   ├── utils.js            # 工具函数
│   ├── books.js            # 读书模块功能
│   ├── games.js            # 游戏模块功能
│   └── modules/            # 模块化脚本
│       └── profile.js      # 个人信息模块
├── assets/                 # 静态资源
│   ├── images/             # 图片资源
│   └── icons/              # 图标资源
└── libs/                   # 第三方库
```

## 功能模块

### 1. 个人信息模块

- **功能**: 展示个人基本信息、技能、社交链接等
- **页面**: `profile.html`
- **数据结构**: 
  ```javascript
  {
    avatar: 'assets/images/head.jpg',
    name: 'FaceAuthentic',
    title: 'Web开发者',
    birthDate: '庚辰年九月廿三',
    city: '上海',
    email: 'example@example.com',
    hobbies: '阅读、游戏、编程',
    bio: '别困在自己的死胡同里',
    skills: ['AI探索者', '学习者'],
    socialLinks: {
      github: 'https://github.com',
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com'
    }
  }
  ```
- **实现文件**: `js/modules/profile.js`

### 2. 读书笔记模块

- **功能**: 管理读书笔记，支持添加、编辑、删除和搜索
- **页面**: `books.html`
- **数据结构**: 
  ```javascript
  {
    id: 'unique-id',
    title: '书名',
    author: '作者',
    date: '阅读日期',
    notes: '读书笔记内容',
    cover: '封面图片URL'
  }
  ```
- **特色功能**: 
  - 卡片式布局展示
  - Pell富文本编辑器
  - 笔记预览和展开
  - 搜索过滤功能
- **实现文件**: `js/books.js`, `css/books.css`

### 3. 游戏记录模块

- **功能**: 记录游戏信息，支持添加、编辑、删除和搜索
- **页面**: `games.html`
- **数据结构**: 
  ```javascript
  {
    id: 'unique-id',
    name: '游戏名称',
    type: '游戏类型',
    category: '游戏分类',
    startDate: '开始日期',
    duration: '游戏时长',
    cover: '游戏封面URL'
  }
  ```
- **特色功能**: 
  - 卡片式布局展示
  - 游戏类型和分类标签
  - 游戏时长计算
  - 搜索过滤功能
- **实现文件**: `js/games.js`, `css/games.css`

### 4. 笔记模块 (待实现)

- **功能**: 管理日常笔记，支持富文本编辑和图片添加
- **页面**: `notes.html`
- **数据结构**: 
  ```javascript
  {
    id: 'unique-id',
    title: '笔记标题',
    content: '笔记内容',
    date: '创建日期',
    images: ['图片URL数组'],
    likes: 0
  }
  ```
- **特色功能**: 
  - 卡片式布局展示
  - Pell富文本编辑器
  - 图片添加和点赞功能
  - medium-zoom图片缩放
  - 搜索过滤功能

## 核心功能实现

### 1. 全局状态管理 (AppState)

- **文件**: `js/state.js`
- **功能**: 
  - 通过localStorage管理应用数据
  - 提供数据加载/保存功能
  - 支持监听器模式
  - 提供模块数据CRUD操作
- **主要方法**: 
  - `loadData()`: 从localStorage加载数据
  - `saveData()`: 保存数据到localStorage
  - `addRecord(module, data)`: 添加记录
  - `updateRecord(module, id, data)`: 更新记录
  - `deleteRecord(module, id)`: 删除记录
  - `getRecords(module)`: 获取模块所有记录

### 2. 导航功能 (Navigation)

- **文件**: `js/nav.js`
- **功能**: 
  - 动态创建导航栏
  - 根据URL路径更新活动导航项
  - 处理导航点击事件
  - 支持浏览器前进后退
- **主要方法**: 
  - `init()`: 初始化导航
  - `render()`: 渲染导航栏
  - `setActiveItem(path)`: 设置活动导航项
  - `handleNavClick(event)`: 处理导航点击

### 3. 工具函数 (Utils)

- **文件**: `js/utils.js`
- **功能**: 
  - Pell富文本编辑器初始化
  - 图片缩放功能
  - 游戏入坑年数计算
  - 日期格式化
  - 防抖和节流函数
  - 加载指示器
  - 消息提示
  - DOM元素创建

## 样式设计

### 1. 主样式 (main.css)

- **全局样式重置**: 标准化浏览器默认样式
- **CSS变量**: 定义主题色、辅助色等
- **基础样式**: 页面布局、导航栏、卡片、按钮、表单
- **功能组件**: 加载指示器、消息提示、页面切换动画
- **响应式设计**: 移动优先的响应式布局
- **第三方库样式**: Pell编辑器和图片缩放相关样式

### 2. 模块样式

- **books.css**: 读书模块专用样式
- **games.css**: 游戏模块专用样式
- **notes.css**: 笔记模块专用样式(待实现)

## 数据模型设计

### 1. 数据存储结构

```javascript
{
  profile: {}, // 个人信息
  books: [],   // 读书笔记数组
  games: [],   // 游戏记录数组
  notes: []    // 笔记数组
}
```

### 2. 数据持久化

- 使用localStorage进行数据持久化
- 数据以JSON格式存储
- 支持数据导入导出(待实现)

## 页面设计

### 1. 主页面 (index.html)

- **结构**: 
  - 导航栏
  - 欢迎区域
  - 模块卡片区域(个人信息、读书、游戏、笔记)
  - 页脚
- **功能**: 
  - 展示网站概览
  - 提供各模块入口

### 2. 模块页面

- **通用结构**: 
  - 页面头部(标题和描述)
  - 操作区域(搜索和添加按钮)
  - 内容区域(卡片列表)
  - 模态框(添加/编辑表单)
- **响应式设计**: 适配不同屏幕尺寸

## 交互设计

### 1. 导航交互

- 点击导航项切换页面
- 当前页面高亮显示
- 支持浏览器前进后退

### 2. 卡片交互

- 悬停效果
- 点击展开详情
- 编辑和删除操作

### 3. 表单交互

- 实时验证
- 提交反馈
- 错误提示

## 开发指南

### 1. 环境要求

- 现代浏览器(支持ES6+)
- 本地HTTP服务器(可选)

### 2. 开发流程

1. 克隆项目到本地
2. 使用HTTP服务器运行项目
3. 根据需求修改或添加功能
4. 测试功能兼容性
5. 部署到静态服务器

### 3. 代码规范

- 使用ES6+语法
- 遵循驼峰命名法
- 添加必要的注释
- 保持代码简洁清晰

## 部署说明

### 1. 静态部署

- 可部署到任何静态文件服务器
- 支持GitHub Pages、Netlify等平台

### 2. 注意事项

- 确保所有资源使用相对路径
- 检查第三方库CDN链接是否可用
- 测试所有功能是否正常工作

## 未来计划

1. 实现笔记模块
2. 添加数据导入导出功能
3. 优化移动端体验
4. 添加主题切换功能
5. 实现数据备份和恢复

## 许可证

MIT License

## 贡献指南

欢迎提交Issue和Pull Request来改进项目。

## 联系方式

如有问题或建议，请通过以下方式联系:

- 邮箱: example@example.com
- GitHub: https://github.com
