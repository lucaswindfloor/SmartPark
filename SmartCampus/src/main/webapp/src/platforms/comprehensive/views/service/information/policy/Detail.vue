<template>
  <div class="policy-detail">
    <el-card :loading="loading" shadow="hover">
      <template #header>
        <div class="card-header">
          <el-button type="primary" @click="backToList">
            <el-icon><ArrowLeft /></el-icon>
            返回列表
          </el-button>
          <el-button v-if="hasEditPermission" type="primary" @click="handleEdit">
            <el-icon><Edit /></el-icon>
            编辑
          </el-button>
        </div>
      </template>

      <div v-if="!loading" class="policy-content">
        <h1 class="policy-title">{{ policy.title }}</h1>
        
        <div class="policy-meta">
          <div class="meta-row">
            <span class="meta-item">
              <el-icon><Document /></el-icon>
              <span>文号：{{ policy.documentNo }}</span>
            </span>
            <span class="meta-item">
              <el-icon><OfficeBuilding /></el-icon>
              <span>发布部门：{{ policy.department }}</span>
            </span>
          </div>
          <div class="meta-row">
            <span class="meta-item">
              <el-icon><Clock /></el-icon>
              <span>发布时间：{{ formatDateTime(policy.publishTime) }}</span>
            </span>
            <span class="meta-item">
              <el-icon><CollectionTag /></el-icon>
              <span>类别：{{ policy.category }}</span>
            </span>
          </div>
        </div>
        
        <div class="policy-body" v-html="policy.content"></div>
        
        <div v-if="policy.attachments && policy.attachments.length > 0" class="policy-attachments">
          <h3>附件列表</h3>
          <el-table :data="policy.attachments" border style="width: 100%">
            <el-table-column width="50">
              <template #default>
                <el-icon><Paperclip /></el-icon>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="文件名" />
            <el-table-column label="操作" width="200">
              <template #default="{ row }">
                <el-button type="primary" link @click="previewAttachment(row)">预览</el-button>
                <el-button type="primary" link @click="downloadAttachment(row)">下载</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>

    <el-dialog v-model="previewVisible" title="附件预览" width="800px" :destroy-on-close="true">
      <div class="attachment-preview">
        <img v-if="currentAttachment && isImage(currentAttachment.type)" :src="currentAttachment.url" alt="附件预览" />
        <iframe v-else-if="currentAttachment && isDocument(currentAttachment.type)" :src="currentAttachment.url" width="100%" height="500px"></iframe>
        <div v-else class="preview-not-available">
          <el-icon :size="48"><Document /></el-icon>
          <p>该类型文件暂不支持预览，请下载后查看</p>
          <el-button type="primary" @click="downloadAttachment(currentAttachment)">下载文件</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  ArrowLeft, 
  Edit, 
  Document, 
  Clock, 
  OfficeBuilding,
  CollectionTag,
  Paperclip
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const router = useRouter();
const route = useRoute();

const loading = ref(true);
const policy = reactive({
  id: '',
  title: '',
  documentNo: '',
  content: '',
  department: '',
  publishTime: '',
  category: '',
  attachments: []
});

const previewVisible = ref(false);
const currentAttachment = ref(null);
const hasEditPermission = ref(true); // 权限控制，实际应该从用户权限中获取

// 格式化日期时间
const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return '';
  const date = new Date(dateTimeStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

// 获取政策文件详情
const fetchPolicyDetail = async () => {
  loading.value = true;
  
  try {
    // 这里应该是实际的API调用，以下为模拟数据
    // const { data } = await api.getPolicyDetail(route.params.id);
    
    // 模拟数据
    const data = {
      id: route.params.id || '1',
      title: '关于园区科技型企业扶持政策',
      documentNo: '园区[2023]第15号',
      content: `<p>为促进园区科技型企业发展，经研究决定，现发布以下扶持政策：</p>
                <h3>一、适用范围</h3>
                <p>本政策适用于在园区注册并实际经营的科技型中小企业。</p>
                <h3>二、扶持内容</h3>
                <ul>
                  <li>对获得高新技术企业认定的，一次性给予20万元奖励</li>
                  <li>对获得发明专利的，每项给予5万元资助</li>
                  <li>对研发投入占营业收入5%以上的企业，按研发投入的10%给予补贴，最高不超过100万元</li>
                </ul>
                <h3>三、申请流程</h3>
                <p>符合条件的企业需在每年3月1日至3月31日期间提交申请材料...</p>`,
      department: '园区科技创新部',
      publishTime: '2023-02-15T09:30:00',
      category: '园区规章',
      attachments: [
        { id: '1', name: '政策详细说明.pdf', type: 'application/pdf', url: 'https://example.com/files/policy_details.pdf', size: 2.5 * 1024 * 1024 },
        { id: '2', name: '申请表.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', url: 'https://example.com/files/application_form.docx', size: 500 * 1024 }
      ]
    };
    
    // 更新数据
    Object.assign(policy, data);
  } catch (error) {
    console.error('获取政策文件详情失败:', error);
    ElMessage.error('获取政策文件详情失败');
  } finally {
    loading.value = false;
  }
};

// 返回列表页
const backToList = () => {
  router.push('/service/information/policy');
};

// 编辑政策文件
const handleEdit = () => {
  router.push(`/service/information/policy/edit/${policy.id}`);
};

// 预览附件
const previewAttachment = (attachment) => {
  currentAttachment.value = attachment;
  previewVisible.value = true;
};

// 下载附件
const downloadAttachment = (attachment) => {
  // 实际项目中应该调用下载API
  const link = document.createElement('a');
  link.href = attachment.url;
  link.download = attachment.name;
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// 判断是否为图片文件
const isImage = (fileType) => {
  return fileType && fileType.startsWith('image/');
};

// 判断是否为可在线预览的文档
const isDocument = (fileType) => {
  const previewableTypes = ['application/pdf', 'text/plain', 'text/html'];
  return previewableTypes.includes(fileType);
};

onMounted(() => {
  fetchPolicyDetail();
});
</script>

<style scoped>
.policy-detail {
  max-width: 1000px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.policy-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
  text-align: center;
}

.policy-meta {
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
  padding: 12px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.meta-row {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.meta-item {
  display: flex;
  align-items: center;
  margin-right: 24px;
  margin-bottom: 8px;
  color: #666;
}

.meta-item span {
  margin-left: 6px;
}

.policy-body {
  margin-bottom: 24px;
  line-height: 1.8;
}

.policy-body h3 {
  margin-top: 20px;
  margin-bottom: 12px;
  font-size: 18px;
  font-weight: bold;
}

.policy-body ul {
  padding-left: 20px;
}

.policy-body li {
  margin-bottom: 8px;
}

.policy-attachments {
  margin-top: 32px;
}

.attachment-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.preview-not-available {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
}

.preview-not-available p {
  margin: 16px 0;
  color: #666;
}
</style> 