<template>
  <div class="notification-widget" :class="{ collapsed: isCollapsed }">
    <div class="widget-header" @click="toggleCollapse">
      <div class="header-title">
        <el-badge :value="unreadCount > 0 ? unreadCount : ''" :max="99" :hidden="unreadCount === 0">
          <span class="title-text">{{ title }}</span>
        </el-badge>
      </div>
      <div class="header-actions">
        <el-button v-if="isCollapsed" circle size="small" :icon="Expand" @click.stop="toggleCollapse"></el-button>
        <el-button v-else circle size="small" :icon="Fold" @click.stop="toggleCollapse"></el-button>
      </div>
    </div>
    
    <div class="widget-content" v-show="!isCollapsed">
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="3" animated />
      </div>
      
      <div v-else-if="notifications.length === 0" class="empty-container">
        <el-empty description="暂无通知" :image-size="60"></el-empty>
      </div>
      
      <div v-else class="notifications-list">
        <div 
          v-for="notification in notifications" 
          :key="notification.id"
          class="notification-item"
          :class="{ unread: !notification.isRead }"
          @click="handleNotificationClick(notification)"
        >
          <div class="notification-dot" v-if="!notification.isRead"></div>
          <div class="notification-icon">
            <el-icon v-if="notification.type === 'audit'"><DocumentChecked /></el-icon>
            <el-icon v-else-if="notification.type === 'publish'"><Bell /></el-icon>
            <el-icon v-else-if="notification.type === 'confirmation'"><InfoFilled /></el-icon>
            <el-icon v-else><Message /></el-icon>
          </div>
          <div class="notification-content">
            <div class="notification-title" :title="notification.title">{{ notification.title }}</div>
            <div class="notification-time">{{ formatTime(notification.time) }}</div>
          </div>
        </div>
      </div>
      
      <div class="widget-footer">
        <el-button 
          v-if="notifications.length > 0" 
          size="small" 
          text 
          @click="markAllAsRead"
        >全部标为已读</el-button>
        <el-button size="small" text @click="$emit('view-all')">查看全部</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Bell, DocumentChecked, InfoFilled, Message, Expand, Fold } from '@element-plus/icons-vue'

