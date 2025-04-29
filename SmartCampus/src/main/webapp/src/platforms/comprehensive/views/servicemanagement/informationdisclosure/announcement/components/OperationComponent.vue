<template>
  <div class="operation-component">
    <!-- 通用确认对话框 -->
    <a-modal
      v-model:visible="confirmDialogVisible"
      :title="confirmDialogTitle"
      width="500px"
      @cancel="handleConfirmDialogClose"
      @ok="handleConfirmDialogConfirm"
      :ok-text="confirmButtonText"
      :ok-button-props="{ type: confirmButtonType === 'primary' ? 'primary' : 'default' }"
    >
      <div class="confirm-content">
        <p>{{ confirmDialogMessage }}</p>
        <div v-if="showReasonInput" class="reason-input">
          <a-form :model="reasonForm" :rules="reasonRules" ref="reasonFormRef">
            <a-form-item name="reason" :rules="[{ required: showReasonRequired, message: '请输入原因', trigger: 'blur' }]">
              <a-textarea
                v-model:value="reasonForm.reason"
                :rows="3"
                :placeholder="reasonPlaceholder"
              ></a-textarea>
            </a-form-item>
          </a-form>
        </div>
      </div>
      <!-- Footer is handled by modal's ok/cancel buttons -->
    </a-modal>
    
    <!-- 发布对话框 -->
    <a-modal
      v-model:visible="publishDialogVisible"
      title="发布通知公告"
      width="600px"
      @cancel="handlePublishDialogClose"
      @ok="handlePublishConfirm"
      ok-text="确认发布"
    >
      <a-form :model="publishForm" :rules="publishRules" ref="publishFormRef" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="发布方式" name="publishType">
          <a-radio-group v-model:value="publishForm.publishType">
            <a-radio value="immediate">立即发布</a-radio>
            <a-radio value="scheduled">定时发布</a-radio>
          </a-radio-group>
        </a-form-item>
        
        <a-form-item v-if="publishForm.publishType === 'scheduled'" label="发布时间" name="publishTime">
          <a-date-picker
            v-model:value="publishForm.publishTime"
            show-time
            placeholder="选择发布时间"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm"
            :disabled-date="disabledDate"
            :disabled-time="disabledDateTime" 
          ></a-date-picker>
        </a-form-item>
        
        <a-form-item label="有效期" name="validityPeriod">
          <a-input-number
            v-model:value="publishForm.validityPeriod"
            :min="1"
            :max="365"
            @change="calculateExpireDate"
          ></a-input-number>
          <span class="validity-unit" style="margin-left: 8px;">天</span>
        </a-form-item>
        
        <a-form-item label="到期时间">
          <a-input :value="publishForm.expireDate" disabled></a-input>
        </a-form-item>
        
        <a-form-item label="需要确认" name="requireConfirmation">
          <a-switch v-model:checked="publishForm.requireConfirmation" @change="handleRequireConfirmationChange"></a-switch>
        </a-form-item>
        
        <a-form-item v-if="publishForm.requireConfirmation" label="确认截止" name="confirmDeadline">
          <a-date-picker
            v-model:value="publishForm.confirmDeadline"
            show-time
            placeholder="选择确认截止时间"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm"
            :disabled-date="disabledConfirmDate"
            :disabled-time="disabledConfirmDateTime" 
          ></a-date-picker>
        </a-form-item>
        
        <a-form-item label="推送方式" name="notificationMethods">
          <a-checkbox-group v-model:value="publishForm.notificationMethods">
            <a-checkbox value="app">App推送</a-checkbox>
            <a-checkbox value="sms">短信通知</a-checkbox>
            <a-checkbox value="email">邮件通知</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
      </a-form>
      <!-- Footer handled by modal -->
    </a-modal>
    
    <!-- 审核对话框 -->
    <a-modal
      v-model:visible="auditDialogVisible"
      title="审核通知公告"
      width="600px"
      @cancel="handleAuditDialogClose"
      @ok="handleAuditConfirm"
      ok-text="提交审核结果"
    >
      <a-form :model="auditForm" :rules="auditRules" ref="auditFormRef" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="审核结果" name="result">
          <a-radio-group v-model:value="auditForm.result">
            <a-radio value="approve">通过</a-radio>
            <a-radio value="reject">驳回</a-radio>
            <a-radio value="suggest">建议修改</a-radio>
          </a-radio-group>
        </a-form-item>
        
        <a-form-item v-if="auditForm.result !== 'approve'" label="审核意见" name="comment">
          <a-textarea
            v-model:value="auditForm.comment"
            :rows="4"
            placeholder="请输入审核意见或修改建议"
          ></a-textarea>
        </a-form-item>
      </a-form>
      <!-- Footer handled by modal -->
    </a-modal>
    
    <!-- 延期对话框 -->
    <a-modal
      v-model:visible="extendDialogVisible"
      title="延长有效期"
      width="500px"
      @cancel="handleExtendDialogClose"
      @ok="handleExtendConfirm"
      ok-text="确认延期"
    >
      <a-form :model="extendForm" :rules="extendRules" ref="extendFormRef" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="当前到期" name="currentExpireTime">
          <a-input :value="extendForm.currentExpireTime" disabled></a-input>
        </a-form-item>
        <a-form-item label="延长天数" name="days">
          <a-input-number 
            v-model:value="extendForm.days" 
            :min="1" 
            :max="90"
            @change="calculateNewExpireDate"
          ></a-input-number>
        </a-form-item>
        <a-form-item label="新到期时间" name="newExpireTime">
          <a-input :value="extendForm.newExpireTime" disabled></a-input>
        </a-form-item>
        <a-form-item label="延期原因" name="reason">
          <a-textarea 
            v-model:value="extendForm.reason" 
            rows="3"
            placeholder="请输入延期原因"
          ></a-textarea>
        </a-form-item>
      </a-form>
      <!-- Footer handled by modal -->
    </a-modal>
  </div>
