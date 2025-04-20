<template>
  <div class="home-page">
    <!-- 未读消息提醒 -->
    <a-alert
      v-if="unreadCount > 0"
      type="info"
      show-icon
      class="message-alert"
    >
      <template #message>
        <span>
          您有 <a-badge :count="unreadCount" :overflow-count="99" /> 条未读消息，
          <router-link to="/user/messages">点击查看</router-link>
        </span>
      </template>
    </a-alert>

    <a-row :gutter="16">
      <!-- 轮播图和园区介绍 -->
      <a-col :xs="24" :lg="16">
        <!-- 园区活动轮播 -->
        <a-card title="园区活动" class="section-card">
          <template #title>
            <div class="card-title">
              <CalendarOutlined /> 园区活动
            </div>
          </template>
          <a-carousel autoplay class="activity-carousel">
            <div v-for="item in carouselItems" :key="item.id">
              <div class="carousel-item" :style="{background: `url(${item.image}) center center / cover no-repeat`}">
                <div class="carousel-overlay">
                  <a-tag color="red" v-if="item.isTop">置顶</a-tag>
                  <h3>{{ item.title }}</h3>
                  <p>
                    <ClockCircleOutlined /> {{ item.date }}
                    <a-divider type="vertical" />
                    <EnvironmentOutlined /> {{ item.location }}
                  </p>
                  <a-button type="primary" size="small" @click="navigateTo(item.link)">
                    查看详情 <RightOutlined />
                  </a-button>
                </div>
              </div>
            </div>
          </a-carousel>
        </a-card>

        <!-- 园区展示 -->
        <a-card title="园区展示" class="section-card" style="margin-top: 16px">
          <template #title>
            <div class="card-title">
              <HomeOutlined /> 园区展示
            </div>
          </template>
          <a-tabs v-model:activeKey="activeTab">
            <a-tab-pane key="intro" tab="基本介绍">
              <p>湘江科创基地位于长沙市岳麓区，总面积约50万平方米，是集科技研发、创新创业、产业加速于一体的综合性科技园区...</p>
              <a-row :gutter="16" style="margin-top: 16px">
                <a-col :span="8">
                  <a-statistic title="入驻企业" :value="108" suffix="家" />
                </a-col>
                <a-col :span="8">
                  <a-statistic title="孵化项目" :value="256" suffix="个" />
                </a-col>
                <a-col :span="8">
                  <a-statistic title="服务设施" :value="35" suffix="处" />
                </a-col>
              </a-row>
            </a-tab-pane>
            <a-tab-pane key="history" tab="发展历程">
              <a-timeline mode="left">
                <a-timeline-item v-for="item in historyItems" :key="item.year" :label="item.year">
                  <h4>{{ item.title }}</h4>
                  <p>{{ item.content }}</p>
                </a-timeline-item>
              </a-timeline>
            </a-tab-pane>
            <a-tab-pane key="gallery" tab="园区风采">
              <a-carousel autoplay class="gallery-carousel" style="margin-bottom: 20px">
                <div v-for="(image, index) in parkImages.slice(0, 3)" :key="index">
                  <div :style="{ height: '300px', background: `url(${image.url}) center center / cover no-repeat` }">
                    <div class="carousel-overlay">
                      <h3>{{ image.title }}</h3>
                    </div>
                  </div>
                </div>
              </a-carousel>
              <a-row :gutter="[16, 16]">
                <a-col :span="8" v-for="(image, index) in parkImages" :key="index">
                  <a-image 
                    :src="image.url" 
                    :alt="image.title" 
                    style="width: 100%; height: 150px; object-fit: cover; border-radius: 8px" 
                  />
                  <p style="text-align: center; margin-top: 8px">{{ image.title }}</p>
                </a-col>
              </a-row>
            </a-tab-pane>
            <a-tab-pane key="facilities" tab="园区设施">
              <a-list :grid="{ gutter: 16, column: 2 }">
                <a-list-item v-for="(facility, index) in facilities" :key="index">
                  <a-card>
                    <h4>{{ facility.title }}</h4>
                    <p>{{ facility.desc }}</p>
                  </a-card>
                </a-list-item>
              </a-list>
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-col>

      <!-- 服务预约和园区公告 -->
      <a-col :xs="24" :lg="8">
        <!-- 我的服务 -->
        <a-card title="我的服务" class="section-card">
          <template #title>
            <div class="card-title">
              <AppstoreOutlined /> 我的服务
            </div>
          </template>
          
          <template v-if="!isAuthenticated">
            <div class="service-login-tip">
              <p>登录后可使用更多园区服务</p>
              <a-button type="primary" @click="navigateTo('/login')">立即登录</a-button>
            </div>
          </template>
          
          <template v-else>
            <a-row :gutter="[16, 16]">
              <a-col :span="12" v-for="service in commonServices" :key="service.title">
                <a-card 
                  class="service-item-card" 
                  hoverable 
                  @click="navigateTo(service.path)"
                  :style="{ cursor: hasPermission(service.permission) ? 'pointer' : 'not-allowed' }"
                >
                  <div class="service-icon">{{ service.icon }}</div>
                  <div class="service-title">{{ service.title }}</div>
                </a-card>
              </a-col>
            </a-row>
          </template>
        </a-card>

        <!-- 通知公告 -->
        <a-card title="通知公告" class="section-card" style="margin-top: 16px">
          <template #title>
            <div class="card-title">
              <NotificationOutlined /> 通知公告
            </div>
          </template>
          <a-list class="info-list">
            <a-list-item v-for="notice in notices" :key="notice.id">
              <a-list-item-meta :title="notice.title">
                <template #description>
                  <div>
                    <CalendarOutlined /> {{ notice.date }}
                    <a-tag v-if="notice.isNew" color="green" style="margin-left: 8px">新</a-tag>
                  </div>
                </template>
              </a-list-item-meta>
              <template #actions>
                <a @click="navigateTo(`/information/detail/${notice.id}`)" class="info-link">查看</a>
              </template>
            </a-list-item>
          </a-list>
          <div class="info-more-button">
            <a-button @click="navigateTo('/information/list')">查看更多通知 <RightOutlined /></a-button>
            <p>已更新 {{ notices.length }} 条通知公告</p>
          </div>
        </a-card>

        <!-- 房源意向登记 -->
        <a-card title="场地租赁" class="section-card" style="margin-top: 16px">
          <template #title>
            <div class="card-title">
              <FileTextOutlined /> 场地租赁
            </div>
          </template>
          <div class="space-registration">
            <h3>对园区房源有意向？</h3>
            <p>留下您的联系方式，我们会尽快与您取得联系</p>
            <a-button type="primary" style="margin-top: 10px" @click="showModal">我要登记</a-button>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 房源意向登记弹窗 -->
    <a-modal
      v-model:visible="isModalVisible"
      title="房源意向登记"
      @ok="handleSpaceInterest"
    >
      <a-form :model="spaceForm" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-form-item label="企业名称" name="company" :rules="[{ required: true, message: '请输入企业名称' }]">
          <a-input v-model:value="spaceForm.company" placeholder="请输入企业名称" />
        </a-form-item>
        <a-form-item label="联系人" name="contact" :rules="[{ required: true, message: '请输入联系人姓名' }]">
          <a-input v-model:value="spaceForm.contact" placeholder="请输入联系人姓名" />
        </a-form-item>
        <a-form-item label="联系电话" name="phone" :rules="[{ required: true, message: '请输入联系电话' }]">
          <a-input v-model:value="spaceForm.phone" placeholder="请输入联系电话" />
        </a-form-item>
        <a-form-item label="意向面积" name="area">
          <a-input v-model:value="spaceForm.area" placeholder="意向租赁面积(平方米)" />
        </a-form-item>
        <a-form-item label="需求说明" name="requirements">
          <a-textarea v-model:value="spaceForm.requirements" placeholder="请简要描述您的需求" :rows="4" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { 
  CalendarOutlined, 
  NotificationOutlined, 
  FileTextOutlined,
  RightOutlined,
  BellOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  UserOutlined,
  PhoneOutlined,
  AppstoreOutlined,
  HomeOutlined
} from '@ant-design/icons-vue';
import { useUserStore } from '../../../stores/user';

