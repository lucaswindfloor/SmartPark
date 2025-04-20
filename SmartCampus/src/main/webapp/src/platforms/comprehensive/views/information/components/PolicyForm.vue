<template>
  <div class="policy-form">
    <a-form
      :model="formState"
      :rules="rules"
      ref="formRef"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 18 }"
    >
      <a-form-item label="标题" name="title">
        <a-input 
          v-model:value="formState.title" 
          placeholder="请输入政策标题"
          :maxlength="200"
          show-count
        />
      </a-form-item>
      
      <a-form-item label="政策类型" name="type">
        <a-select
          v-model:value="formState.type"
          placeholder="请选择政策类型"
          style="width: 100%"
        >
          <a-select-option value="NATIONAL">国家政策</a-select-option>
          <a-select-option value="LOCAL">地方政策</a-select-option>
          <a-select-option value="INDUSTRY">行业政策</a-select-option>
          <a-select-option value="PARK">园区政策</a-select-option>
        </a-select>
      </a-form-item>
      
      <a-form-item label="发文单位" name="issuingAuthority">
        <a-input 
          v-model:value="formState.issuingAuthority" 
          placeholder="请输入发文单位"
        />
      </a-form-item>
      
      <a-form-item label="文号" name="documentNumber">
        <a-input 
          v-model:value="formState.documentNumber" 
          placeholder="请输入文号"
        />
      </a-form-item>
      
      <a-form-item label="发布日期" name="publishDate">
        <a-date-picker 
          v-model:value="formState.publishDate" 
          style="width: 100%"
        />
      </a-form-item>
      
      <a-form-item label="生效日期" name="effectiveDate">
        <a-date-picker 
          v-model:value="formState.effectiveDate" 
          style="width: 100%"
        />
      </a-form-item>
      
      <a-form-item label="是否置顶" name="isTop">
        <a-switch v-model:checked="formState.isTop" />
      </a-form-item>
      
      <a-form-item label="内容" name="content">
        <rich-text-editor 
          v-model:value="formState.content" 
          :height="400"
        />
      </a-form-item>
      
      <a-form-item label="附件" name="attachments">
        <file-upload 
          v-model:value="formState.attachments"
          :max-count="5"
          :max-size="20"
          accept=".pdf,.doc,.docx,.xls,.xlsx"
        />
      </a-form-item>
      
      <a-form-item label="关键词" name="keywords">
        <a-select
          v-model:value="formState.keywords"
          mode="tags"
          placeholder="请输入关键词，回车分隔"
          style="width: 100%"
        ></a-select>
      </a-form-item>
      
      <a-form-item :wrapper-col="{ offset: 4, span: 18 }">
        <a-space>
          <a-button type="primary" @click="submitForm">保存</a-button>
          <a-button @click="resetForm">重置</a-button>
          <a-button @click="handleCancel">取消</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { defineComponent, ref, reactive, onMounted } from 'vue';
import { notification } from 'ant-design-vue';
import RichTextEditor from '@/core/components/business/RichTextEditor.vue';
import FileUpload from '@/core/components/business/FileUpload.vue';

// 政策服务可以与通知服务类似，稍后实现
// import { PolicyService } from '@/services/information/policy.service';

export default defineComponent({
  name: 'PolicyForm',
  components: {
    RichTextEditor,
    FileUpload
  },
  props: {
    initialData: {
      type: Object,
      default: () => ({})
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  emits: ['success', 'cancel'],
  setup(props, { emit }) {
    const formRef = ref(null);
    
    // 表单数据
    const formState = reactive({
      title: '',
      type: undefined,
      issuingAuthority: '',
      documentNumber: '',
      publishDate: null,
      effectiveDate: null,
      isTop: false,
      content: '',
      attachments: [],
      keywords: [],
      status: 'DRAFT'
    });
    
    // 表单验证规则
    const rules = {
      title: [{ required: true, message: '请输入政策标题', trigger: 'blur' }],
      type: [{ required: true, message: '请选择政策类型', trigger: 'change' }],
      issuingAuthority: [{ required: true, message: '请输入发文单位', trigger: 'blur' }],
      content: [{ required: true, message: '请输入政策内容', trigger: 'blur' }]
    };
    
    // 初始化表单数据
    onMounted(() => {
      if (props.isEdit && props.initialData) {
        Object.keys(formState).forEach(key => {
          if (props.initialData[key] !== undefined) {
            formState[key] = props.initialData[key];
          }
        });
      }
    });
    
    // 提交表单
    const submitForm = () => {
      formRef.value.validate().then(async () => {
        try {
          // 准备提交数据
          const submitData = { ...formState };
          
          let response;
          if (props.isEdit) {
            // 更新政策
            // response = await PolicyService.updatePolicy(props.initialData.id, submitData);
            response = { success: true, data: { ...submitData, id: props.initialData.id } };
          } else {
            // 创建政策
            // response = await PolicyService.createPolicy(submitData);
            response = { success: true, data: { ...submitData, id: Math.floor(Math.random() * 1000) } };
          }
          
          if (response.success) {
            notification.success({
              message: props.isEdit ? '更新成功' : '创建成功',
              description: `政策${props.isEdit ? '更新' : '创建'}成功`
            });
            emit('success', response.data);
          } else {
            throw new Error(response.message || '操作失败');
          }
        } catch (error) {
          console.error('提交表单失败:', error);
          notification.error({
            message: '操作失败',
            description: error.message || '请稍后重试'
          });
        }
      }).catch(error => {
        console.log('表单验证失败:', error);
      });
    };
    
    // 重置表单
    const resetForm = () => {
      formRef.value.resetFields();
    };
    
    // 取消操作
    const handleCancel = () => {
      emit('cancel');
    };
    
    return {
      formRef,
      formState,
      rules,
      submitForm,
      resetForm,
      handleCancel
    };
  }
});
</script>

<style scoped>
.policy-form {
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
}
</style> 