export default {
  name: 'NotificationWidget',
  components: {
    Bell,
    DocumentChecked,
    InfoFilled,
    Message,
    Expand,
    Fold
  },
  props: {
    title: {
      type: String,
      default: '通知提醒'
    },
    pollingInterval: {
      type: Number,
      default: 60000 // 默认1分钟轮询一次
    },
    defaultCollapsed: {
      type: Boolean,
      default: false
    },
    maxHeight: {
      type: String,
      default: '300px'
    }
  },
  setup(props, { emit }) {
    const isCollapsed = ref(props.defaultCollapsed)
    const loading = ref(true)
    const notifications = ref([])
    let pollingTimer = null
    
    const unreadCount = computed(() => {
      return notifications.value.filter(item => !item.isRead).length
    })
    
    const toggleCollapse = () => {
      isCollapsed.value = !isCollapsed.value
    }
    
    const fetchNotifications = async () => {
      loading.value = true
      
      try {
        // 实际项目中这里应该调用API获取通知数据
        // 这里模拟获取数据
        const mockNotifications = generateMockNotifications()
        notifications.value = mockNotifications
      } catch (error) {
        console.error('获取通知失败:', error)
      } finally {
        loading.value = false
      }
    }
    
    const generateMockNotifications = () => {
      const types = ['audit', 'publish', 'confirmation', 'other']
      const now = new Date()
      
      return Array(5)
        .fill()
        .map((_, index) => {
          const type = types[index % types.length]
          let title = ''
          
          switch (type) {
            case 'audit':
              title = '【审核】有新的通知公告待审核'
              break
            case 'publish':
              title = '【发布】通知公告《关于园区停电维护的通知》已发布'
              break
            case 'confirmation':
              title = '【确认】有3项通知公告确认即将截止'
              break
            default:
              title = '【系统】系统通知'
          }
          
          return {
            id: `notification-${index + 1}`,
            type,
            title,
            time: new Date(now.getTime() - (index * 30 + Math.random() * 30) * 60000),
            isRead: index > 2
          }
        })
    }
    
    const formatTime = (time) => {
      const now = new Date()
      const diff = (now.getTime() - time.getTime()) / 1000
      
      if (diff < 60) {
        return '刚刚'
      } else if (diff < 3600) {
        return `${Math.floor(diff / 60)}分钟前`
      } else if (diff < 86400) {
        return `${Math.floor(diff / 3600)}小时前`
      } else if (diff < 604800) {
        return `${Math.floor(diff / 86400)}天前`
      } else {
        const year = time.getFullYear()
        const month = (time.getMonth() + 1).toString().padStart(2, '0')
        const day = time.getDate().toString().padStart(2, '0')
        return `${year}-${month}-${day}`
      }
    }
    
    const handleNotificationClick = (notification) => {
      // 标记为已读
      if (!notification.isRead) {
        markAsRead(notification.id)
      }
      
      // 根据通知类型进行不同处理
      switch (notification.type) {
        case 'audit':
          emit('handle-notification', { type: 'audit', id: notification.id })
          break
        case 'publish':
          emit('handle-notification', { type: 'publish', id: notification.id })
          break
        case 'confirmation':
          emit('handle-notification', { type: 'confirmation', id: notification.id })
          break
        default:
          emit('handle-notification', { type: 'other', id: notification.id })
      }
    }
    
    const markAsRead = (id) => {
      // 实际项目中这里应该调用API标记通知为已读
      const notification = notifications.value.find(item => item.id === id)
      if (notification) {
        notification.isRead = true
      }
    }
    
    const markAllAsRead = () => {
      // 实际项目中这里应该调用API标记所有通知为已读
      notifications.value.forEach(item => {
        item.isRead = true
      })
      emit('mark-all-read')
    }
    
    const startPolling = () => {
      // 开始轮询
      pollingTimer = setInterval(() => {
        fetchNotifications()
      }, props.pollingInterval)
    }
    
    const stopPolling = () => {
      // 停止轮询
      if (pollingTimer) {
        clearInterval(pollingTimer)
        pollingTimer = null
      }
    }
    
    onMounted(() => {
      fetchNotifications()
      startPolling()
    })
    
    onBeforeUnmount(() => {
      stopPolling()
    })
    
    return {
      isCollapsed,
      loading,
      notifications,
      unreadCount,
      toggleCollapse,
      formatTime,
      handleNotificationClick,
      markAllAsRead,
      Bell,
      DocumentChecked,
      InfoFilled,
      Message,
      Expand,
      Fold
    }
  },
  emits: ['handle-notification', 'mark-all-read', 'view-all']
}
</script>

<style scoped>
.notification-widget {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: #fff;
  width: 100%;
  max-width: 400px;
  transition: all 0.3s;
}

.widget-header {
  padding: 12px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ebeef5;
  cursor: pointer;
}

.header-title {
  font-weight: bold;
  display: flex;
  align-items: center;
}

.title-text {
  margin-left: 5px;
}

.widget-content {
  max-height: v-bind(maxHeight);
  overflow-y: auto;
}

.loading-container, .empty-container {
  padding: 20px;
  text-align: center;
}

.notifications-list {
  padding: 0;
}

.notification-item {
  padding: 12px 15px;
  display: flex;
  align-items: flex-start;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  position: relative;
  transition: background-color 0.3s;
}

.notification-item:hover {
  background-color: #f5f7fa;
}

.notification-item.unread {
  background-color: #f0f7ff;
}

.notification-dot {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #f56c6c;
  top: 12px;
  right: 12px;
}

.notification-icon {
  margin-right: 10px;
  color: #409eff;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-size: 14px;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.notification-time {
  font-size: 12px;
  color: #909399;
}

.widget-footer {
  padding: 8px 15px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #ebeef5;
}

/* 折叠状态 */
.collapsed .widget-header {
  border-bottom: none;
}
</style> 