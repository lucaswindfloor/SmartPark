<template>
  <div class="notification-form">
    <a-form :form="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" @submit="handleSubmit">
      <a-form-item label="标题">
        <a-input
          v-decorator="[
            'title',
            {
              initialValue: formData.title,
              rules: [
                { required: true, message: '请输入通知标题' },
                { max: 100, message: '标题不能超过100个字符' }
              ]
            }
          ]"
          placeholder="请输入通知标题"
        />
      </a-form-item>
      
      <a-form-item label="通知类型">
        <a-select
          v-decorator="[
            'noticeType',
            {
              initialValue: formData.noticeType || 'NORMAL',
              rules: [{ required: true, message: '请选择通知类型' }]
            }
          ]"
          placeholder="请选择通知类型"
        >
          <a-select-option v-for="item in noticeTypeOptions" :key="item.value" :value="item.value">
            {{ item.label }}
          </a-select-option>
        </a-select>
      </a-form-item>
      
      <a-form-item label="来源">
        <a-input
          v-decorator="[
            'source',
            {
              initialValue: formData.source || '信息中心',
              rules: [{ required: true, message: '请输入通知来源' }]
            }
          ]"
          placeholder="请输入通知来源"
        />
      </a-form-item>
      
      <a-form-item label="截止有效期">
        <a-date-picker
          v-decorator="[
            'validityEndTime',
            {
              initialValue: formData.validityEndTime ? moment(formData.validityEndTime, 'YYYY-MM-DD HH:mm:ss') : null,
              rules: [{ required: true, message: '请选择截止有效期' }]
            }
          ]"
          placeholder="请选择截止有效期"
          style="width: 100%"
          format="YYYY-MM-DD"
          :disabledDate="disabledDate"
          :showTime="false"
        />
      </a-form-item>
      
      <a-form-item label="内容" class="editor-form-item">
        <rich-text-editor
          ref="richTextEditor"
          v-decorator="[
            'content',
            {
              initialValue: formData.content || '',
              rules: [{ required: true, message: '请输入通知内容' }]
            }
          ]"
          :height="400"
          :placeholder="'请输入通知内容'"
        />
      </a-form-item>
      
      <a-form-item label="附件" class="upload-form-item">
        <a-upload
          :file-list="fileList"
          :remove="handleRemove"
          :before-upload="beforeUpload"
          :action="uploadAction"
          :headers="uploadHeaders"
          @change="handleUploadChange"
          :multiple="true"
        >
          <a-button>
            <a-icon type="upload" /> 上传附件
          </a-button>
          <div class="ant-upload-hint">
            支持任意类型文件上传，单个文件大小不超过20MB
          </div>
        </a-upload>
      </a-form-item>
      
      <a-form-item v-if="editMode" label="修改备注">
        <a-textarea
          v-decorator="[
            'editRemarks',
            {
              initialValue: formData.editRemarks || '',
              rules: [{ required: true, message: '请输入修改备注' }]
            }
          ]"
          placeholder="请输入修改备注"
          :rows="4"
        />
      </a-form-item>
      
      <a-form-item :wrapper-col="{ span: 20, offset: 4 }">
        <a-space>
          <a-button type="primary" html-type="submit" :loading="submitting">提交</a-button>
          <a-button @click="handleCancel">取消</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import moment from 'moment'
import RichTextEditor from './RichTextEditor.vue'

export default {
  name: 'NotificationForm',
  components: {
    RichTextEditor
  },
  props: {
    formData: {
      type: Object,
      default: () => ({})
    },
    editMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      submitting: false,
      fileList: [],
      uploadAction: '/api/file/upload', // 附件上传接口
      uploadHeaders: {
        // 附件上传请求头
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`
      },
      // 通知类型选项
      noticeTypeOptions: [
        { label: '普通通知', value: 'NORMAL' },
        { label: '重要通知', value: 'IMPORTANT' },
        { label: '紧急通知', value: 'URGENT' }
      ]
    }
  },
  created() {
    // 初始化附件列表
    if (this.formData.attachments && this.formData.attachments.length > 0) {
      this.fileList = this.formData.attachments.map(item => ({
        uid: item.id,
        name: item.name,
        status: 'done',
        url: item.url,
        response: { data: { id: item.id, fileUrl: item.url } }
      }))
    }
  },
  methods: {
    // 日期不可选配置（今天之前的日期不可选）
    disabledDate(current) {
      return current && current < moment().startOf('day')
    },
    
    // 提交表单
    handleSubmit(e) {
      e.preventDefault()
      
      this.form.validateFields((err, values) => {
        if (err) {
          // 滚动到第一个错误字段
          const errorField = Object.keys(err)[0]
          document.querySelector(`[data-field="${errorField}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
          return
        }
        
        this.submitting = true
        
        // 处理日期
        if (values.validityEndTime) {
          values.validityEndTime = values.validityEndTime.format('YYYY-MM-DD 23:59:59')
        }
        
        // 处理附件
        values.attachments = this.fileList
          .filter(file => file.status === 'done' && file.response)
          .map(file => ({
            id: file.response.data.id,
            name: file.name,
            url: file.response.data.fileUrl
          }))
        
        // 添加id（编辑模式）
        if (this.editMode && this.formData.id) {
          values.id = this.formData.id
        }
        
        // 设置状态为草稿
        values.status = this.formData.status || 'DRAFT'
        
        // 触发提交事件
        this.$emit('submit', values)
        
        // 延迟关闭提交状态（实际项目中应在请求回调中关闭）
        setTimeout(() => {
          this.submitting = false
        }, 500)
      })
    },
    
    // 取消表单
    handleCancel() {
      this.$emit('cancel')
    },
    
    // 清空表单
    resetForm() {
      this.form.resetFields()
      this.fileList = []
      if (this.$refs.richTextEditor) {
        this.$refs.richTextEditor.clearContent()
      }
    },
    
    // 移除附件
    handleRemove(file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
      return true
    },
    
    // 上传前校验
    beforeUpload(file) {
      // 检查文件大小
      const isLt20M = file.size / 1024 / 1024 < 20
      if (!isLt20M) {
        this.$message.error('文件大小不能超过20MB!')
        return false
      }
      return true
    },
    
    // 上传状态变化
    handleUploadChange(info) {
      let fileList = [...info.fileList]
      
      // 限制上传数量
      fileList = fileList.slice(-10)
      
      // 处理响应
      fileList = fileList.map(file => {
        if (file.response) {
          // 根据后端响应格式调整
          file.url = file.response.data.fileUrl
        }
        return file
      })
      
      this.fileList = fileList
    }
  }
}
</script>

<style lang="less" scoped>
.notification-form {
  padding: 12px;
  
  .editor-form-item {
    :deep(.ant-form-item-control) {
      line-height: normal;
    }
  }
  
  .upload-form-item {
    :deep(.ant-upload-list) {
      max-height: 300px;
      overflow-y: auto;
    }
  }
  
  :deep(.ant-calendar-picker) {
    width: 100%;
  }
}
</style> 