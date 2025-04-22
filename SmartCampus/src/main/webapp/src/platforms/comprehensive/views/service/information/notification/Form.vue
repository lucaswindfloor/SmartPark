<template>
  <div class="notification-form">
    <el-form 
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      label-position="left"
    >
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" placeholder="请输入标题" />
      </el-form-item>
      
      <el-form-item label="类型" prop="category">
        <el-select v-model="form.category" placeholder="请选择公告类型">
          <el-option 
            v-for="category in categoryOptions" 
            :key="category.value" 
            :label="category.label" 
            :value="category.value" 
          />
        </el-select>
      </el-form-item>
      
      <el-form-item label="置顶">
        <el-switch v-model="form.isSticky" />
      </el-form-item>
      
      <el-form-item label="内容" prop="content">
        <el-editor 
          v-model="form.content" 
          :min-height="300"
          placeholder="请输入公告内容"
        />
      </el-form-item>
      
      <el-form-item label="附件">
        <el-upload
          multiple
          :limit="5"
          :action="uploadUrl"
          :on-success="handleUploadSuccess"
          :on-remove="handleRemoveFile"
          :before-upload="beforeUpload"
          :file-list="fileList"
        >
          <el-button type="primary">
            <el-icon><Upload /></el-icon>上传附件
          </el-button>
          <template #tip>
            <div class="el-upload__tip">
              支持各种格式文件，单个文件不超过10MB
            </div>
          </template>
        </el-upload>
      </el-form-item>
      
      <el-form-item label="发布时间">
        <el-date-picker
          v-model="form.publishTime"
          type="datetime"
          placeholder="选择发布时间"
        />
      </el-form-item>
      
      <el-form-item label="状态">
        <el-radio-group v-model="form.status">
          <el-radio label="DRAFT">保存为草稿</el-radio>
          <el-radio label="PUBLISHED">立即发布</el-radio>
        </el-radio-group>
      </el-form-item>
      
      <el-form-item>
        <div class="form-actions">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="submitForm" :loading="submitting">
            {{ submitText }}
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { Upload } from '@element-plus/icons-vue';

// 组件属性
const props = defineProps({
  formData: {
    type: Object,
    default: () => ({})
  },
  mode: {
    type: String,
    default: 'create' // 'create' 或 'edit'
  }
});

// 组件事件
const emit = defineEmits(['submit', 'cancel']);

// 表单引用
const formRef = ref(null);

// 上传状态
const submitting = ref(false);
const fileList = ref([]);
const uploadUrl = '/api/files/upload'; // 实际的上传URL

// 表单数据
const form = reactive({
  id: '',
  title: '',
  category: '',
  content: '',
  attachments: [],
  isSticky: false,
  status: 'DRAFT',
  publishTime: new Date()
});

// 类别选项
const categoryOptions = [
  { label: '通知', value: 'NOTICE' },
  { label: '公告', value: 'ANNOUNCEMENT' },
  { label: '新闻', value: 'NEWS' },
  { label: '活动', value: 'EVENT' }
];

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 2, max: 100, message: '标题长度在2到100个字符之间', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择公告类型', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入公告内容', trigger: 'blur' }
  ]
};

// 计算提交按钮文字
const submitText = computed(() => {
  if (form.status === 'DRAFT') {
    return '保存草稿';
  } else if (form.status === 'PUBLISHED') {
    return props.mode === 'create' ? '发布公告' : '更新公告';
  }
  return '提交';
});

// 初始化表单数据
const initFormData = () => {
  if (props.formData && Object.keys(props.formData).length > 0) {
    // 编辑模式：填充表单数据
    Object.keys(form).forEach(key => {
      if (props.formData[key] !== undefined) {
        form[key] = props.formData[key];
      }
    });
    
    // 处理附件列表
    if (props.formData.attachments && props.formData.attachments.length > 0) {
      fileList.value = props.formData.attachments.map(attachment => ({
        name: attachment.fileName,
        url: attachment.fileUrl,
        uid: attachment.id
      }));
    }
  }
};

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return;
  
  try {
    await formRef.value.validate();
    
    submitting.value = true;
    
    // 构建提交数据
    const submitData = {
      ...form,
      attachments: fileList.value.map(file => ({
        id: file.uid,
        fileName: file.name,
        fileUrl: file.url,
        fileSize: file.size
      }))
    };
    
    // 触发提交事件
    emit('submit', submitData);
  } catch (error) {
    console.error('表单验证失败:', error);
    ElMessage.error('请检查表单填写是否正确');
  } finally {
    submitting.value = false;
  }
};

// 取消表单
const handleCancel = () => {
  emit('cancel');
};

// 上传成功处理
const handleUploadSuccess = (response, file, fileList) => {
  ElMessage.success('文件上传成功');
  // 假设response包含文件信息，如id、url等
  file.uid = response.data.id;
  file.url = response.data.url;
};

// 移除文件处理
const handleRemoveFile = (file, fileList) => {
  // 可以在这里添加删除服务器文件的逻辑
  console.log('移除文件:', file);
};

// 上传前验证
const beforeUpload = (file) => {
  const isLt10M = file.size / 1024 / 1024 < 10;
  if (!isLt10M) {
    ElMessage.error('文件大小不能超过10MB!');
    return false;
  }
  return true;
};

// 组件挂载时初始化表单数据
onMounted(() => {
  initFormData();
});
</script>

<style scoped>
.notification-form {
  width: 100%;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

:deep(.el-upload-list) {
  margin-top: 10px;
}

:deep(.el-editor) {
  width: 100%;
}
</style> 