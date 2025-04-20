<template>
  <div class="profile-page">
    <a-card title="个人资料" class="profile-card">
      <template #title>
        <div class="card-title">
          <UserOutlined /> 个人资料
        </div>
      </template>
      
      <a-descriptions bordered :column="1">
        <a-descriptions-item label="用户名">
          {{ userInfo.username || '未设置' }}
        </a-descriptions-item>
        <a-descriptions-item label="姓名">
          {{ userInfo.name || '未设置' }}
        </a-descriptions-item>
        <a-descriptions-item label="手机号">
          {{ userInfo.mobile || '未设置' }}
        </a-descriptions-item>
        <a-descriptions-item label="邮箱">
          {{ userInfo.email || '未设置' }}
        </a-descriptions-item>
        <a-descriptions-item label="所属企业">
          {{ userInfo.company || '未设置' }}
        </a-descriptions-item>
        <a-descriptions-item label="职位">
          {{ userInfo.position || '未设置' }}
        </a-descriptions-item>
        <a-descriptions-item label="账号创建时间">
          {{ userInfo.createTime || '未知' }}
        </a-descriptions-item>
        <a-descriptions-item label="上次登录时间">
          {{ userInfo.lastLoginTime || '未知' }}
        </a-descriptions-item>
      </a-descriptions>
      
      <div class="action-buttons">
        <a-button type="primary" @click="handleEdit">
          <EditOutlined /> 编辑资料
        </a-button>
        <a-button @click="handleChangePassword">
          <LockOutlined /> 修改密码
        </a-button>
      </div>
    </a-card>
    
    <!-- 编辑资料对话框 -->
    <a-modal
      v-model:visible="editModalVisible"
      title="编辑个人资料"
      @ok="saveProfile"
      :confirmLoading="saveLoading"
    >
      <a-form :model="editForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="姓名" name="name">
          <a-input v-model:value="editForm.name" placeholder="请输入姓名" />
        </a-form-item>
        <a-form-item label="手机号" name="mobile">
          <a-input v-model:value="editForm.mobile" placeholder="请输入手机号" />
        </a-form-item>
        <a-form-item label="邮箱" name="email">
          <a-input v-model:value="editForm.email" placeholder="请输入邮箱" />
        </a-form-item>
        <a-form-item label="职位" name="position">
          <a-input v-model:value="editForm.position" placeholder="请输入职位" />
        </a-form-item>
      </a-form>
    </a-modal>
    
    <!-- 修改密码对话框 -->
    <a-modal
      v-model:visible="passwordModalVisible"
      title="修改密码"
      @ok="changePassword"
      :confirmLoading="passwordLoading"
    >
      <a-form :model="passwordForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="当前密码" name="oldPassword">
          <a-input-password v-model:value="passwordForm.oldPassword" placeholder="请输入当前密码" />
        </a-form-item>
        <a-form-item label="新密码" name="newPassword">
          <a-input-password v-model:value="passwordForm.newPassword" placeholder="请输入新密码" />
        </a-form-item>
        <a-form-item label="确认新密码" name="confirmPassword">
          <a-input-password v-model:value="passwordForm.confirmPassword" placeholder="请再次输入新密码" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { message } from 'ant-design-vue';
import { UserOutlined, EditOutlined, LockOutlined } from '@ant-design/icons-vue';
import { useUserStore } from '../../../../stores/user';

// 用户Store
const userStore = useUserStore();

// 响应式状态
const userInfo = ref({});
const editModalVisible = ref(false);
const passwordModalVisible = ref(false);
const saveLoading = ref(false);
const passwordLoading = ref(false);

// 编辑表单
const editForm = reactive({
  name: '',
  mobile: '',
  email: '',
  position: ''
});

// 修改密码表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const result = await userStore.getUserInfo();
    userInfo.value = result;
  } catch (error) {
    message.error('获取用户信息失败');
  }
};

// 处理编辑资料
const handleEdit = () => {
  // 填充表单数据
  editForm.name = userInfo.value.name || '';
  editForm.mobile = userInfo.value.mobile || '';
  editForm.email = userInfo.value.email || '';
  editForm.position = userInfo.value.position || '';
  
  editModalVisible.value = true;
};

// 保存个人资料
const saveProfile = async () => {
  saveLoading.value = true;
  try {
    await userStore.updateUserInfo(editForm);
    message.success('资料更新成功');
    editModalVisible.value = false;
    
    // 重新获取用户信息
    await fetchUserInfo();
  } catch (error) {
    message.error('更新失败，请稍后重试');
  } finally {
    saveLoading.value = false;
  }
};

// 处理修改密码
const handleChangePassword = () => {
  // 清空表单
  passwordForm.oldPassword = '';
  passwordForm.newPassword = '';
  passwordForm.confirmPassword = '';
  
  passwordModalVisible.value = true;
};

// 修改密码
const changePassword = async () => {
  // 表单验证
  if (!passwordForm.oldPassword) {
    message.error('请输入当前密码');
    return;
  }
  
  if (!passwordForm.newPassword) {
    message.error('请输入新密码');
    return;
  }
  
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    message.error('两次输入的新密码不一致');
    return;
  }
  
  passwordLoading.value = true;
  try {
    await userStore.changePassword(passwordForm);
    message.success('密码修改成功');
    passwordModalVisible.value = false;
  } catch (error) {
    message.error('密码修改失败，请确认当前密码是否正确');
  } finally {
    passwordLoading.value = false;
  }
};

// 组件挂载时获取用户信息
onMounted(() => {
  fetchUserInfo();
});
</script>

<style scoped>
.profile-page {
  max-width: 800px;
  margin: 0 auto;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.profile-card {
  border-radius: 8px;
  box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16), 
              0 3px 6px 0 rgba(0, 0, 0, 0.12), 
              0 5px 12px 4px rgba(0, 0, 0, 0.09);
}

.action-buttons {
  margin-top: 24px;
  display: flex;
  justify-content: center;
  gap: 16px;
}
</style> 