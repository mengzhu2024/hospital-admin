<!-- 左侧菜单 -->
<template>
  <div class="left-nav-container">
    <!-- 简约Logo区域 -->
    <div class="system-logo">
      <div class="logo-icon">
        <i class="el-icon-first-aid-kit"></i>
      </div>
      <div class="system-name" v-show="!collapsed">
        <span class="main-title">预约挂号系统</span>
      </div>
    </div>

    <!-- 导航菜单 -->
    <div class="menu-wrapper">
      <el-menu
          default-active="2"
          :collapse="collapsed"
          collapse-transition
          router
          :default-active="$route.path"
          unique-opened
          class="el-menu-vertical-demo"
          background-color="#ffffff"
          text-color="#4a5568"
          active-text-color="#2d3748">

        <el-menu-item
            v-for="menu in allmenu"
            v-if="!menu.role || user.role === menu.role"
            :index="menu.path"
            :key="menu.menuId"
            class="menu-item-custom">
          <div class="menu-item-content">
            <div class="menu-icon-wrapper">
              <i :class="menu.icon" class="menu-icon"></i>
            </div>
            <span class="menu-text">{{ menu.name }}</span>
            <div class="menu-arrow" v-if="$route.path === menu.path && !collapsed">
              <i class="el-icon-arrow-right"></i>
            </div>
          </div>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 折叠控制按钮 -->
    <div class="collapse-control" @click="$root.Bus.$emit('toggle', collapsed)">
      <i :class="collapsed ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'"></i>
      <span v-show="!collapsed">收起菜单</span>
    </div>
  </div>
</template>

<script>
import menu from '../router/menu'
export default {
  name: 'leftnav',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      collapsed: false,
      allmenu: menu.menus,
    }
  },
  created() {
    this.$root.Bus.$on('toggle', value => {
      this.collapsed = !value
    })
  }
}
</script>

<style scoped>
.left-nav-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  box-shadow: 1px 0 6px rgba(0, 0, 0, 0.03);
  position: relative;
  overflow: hidden; /* 防止整个容器出现滚动条 */
}

/* Logo区域样式 - 简约医疗风格 */
.system-logo {
  padding: 24px 20px;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-bottom: 1px solid #f1f5f9;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  transition: all 0.3s ease;
  flex-shrink: 0; /* 防止Logo区域被压缩 */
}

.system-logo:hover {
  background: linear-gradient(135deg, #f1f5f9 0%, #ffffff 100%);
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #4299e1 0%, #38b2ac 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  box-shadow: 0 2px 8px rgba(66, 153, 225, 0.15);
}

.logo-icon i {
  font-size: 20px;
  color: white;
}

.system-name {
  display: flex;
  flex-direction: column;
}

.main-title {
  font-size: 18px;
  font-weight: 700;
  color: #2d3748;
  letter-spacing: 1px;
  background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.sub-title {
  font-size: 12px;
  color: #718096;
  margin-top: 2px;
  font-weight: 500;
}

/* 菜单包装容器 - 处理滚动条 */
.menu-wrapper {
  flex: 1;
  overflow: hidden; /* 隐藏自身滚动条 */
  min-height: 0; /* 允许flex子元素收缩 */
}

/* 导航菜单样式 */
.el-menu-vertical-demo {
  flex: 1;
  border-right: none;
  padding: 16px 8px;
  overflow-y: auto; /* 允许垂直滚动 */
  overflow-x: hidden; /* 隐藏水平滚动 */
  height: 100%; /* 占满父容器 */
  /* 隐藏滚动条 - 兼容多种浏览器 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

/* 隐藏Webkit浏览器的滚动条 */
.el-menu-vertical-demo::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
  width: 0;
  height: 0;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 240px;
}

.menu-item-custom {
  margin: 6px 12px;
  border-radius: 8px;
  height: 44px;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
}

.menu-item-custom:hover {
  background-color: #f7fafc !important;
  transform: translateX(4px);
}

.menu-item-custom:hover::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 16px;
  background: #4299e1;
  border-radius: 0 2px 2px 0;
}

.menu-item-custom.is-active {
  background-color: #ebf8ff !important;
}

.menu-item-custom.is-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 24px;
  background: linear-gradient(to bottom, #4299e1, #38b2ac);
  border-radius: 0 2px 2px 0;
}

.menu-item-content {
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
  padding-left: 4px;
}

.menu-icon-wrapper {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  background: #f1f5f9;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
}

.menu-item-custom:hover .menu-icon-wrapper {
  background: #e2e8f0;
  transform: scale(1.05);
}

.menu-item-custom.is-active .menu-icon-wrapper {
  background: linear-gradient(135deg, #4299e1, #38b2ac);
  box-shadow: 0 2px 6px rgba(66, 153, 225, 0.2);
}

.menu-icon {
  font-size: 16px;
  color: #64748b;
  position: relative;
  z-index: 1;
  transition: all 0.25s ease;
}

.menu-item-custom.is-active .menu-icon {
  color: white;
}

.menu-text {
  font-size: 14px;
  font-weight: 500;
  color: #4a5568;
  flex: 1;
  transition: all 0.25s ease;
}

.menu-item-custom.is-active .menu-text {
  color: #2d3748;
  font-weight: 600;
}

.menu-arrow {
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.25s ease;
  color: #4299e1;
}

.menu-item-custom:hover .menu-arrow,
.menu-item-custom.is-active .menu-arrow {
  opacity: 1;
  transform: translateX(0);
}

/* 折叠控制按钮 */
.collapse-control {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #64748b;
  flex-shrink: 0; /* 防止底部按钮被压缩 */
}

.collapse-control:hover {
  background: #f1f5f9;
  color: #4299e1;
}

.collapse-control i {
  font-size: 18px;
  transition: transform 0.3s ease;
}

.collapse-control:hover i {
  transform: scale(1.1);
}

.collapse-control span {
  margin-left: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
}

/* 折叠状态样式 */
.el-menu--collapse {
  padding: 16px 0;
}

.el-menu--collapse .menu-item-content {
  justify-content: center;
}

.el-menu--collapse .menu-icon-wrapper {
  margin-right: 0;
  width: 40px;
  height: 40px;
}

.el-menu--collapse .menu-icon {
  font-size: 18px;
}

.el-menu--collapse .menu-item-custom {
  margin: 8px 4px;
}

/* 菜单项分隔效果 */
.menu-item-custom + .menu-item-custom {
  margin-top: 2px;
}

/* 确保菜单内容不会超出容器 */
.menu-item-custom .menu-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 额外保证滚动条隐藏 */
* {
  scrollbar-width: none;
}

*::-webkit-scrollbar {
  width: 0 !important;
  height: 0 !important;
}
</style>
