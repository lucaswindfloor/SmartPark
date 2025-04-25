<template>
  <div class="operation-component">
    <!-- 通用确认对话框 -->
    <el-dialog
      v-model="confirmDialogVisible"
      :title="confirmDialogTitle"
      width="500px"
      :before-close="handleConfirmDialogClose"
    >
      <div class="confirm-content">
        <p>{{ confirmDialogMessage }}</p>
        <div v-if="showReasonInput" class="reason-input">
          <el-form :model="reasonForm" :rules="reasonRules" ref="reasonFormRef">
            <el-form-item prop="reason" :rules="[{ required: showReasonRequired, message: '请输入原因', trigger: 'blur' }]">
              <el-input
                v-model="reasonForm.reason"
                type="textarea"
                :rows="3"
                :placeholder="reasonPlaceholder"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleConfirmDialogClose">取消</el-button>
          <el-button :type="confirmButtonType" @click="handleConfirmDialogConfirm">{{ confirmButtonText }}</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 发布对话框 -->
    <el-dialog
      v-model="publishDialogVisible"
      title="发布通知公告"
      width="600px"
      :before-close="handlePublishDialogClose"
    >
      <el-form :model="publishForm" :rules="publishRules" ref="publishFormRef" label-width="100px">
        <el-form-item label="发布方式" prop="publishType">
          <el-radio-group v-model="publishForm.publishType">
            <el-radio label="immediate">立即发布</el-radio>
            <el-radio label="scheduled">定时发布</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item v-if="publishForm.publishType === 'scheduled'" label="发布时间" prop="publishTime">
          <el-date-picker
            v-model="publishForm.publishTime"
            type="datetime"
            placeholder="选择发布时间"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm"
            :disabled-date="disabledDate"
            :disabled-hours="disabledHours"
          ></el-date-picker>
        </el-form-item>
        
        <el-form-item label="有效期" prop="validityPeriod">
          <el-input-number
            v-model="publishForm.validityPeriod"
            :min="1"
            :max="365"
            @change="calculateExpireDate"
          ></el-input-number>
          <span class="validity-unit">天</span>
        </el-form-item>
        
        <el-form-item label="到期时间">
          <el-input v-model="publishForm.expireDate" disabled></el-input>
        </el-form-item>
        
        <el-form-item label="需要确认" prop="requireConfirmation">
          <el-switch v-model="publishForm.requireConfirmation" @change="handleRequireConfirmationChange"></el-switch>
        </el-form-item>
        
        <el-form-item v-if="publishForm.requireConfirmation" label="确认截止" prop="confirmDeadline">
          <el-date-picker
            v-model="publishForm.confirmDeadline"
            type="datetime"
            placeholder="选择确认截止时间"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm"
            :disabled-date="disabledConfirmDate"
          ></el-date-picker>
        </el-form-item>
        
        <el-form-item label="推送方式" prop="notificationMethods">
          <el-checkbox-group v-model="publishForm.notificationMethods">
            <el-checkbox label="app">App推送</el-checkbox>
            <el-checkbox label="sms">短信通知</el-checkbox>
            <el-checkbox label="email">邮件通知</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handlePublishDialogClose">取消</el-button>
          <el-button type="primary" @click="handlePublishConfirm">确认发布</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 审核对话框 -->
    <el-dialog
      v-model="auditDialogVisible"
      title="审核通知公告"
      width="600px"
      :before-close="handleAuditDialogClose"
    >
      <el-form :model="auditForm" :rules="auditRules" ref="auditFormRef" label-width="100px">
        <el-form-item label="审核结果" prop="result">
          <el-radio-group v-model="auditForm.result">
            <el-radio label="approve">通过</el-radio>
            <el-radio label="reject">驳回</el-radio>
            <el-radio label="suggest">建议修改</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item v-if="auditForm.result !== 'approve'" label="审核意见" prop="comment">
          <el-input
            v-model="auditForm.comment"
            type="textarea"
            :rows="4"
            placeholder="请输入审核意见或修改建议"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleAuditDialogClose">取消</el-button>
          <el-button type="primary" @click="handleAuditConfirm">提交审核结果</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 延期对话框 -->
    <el-dialog
      v-model="extendDialogVisible"
      title="延长有效期"
      width="500px"
      :before-close="handleExtendDialogClose"
    >
      <el-form :model="extendForm" :rules="extendRules" ref="extendFormRef" label-width="100px">
        <el-form-item label="当前到期" prop="currentExpireTime">
          <el-input v-model="extendForm.currentExpireTime" disabled></el-input>
        </el-form-item>
        <el-form-item label="延长天数" prop="days">
          <el-input-number 
            v-model="extendForm.days" 
            :min="1" 
            :max="90"
            @change="calculateNewExpireDate"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="新到期时间" prop="newExpireTime">
          <el-input v-model="extendForm.newExpireTime" disabled></el-input>
        </el-form-item>
        <el-form-item label="延期原因" prop="reason">
          <el-input 
            v-model="extendForm.reason" 
            type="textarea" 
            rows="3"
            placeholder="请输入延期原因"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleExtendDialogClose">取消</el-button>
          <el-button type="primary" @click="handleExtendConfirm">确认延期</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'OperationComponent',
  props: {
    notification: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      // 通用确认对话框
      confirmDialogVisible: false,
      confirmDialogTitle: '',
      confirmDialogMessage: '',
      confirmButtonText: '确定',
      confirmButtonType: 'primary',
      confirmCallback: null,
      showReasonInput: false,
      showReasonRequired: false,
      reasonPlaceholder: '请输入原因',
      reasonForm: {
        reason: ''
      },
      reasonRules: {
        reason: [{ required: true, message: '请输入原因', trigger: 'blur' }]
      },
      
      // 发布对话框
      publishDialogVisible: false,
      publishForm: {
        publishType: 'immediate',
        publishTime: '',
        validityPeriod: 7,
        expireDate: '',
        requireConfirmation: false,
        confirmDeadline: '',
        notificationMethods: ['app']
      },
      publishRules: {
        publishType: [{ required: true, message: '请选择发布方式', trigger: 'change' }],
        publishTime: [{ required: true, message: '请选择发布时间', trigger: 'change' }],
        validityPeriod: [{ required: true, message: '请输入有效期', trigger: 'blur' }],
        confirmDeadline: [{ required: true, message: '请选择确认截止时间', trigger: 'change' }],
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
        comment: [{ required: true, message: '请输入审核意见', trigger: 'blur' }]
      },
      
      // 延期对话框
      extendDialogVisible: false,
      extendForm: {
        currentExpireTime: '',
        days: 7,
        newExpireTime: '',
        reason: ''
      },
      extendRules: {
        days: [{ required: true, message: '请输入延长天数', trigger: 'blur' }],
        reason: [{ required: true, message: '请输入延期原因', trigger: 'blur' }]
      }
    }
  },
  methods: {
    //===== 通用确认对话框 =====
    showConfirmDialog({ title, message, confirmButtonText = '确定', confirmButtonType = 'primary', callback, showReason = false, reasonRequired = false, reasonPlaceholder = '请输入原因' }) {
      this.confirmDialogTitle = title
      this.confirmDialogMessage = message
      this.confirmButtonText = confirmButtonText
      this.confirmButtonType = confirmButtonType
      this.confirmCallback = callback
      this.showReasonInput = showReason
      this.showReasonRequired = reasonRequired
      this.reasonPlaceholder = reasonPlaceholder
      this.reasonForm.reason = ''
      this.confirmDialogVisible = true
    },
    
    handleConfirmDialogClose() {
      this.confirmDialogVisible = false
    },
    
    handleConfirmDialogConfirm() {
      if (this.showReasonInput && this.showReasonRequired && !this.reasonForm.reason) {
        this.$message.warning('请输入原因')
        return
      }
      
      if (typeof this.confirmCallback === 'function') {
        this.confirmCallback(this.reasonForm.reason)
      }
      
      this.confirmDialogVisible = false
    },
    
    //===== 发布相关 =====
    showPublishDialog() {
      // 初始化表单
      this.publishForm = {
        publishType: 'immediate',
        publishTime: '',
        validityPeriod: 7,
        expireDate: '',
        requireConfirmation: false,
        confirmDeadline: '',
        notificationMethods: ['app']
      }
      
      // 计算过期时间
      this.calculateExpireDate()
      
      this.publishDialogVisible = true
    },
    
    handlePublishDialogClose() {
      this.publishDialogVisible = false
    },
    
    calculateExpireDate() {
      const startDate = this.publishForm.publishType === 'immediate' 
        ? new Date() 
        : (this.publishForm.publishTime ? new Date(this.publishForm.publishTime) : new Date())
        
      const expireDate = new Date(startDate.getTime() + this.publishForm.validityPeriod * 24 * 60 * 60 * 1000)
      this.publishForm.expireDate = this.formatDate(expireDate)
      
      // 如果需要确认，默认设置确认截止日期为有效期的一半
      if (this.publishForm.requireConfirmation && !this.publishForm.confirmDeadline) {
        const halfPeriod = Math.floor(this.publishForm.validityPeriod / 2)
        const confirmDate = new Date(startDate.getTime() + halfPeriod * 24 * 60 * 60 * 1000)
        this.publishForm.confirmDeadline = this.formatDateTime(confirmDate)
      }
    },
    
    handleRequireConfirmationChange(val) {
      if (val && !this.publishForm.confirmDeadline) {
        this.calculateExpireDate()
      }
    },
    
    disabledDate(date) {
      return date < new Date(new Date().setHours(0, 0, 0, 0))
    },
    
    disabledConfirmDate(date) {
      if (!this.publishForm.expireDate) return false
      
      const startDate = this.publishForm.publishType === 'immediate' 
        ? new Date() 
        : (this.publishForm.publishTime ? new Date(this.publishForm.publishTime) : new Date())
      const expireDate = new Date(this.publishForm.expireDate)
      
      return date < startDate || date > expireDate
    },
    
    disabledHours() {
      const hours = []
      const now = new Date()
      const selectedDate = this.publishForm.publishTime ? new Date(this.publishForm.publishTime) : now
      
      // 如果是今天，禁用已过去的小时
      if (selectedDate.getDate() === now.getDate() && 
          selectedDate.getMonth() === now.getMonth() && 
          selectedDate.getFullYear() === now.getFullYear()) {
        for (let i = 0; i < now.getHours(); i++) {
          hours.push(i)
        }
      }
      
      return hours
    },
    
    handlePublishConfirm() {
      this.$refs.publishFormRef.validate((valid) => {
        if (!valid) return
        
        // 校验定时发布时间
        if (this.publishForm.publishType === 'scheduled' && !this.publishForm.publishTime) {
          this.$message.warning('请选择发布时间')
          return
        }
        
        // 校验确认截止时间
        if (this.publishForm.requireConfirmation && !this.publishForm.confirmDeadline) {
          this.$message.warning('请选择确认截止时间')
          return
        }
        
        // 组装发布数据
        const publishData = {
          ...this.publishForm,
          immediate: this.publishForm.publishType === 'immediate'
        }
        
        // 实际项目中这里应该调用API进行发布
        this.$emit('publish', publishData)
        this.publishDialogVisible = false
      })
    },
    
    //===== 审核相关 =====
    showAuditDialog() {
      // 初始化表单
      this.auditForm = {
        result: 'approve',
        comment: ''
      }
      
      this.auditDialogVisible = true
    },
    
    handleAuditDialogClose() {
      this.auditDialogVisible = false
    },
    
    handleAuditConfirm() {
      this.$refs.auditFormRef.validate((valid) => {
        if (!valid) {
          // 如果是通过，则不需要校验意见
          if (this.auditForm.result === 'approve') {
            // 实际项目中这里应该调用API进行审核操作
            this.$emit('audit', { ...this.auditForm })
            this.auditDialogVisible = false
          } else {
            return false
          }
        } else {
          // 实际项目中这里应该调用API进行审核操作
          this.$emit('audit', { ...this.auditForm })
          this.auditDialogVisible = false
        }
      })
    },
    
    //===== 延期相关 =====
    showExtendDialog(expireTime) {
      // 初始化表单
      this.extendForm = {
        currentExpireTime: expireTime || this.formatDateTime(new Date()),
        days: 7,
        newExpireTime: '',
        reason: ''
      }
      
      // 计算新的过期时间
      this.calculateNewExpireDate()
      
      this.extendDialogVisible = true
    },
    
    handleExtendDialogClose() {
      this.extendDialogVisible = false
    },
    
    calculateNewExpireDate() {
      if (!this.extendForm.currentExpireTime) return
      
      const currentDate = new Date(this.extendForm.currentExpireTime)
      const newDate = new Date(currentDate.getTime() + this.extendForm.days * 24 * 60 * 60 * 1000)
      this.extendForm.newExpireTime = this.formatDateTime(newDate)
    },
    
    handleExtendConfirm() {
      this.$refs.extendFormRef.validate((valid) => {
        if (!valid) return
        
        // 实际项目中这里应该调用API进行延期操作
        this.$emit('extend', { ...this.extendForm })
        this.extendDialogVisible = false
      })
    },
    
    //===== 工具方法 =====
    formatDate(date) {
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    
    formatDateTime(date) {
      const formattedDate = this.formatDate(date)
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      return `${formattedDate} ${hours}:${minutes}`
    }
  },
  emits: ['publish', 'audit', 'extend']
}
</script>

<style scoped>
.confirm-content {
  padding: 10px 0;
}

.reason-input {
  margin-top: 15px;
}

.validity-unit {
  margin-left: 10px;
}
</style> 