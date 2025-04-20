<template>
  <div class="content-security-panel">
    <div class="panel-header">
      <div class="title">
        <safety-outlined />
        <span>内容安全检查</span>
      </div>
      <a-button type="primary" @click="rescan">重新扫描</a-button>
    </div>

    <div class="security-summary">
      <a-row :gutter="16">
        <a-col :span="8">
          <a-statistic 
            title="敏感词" 
            :value="scanResults.sensitiveWords?.length || 0" 
            :value-style="{ color: scanResults.hasSensitiveWords ? '#cf1322' : '#3f8600' }"
          >
            <template #prefix>
              <warning-outlined v-if="scanResults.hasSensitiveWords" />
              <check-circle-outlined v-else />
            </template>
          </a-statistic>
        </a-col>
        <a-col :span="8">
          <a-statistic 
            title="个人信息" 
            :value="scanResults.personalInfoItems?.length || 0" 
            :value-style="{ color: scanResults.hasPersonalInfo ? '#cf1322' : '#3f8600' }"
          >
            <template #prefix>
              <warning-outlined v-if="scanResults.hasPersonalInfo" />
              <check-circle-outlined v-else />
            </template>
          </a-statistic>
        </a-col>
        <a-col :span="8">
          <a-statistic 
            title="外部链接" 
            :value="scanResults.externalLinks?.length || 0" 
            :value-style="{ color: scanResults.hasExternalLinks ? '#faad14' : '#3f8600' }"
          >
            <template #prefix>
              <exclamation-circle-outlined v-if="scanResults.hasExternalLinks" />
              <check-circle-outlined v-else />
            </template>
          </a-statistic>
        </a-col>
      </a-row>
    </div>

    <div class="security-details" v-if="hasSecurityIssues">
      <a-tabs>
        <a-tab-pane key="sensitive-words" tab="敏感词" v-if="scanResults.hasSensitiveWords">
          <a-alert message="检测到敏感词，请检查并修改内容" type="error" show-icon style="margin-bottom: 16px" />
          <a-table :dataSource="scanResults.sensitiveWords" :columns="sensitiveWordColumns" size="small" :pagination="false">
            <template #bodyCell="{ column, text }">
              <template v-if="column.key === 'action'">
                <a @click="handleReplace(text)">替换</a>
              </template>
            </template>
          </a-table>
        </a-tab-pane>
        
        <a-tab-pane key="personal-info" tab="个人信息" v-if="scanResults.hasPersonalInfo">
          <a-alert message="检测到可能的个人敏感信息，建议去除或脱敏处理" type="error" show-icon style="margin-bottom: 16px" />
          <a-table :dataSource="scanResults.personalInfoItems" :columns="personalInfoColumns" size="small" :pagination="false">
            <template #bodyCell="{ column, text }">
              <template v-if="column.key === 'action'">
                <a @click="handleMask(text)">脱敏</a>
              </template>
            </template>
          </a-table>
        </a-tab-pane>
        
        <a-tab-pane key="external-links" tab="外部链接" v-if="scanResults.hasExternalLinks">
          <a-alert message="检测到外部链接，请确认链接安全可靠" type="warning" show-icon style="margin-bottom: 16px" />
          <a-table :dataSource="scanResults.externalLinks" :columns="externalLinkColumns" size="small" :pagination="false">
            <template #bodyCell="{ column, text }">
              <template v-if="column.key === 'action'">
                <a-space>
                  <a @click="handleOpenLink(text)">查看</a>
                  <a @click="handleRemoveLink(text)">移除</a>
                </a-space>
              </template>
            </template>
          </a-table>
        </a-tab-pane>
        
        <a-tab-pane key="external-images" tab="外部图片" v-if="scanResults.hasExternalImages">
          <a-alert message="检测到外部图片，建议下载并上传至系统" type="warning" show-icon style="margin-bottom: 16px" />
          <a-list
            itemLayout="horizontal"
            :dataSource="scanResults.externalImages"
            :grid="{ gutter: 16, column: 2 }"
          >
            <template #renderItem="{ item }">
              <a-list-item>
                <a-card hoverable>
                  <template #cover>
                    <img :src="item" style="height: 120px; object-fit: cover;" />
                  </template>
                  <a-card-meta :description="item">
                    <template #title>
                      <a-space>
                        <span>外部图片</span>
                        <a-tag color="orange">未托管</a-tag>
                      </a-space>
                    </template>
                  </a-card-meta>
                  <div style="margin-top: 12px">
                    <a-space>
                      <a-button size="small" @click="handleDownloadImage(item)">下载</a-button>
                      <a-button size="small" type="primary" @click="handleReplaceImage(item)">替换</a-button>
                    </a-space>
                  </div>
                </a-card>
              </a-list-item>
            </template>
          </a-list>
        </a-tab-pane>
        
        <a-tab-pane key="xss-risks" tab="XSS风险" v-if="scanResults.hasXssRisks">
          <a-alert message="检测到可能的XSS风险，系统已自动清理，请检查内容完整性" type="error" show-icon style="margin-bottom: 16px" />
          <a-descriptions bordered size="small">
            <a-descriptions-item label="风险数量" :span="3">{{ scanResults.xssRisks?.length || 0 }}</a-descriptions-item>
            <a-descriptions-item label="风险类型" :span="3">
              <a-tag v-for="(type, index) in xssRiskTypes" :key="index" color="red">{{ type }}</a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="处理建议" :span="3">
              XSS风险内容已被系统自动过滤，请检查内容是否完整，避免使用内联脚本和危险的HTML属性
            </a-descriptions-item>
          </a-descriptions>
        </a-tab-pane>
      </a-tabs>
    </div>
    
    <div class="security-empty" v-else>
      <a-empty description="未检测到内容安全问题，内容符合发布要求" />
    </div>
    
    <div class="security-tips">
      <a-alert type="info" show-icon>
        <template #message>
          <span>内容安全提示</span>
        </template>
        <template #description>
          <ol>
            <li>避免在内容中包含敏感词、个人信息等敏感内容</li>
            <li>尽量不使用外部链接和图片，以免链接失效或存在安全风险</li>
            <li>上传图片前请确认无敏感信息，如有需要请进行脱敏处理</li>
            <li>如内容涉及个人信息，请确保已获得相关授权</li>
          </ol>
        </template>
      </a-alert>
    </div>
  </div>
