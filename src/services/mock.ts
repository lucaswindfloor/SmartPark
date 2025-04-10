import { Mock, createMockAdapter } from 'axios-mock-adapter';
import axios from 'axios';
import dayjs from 'dayjs';

// Mock数据
const noticesList = [
  {
    id: 1,
    title: '关于园区停电维护的通知',
    content: '尊敬的园区企业：\n为保障园区电力系统安全运行，我们计划于2024年6月20日进行电力设备维护，届时将会有短暂停电，请各企业做好相关准备。',
    category: 'notice',
    publicRange: ['enterprise', 'employee'],
    status: 'published',
    isTop: true,
    requireConfirmation: true,
    confirmCount: 35,
    viewCount: 245,
    createdBy: 'admin',
    createdAt: '2024-06-15 09:30:00',
    updatedAt: '2024-06-15 10:20:00',
    publishedAt: '2024-06-15 10:30:00',
    reviewedBy: 'manager'
  },
  {
    id: 2,
    title: '园区招商政策更新公告',
    content: '为促进园区产业升级和技术创新，园区管委会特制定新的招商引资政策...',
    category: 'announcement',
    publicRange: ['enterprise', 'employee', 'public'],
    status: 'published',
    isTop: false,
    requireConfirmation: false,
    confirmCount: 0,
    viewCount: 189,
    createdBy: 'admin',
    createdAt: '2024-06-12 14:20:00',
    updatedAt: '2024-06-12 15:30:00',
    publishedAt: '2024-06-12 16:00:00',
    reviewedBy: 'manager'
  }
];

const policiesList = [
  {
    id: 1,
    title: '智慧园区创新企业认定管理办法',
    content: '为鼓励园区企业加大研发投入，提升自主创新能力，特制定本办法...',
    category: 'park-management',
    publicRange: ['enterprise', 'employee'],
    status: 'published',
    isTop: true,
    viewCount: 156,
    downloadCount: 98,
    fileName: '智慧园区创新企业认定管理办法.pdf',
    fileUrl: '/files/policies/park-management-001.pdf',
    fileSize: 1024576,
    implementDate: '2024-07-01',
    createdBy: '张三',
    createdAt: '2024-06-10 10:30:00',
    updatedAt: '2024-06-11 14:20:00',
    publishedAt: '2024-06-11 15:00:00',
    reviewedBy: '李四'
  },
  {
    id: 2,
    title: '智慧园区高新技术企业财政扶持实施细则',
    content: '为加快园区高新技术产业发展，对符合条件的高新技术企业给予财政扶持...',
    category: 'financial-support',
    publicRange: ['enterprise', 'employee', 'public'],
    status: 'published',
    isTop: true,
    viewCount: 210,
    downloadCount: 145,
    fileName: '智慧园区高新技术企业财政扶持实施细则.pdf',
    fileUrl: '/files/policies/financial-support-001.pdf',
    fileSize: 2048576,
    implementDate: '2024-08-01',
    createdBy: '王五',
    createdAt: '2024-06-08 09:15:00',
    updatedAt: '2024-06-09 11:30:00',
    publishedAt: '2024-06-09 12:00:00',
    reviewedBy: '李四'
  }
];