// 路由
const router = useRouter();

// 用户store
const userStore = useUserStore();

// 响应式状态
const activeTab = ref('intro');
const isModalVisible = ref(false);
const unreadCount = ref(3); // 模拟数据
const isAuthenticated = ref(userStore.isLoggedIn); // 从store获取

// 园区活动轮播内容
const carouselItems = reactive([
  {
    id: 1,
    title: '2024年科技创新峰会',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop',
    date: '2024-10-15',
    isTop: true,
    endTime: '2024-10-16',
    link: '/activities/1',
    location: '创新中心多功能厅'
  },
  {
    id: 2,
    title: '人工智能技术交流会',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop',
    date: '2024-09-28',
    isTop: true,
    endTime: '2024-09-28',
    link: '/activities/2',
    location: '科技楼报告厅'
  },
  {
    id: 3,
    title: '创业项目路演活动',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2032&auto=format&fit=crop',
    date: '2024-09-20',
    isTop: false,
    endTime: '2024-09-20',
    link: '/activities/3',
    location: '创业孵化中心路演厅'
  },
  {
    id: 4,
    title: '企业家沙龙第三期',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2026&auto=format&fit=crop',
    date: '2024-09-15',
    isTop: false,
    endTime: '2024-09-15',
    link: '/activities/4',
    location: '湘江会议中心'
  }
]);

