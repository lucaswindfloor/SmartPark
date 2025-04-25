<template>
  <div class="rich-text-editor">
    <div ref="editorEl" class="editor-container"></div>
  </div>
</template>

<script>
export default {
  name: 'RichTextEditor',
  props: {
    value: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      default: 300
    },
    placeholder: {
      type: String,
      default: '请输入内容...'
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      editor: null,
      isInitialized: false
    }
  },
  watch: {
    value(val) {
      // 避免循环触发
      if (this.editor && this.editor.getHTML() !== val) {
        this.editor.setContent(val)
      }
    },
    readonly(val) {
      if (this.editor) {
        this.editor.setReadOnly(val)
      }
    }
  },
  mounted() {
    this.initEditor()
  },
  beforeDestroy() {
    this.destroyEditor()
  },
  methods: {
    async initEditor() {
      // 动态引入编辑器依赖
      // 注意：这里假设项目使用的是 wangeditor，根据实际情况可能需要修改
      try {
        // 动态导入 wangeditor
        const E = await import('@wangeditor/editor')
        
        // 创建编辑器实例
        this.editor = E.createEditor({
          selector: this.$refs.editorEl,
          html: this.value,
          config: {
            placeholder: this.placeholder,
            readOnly: this.readonly,
            MENU_CONF: {
              uploadImage: {
                server: '/api/file/upload',
                fieldName: 'file',
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token') || ''}`
                },
                maxFileSize: 5 * 1024 * 1024, // 5MB
                allowedFileTypes: ['image/jpeg', 'image/png', 'image/gif'],
                customInsert: (res, insertFn) => {
                  // 根据服务器返回的数据进行图片插入
                  if (res.code === 0 && res.data) {
                    insertFn(res.data.fileUrl, res.data.name, res.data.fileUrl)
                  } else {
                    this.$message.error('图片上传失败')
                  }
                }
              }
            }
          }
        })
        
        // 设置高度
        this.$refs.editorEl.style.height = `${this.height}px`
        
        // 监听内容变化
        this.editor.on('change', () => {
          const html = this.editor.getHTML()
          this.$emit('input', html)
          this.$emit('change', html)
        })
        
        this.isInitialized = true
      } catch (error) {
        console.error('初始化编辑器失败', error)
        this.$message.error('富文本编辑器加载失败')
      }
    },
    
    // 设置内容
    setContent(html) {
      if (this.editor) {
        this.editor.setContent(html)
      }
    },
    
    // 获取内容
    getContent() {
      return this.editor ? this.editor.getHTML() : ''
    },
    
    // 清空内容
    clearContent() {
      if (this.editor) {
        this.editor.setContent('')
      }
    },
    
    // 销毁编辑器
    destroyEditor() {
      if (this.editor) {
        this.editor.destroy()
        this.editor = null
      }
    }
  }
}
</script>

<style lang="less" scoped>
.rich-text-editor {
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  
  .editor-container {
    width: 100%;
    overflow-y: auto;
  }
  
  :deep(.w-e-text-container) {
    z-index: 1 !important;
  }
  
  :deep(.w-e-toolbar) {
    z-index: 2 !important;
  }
  
  :deep(.w-e-menu) {
    z-index: 3 !important;
  }
}
</style> 