const activitiesList = [
  {
    id: 1,
    title: '2024年科技创新峰会',
    content: '本次峰会将邀请行业专家分享最新科技趋势，探讨创新发展方向。',
    category: 'technology',
    publicRange: ['enterprise', 'employee', 'public'],
    status: 'published',
    isTop: true,
    location: '园区多功能厅A区',
    startTime: '2024-10-15 09:00:00',
    endTime: '2024-10-15 17:00:00',
    registrationStartTime: '2024-09-15 00:00:00',
    registrationEndTime: '2024-10-14 23:59:59',
    maxParticipants: 200,
    currentParticipants: 145,
    viewCount: 356,
    imageUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3',
    createdBy: '张三',
    createdAt: '2024-09-10 10:30:00',
    updatedAt: '2024-09-11 14:20:00',
    publishedAt: '2024-09-11 15:00:00',
    reviewedBy: '李四'
  },
  {
    id: 2,
    title: '园区企业招聘会',
    content: '园区联合招聘会，30家企业参与，提供200+就业岗位。',
    category: 'recruitment',
    publicRange: ['enterprise', 'employee', 'public'],
    status: 'published',
    isTop: false,
    location: '园区展览中心',
    startTime: '2024-10-20 13:00:00',
    endTime: '2024-10-20 17:30:00',
    registrationStartTime: '2024-09-20 00:00:00',
    registrationEndTime: '2024-10-19 23:59:59',
    maxParticipants: 500,
    currentParticipants: 320,
    viewCount: 410,
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3',
    createdBy: '王五',
    createdAt: '2024-09-08 09:15:00',
    updatedAt: '2024-09-09 11:30:00',
    publishedAt: '2024-09-09 12:00:00',
    reviewedBy: '李四'
  }
];

const surveysList = [
  {
    id: 1,
    title: '园区服务满意度调查',
    description: '本次调查旨在了解园区企业对各项服务的满意度，为进一步提升服务质量提供参考。',
    category: 'satisfaction',
    targetGroups: ['enterprises', 'employees'],
    status: 'published',
    startTime: '2024-10-01 00:00:00',
    endTime: '2024-10-30 23:59:59',
    questions: [],
    questionCount: 12,
    responseCount: 68,
    viewCount: 156,
    createdBy: '张三',
    createdAt: '2024-09-25 10:30:00',
    updatedAt: '2024-09-25 14:20:00',
    publishedAt: '2024-09-25 15:00:00'
  },
  {
    id: 2,
    title: '园区餐饮服务反馈调查',
    description: '收集园区用户对餐饮服务的意见与建议，包括餐厅环境、食品质量、服务态度等方面。',
    category: 'feedback',
    targetGroups: ['enterprises', 'employees', 'public'],
    status: 'published',
    startTime: '2024-09-15 00:00:00',
    endTime: '2024-09-30 23:59:59',
    questions: [],
    questionCount: 8,
    responseCount: 124,
    viewCount: 210,
    createdBy: '王五',
    createdAt: '2024-09-10 09:15:00',
    updatedAt: '2024-09-11 11:30:00',
    publishedAt: '2024-09-11 12:00:00'
  }
];

const demandsList = [
  {
    id: 1,
    title: '招聘AI算法工程师',
    content: '我司正在寻找有经验的AI算法工程师...',
    type: 'recruitment',
    company: '智能科技有限公司',
    contact: '张三',
    contactPhone: '13800138000',
    contactEmail: 'zhangsan@example.com',
    status: 'published',
    isTop: true,
    viewCount: 156,
    validUntil: '2024-07-15',
    createdBy: '张三',
    createdAt: '2024-06-15 10:30:00',
    updatedAt: '2024-06-15 14:20:00',
    publishedAt: '2024-06-15 15:00:00',
    reviewedBy: '李四'
  },
  {
    id: 2,
    title: '寻找机器学习项目合作伙伴',
    content: '我们正在开发一个创新的机器学习项目...',
    type: 'project',
    company: '创新科技有限公司',
    contact: '李四',
    contactPhone: '13900139000',
    contactEmail: 'lisi@example.com',
    status: 'published',
    isTop: false,
    viewCount: 89,
    validUntil: '2024-07-14',
    createdBy: '李四',
    createdAt: '2024-06-14 09:15:00',
    updatedAt: '2024-06-14 11:30:00',
    publishedAt: '2024-06-14 12:00:00',
    reviewedBy: '王五'
  }
];