// 服务菜单配置
const commonServices = reactive([
  { icon: '⚡', title: '电费预充', path: '/services/electricity', type: 'facility', permission: 'PAY_BILLS' },
  { icon: '💰', title: '充值预付款', path: '/services/prepay', type: 'facility', permission: 'PAY_BILLS' },
  { icon: '📄', title: '账单缴费', path: '/services/bills', type: 'facility', permission: 'PAY_BILLS' },
  { icon: '❄️', title: '空调加时', path: '/services/ac', type: 'facility', permission: 'APPLY_ENTERPRISE_SERVICE' },
  { icon: '🏢', title: '会议室预订', path: '/services/meeting', type: 'facility', permission: 'BOOK_MEETING_ROOM' },
  { icon: '🚗', title: '停车月卡', path: '/services/parking', type: 'facility', permission: 'APPLY_ENTERPRISE_SERVICE' },
  { icon: '⚠️', title: '事件上报', path: '/services/report', type: 'property', permission: 'REPORT_MAINTENANCE' },
  { icon: '🔧', title: '维修申报', path: '/services/maintenance', type: 'property', permission: 'REPORT_MAINTENANCE' }
]);

// 园区设施
const facilities = reactive([
  { title: '智能门禁系统', desc: '24小时智能化门禁管理' },
  { title: '多功能会议室', desc: '配备先进视听设备的会议空间' },
  { title: '共享办公区域', desc: '灵活舒适的共享工作空间' },
  { title: '园区餐厅', desc: '提供多样化餐饮服务' },
  { title: '健身休闲区', desc: '配备健身器材的休闲活动空间' },
  { title: '停车场', desc: '大型智能化停车场，提供充电桩' }
]);

// 园区发展历程
const historyItems = reactive([
  { year: '2020', title: '园区成立', content: '湘江科创基地正式成立' },
  { year: '2021', title: '基础建设', content: '完成一期工程建设，引入首批企业' },
  { year: '2022', title: '快速发展', content: '入驻企业突破50家，建立产业集群' },
  { year: '2023', title: '创新升级', content: '智慧园区系统上线，服务升级' },
  { year: '2024', title: '产业集聚', content: '重点产业规模突破100亿' }
]);

