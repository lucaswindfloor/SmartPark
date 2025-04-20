<template>
  <div class="accessibility-check-panel">
    <div class="panel-header">
      <div class="title">
        <eye-outlined />
        <span>无障碍检查</span>
      </div>
      <div class="actions">
        <a-button @click="handleCheck" style="margin-right: 8px">检查</a-button>
        <a-button type="primary" @click="handleFix" :disabled="!hasIssues">自动修复</a-button>
      </div>
    </div>

    <div class="accessibility-score">
      <a-progress
        type="dashboard"
        :percent="checkResults.score"
        :format="percent => `${percent}分`"
        :status="scoreStatus"
      />
      <div class="score-details">
        <div class="score-title">无障碍评分</div>
        <div class="score-summary">
          {{ getSummaryText() }}
        </div>
      </div>
    </div>

    <div class="issues-summary">
      <a-row :gutter="16">
        <a-col :span="6">
          <a-statistic
            title="缺少替代文本"
            :value="checkResults.missingAltTexts"
            :value-style="{ color: checkResults.missingAltTexts > 0 ? '#cf1322' : '#3f8600' }"
          />
        </a-col>
        <a-col :span="6">
          <a-statistic
            title="表格缺少标题"
            :value="checkResults.missingTableHeaders"
            :value-style="{ color: checkResults.missingTableHeaders > 0 ? '#cf1322' : '#3f8600' }"
          />
        </a-col>
        <a-col :span="6">
          <a-statistic
            title="空链接文本"
            :value="checkResults.emptyLinks"
            :value-style="{ color: checkResults.emptyLinks > 0 ? '#faad14' : '#3f8600' }"
          />
        </a-col>
        <a-col :span="6">
          <a-statistic
            title="低对比度元素"
            :value="checkResults.lowContrastElements"
            :value-style="{ color: checkResults.lowContrastElements > 0 ? '#faad14' : '#3f8600' }"
          />
        </a-col>
      </a-row>
    </div>

    <div class="issues-list" v-if="hasIssues">
      <a-collapse>
        <a-collapse-panel v-if="checkResults.missingAltTexts > 0" key="1" header="缺少替代文本的图片">
          <a-alert message="图片缺少替代文本会使屏幕阅读器用户无法理解图片内容" type="error" show-icon style="margin-bottom: 16px" />
          <div class="auto-fix-tip">
            <bulb-outlined />
            <span>建议：为所有图片添加有意义的替代文本，描述图片内容和作用</span>
          </div>
          <a-button type="link" @click="handleGenerateAltTexts">自动生成替代文本</a-button>
          <div class="issue-images">
            <div 
              v-for="(issue, index) in getIssuesByType('missingAlt')" 
              :key="`alt-${index}`" 
              class="issue-image-item"
            >
              <div class="image-preview">
                <img :src="issue.src" alt="" />
              </div>
              <div class="image-actions">
                <a-input 
                  placeholder="输入替代文本"
                  v-model:value="issue.fixValue"
                  style="width: 200px; margin-right: 8px"
                />
                <a-button size="small" @click="applyFix(issue)">应用</a-button>
              </div>
            </div>
          </div>
        </a-collapse-panel>

        <a-collapse-panel v-if="checkResults.missingTableHeaders > 0" key="2" header="表格缺少标题行">
          <a-alert message="没有标题行的表格会使屏幕阅读器用户难以理解表格结构和内容" type="error" show-icon style="margin-bottom: 16px" />
          <div class="auto-fix-tip">
            <bulb-outlined />
            <span>建议：为所有表格添加标题行，使用th标签表示表头</span>
          </div>
          <a-list
            size="small"
            bordered
            :data-source="getIssuesByType('missingTableHeader')"
          >
            <template #renderItem="{ item, index }">
              <a-list-item>
                <div class="issue-list-item">
                  <div>表格 #{{ index + 1 }}</div>
                  <a-button size="small" @click="applyFix(item)">自动修复</a-button>
                </div>
              </a-list-item>
            </template>
          </a-list>
        </a-collapse-panel>

        <a-collapse-panel v-if="checkResults.emptyLinks > 0" key="3" header="空链接文本">
          <a-alert message="链接文本为空或不明确会使屏幕阅读器用户无法理解链接目的" type="warning" show-icon style="margin-bottom: 16px" />
          <div class="auto-fix-tip">
            <bulb-outlined />
            <span>建议：为所有链接提供有意义的文本描述，避免使用"点击这里"等模糊表述</span>
          </div>
          <a-list
            size="small"
            bordered
            :data-source="getIssuesByType('emptyLink')"
          >
            <template #renderItem="{ item, index }">
              <a-list-item>
                <div class="issue-list-item">
                  <div>
                    <div>链接 #{{ index + 1 }}</div>
                    <div class="issue-preview">{{ item.href }}</div>
                  </div>
                  <div>
                    <a-input 
                      placeholder="输入链接文本"
                      v-model:value="item.fixValue"
                      style="width: 200px; margin-right: 8px"
                    />
                    <a-button size="small" @click="applyFix(item)">应用</a-button>
                  </div>
                </div>
              </a-list-item>
            </template>
          </a-list>
        </a-collapse-panel>

        <a-collapse-panel v-if="checkResults.lowContrastElements > 0" key="4" header="低对比度元素">
          <a-alert message="文本与背景色对比度不足会导致弱视用户难以阅读内容" type="warning" show-icon style="margin-bottom: 16px" />
          <div class="auto-fix-tip">
            <bulb-outlined />
            <span>建议：确保文本与背景色的对比度至少为4.5:1，大号文本至少为3:1</span>
          </div>
          <a-list
            size="small"
            bordered
            :data-source="getIssuesByType('lowContrast')"
          >
            <template #renderItem="{ item, index }">
              <a-list-item>
                <div class="issue-list-item">
                  <div>
                    <div>元素 #{{ index + 1 }}</div>
                    <div 
                      class="contrast-preview" 
                      :style="{ 
                        backgroundColor: item.backgroundColor, 
                        color: item.color
                      }"
                    >
                      {{ item.text || '预览文本' }}
                    </div>
                    <div class="contrast-ratio">
                      当前对比度: {{ item.ratio }}:1 (推荐: 4.5:1)
                    </div>
                  </div>
                  <a-button size="small" @click="applyFix(item)">增强对比度</a-button>
                </div>
              </a-list-item>
            </template>
          </a-list>
        </a-collapse-panel>
      </a-collapse>
    </div>

    <div class="accessibility-empty" v-else>
      <a-empty description="未检测到无障碍问题，内容符合发布要求" />
    </div>

    <div class="accessibility-tips">
      <a-alert type="info" show-icon>
        <template #message>
          <span>无障碍优化提示</span>
        </template>
        <template #description>
          <ol>
            <li>为所有图片提供有意义的替代文本，描述图片内容</li>
            <li>确保表格有清晰的表头，使用适当的HTML结构</li>
            <li>链接文本应清晰表达链接目的，避免使用"点击这里"等文本</li>
            <li>确保文本与背景有足够的对比度，以便于阅读</li>
            <li>不要仅依赖颜色来传达信息，应配合使用文本或图标</li>
          </ol>
        </template>
      </a-alert>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
