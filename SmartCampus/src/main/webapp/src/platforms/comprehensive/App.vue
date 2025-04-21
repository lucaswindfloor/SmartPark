<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
</template>

<script setup>
// 综合管理平台主应用组件
// 使用router-view直接渲染当前路由组件，各个页面根据需要使用不同的布局
</script>

<style>
/* CSS变量定义 */
:root {
  --primary-color: #2E6AE6;
  --secondary-color: #4CBBFF;
  --dark-bg: #0F2645;
  --light-bg: #f6f8fd;
  --header-height: 72px;
  --border-radius-lg: 12px;
  --border-radius-sm: 8px;
  --box-shadow: 0 8px 24px rgba(15, 38, 69, 0.12);
  --transition-normal: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

/* 综合管理平台全局样式 */
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--light-bg);
}

/* Ant Design Vue样式优先级调整 */
.ant-layout {
  background: var(--light-bg) !important;
}

.ant-layout-header {
  height: var(--header-height) !important;
  line-height: var(--header-height) !important;
  padding: 0 !important;
}

.ant-menu-dark {
  background: var(--dark-bg) !important;
  background-image: linear-gradient(180deg, #0F2645 0%, #1A3A67 100%) !important;
}

.ant-menu-dark .ant-menu-inline.ant-menu-sub {
  background: rgba(0, 0, 0, 0.2) !important;
}

.ant-menu-dark.ant-menu-dark:not(.ant-menu-horizontal) .ant-menu-item-selected {
  background-color: var(--primary-color) !important;
}

.ant-menu-item-selected {
  color: white !important;
  font-weight: 500 !important;
}

.ant-menu-light {
  border-right: none !important;
}

.ant-tabs-nav::before {
  border-bottom: none !important;
}

.ant-tabs-top > .ant-tabs-nav {
  margin-bottom: 0 !important;
}

.ant-tabs-tab {
  transition: color 0.3s !important;
}

.ant-statistic-title {
  margin-bottom: 8px !important;
}

.ant-card-body {
  padding: 20px !important;
}

.ant-btn {
  line-height: 1.5715 !important;
  border-radius: var(--border-radius-sm) !important;
  transition: var(--transition-normal) !important;
}

.ant-btn-primary {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
}

.ant-btn-primary:hover {
  background-color: #4281f5 !important;
  border-color: #4281f5 !important;
}

.ant-menu-item, .ant-menu-submenu-title {
  height: 40px !important;
  line-height: 40px !important;
}

.ant-card {
  border-radius: var(--border-radius-sm) !important;
}

/* 解决Element UI与Ant Design Vue的样式冲突 */
.el-button {
  border-radius: var(--border-radius-sm) !important;
}

.el-menu-item, .el-submenu__title {
  height: 40px !important;
  line-height: 40px !important;
}

/* 动画效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 