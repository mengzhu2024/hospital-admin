<template>
  <div class="top-nav-container">
    <!-- 左侧：面包屑和收缩按钮 -->
    <div class="nav-left">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item
            v-for="(item, index) in $route.matched"
            :key="index"
            :to="item.path">
          {{ item.meta?.title || item.name }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 右侧：用户操作区域 -->
    <div class="nav-right">
      <!-- 系统信息 -->
      <div class="system-info">
        <i class="el-icon-date"></i>
        <span class="date">{{ currentDate }}</span>
        <span class="time">{{ currentTime }}</span>
      </div>

      <!-- 用户信息 -->
      <el-dropdown class="user-dropdown" @command="handleCommand">
        <div class="user-info">
          <div class="user-avatar">
            <i class="el-icon-user-solid"></i>
          </div>
          <div class="user-detail">
            <div class="user-name">{{ user.name || '用户' }}</div>
          </div>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </div>

        <el-dropdown-menu slot="dropdown" class="dropdown-menu">
          <el-dropdown-item command="logout">
            <i class="el-icon-switch-button"></i>退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  name: 'navcon',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      collapsed: true,
      currentDate: '',
      currentTime: '',
      timer: null
    }
  },
  mounted() {
    this.updateDateTime()
    this.timer = setInterval(this.updateDateTime, 1000)
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    // 更新日期时间
    updateDateTime() {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      const hour = String(now.getHours()).padStart(2, '0')
      const minute = String(now.getMinutes()).padStart(2, '0')
      const second = String(now.getSeconds()).padStart(2, '0')

      this.currentDate = `${year}-${month}-${day}`
      this.currentTime = `${hour}:${minute}:${second}`
    },

    // 下拉菜单命令处理
    handleCommand(command) {
      if (command === 'logout') {
        this.exit()
      }
    },

    // 退出登录
    exit() {
      this.$confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'logout-confirm',
        center: true
      }).then(() => {
        localStorage.removeItem('token')
        this.$router.push({ path: '/login' })
        this.$message.success('已安全退出')
      }).catch(() => {
        this.$message.info('已取消操作')
      })
    },

    // 切换菜单显示
    toggle(showtype) {
      this.collapsed = !showtype
      this.$root.Bus.$emit('toggle', this.collapsed)
    }
  }
}
</script>

<style scoped>
.top-nav-container {
  height: 60px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  position: relative;
  z-index: 100;
}

/* 左侧区域 */
.nav-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.collapse-btn {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 20px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
}

.collapse-btn:hover {
  background: #e2e8f0;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.collapse-btn i {
  font-size: 20px;
  color: #64748b;
  transition: all 0.3s ease;
}

.collapse-btn:hover i {
  color: #4299e1;
  transform: scale(1.1);
}

.btn-tooltip {
  margin-left: 8px;
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

/* 面包屑导航 */
.breadcrumb {
  padding: 8px 16px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.breadcrumb::v-deep .el-breadcrumb__inner {
  color: #64748b;
  font-weight: 500;
}

.breadcrumb::v-deep .el-breadcrumb__inner:hover {
  color: #4299e1;
}

.breadcrumb::v-deep .el-breadcrumb__separator {
  color: #cbd5e0;
}

/* 右侧区域 */
.nav-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

/* 系统信息 */
.system-info {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.system-info i {
  color: #4299e1;
  font-size: 16px;
  margin-right: 8px;
}

.date {
  font-size: 14px;
  color: #4a5568;
  font-weight: 500;
  margin-right: 12px;
}

.time {
  font-size: 14px;
  color: #4299e1;
  font-weight: 600;
  background: #ebf8ff;
  padding: 2px 8px;
  border-radius: 4px;
}

/* 用户信息下拉菜单 */
.user-dropdown {
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 10px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  min-width: 180px;
}

.user-info:hover {
  background: #f7fafc;
  border-color: #cbd5e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.user-avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #4299e1 0%, #38b2ac 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.user-avatar i {
  font-size: 18px;
  color: white;
}

.user-detail {
  flex: 1;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 2px;
}

.role-tag {
  display: inline-block;
  padding: 2px 8px;
  font-size: 11px;
  border-radius: 10px;
  font-weight: 500;
}

.role-tag.patient {
  background: #e6f7ff;
  color: #1890ff;
}

.role-tag.doctor {
  background: #f6ffed;
  color: #52c41a;
}

.role-tag.admin {
  background: #fff7e6;
  color: #fa8c16;
}

.user-info .el-icon-arrow-down {
  color: #a0aec0;
  font-size: 14px;
  margin-left: 8px;
  transition: transform 0.3s ease;
}

.user-dropdown:hover .el-icon-arrow-down {
  color: #4299e1;
  transform: rotate(180deg);
}

/* 下拉菜单样式 */
.dropdown-menu {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 8px 0;
  margin-top: 8px !important;
  min-width: 120px;
}

.dropdown-menu::v-deep .el-dropdown-menu__item {
  padding: 10px 20px;
  font-size: 14px;
  color: #4a5568;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
}

.dropdown-menu::v-deep .el-dropdown-menu__item i {
  margin-right: 8px;
  font-size: 16px;
  color: #64748b;
}

.dropdown-menu::v-deep .el-dropdown-menu__item:hover {
  background: #f7fafc;
  color: #f56565;
}

.dropdown-menu::v-deep .el-dropdown-menu__item:hover i {
  color: #f56565;
}

/* 响应式调整 */
@media (max-width: 992px) {
  .top-nav-container {
    padding: 0 12px;
  }

  .btn-tooltip {
    display: none;
  }

  .system-info {
    display: none;
  }

  .user-info {
    min-width: auto;
    padding: 6px 8px;
  }

  .user-name {
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .breadcrumb {
    display: none;
  }

  .nav-right {
    gap: 12px;
  }

  .user-detail {
    display: none;
  }

  .user-info {
    padding: 6px;
  }
}
</style>
