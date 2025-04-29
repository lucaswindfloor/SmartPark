<template>
  <div class="notification-edit">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ isEdit ? '编辑通知' : '新增通知' }}</span>
        </div>
      </template>
      
      <el-form 
        ref="formRef" 
        :model="formData" 
        :rules="rules" 
        label-width="100px"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入通知标题" />
        </el-form-item>
        
        <el-form-item label="类别" prop="category">
          <el-select v-model="formData.category" placeholder="请选择类别">
            <el-option 
              v-for="item in categoryOptions" 
              :key="item.value" 
              :label="item.label" 
              :value="item.value" 
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="内容" prop="content">
          <el-editor v-model="formData.content" :min-height="300" />
        </el-form-item>
        
        <el-form-item label="附件">
          <el-upload
            :action="uploadAction"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleUploadSuccess"
            :file-list="fileList"
            multiple
          >
            <el-button type="primary">上传附件</el-button>
            <template #tip>
              <div class="el-upload__tip">
                支持任意格式文件，单个文件不超过10MB
              </div>
            </template>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="置顶">
          <el-switch v-model="formData.isSticky" />
        </el-form-item>
        
        <el-form-item label="状态">
          <el-radio-group v-model="formData.status">
            <el-radio label="DRAFT">保存为草稿</el-radio>
            <el-radio label="PUBLISHED">立即发布</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 预览文件的对话框 -->
    <el-dialog v-model="previewVisible" title="文件预览" width="50%">
      <div class="preview-container" v-if="previewType === 'image'">
        <img :src="previewUrl" alt="预览图片" class="preview-image" />
      </div>
      <div v-else class="preview-container">
        <p>当前文件不支持预览，请下载后查看</p>
        <el-button type="primary" @click="downloadFile">下载文件</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';

// 引入富文本编辑器组件（这里假设已经有了一个名为 el-editor 的组件）
// 如果没有，可以使用 Tinymce, CKEditor 等第三方编辑器

const route = useRoute();
const router = useRouter();
const formRef = ref(null);

// 判断是编辑还是新增
const isEdit = computed(() => {
  return route.params.id !== undefined;
});

// 表单数据
const formData = reactive({
  id: '',
  title: '',
  category: '',
  content: '',
  attachments: [],
  isSticky: false,
  status: 'DRAFT' // 默认为草稿
});

// 类别选项
const categoryOptions = [
  { value: 'NOTICE', label: '通知' },
  { value: 'ANNOUNCEMENT', label: '公告' },
  { value: 'NEWS', label: '新闻' },
  { value: 'EVENT', label: '活动' }
];

// 附件列表
const fileList = ref([]);

// 上传地址
const uploadAction = '/api/file/upload';

// 表单验证规则
const rules = reactive({
  title: [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 2, max: 100, message: '标题长度应在 2 到 100 个字符之间', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择类别', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入内容', trigger: 'blur' }
  ]
});

// 预览相关
const previewVisible = ref(false);
const previewUrl = ref('');
const previewType = ref('');
const currentFile = ref(null);

// 初始化数据
const initData = async () => {
  if (isEdit.value) {
    try {
      // TODO: 应该调用后端API获取数据
      // const { data } = await api.getNotificationDetail(route.params.id);
      
      // 模拟数据
      setTimeout(() => {
        const mockData = {
          id: route.params.id,
          title: '通知标题示例',
          category: 'NOTICE',
          content: '<p>这是通知的详细内容...</p>',
          attachments: [
            { name: '附件1.pdf', url: '/files/attachment1.pdf' },
            { name: '附件2.docx', url: '/files/attachment2.docx' }
          ],
          isSticky: true,
          status: 'PUBLISHED'
        };
        
        // 更新表单数据
        Object.keys(mockData).forEach(key => {
          if (key in formData) {
            formData[key] = mockData[key];
          }
        });
        
        // 更新附件列表
        fileList.value = mockData.attachments.map(item => ({
          name: item.name,
          url: item.url
        }));
      }, 500);
    } catch (error) {
      console.error('获取通知详情失败', error);
      ElMessage.error('获取通知详情失败');
    }
  }
};

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return;
  
  await formRef.value.validate(async (valid, fields) => {
    if (valid) {
      try {
        // 处理附件
        formData.attachments = fileList.value.map(file => ({
          name: file.name,
          url: file.url || file.response?.url
        }));
        
        // TODO: 调用后端API保存数据
        // if (isEdit.value) {
        //   await api.updateNotification(formData);
        // } else {
        //   await api.createNotification(formData);
        // }
        
        // 模拟请求成功
        setTimeout(() => {
          ElMessage.success(isEdit.value ? '更新成功' : '创建成功');
          router.push('/service/information/notification/list');
        }, 500);
      } catch (error) {
        console.error('保存通知失败', error);
        ElMessage.error('保存失败');
      }
    } else {
      console.log('表单验证失败', fields);
    }
  });
};

// 取消
const cancel = () => {
  ElMessageBox.confirm('确认取消编辑？未保存的内容将丢失', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    router.push('/service/information/notification/list');
  }).catch(() => {});
};

// 文件上传成功
const handleUploadSuccess = (response, file, fileList) => {
  ElMessage.success('文件上传成功');
};

// 预览文件
const handlePreview = (file) => {
  currentFile.value = file;
  previewUrl.value = file.url || file.response?.url;
  
  // 判断文件类型
  const fileName = file.name.toLowerCase();
  if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg') || 
      fileName.endsWith('.png') || fileName.endsWith('.gif')) {
    previewType.value = 'image';
  } else {
    previewType.value = 'other';
  }
  
  previewVisible.value = true;
};

// 下载文件
const downloadFile = () => {
  if (currentFile.value) {
    const url = currentFile.value.url || currentFile.value.response?.url;
    if (url) {
      window.open(url, '_blank');
    }
  }
};

// 移除文件
const handleRemove = (file, fileList) => {
  // 更新附件列表
};

// 初始化
onMounted(() => {
  initData();
});
</script>

<style scoped>
.notification-edit {
  padding: 20px;
  background-color: #fff;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.preview-image {
  max-width: 100%;
  max-height: 500px;
}
</style> 