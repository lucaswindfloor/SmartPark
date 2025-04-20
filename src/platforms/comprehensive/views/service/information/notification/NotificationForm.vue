<template>
  <div class="notification-form">
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
          placeholder="请输入通知标题"
          :maxlength="200"
          show-count
        />
      </a-form-item>
      
      <a-form-item label="通知类型" name="type">
        <a-select
          v-model:value="formState.type"
          placeholder="请选择通知类型"
          style="width: 100%"
        >
          <a-select-option v-for="type in notificationTypes" :key="type.value" :value="type.value">
            {{ type.label }}
          </a-select-option>
        </a-select>
      </a-form-item>
      
      <a-form-item label="重要程度" name="importance">
        <a-radio-group v-model:value="formState.importance">
          <a-radio value="NORMAL">普通</a-radio>
          <a-radio value="MEDIUM">重要</a-radio>
          <a-radio value="HIGH">紧急</a-radio>
        </a-radio-group>
      </a-form-item>
      
      <a-form-item label="目标受众" name="targetAudience">
        <audience-selector v-model:value="formState.targetAudience" />
      </a-form-item>
      
      <a-form-item label="是否需要确认" name="requireConfirmation">
        <a-switch v-model:checked="formState.requireConfirmation" />
      </a-form-item>
      
      <a-form-item 
        label="确认截止时间" 
        name="confirmationDeadline"
        v-if="formState.requireConfirmation"
      >
        <a-date-picker 
          v-model:value="formState.confirmationDeadline" 
          show-time 
          format="YYYY-MM-DD HH:mm:ss"
          style="width: 100%"
        />
      </a-form-item>
      
      <a-form-item label="过期时间" name="expirationDate">
        <a-date-picker 
          v-model:value="formState.expirationDate" 
          show-time 
          format="YYYY-MM-DD HH:mm:ss"
          style="width: 100%"
        />
      </a-form-item>
      
      <a-form-item label="内容" name="content">
        <a-tabs>
          <a-tab-pane key="editor" tab="编辑器">
            <rich-text-editor 
              v-model:value="formState.content" 
              :height="400"
              @contentChange="handleContentChange" 
            />
          </a-tab-pane>
          <a-tab-pane key="mobile-preview" tab="移动端预览">
            <div class="mobile-preview">
              <div class="mobile-frame">
                <div class="mobile-header">移动端预览</div>
                <div class="mobile-content" v-html="mobileOptimizedContent"></div>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="security" tab="内容安全检查">
            <content-security-panel 
              :content="formState.content"
              :scan-results="contentScanResults"
              @rescan="scanContent"
            />
          </a-tab-pane>
          <a-tab-pane key="accessibility" tab="无障碍检查">
            <accessibility-check-panel 
              :content="formState.content"
              :check-results="accessibilityResults"
              @check="checkAccessibility"
              @fix="applyAccessibilityFixes"
            />
          </a-tab-pane>
        </a-tabs>
      </a-form-item>
      
      <a-form-item label="附件" name="attachments">
        <file-upload 
          v-model:value="formState.attachments"
          :max-count="5"
          :max-size="20"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.jpg,.jpeg,.png"
        />
      </a-form-item>
      
      <a-form-item label="移动优化" name="enableMobileOptimization">
        <a-tooltip title="启用后将为移动设备提供优化的内容布局">
          <a-switch 
            v-model:checked="formState.enableMobileOptimization" 
            checked-children="已启用" 
            un-checked-children="未启用"
          />
        </a-tooltip>
      </a-form-item>
      
      <a-form-item label="图片替代文本" name="imageAltText">
        <a-tooltip title="为通知中的图片提供替代文本，提高无障碍支持">
          <a-switch 
            v-model:checked="formState.enableImageAltText" 
            checked-children="已启用" 
            un-checked-children="未启用"
          />
        </a-tooltip>
        <a-button 
          type="link" 
          @click="generateAltText" 
          v-if="formState.enableImageAltText && hasImages"
        >
          自动生成图片替代文本
        </a-button>
      </a-form-item>
      
      <a-form-item :wrapper-col="{ offset: 4, span: 18 }">
        <a-space>
          <a-button type="primary" @click="submitForm">保存</a-button>
          <a-button @click="resetForm">重置</a-button>
          <a-button v-if="isEdit && formState.status === 'DRAFT'" @click="submitForReview">提交审核</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { notification } from 'ant-design-vue';
