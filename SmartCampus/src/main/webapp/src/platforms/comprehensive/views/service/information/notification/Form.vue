<template>
  <div class="notification-form">
    <h2>{{ isEdit ? '编辑通知公告' : '创建通知公告' }}</h2>
    <p>此页面为通知公告表单的占位页面，后续将实现完整功能。</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isEdit = computed(() => route.name === 'EditNotification');
</script>

<style scoped>
.notification-form {
  padding: 20px;
}
</style> 