// 初始化Mock
const initMock = () => {
  const mock = new Mock(axios, { delayResponse: 1000 });

  // 通知公告相关接口
  mock.onGet('/api/notices').reply((config) => {
    const { page = 1, pageSize = 10, keyword, category, status, startDate, endDate, isTop } = config.params || {};
    let filteredData = [...noticesList];

    // 根据参数筛选
    if (keyword) {
      filteredData = filteredData.filter(item => 
        item.title.toLowerCase().includes(keyword.toLowerCase()) || 
        item.content.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    if (category) {
      filteredData = filteredData.filter(item => item.category === category);
    }

    if (status) {
      filteredData = filteredData.filter(item => item.status === status);
    }

    if (isTop !== undefined) {
      filteredData = filteredData.filter(item => item.isTop === isTop);
    }

    if (startDate && endDate) {
      filteredData = filteredData.filter(item => {
        const createTime = dayjs(item.createdAt);
        return createTime.isAfter(dayjs(startDate)) && createTime.isBefore(dayjs(endDate).add(1, 'day'));
      });
    }

    // 分页
    const total = filteredData.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedData = filteredData.slice(start, end);

    return [200, { data: paginatedData, total, page, pageSize }];
  });

  mock.onGet(/\/api\/notices\/\d+/).reply((config) => {
    const id = parseInt(config.url?.split('/').pop() || '0');
    const notice = noticesList.find(item => item.id === id);
    
    if (notice) {
      return [200, { data: notice }];
    } else {
      return [404, { message: '通知不存在' }];
    }
  });

  mock.onPost('/api/notices').reply((config) => {
    const data = JSON.parse(config.data);
    const newId = noticesList.length > 0 ? Math.max(...noticesList.map(item => item.id)) + 1 : 1;
    
    const newNotice = {
      id: newId,
      ...data,
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      viewCount: 0,
      confirmCount: 0
    };
    
    noticesList.push(newNotice);
    return [201, { data: newNotice, message: '创建成功' }];
  });

  mock.onPut(/\/api\/notices\/\d+/).reply((config) => {
    const id = parseInt(config.url?.split('/').pop() || '0');
    const data = JSON.parse(config.data);
    const index = noticesList.findIndex(item => item.id === id);
    
    if (index !== -1) {
      noticesList[index] = {
        ...noticesList[index],
        ...data,
        updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
      };
      return [200, { data: noticesList[index], message: '更新成功' }];
    } else {
      return [404, { message: '通知不存在' }];
    }
  });

  mock.onDelete(/\/api\/notices\/\d+/).reply((config) => {
    const id = parseInt(config.url?.split('/').pop() || '0');
    const index = noticesList.findIndex(item => item.id === id);
    
    if (index !== -1) {
      noticesList.splice(index, 1);
      return [200, { message: '删除成功' }];
    } else {
      return [404, { message: '通知不存在' }];
    }
  });

  mock.onPost(/\/api\/notices\/\d+\/review/).reply((config) => {
    const id = parseInt(config.url?.split('/').pop().replace('/review', '') || '0');
    const data = JSON.parse(config.data);
    const index = noticesList.findIndex(item => item.id === id);
    
    if (index !== -1) {
      noticesList[index] = {
        ...noticesList[index],
        status: data.status,
        reviewedBy: 'manager',
        updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        publishedAt: data.status === 'published' ? dayjs().format('YYYY-MM-DD HH:mm:ss') : undefined
      };
      return [200, { data: noticesList[index], message: '审核成功' }];
    } else {
      return [404, { message: '通知不存在' }];
    }
  });

  mock.onPost(/\/api\/notices\/\d+\/toggle-top/).reply((config) => {
    const id = parseInt(config.url?.split('/').pop().replace('/toggle-top', '') || '0');
    const index = noticesList.findIndex(item => item.id === id);
    
    if (index !== -1) {
      noticesList[index] = {
        ...noticesList[index],
        isTop: !noticesList[index].isTop,
        updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
      };
      return [200, { data: noticesList[index], message: noticesList[index].isTop ? '置顶成功' : '取消置顶成功' }];
    } else {
      return [404, { message: '通知不存在' }];
    }
  });

  // 政策文件相关接口 - 类似通知公告的实现方式

  // 园区活动相关接口 - 类似通知公告的实现方式

  // 调查问卷相关接口 - 类似通知公告的实现方式

  // 需求发布相关接口 - 类似通知公告的实现方式

  return mock;
};

export default initMock; 