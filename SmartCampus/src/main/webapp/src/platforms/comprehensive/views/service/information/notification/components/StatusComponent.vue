<template>
  <div class="notification-status-component">
    <div class="status-tag">
      <el-tag :type="getStatusTagType" :effect="getStatusTagEffect">
        {{ getStatusLabel }}
      </el-tag>
    </div>
    
    <div class="status-actions" v-if="showActions">
      <!-- 草稿状态 -->
      <template v-if="status === 'draft'">
        <el-button 
          v-if="hasPermission('draft')"
          size="small" 
          type="primary" 
          @click="$emit('edit')"
        >编辑</el-button>
        <el-button 
          v-if="hasPermission('draft')"
          size="small" 
          type="success" 
          @click="$emit('submit-audit')"
        >提交审核</el-button>
        <el-button 
          v-if="hasPermission('draft')"
          size="small" 
          type="danger" 
          @click="$emit('delete')"
        >删除</el-button>
      </template>
      
      <!-- 待审核状态 -->
      <template v-else-if="status === 'pending_audit'">
        <el-button 
          v-if="hasPermission('audit')"
          size="small" 
          type="success" 
          @click="$emit('approve')"
        >通过</el-button>
        <el-button 
          v-if="hasPermission('audit')"
          size="small" 
          type="danger" 
          @click="$emit('reject')"
        >驳回</el-button>
        <el-button 
          v-if="hasPermission('draft') && creator === currentUser"
          size="small" 
          @click="$emit('withdraw')"
        >撤回</el-button>
      </template>
      
      <!-- 待发布状态 -->
      <template v-else-if="status === 'pending_publish'">
        <el-button 
          v-if="hasPermission('publish')"
          size="small" 
          type="success" 
          @click="$emit('publish')"
        >发布</el-button>
        <el-button 
          v-if="hasPermission('publish')"
          size="small" 
          @click="$emit('schedule')"
        >定时发布</el-button>
        <el-button 
          v-if="hasPermission('draft') && creator === currentUser"
          size="small" 
          @click="$emit('withdraw-to-draft')"
        >撤回至草稿</el-button>
      </template>
      
      <!-- 已发布状态 -->
      <template v-else-if="status === 'published'">
        <el-button 
          v-if="hasPermission('manage') && !isPinned"
          size="small" 
          @click="$emit('pin')"
        >置顶</el-button>
        <el-button 
          v-if="hasPermission('manage') && isPinned"
          size="small" 
          @click="$emit('unpin')"
        >取消置顶</el-button>
        <el-button 
          v-if="hasPermission('manage')"
          size="small" 
          @click="$emit('extend')"
        >延期</el-button>
        <el-button 
          v-if="hasPermission('manage')"
          size="small" 
          type="warning" 
          @click="$emit('cancel')"
        >取消发布</el-button>
        <el-button 
          v-if="hasPermission('manage')"
          size="small" 
          type="danger" 
          @click="$emit('delete')"
        >删除</el-button>
      </template>
      
      <!-- 已过期状态 -->
      <template v-else-if="status === 'expired'">
        <el-button 
          v-if="hasPermission('archive')"
          size="small" 
          @click="$emit('archive')"
        >归档</el-button>
        <el-button 
          v-if="hasPermission('manage')"
          size="small" 
          @click="$emit('extend')"
        >延期</el-button>
        <el-button 
          v-if="hasPermission('manage')"
          size="small" 
          type="danger" 
          @click="$emit('delete')"
        >删除</el-button>
      </template>
      
      <!-- 已取消发布状态 -->
      <template v-else-if="status === 'canceled'">
        <el-button 
          v-if="hasPermission('archive')"
          size="small" 
          @click="$emit('archive')"
        >归档</el-button>
        <el-button 
          v-if="hasPermission('manage')"
          size="small" 
          type="danger" 
          @click="$emit('delete')"
        >删除</el-button>
      </template>
      
      <!-- 归档状态 -->
      <template v-else-if="status === 'archived'">
        <el-button 
          v-if="hasPermission('archive')"
          size="small" 
          @click="$emit('unarchive')"
        >解档</el-button>
        <el-button 
          v-if="hasPermission('manage')"
          size="small" 
          type="danger" 
          @click="$emit('delete')"
        >删除</el-button>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatusComponent',
  props: {
    status: {
      type: String,
      required: true,
      validator: (value) => {
        return [
          'draft', 
          'pending_audit', 
          'pending_publish', 
          'published', 
          'expired', 
          'canceled', 
          'archived'
        ].includes(value)
      }
    },
    isPinned: {
      type: Boolean,
      default: false
    },
    creator: {
      type: String,
      default: ''
    },
    showActions: {
      type: Boolean,
      default: true
    },
    userPermissions: {
      type: Array,
      default: () => []
    },
    currentUser: {
      type: String,
      default: ''
    }
  },
  computed: {
    getStatusTagType() {
      const map = {
        draft: 'info',
        pending_audit: 'warning',
        pending_publish: 'warning',
        published: 'success',
        expired: '',
        canceled: 'danger',
        archived: 'info'
      }
      return map[this.status] || 'info'
    },
    getStatusTagEffect() {
      return (this.status === 'published' && this.isPinned) ? 'dark' : 'light'
    },
    getStatusLabel() {
      const map = {
        draft: '草稿',
        pending_audit: '待审核',
        pending_publish: '待发布',
        published: this.isPinned ? '已发布(置顶)' : '已发布',
        expired: '已过期',
        canceled: '已取消发布',
        archived: '已归档'
      }
      return map[this.status] || '未知状态'
    }
  },
  methods: {
    hasPermission(permission) {
      // 检查用户是否拥有某项权限
      return this.userPermissions.includes(permission)
    }
  },
  emits: [
    'edit',
    'submit-audit', 
    'approve', 
    'reject', 
    'withdraw',
    'publish', 
    'schedule', 
    'withdraw-to-draft', 
    'pin', 
    'unpin', 
    'extend', 
    'cancel', 
    'archive', 
    'unarchive', 
    'delete'
  ]
}
</script>

<style scoped>
.notification-status-component {
  display: flex;
  align-items: center;
}

.status-tag {
  margin-right: 15px;
}

.status-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .notification-status-component {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .status-tag {
    margin-right: 0;
    margin-bottom: 10px;
  }
}
</style> 