// 园区相册
const parkImages = reactive([
  { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop', title: '园区鸟瞰图' },
  { url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2070&auto=format&fit=crop', title: '创新中心' },
  { url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2069&auto=format&fit=crop', title: '产业园区' },
  { url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070&auto=format&fit=crop', title: '休闲广场' },
  { url: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=2074&auto=format&fit=crop', title: '科技展示中心' },
  { url: 'https://images.unsplash.com/photo-1562516710-58fc45060d76?q=80&w=2069&auto=format&fit=crop', title: '智能会议室' }
]);

// 通知公告
const notices = reactive([
  { id: 1, title: '关于园区道路维修的通知', date: '2024-09-10', isNew: true },
  { id: 2, title: '2024年第四季度企业服务政策说明会', date: '2024-09-08', isNew: true },
  { id: 3, title: '园区智能化升级项目进展公告', date: '2024-09-05', isNew: false },
  { id: 4, title: '关于加强园区安全管理的通知', date: '2024-09-01', isNew: false },
  { id: 5, title: '园区电力系统检修通知', date: '2024-08-28', isNew: false }
]);

// 房源意向表单
const spaceForm = reactive({
  company: '',
  contact: '',
  phone: '',
  area: '',
  requirements: ''
});

// 处理房源意向登记
const handleSpaceInterest = () => {
  console.log('房源意向登记:', spaceForm);
  message.success('登记成功，我们会尽快与您联系！');
  isModalVisible.value = false;
};

// 显示模态框
const showModal = () => {
  isModalVisible.value = true;
};

// 导航
const navigateTo = (path) => {
  router.push(path);
};

// 权限检查 - 实际项目中应该使用userStore中的权限检查函数
const hasPermission = (permission) => {
  // return userStore.hasPermission(permission);
  return true; // 示例中直接返回true
};
</script>

<style scoped>
/* Home page styles */
.home-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
}

/* Message alert styles */
.message-alert {
  border-radius: 8px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* Section card styles */
.section-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  margin-bottom: 16px;
}

.section-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Activity carousel styles */
.activity-carousel {
  margin-bottom: 16px;
}

.carousel-item {
  height: 280px;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
}

.carousel-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: white;
}

.carousel-overlay h3 {
  color: white;
  margin: 8px 0;
  font-size: 22px;
}

/* Service menu styles */
.service-login-tip {
  padding: 40px 0;
  text-align: center;
}

.service-item-card {
  text-align: center;
  transition: all 0.3s;
  border-radius: 12px;
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.service-item-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.service-icon {
  font-size: 36px;
  margin-bottom: 12px;
}

.service-title {
  font-size: 16px;
  font-weight: 500;
}

/* Information section styles */
.info-list {
  max-height: 300px;
  overflow-y: auto;
}

.info-link {
  color: #1890ff;
  transition: all 0.3s;
}

.info-link:hover {
  color: #40a9ff;
  text-decoration: underline;
}

.info-more-button {
  text-align: center;
  margin: 20px 0;
}

.info-more-button p {
  margin-top: 8px;
  color: #666;
  font-size: 14px;
}

/* Gallery carousel styles */
.gallery-carousel :deep(.carousel-item) {
  height: 300px;
}

.gallery-carousel :deep(.carousel-overlay) {
  padding: 16px;
}

/* Space registration styles */
.space-registration {
  text-align: center;
  padding: 20px;
  background: #f0f9ff;
  border-radius: 8px;
  margin-top: 20px;
}

.space-registration h3 {
  font-size: 18px;
  margin-bottom: 8px;
}

/* Responsive styles */
@media (max-width: 768px) {
  .home-page {
    padding: 12px;
  }
  
  .carousel-item {
    height: 200px;
  }
  
  .carousel-overlay h3 {
    font-size: 18px;
  }
  
  .service-icon {
    font-size: 28px;
  }

  .gallery-carousel :deep(.carousel-item) {
    height: 200px;
  }
}

@media (max-width: 576px) {
  .service-item-card {
    padding: 12px 8px;
  }
  
  .service-icon {
    font-size: 24px;
    margin-bottom: 8px;
  }
  
  .service-title {
    font-size: 14px;
  }
}
</style> 