</template>

<script>
// Import moment if not already globally available or imported in the parent
import moment from 'moment' // Or dayjs if the project uses it

export default {
  name: 'OperationComponent',
  props: {
    notification: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    // Helper for disabled date/time logic
    const range = (start, end) => {
      const result = [];
      for (let i = start; i < end; i++) {
        result.push(i);
      }
      return result;
    };
    
    return {
      currentRecord: null, // Store the record being operated on

      // 通用确认对话框
      confirmDialogVisible: false,
      confirmDialogTitle: '',
      confirmDialogMessage: '',
      confirmButtonText: '确定',
      confirmButtonType: 'primary', // Note: Antd button type is string 'primary', 'dashed', etc.
      confirmCallback: null,
      showReasonInput: false,
      showReasonRequired: false,
      reasonPlaceholder: '请输入原因',
      reasonForm: {
        reason: ''
      },
      reasonRules: { // Antd rules format
        reason: [{ required: true, message: '请输入原因', trigger: 'blur' }]
      },
      
      // 发布对话框
      publishDialogVisible: false,
      publishForm: {
        publishType: 'immediate',
        publishTime: null, // Use null for date objects
        validityPeriod: 7,
        expireDate: '', // Keep as string for display
        requireConfirmation: false,
        confirmDeadline: null, // Use null for date objects
        notificationMethods: ['app']
      },
      publishRules: {
        publishType: [{ required: true, message: '请选择发布方式', trigger: 'change' }],
        publishTime: [{ required: true, message: '请选择发布时间', trigger: 'change', type: 'object' }], // Use type: 'object' for date picker
        validityPeriod: [{ required: true, message: '请输入有效期', trigger: 'blur', type: 'number' }], // Use type: 'number' for input number
        confirmDeadline: [{ required: true, message: '请选择确认截止时间', trigger: 'change', type: 'object' }],
        notificationMethods: [{ type: 'array', required: true, message: '请至少选择一种推送方式', trigger: 'change' }]
      },
      
      // 审核对话框
      auditDialogVisible: false,
      auditForm: {
        result: 'approve',
        comment: ''
      },
      auditRules: {
        result: [{ required: true, message: '请选择审核结果', trigger: 'change' }],
        // Make comment required only if result is not 'approve'
        comment: [{ 
          // Requirement is handled dynamically in the watch section
          required: false, // Initially not required
          message: '请输入审核意见', 
          trigger: 'blur' 
        }]
      },
      
      // 延期对话框
      extendDialogVisible: false,
      extendForm: {
        currentExpireTime: '', // Keep as string for display
        days: 7,
        newExpireTime: '', // Keep as string for display
        reason: ''
      },
      extendRules: {
        days: [{ required: true, message: '请输入延长天数', trigger: 'blur', type: 'number' }],
        reason: [{ required: true, message: '请输入延期原因', trigger: 'blur' }]
      },

      // --- Helper functions for date/time pickers ---
      disabledDate: current => {
        // Cannot select days before today
        return current && current < moment().startOf('day');
      },
      disabledDateTime: () => {
        // Example: Disable hours before current hour if date is today
        const now = moment();
        if (this.publishForm.publishTime && moment(this.publishForm.publishTime).isSame(now, 'day')) {
          return {
            disabledHours: () => range(0, now.hour()),
            // disabledMinutes: () => range(0, now.minute()), // If needed
          };
        }
        return {};
      },
      disabledConfirmDate: current => {
        // Cannot select days before publish time or today
        const publishMoment = this.publishForm.publishTime ? moment(this.publishForm.publishTime) : moment();
        return current && current < publishMoment.startOf('day');
      },
      disabledConfirmDateTime: () => {
         // Similar logic for confirm deadline based on publish time
        const publishMoment = this.publishForm.publishTime ? moment(this.publishForm.publishTime) : moment();
         if (this.publishForm.confirmDeadline && moment(this.publishForm.confirmDeadline).isSame(publishMoment, 'day')) {
           return {
             disabledHours: () => range(0, publishMoment.hour()),
             // disabledMinutes: () => range(0, publishMoment.minute()), // If needed
           };
         }
         return {};
      }
    }
  },
  watch: {
    // Watch audit result to update comment validation rule
    'auditForm.result': function(newVal) {
      // Ensure auditRules and comment exist before accessing
      if (this.auditRules && this.auditRules.comment && this.auditRules.comment[0]) {
        this.auditRules.comment[0].required = newVal !== 'approve';
      }
      // Re-validate comment if the form is already open
      if (this.auditDialogVisible) {
        this.$refs.auditFormRef?.validateFields(['comment']);
      }
    }
  },
  methods: {
    // --- Public Methods (Called by Parent) ---
    showAuditDialog(record) {
      this.currentRecord = record;
      this.auditForm = { result: 'approve', comment: '' }; // Reset form
      this.$nextTick(() => this.$refs.auditFormRef?.resetFields());
      this.auditDialogVisible = true;
    },

    showPublishDialog(record) {
      this.currentRecord = record;
      // Reset form, maybe prefill validity based on record?
      this.publishForm = {
        publishType: 'immediate',
        publishTime: null, 
        validityPeriod: record.validityPeriod || 7, // Example prefill
        expireDate: '',
        requireConfirmation: record.requireConfirmation || false,
        confirmDeadline: record.confirmDeadline ? moment(record.confirmDeadline) : null,
        notificationMethods: record.notificationMethods || ['app']
      };
      this.calculateExpireDate(); // Calculate initial expire date
      this.$nextTick(() => this.$refs.publishFormRef?.resetFields()); // Reset validation state
      this.publishDialogVisible = true;
    },

    showCancelDialog(record) {
      this.currentRecord = record;
      this.confirmDialogTitle = '取消发布确认';
      this.confirmDialogMessage = `确定要取消发布通知公告 "${record.title}" 吗？取消后将变为草稿状态。`;
      this.confirmButtonText = '确认取消';
      this.confirmButtonType = 'danger'; // Use string for Antd type
      this.showReasonInput = true;
      this.showReasonRequired = true; // Reason is required for cancellation
      this.reasonPlaceholder = '请输入取消原因';
      this.reasonForm = { reason: '' };
      this.$nextTick(() => this.$refs.reasonFormRef?.resetFields());
      this.confirmCallback = this.handleCancelConfirm;
      this.confirmDialogVisible = true;
    },

    showExtendDialog(record) {
      this.currentRecord = record;
      const currentExpireTimeMoment = record.expiryTime ? moment(record.expiryTime) : moment().add(7, 'days'); // Default if no expiry
      this.extendForm = {
        currentExpireTime: currentExpireTimeMoment.format('YYYY-MM-DD HH:mm'),
        days: 7,
        newExpireTime: '',
        reason: ''
      };
      this.calculateNewExpireDate(); // Calculate initial new expiry date
      this.$nextTick(() => this.$refs.extendFormRef?.resetFields());
      this.extendDialogVisible = true;
    },

    // --- Internal Methods ---

    // General Confirm Dialog
    async handleConfirmDialogConfirm() {
      let valid = true;
      if (this.showReasonInput) {
        try {
          await this.$refs.reasonFormRef.validate();
        } catch (error) {
          valid = false;
        }
      }

      if (valid && this.confirmCallback) {
        const data = this.showReasonInput ? { reason: this.reasonForm.reason } : {};
        this.confirmCallback(this.currentRecord, data); // Pass record and optional data
        this.handleConfirmDialogClose();
      }
    },

    handleConfirmDialogClose() {
      this.confirmDialogVisible = false;
      this.confirmCallback = null;
      this.currentRecord = null;
      this.$refs.reasonFormRef?.resetFields();
    },

    // Publish Dialog
    async handlePublishConfirm() {
      try {
        await this.$refs.publishFormRef.validate();
        
        const data = { 
          ...this.publishForm,
          // Convert moment objects back to strings if API expects strings
          publishTime: this.publishForm.publishTime ? moment(this.publishForm.publishTime).format('YYYY-MM-DD HH:mm') : null,
          confirmDeadline: this.publishForm.confirmDeadline ? moment(this.publishForm.confirmDeadline).format('YYYY-MM-DD HH:mm') : null,
         };
        this.$emit('on-publish-submit', this.currentRecord, data);
        this.handlePublishDialogClose();
      } catch (errorInfo) {
        console.log('Publish form validation failed:', errorInfo);
      }
    },

    handlePublishDialogClose() {
      this.publishDialogVisible = false;
      this.currentRecord = null;
      this.$refs.publishFormRef?.resetFields();
    },

    calculateExpireDate() {
      const publishMoment = this.publishForm.publishType === 'immediate' 
        ? moment() 
        : (this.publishForm.publishTime ? moment(this.publishForm.publishTime) : null);
        
      if (publishMoment && this.publishForm.validityPeriod) {
        this.publishForm.expireDate = publishMoment.add(this.publishForm.validityPeriod, 'days').format('YYYY-MM-DD HH:mm');
      } else {
        this.publishForm.expireDate = 'N/A';
      }
    },
    
    handleRequireConfirmationChange() {
        if (!this.publishForm.requireConfirmation) {
            this.publishForm.confirmDeadline = null; // Clear deadline if not required
        }
        // Trigger validation if needed
        this.$refs.publishFormRef?.validateFields(['confirmDeadline']);
    },


    // Audit Dialog
    async handleAuditConfirm() {
      try {
        await this.$refs.auditFormRef.validate();
        this.$emit('on-audit-submit', this.currentRecord, this.auditForm);
        this.handleAuditDialogClose();
      } catch (errorInfo) {
         console.log('Audit form validation failed:', errorInfo);
      }
    },

    handleAuditDialogClose() {
      this.auditDialogVisible = false;
      this.currentRecord = null;
      this.$refs.auditFormRef?.resetFields();
    },

    // Extend Dialog
    async handleExtendConfirm() {
       try {
        await this.$refs.extendFormRef.validate();
        const data = {
            days: this.extendForm.days,
            reason: this.extendForm.reason
        }
        this.$emit('on-extend-submit', this.currentRecord, data);
        this.handleExtendDialogClose();
      } catch (errorInfo) {
         console.log('Extend form validation failed:', errorInfo);
      }
    },

    handleExtendDialogClose() {
      this.extendDialogVisible = false;
      this.currentRecord = null;
      this.$refs.extendFormRef?.resetFields();
    },
    
    calculateNewExpireDate() {
      const currentMoment = this.extendForm.currentExpireTime ? moment(this.extendForm.currentExpireTime, 'YYYY-MM-DD HH:mm') : moment();
      if (this.extendForm.days) {
        this.extendForm.newExpireTime = currentMoment.add(this.extendForm.days, 'days').format('YYYY-MM-DD HH:mm');
      } else {
         this.extendForm.newExpireTime = 'N/A';
      }
    },

    // Specific Confirm Callbacks (used by confirmDialog)
    handleCancelConfirm(record, data) {
      this.$emit('on-cancel-submit', record, data);
    }
    // Add other specific confirm callbacks if needed for different actions using the generic dialog
  }
}
</script>

<style lang="less" scoped>
.operation-component {
  // Add any specific styles if needed, Ant Design components might have different default margins/paddings
  .reason-input {
    margin-top: 15px;
  }
  // Antd form item labels usually align left by default, adjust if needed
  // :deep(.ant-form-item-label) { text-align: right; } 
}
</style> 