</template>

<script>
import { 
  SafetyOutlined, 
  WarningOutlined, 
  CheckCircleOutlined, 
  ExclamationCircleOutlined 
} from '@ant-design/icons-vue';
import { defineComponent, ref, computed } from 'vue';

export default defineComponent({
  name: 'ContentSecurityPanel',
  components: {
    SafetyOutlined,
    WarningOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined
  },
  props: {
    content: {
      type: String,
      default: ''
    },
    scanResults: {
      type: Object,
      default: () => ({
        hasSensitiveWords: false,
        hasPersonalInfo: false,
        hasExternalLinks: false,
        hasExternalImages: false,
        hasXssRisks: false,
        sensitiveWords: [],
        personalInfoItems: [],
        externalLinks: [],
        externalImages: [],
        xssRisks: []
      })
    }
  },
  emits: ['rescan'],
  setup(props, { emit }) {
    // 敏感词表格列
    const sensitiveWordColumns = [
      { title: '敏感词', dataIndex: 'word', key: 'word' },
      { title: '风险等级', dataIndex: 'level', key: 'level' },
      { title: '出现位置', dataIndex: 'position', key: 'position' },
      { title: '操作', key: 'action' }
    ];

    // 个人信息表格列
    const personalInfoColumns = [
      { title: '信息类型', dataIndex: 'type', key: 'type' },
      { title: '内容', dataIndex: 'content', key: 'content' },
      { title: '位置', dataIndex: 'position', key: 'position' },
      { title: '操作', key: 'action' }
    ];

    // 外部链接表格列
    const externalLinkColumns = [
      { title: 'URL', dataIndex: 'url', key: 'url' },
      { title: '域名', dataIndex: 'domain', key: 'domain' },
      { title: '操作', key: 'action' }
    ];

    // XSS风险类型
    const xssRiskTypes = ref([
      '内联脚本', '危险事件属性', 'iframe嵌入', 'JavaScript URLs'
    ]);

    // 是否存在安全问题
    const hasSecurityIssues = computed(() => {
      return props.scanResults.hasSensitiveWords || 
             props.scanResults.hasPersonalInfo || 
             props.scanResults.hasExternalLinks || 
             props.scanResults.hasExternalImages ||
             props.scanResults.hasXssRisks;
    });

    // 重新扫描
    const rescan = () => {
      emit('rescan');
    };

    // 替换敏感词
    const handleReplace = (word) => {
      console.log('替换敏感词:', word);
      // 实际替换逻辑，可能需要调用父组件方法
    };

    // 脱敏处理
    const handleMask = (info) => {
      console.log('脱敏处理:', info);
      // 实际脱敏逻辑，可能需要调用父组件方法
    };

    // 查看链接
    const handleOpenLink = (url) => {
      window.open(url, '_blank');
    };

    // 移除链接
    const handleRemoveLink = (url) => {
      console.log('移除链接:', url);
      // 实际移除逻辑，可能需要调用父组件方法
    };

    // 下载图片
    const handleDownloadImage = (url) => {
      const link = document.createElement('a');
      link.href = url;
      link.download = url.substring(url.lastIndexOf('/') + 1);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    // 替换图片
    const handleReplaceImage = (url) => {
      console.log('替换图片:', url);
      // 实际替换逻辑，可能需要调用父组件方法
    };

    return {
      sensitiveWordColumns,
      personalInfoColumns,
      externalLinkColumns,
      xssRiskTypes,
      hasSecurityIssues,
      rescan,
      handleReplace,
      handleMask,
      handleOpenLink,
      handleRemoveLink,
      handleDownloadImage,
      handleReplaceImage
    };
  }
});
</script>

<style scoped>
.content-security-panel {
  padding: 16px;
  background-color: #fafafa;
  border-radius: 4px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.title {
  font-size: 16px;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.title span {
  margin-left: 8px;
}

.security-summary {
  margin-bottom: 24px;
  background-color: #fff;
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.security-details {
  margin-bottom: 24px;
  background-color: #fff;
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.security-empty {
  margin-bottom: 24px;
  padding: 32px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.security-tips {
  margin-top: 16px;
}
</style>