<template>
  <div class="statistics-component">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="8">
        <el-card shadow="hover" class="stats-card">
          <template #header>
            <div class="card-header">
              <span>总阅读量</span>
              <el-tooltip content="查看公告的总人数" placement="top">
                <el-icon><InfoFilled /></el-icon>
              </el-tooltip>
            </div>
          </template>
          <div class="card-content">
            <h2 class="stats-number">{{ viewCount }}</h2>
            <div v-if="compareViewCount > 0" class="trend up">
              <el-icon><CaretTop /></el-icon> {{ compareViewCount }}
              <span class="trend-text">较前一天</span>
            </div>
            <div v-else-if="compareViewCount < 0" class="trend down">
              <el-icon><CaretBottom /></el-icon> {{ Math.abs(compareViewCount) }}
              <span class="trend-text">较前一天</span>
            </div>
            <div v-else class="trend">
              <el-icon><Minus /></el-icon>
              <span class="trend-text">较前一天</span>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="8">
        <el-card shadow="hover" class="stats-card">
          <template #header>
            <div class="card-header">
              <span>阅读率</span>
              <el-tooltip content="已读人数占目标人群的百分比" placement="top">
                <el-icon><InfoFilled /></el-icon>
              </el-tooltip>
            </div>
          </template>
          <div class="card-content">
            <h2 class="stats-number">{{ formatPercent(readRate) }}</h2>
            <el-progress 
              :percentage="readRate * 100" 
              :color="getProgressColor(readRate)"
              :status="getProgressStatus(readRate)"
              :stroke-width="8"
            ></el-progress>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="8" v-if="requireConfirmation">
        <el-card shadow="hover" class="stats-card">
          <template #header>
            <div class="card-header">
              <span>确认率</span>
              <el-tooltip content="确认收到的人数占目标人群的百分比" placement="top">
                <el-icon><InfoFilled /></el-icon>
              </el-tooltip>
            </div>
          </template>
          <div class="card-content">
            <h2 class="stats-number">{{ formatPercent(confirmRate) }}</h2>
            <el-progress 
              :percentage="confirmRate * 100" 
              :color="getProgressColor(confirmRate)"
              :status="getProgressStatus(confirmRate)"
              :stroke-width="8"
            ></el-progress>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <div class="detail-stats">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="部门/企业统计" name="department">
          <el-table :data="departmentStats" style="width: 100%" border>
            <el-table-column prop="name" label="部门/企业名称" min-width="200"></el-table-column>
            <el-table-column prop="totalCount" label="总人数" width="120"></el-table-column>
            <el-table-column prop="viewCount" label="已读人数" width="120"></el-table-column>
            <el-table-column label="阅读率" width="200">
              <template #default="scope">
                <div class="progress-cell">
                  <el-progress 
                    :percentage="(scope.row.viewCount / scope.row.totalCount) * 100" 
                    :format="percentFormat"
                    :color="getProgressColor(scope.row.viewCount / scope.row.totalCount)"
                    :stroke-width="6"
                  ></el-progress>
                </div>
              </template>
            </el-table-column>
            <el-table-column v-if="requireConfirmation" prop="confirmCount" label="已确认人数" width="120"></el-table-column>
            <el-table-column v-if="requireConfirmation" label="确认率" width="200">
              <template #default="scope">
                <div class="progress-cell">
                  <el-progress 
                    :percentage="(scope.row.confirmCount / scope.row.totalCount) * 100" 
                    :format="percentFormat"
                    :color="getProgressColor(scope.row.confirmCount / scope.row.totalCount)"
                    :stroke-width="6"
                  ></el-progress>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="详情" width="100" fixed="right">
              <template #default="scope">
                <el-button 
                  size="small" 
                  @click="$emit('view-detail', { type: 'department', id: scope.row.id })"
                >查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        
        <el-tab-pane label="阅读时段分布" name="time">
          <div class="chart-container" ref="timeChartContainer">
            <!-- 在实际项目中，这里可以使用ECharts等图表库渲染时段分布图 -->
            <div class="chart-placeholder">
              <p>时段分布图表 (实际项目中应使用图表库渲染)</p>
              <div class="mock-chart-bars">
                <div v-for="(item, index) in timeDistribution" :key="index" class="mock-bar" :style="{ height: item.percent + '%' }">
                  <div class="mock-bar-label">{{ item.percent }}%</div>
                </div>
              </div>
              <div class="mock-chart-labels">
                <div v-for="(item, index) in timeDistribution" :key="index" class="mock-label">
                  {{ item.time }}
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane v-if="requireConfirmation" label="确认截止提醒" name="reminder">
          <div class="reminder-section">
            <el-alert
              v-if="daysUntilDeadline > 0"
              title="未完成确认提醒"
              type="warning"
              show-icon
              :closable="false"
            >
              <p>距离确认截止日期还有 <b>{{ daysUntilDeadline }}</b> 天，尚有 <b>{{ totalCount - confirmCount }}</b> 人未确认。</p>
            </el-alert>
            
            <el-alert
              v-else-if="daysUntilDeadline === 0"
              title="今日截止提醒"
              type="error"
              show-icon
              :closable="false"
            >
              <p>确认今日截止，尚有 <b>{{ totalCount - confirmCount }}</b> 人未确认，请尽快提醒。</p>
            </el-alert>
            
            <el-alert
              v-else
              title="已过确认截止日期"
              type="info"
              show-icon
              :closable="false"
            >
              <p>确认已截止，共有 <b>{{ confirmCount }}</b> 人完成确认，确认率 <b>{{ formatPercent(confirmRate) }}</b>。</p>
            </el-alert>
            
            <div class="reminder-actions" v-if="daysUntilDeadline >= 0">
              <el-button type="primary" @click="$emit('send-reminder')">发送提醒</el-button>
              <el-button v-if="daysUntilDeadline < 3" @click="$emit('extend-deadline')">延长截止时间</el-button>
            </div>
            
            <el-table v-if="daysUntilDeadline >= 0" :data="unconfirmedList" style="width: 100%; margin-top: 20px" border>
              <el-table-column prop="department" label="部门/企业" min-width="150"></el-table-column>
              <el-table-column prop="name" label="用户名称" min-width="120"></el-table-column>
              <el-table-column prop="phone" label="联系电话" width="150"></el-table-column>
              <el-table-column prop="email" label="邮箱" min-width="200"></el-table-column>
              <el-table-column prop="viewed" label="是否已读" width="100">
                <template #default="scope">
                  <el-tag :type="scope.row.viewed ? 'success' : 'info'">
                    {{ scope.row.viewed ? '已读' : '未读' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="180" fixed="right">
                <template #default="scope">
                  <el-button size="small" type="primary" @click="$emit('remind-individual', scope.row)">单独提醒</el-button>
                  <el-button size="small" @click="$emit('contact', scope.row)">联系</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { CaretTop, CaretBottom, Minus, InfoFilled } from '@element-plus/icons-vue'

export default {
  name: 'StatisticsComponent',
  components: {
    CaretTop,
    CaretBottom,
    Minus,
    InfoFilled
  },
  props: {
    viewCount: {
      type: Number,
      default: 0
    },
    compareViewCount: {
      type: Number,
      default: 0
    },
    readRate: {
      type: Number,
      default: 0
    },
    requireConfirmation: {
      type: Boolean,
      default: false
    },
    confirmRate: {
      type: Number,
      default: 0
    },
    confirmCount: {
      type: Number,
      default: 0
    },
    totalCount: {
      type: Number,
      default: 0
    },
    confirmDeadline: {
      type: [Date, String, null],
      default: null
    },
    departmentStats: {
      type: Array,
      default: () => []
    },
    unconfirmedList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      activeTab: 'department',
      // 模拟时段分布数据
      timeDistribution: [
        { time: '00:00-03:59', count: 15, percent: 5 },
        { time: '04:00-07:59', count: 30, percent: 10 },
        { time: '08:00-11:59', count: 120, percent: 40 },
        { time: '12:00-15:59', count: 75, percent: 25 },
        { time: '16:00-19:59', count: 45, percent: 15 },
        { time: '20:00-23:59', count: 15, percent: 5 }
      ]
    }
  },
  computed: {
    daysUntilDeadline() {
      if (!this.confirmDeadline) return -1
      
      const deadline = new Date(this.confirmDeadline)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      deadline.setHours(0, 0, 0, 0)
      
      const timeDiff = deadline.getTime() - today.getTime()
      return Math.ceil(timeDiff / (1000 * 3600 * 24))
    }
  },
  methods: {
    formatPercent(value) {
      return `${Math.round(value * 100)}%`
    },
    
    percentFormat(percentage) {
      return `${percentage}%`
    },
    
    getProgressColor(rate) {
      if (rate >= 0.8) return '#67c23a'
      if (rate >= 0.5) return '#e6a23c'
      return '#f56c6c'
    },
    
    getProgressStatus(rate) {
      if (rate >= 0.8) return 'success'
      if (rate >= 0.5) return ''
      return 'exception'
    }
  },
  emits: [
    'view-detail',
    'send-reminder',
    'extend-deadline',
    'remind-individual',
    'contact'
  ]
}
</script>

<style scoped>
.statistics-component {
  padding: 10px;
}

.stats-card {
  margin-bottom: 20px;
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-content {
  text-align: center;
  padding: 10px 0;
}

.stats-number {
  margin: 10px 0;
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}

.trend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 14px;
}

.trend.up {
  color: #67c23a;
}

.trend.down {
  color: #f56c6c;
}

.trend-text {
  color: #909399;
  margin-left: 5px;
}

.detail-stats {
  margin-top: 20px;
}

.progress-cell {
  width: 100%;
}

.chart-container {
  height: 300px;
  margin: 20px 0;
}

.chart-placeholder {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f5f7fa;
  border-radius: 4px;
  padding: 20px;
  align-items: center;
}

.mock-chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 200px;
  width: 100%;
  margin-top: 20px;
}

.mock-bar {
  width: 40px;
  background-color: #409eff;
  border-radius: 4px 4px 0 0;
  position: relative;
  display: flex;
  justify-content: center;
}

.mock-bar-label {
  position: absolute;
  top: -25px;
  font-size: 12px;
  color: #606266;
}

.mock-chart-labels {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 10px;
}

.mock-label {
  font-size: 12px;
  color: #606266;
  text-align: center;
  width: 40px;
}

.reminder-section {
  padding: 10px 0;
}

.reminder-actions {
  margin: 20px 0;
}

@media (max-width: 768px) {
  .stats-card {
    margin-bottom: 15px;
  }
  
  .mock-bar {
    width: 30px;
  }
  
  .mock-label {
    width: 30px;
    font-size: 10px;
  }
}
</style> 