import { EyeOutlined, BulbOutlined } from '@ant-design/icons-vue';
import { notification } from 'ant-design-vue';

export default defineComponent({
  name: 'AccessibilityCheckPanel',
  components: {
    EyeOutlined,
    BulbOutlined
  },
  props: {
    content: {
      type: String,
      default: ''
    },
    checkResults: {
      type: Object,
      default: () => ({
        missingAltTexts: 0,
        missingTableHeaders: 0,
        emptyLinks: 0,
        lowContrastElements: 0,
        issues: [],
        score: 100
      })
    }
  },
  emits: ['check', 'fix'],
  setup(props, { emit }) {
    // 修复值
    const fixValues = ref({});

    // 是否有问题
    const hasIssues = computed(() => {
      return props.checkResults.issues && props.checkResults.issues.length > 0;
    });

    // 评分状态
    const scoreStatus = computed(() => {
      const score = props.checkResults.score;
      if (score >= 90) return 'success';
      if (score >= 70) return 'normal';
      return 'exception';
    });

    // 获取评分文本
    const getSummaryText = () => {
      const score = props.checkResults.score;
      if (score >= 90) return '优秀';
      if (score >= 80) return '良好';
      if (score >= 70) return '一般';
      if (score >= 60) return '较差';
      return '需改进';
    };

    // 根据类型获取问题
    const getIssuesByType = (type) => {
      return (props.checkResults.issues || []).filter(issue => issue.type === type);
    };

    // 处理检查
    const handleCheck = () => {
      emit('check');
    };

    // 处理自动修复
    const handleFix = () => {
      emit('fix');
    };

    // 自动生成替代文本
    const handleGenerateAltTexts = () => {
      notification.info({
        message: '正在生成替代文本',
        description: '系统正在分析图片内容，生成替代文本可能需要一些时间，请稍候...'
      });
      emit('fix', 'generateAltTexts');
    };

    // 应用修复
    const applyFix = (issue) => {
      emit('fix', issue);
    };

    return {
      hasIssues,
      scoreStatus,
      fixValues,
      getSummaryText,
      getIssuesByType,
      handleCheck,
      handleFix,
      handleGenerateAltTexts,
      applyFix
    };
  }
});
</script>

<style scoped>
.accessibility-check-panel {
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

.accessibility-score {
  margin-bottom: 24px;
  background-color: #fff;
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
}

.score-details {
  margin-left: 24px;
}

.score-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
}

.score-summary {
  font-size: 24px;
  color: #333;
}

.issues-summary {
  margin-bottom: 24px;
  background-color: #fff;
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.issues-list {
  margin-bottom: 24px;
  background-color: #fff;
  padding: 16px;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.auto-fix-tip {
  display: flex;
  align-items: center;
  background-color: #f9f0ff;
  padding: 8px;
  border-radius: 4px;
  margin-bottom: 16px;
  color: #722ed1;
}

.auto-fix-tip span {
  margin-left: 8px;
}

.issue-list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.issue-preview {
  color: #999;
  font-size: 12px;
  margin-top: 4px;
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.issue-images {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 16px;
}

.issue-image-item {
  width: 220px;
}

.image-preview {
  margin-bottom: 8px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
}

.image-preview img {
  max-width: 100%;
  max-height: 100%;
}

.image-actions {
  display: flex;
  align-items: center;
}

.contrast-preview {
  padding: 8px;
  border-radius: 4px;
  margin: 8px 0;
  max-width: 200px;
}

.contrast-ratio {
  font-size: 12px;
  color: #999;
}

.accessibility-empty {
  margin-bottom: 24px;
  padding: 32px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.accessibility-tips {
  margin-top: 16px;
}
</style> 