import RichTextEditor from '@/core/components/business/RichTextEditor.vue';
import FileUpload from '@/core/components/business/FileUpload.vue';
import AudienceSelector from '@/platforms/comprehensive/components/AudienceSelector.vue';
import ContentSecurityPanel from './components/ContentSecurityPanel.vue';
import AccessibilityCheckPanel from './components/AccessibilityCheckPanel.vue';
import { NotificationService } from '@/services/information/notification.service';
import { MobileNotificationService } from '@/services/information/mobile-notification.service';
import { ContentSecurityService } from '@/services/information/content-security.service';
import { AccessibilityService } from '@/services/information/accessibility.service';
import { htmlToText } from '@/core/utils/html-utils';

export default {
  name: 'NotificationForm',
  components: {
    RichTextEditor,
    FileUpload,
    AudienceSelector,
    ContentSecurityPanel,
    AccessibilityCheckPanel
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
    
    // 通知类型选项
    const notificationTypes = [
      { label: '公告', value: 'ANNOUNCEMENT' },
      { label: '政策', value: 'POLICY' },
      { label: '活动', value: 'ACTIVITY' },
      { label: '紧急', value: 'EMERGENCY' },
      { label: '园区动态', value: 'NEWS' }
    ];
    
    // 表单数据
    const formState = reactive({
      title: '',
      type: undefined,
      importance: 'NORMAL',
      targetAudience: null,
      requireConfirmation: false,
      confirmationDeadline: null,
      expirationDate: null,
      content: '',
      attachments: [],
      status: 'DRAFT',
      enableMobileOptimization: true,
      enableImageAltText: true
    });
    
    // 表单验证规则
    const rules = {
      title: [{ required: true, message: '请输入通知标题', trigger: 'blur' }],
      type: [{ required: true, message: '请选择通知类型', trigger: 'change' }],
      targetAudience: [{ required: true, message: '请选择目标受众', trigger: 'change' }],
      content: [{ required: true, message: '请输入通知内容', trigger: 'blur' }],
      confirmationDeadline: [{ 
        required: true, 
        message: '需要确认时必须设置确认截止时间', 
        trigger: 'change',
        validator: (rule, value) => {
          if (formState.requireConfirmation && !value) {
            return Promise.reject(rule.message);
          }
          return Promise.resolve();
        }
      }]
    };
    
    // 内容安全扫描结果
    const contentScanResults = ref({
      hasSensitiveWords: false,
      hasPersonalInfo: false,
      hasExternalLinks: false,
      hasXssRisks: false,
      hasExternalImages: false,
      sensitiveWords: [],
      personalInfoItems: [],
      externalLinks: [],
      externalImages: []
    });
    
    // 无障碍检查结果
    const accessibilityResults = ref({
      missingAltTexts: 0,
      missingTableHeaders: 0,
      emptyLinks: 0,
      lowContrastElements: 0,
      issues: [],
      score: 100
    });
    
    // 计算移动优化后的内容
    const mobileOptimizedContent = computed(() => {
      if (!formState.content) return '';
      return MobileNotificationService.optimizeContentForMobile(formState.content);
    });
    
    // 判断内容中是否有图片
    const hasImages = computed(() => {
      return /<img/i.test(formState.content);
    });
    
    // 监听内容变化，自动扫描内容安全
    watch(() => formState.content, debounce(() => {
      if (formState.content) {
        scanContent();
      }
    }, 1000));
    
    // 初始化表单数据
    onMounted(() => {
      if (props.isEdit && props.initialData) {
        Object.keys(formState).forEach(key => {
          if (props.initialData[key] !== undefined) {
            formState[key] = props.initialData[key];
          }
        });
      }
      
      // 执行初始扫描
      if (formState.content) {
        scanContent();
        checkAccessibility();
      }
    });
    
    // 内容变更处理
    const handleContentChange = (content) => {
      formState.content = content;
    };
    
    // 扫描内容安全
    const scanContent = async () => {
      try {
        const content = formState.content;
        if (!content) return;
        
        // 检查敏感内容
        const securityResults = await ContentSecurityService.scanContent(content);
        
        // 检查外部链接和图片
        const externalLinks = ContentSecurityService.checkExternalLinks(content);
        const externalImages = ContentSecurityService.checkImageSources(content);
        
        contentScanResults.value = {
          ...securityResults,
          hasExternalLinks: externalLinks.hasExternalLinks,
          externalLinks: externalLinks.externalUrls,
          hasExternalImages: externalImages.hasExternalImages,
          externalImages: externalImages.externalImageUrls
        };
      } catch (error) {
        console.error('内容安全扫描失败:', error);
        notification.error({
          message: '内容安全扫描失败',
          description: '请稍后重试或联系管理员'
        });
      }
    };
    
    // 检查无障碍合规性
    const checkAccessibility = async () => {
      try {
        const content = formState.content;
        if (!content) return;
        
        const results = await AccessibilityService.checkAccessibility(content);
        accessibilityResults.value = results;
      } catch (error) {
        console.error('无障碍检查失败:', error);
        notification.error({
          message: '无障碍检查失败',
          description: '请稍后重试或联系管理员'
        });
      }
    };
    
    // 应用无障碍修复
    const applyAccessibilityFixes = () => {
      const content = formState.content;
      if (!content) return;
      
      const improved = AccessibilityService.improveAccessibility(content);
      formState.content = improved;
      
      // 重新检查
      checkAccessibility();
      
      notification.success({
        message: '无障碍优化已应用',
        description: '已自动修复部分无障碍问题'
      });
    };
    
    // 生成图片替代文本
    const generateAltText = async () => {
      try {
        if (!hasImages.value) return;
        
        notification.info({
          message: '正在处理图片',
          description: '正在为图片生成替代文本，请稍候...'
        });
        
        const improved = await AccessibilityService.autoGenerateImageAltTexts(formState.content);
        formState.content = improved;
        
        // 重新检查
        checkAccessibility();
        
        notification.success({
          message: '替代文本生成完成',
          description: '已为图片添加自动生成的替代文本'
        });
      } catch (error) {
        console.error('生成替代文本失败:', error);
        notification.error({
          message: '生成替代文本失败',
          description: '请稍后重试或手动添加替代文本'
        });
      }
    };
    
    // 提交表单
    const submitForm = () => {
      formRef.value.validate().then(async () => {
        try {
          // 准备提交数据
          const submitData = { ...formState };
          
          // 处理移动优化标志
          if (submitData.enableMobileOptimization) {
            submitData.mobileOptimizedContent = MobileNotificationService.optimizeContentForMobile(submitData.content);
          }
          
          // 记录安全审计信息
          submitData.securityScanResult = contentScanResults.value;
          submitData.accessibilityScore = accessibilityResults.value.score;
          
          let response;
          if (props.isEdit) {
            // 更新通知
            response = await NotificationService.updateNotification(props.initialData.id, submitData);
          } else {
            // 创建通知
            response = await NotificationService.createNotification(submitData);
          }
          
          if (response.success) {
            notification.success({
              message: props.isEdit ? '更新成功' : '创建成功',
              description: `通知${props.isEdit ? '更新' : '创建'}成功`
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
    
    // 提交审核
    const submitForReview = async () => {
      try {
        if (!props.isEdit) {
          notification.warning({ message: '请先保存通知再提交审核' });
          return;
        }
        
        const response = await NotificationService.submitForReview(props.initialData.id);
        
        if (response.success) {
          notification.success({
            message: '提交审核成功',
            description: '通知已提交审核'
          });
          emit('success', response.data);
        } else {
          throw new Error(response.message || '提交审核失败');
        }
      } catch (error) {
        console.error('提交审核失败:', error);
        notification.error({
          message: '提交审核失败',
          description: error.message || '请稍后重试'
        });
      }
    };
    
    // 工具函数：防抖
    function debounce(fn, delay) {
      let timer = null;
      return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timer);
        timer = setTimeout(() => {
          fn.apply(context, args);
        }, delay);
      };
    }
    
    return {
      formRef,
      formState,
      rules,
      notificationTypes,
      contentScanResults,
      accessibilityResults,
      mobileOptimizedContent,
      hasImages,
      handleContentChange,
      scanContent,
      checkAccessibility,
      applyAccessibilityFixes,
      generateAltText,
      submitForm,
      resetForm,
      submitForReview
    };
  }
};
</script>

<style scoped>
.notification-form {
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
}

.mobile-preview {
  display: flex;
  justify-content: center;
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.mobile-frame {
  width: 375px;
  height: 600px;
  border: 10px solid #333;
  border-radius: 20px;
  overflow: hidden;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}

.mobile-header {
  height: 40px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  border-bottom: 1px solid #ddd;
}

.mobile-content {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  font-size: 16px;
}
</style> 