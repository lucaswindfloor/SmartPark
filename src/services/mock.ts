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

// 添加通知公告模拟数据
// 通知公告模拟数据
export const mockNotices = [
  {
    id: 1,
    title: '园区安全管理规定更新通知',
    content: '<p>各位园区企业及员工：</p><p>为了进一步加强园区安全管理，提升安全防范意识，园区管理委员会特更新发布《智慧园区安全管理规定》，自2023年6月1日起施行。主要更新内容包括：</p><ol><li>消防安全管理细则</li><li>门禁管理要求</li><li>视频监控系统使用规范</li><li>应急预案优化</li></ol><p>请各企业负责人认真学习并传达至所有员工，确保全员知晓并严格遵守。</p><p>特此通知。</p>',
    category: 'important',
    publicRange: ['enterprise', 'employee'],
    status: 'published',
    isTop: true,
    requireConfirmation: true,
    confirmCount: 245,
    viewCount: 389,
    createdBy: '园区管理员',
    createdAt: '2023-05-20T08:30:00.000Z',
    updatedAt: '2023-05-25T10:15:00.000Z',
    publishedAt: '2023-05-25T10:15:00.000Z',
    reviewedBy: '安全主管',
  },
  {
    id: 2,
    title: '6月份园区文化活动预告',
    content: '<p>亲爱的园区伙伴们：</p><p>为丰富园区文化生活，增强园区企业凝聚力，6月份我们将举办以下活动：</p><ol><li>6月9日 15:00-17:00 创新沙龙（A栋多功能厅）</li><li>6月16日 10:00-12:00 健康讲座（B栋报告厅）</li><li>6月23日 全天 户外拓展活动（详见报名通知）</li><li>6月30日 19:00-21:00 露天电影之夜（园区中央广场）</li></ol><p>欢迎大家积极参与！</p>',
    category: 'notice',
    publicRange: ['enterprise', 'employee', 'public'],
    status: 'published',
    isTop: false,
    requireConfirmation: false,
    confirmCount: 0,
    viewCount: 278,
    createdBy: '文化专员',
    createdAt: '2023-05-28T14:20:00.000Z',
    updatedAt: '2023-05-29T09:10:00.000Z',
    publishedAt: '2023-05-29T09:10:00.000Z',
    reviewedBy: '文化主管',
  },
  {
    id: 3,
    title: '园区充电桩设施升级公告',
    content: '<p>尊敬的园区用户：</p><p>为响应国家绿色出行政策，提升园区智慧化水平，我们将于近期对园区充电桩设施进行全面升级。升级内容包括：</p><ol><li>增加快充桩数量，由原来的10个增至25个</li><li>升级充电管理系统，支持手机APP预约</li><li>优化计费模式，引入会员折扣</li><li>增设充电状态实时监控</li></ol><p>升级工作预计在6月15日至6月20日进行，期间部分充电桩将暂停使用。给您带来的不便，敬请谅解。</p><p>特此公告。</p>',
    category: 'announcement',
    publicRange: ['enterprise', 'employee'],
    status: 'pending',
    isTop: false,
    requireConfirmation: false,
    confirmCount: 0,
    viewCount: 0,
    createdBy: '设施管理员',
    createdAt: '2023-06-01T11:05:00.000Z',
    updatedAt: '2023-06-01T11:05:00.000Z',
  },
  {
    id: 4,
    title: '防疫工作重要通知',
    content: '<p>各位园区企业及员工：</p><p>近期周边地区疫情形势有所变化，为保障全体人员健康安全，园区决定采取以下防疫措施：</p><ol><li>所有入园人员须出示健康码和行程码</li><li>非必要不离开本市区域</li><li>公共区域每日消毒次数增加至3次</li><li>鼓励企业采取弹性工作制或远程办公</li></ol><p>以上措施自即日起执行，解除时间另行通知。</p><p>感谢您的理解与配合！</p>',
    category: 'important',
    publicRange: ['enterprise', 'employee', 'public'],
    status: 'draft',
    isTop: false,
    requireConfirmation: true,
    confirmCount: 0,
    viewCount: 0,
    createdBy: '防疫工作组',
    createdAt: '2023-06-02T16:40:00.000Z',
    updatedAt: '2023-06-02T16:40:00.000Z',
  },
  {
    id: 5,
    title: '园区餐厅服务调整通知',
    content: '<p>尊敬的园区用户：</p><p>为提升就餐体验，园区中央餐厅将进行为期两周的设备更新和环境优化工程，具体安排如下：</p><ol><li>施工时间：6月10日至6月24日</li><li>施工期间，一楼餐厅暂停营业</li><li>二楼咖啡厅正常营业，并增设临时简餐区</li><li>园区西南角美食广场各商户正常营业</li></ol><p>施工期间噪音可能会对周边办公环境造成一定影响，我们将尽量控制施工时间，减少干扰。</p><p>感谢您的理解与支持！</p>',
    category: 'notice',
    publicRange: ['enterprise', 'employee'],
    status: 'rejected',
    isTop: false,
    requireConfirmation: false,
    confirmCount: 0,
    viewCount: 3,
    createdBy: '后勤主管',
    createdAt: '2023-05-30T09:25:00.000Z',
    updatedAt: '2023-05-31T14:10:00.000Z',
    reviewedBy: '园区主任',
    rejectReason: '餐厅调整计划尚未最终确定，请与餐饮服务商确认后再发布。',
  }
];

// 模拟API处理函数
export const mockApi = {
  // ... 其他模拟API ...
  
  // 通知公告API
  getNotices: (params: any) => {
    console.log('Mock API - 获取通知列表', params);
    
    let filteredNotices = [...mockNotices];
    
    // 关键词过滤
    if (params.keyword) {
      const keyword = params.keyword.toLowerCase();
      filteredNotices = filteredNotices.filter(notice => 
        notice.title.toLowerCase().includes(keyword) || 
        notice.content.toLowerCase().includes(keyword)
      );
    }
    
    // 状态过滤
    if (params.status) {
      filteredNotices = filteredNotices.filter(notice => notice.status === params.status);
    }
    
    // 类别过滤
    if (params.category) {
      filteredNotices = filteredNotices.filter(notice => notice.category === params.category);
    }
    
    // 日期范围过滤
    if (params.start_date) {
      const startDate = new Date(params.start_date);
      filteredNotices = filteredNotices.filter(notice => new Date(notice.createdAt) >= startDate);
    }
    
    if (params.end_date) {
      const endDate = new Date(params.end_date);
      filteredNotices = filteredNotices.filter(notice => new Date(notice.createdAt) <= endDate);
    }
    
    // 计算分页
    const page = params.page || 1;
    const pageSize = params.page_size || 10;
    const total = filteredNotices.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedNotices = filteredNotices.slice(start, end);
    
    return {
      data: {
        data: paginatedNotices,
        total,
        page,
        pageSize
      }
    };
  },
  
  getNoticeById: (id: number) => {
    console.log('Mock API - 获取通知详情', id);
    const notice = mockNotices.find(item => item.id === id);
    if (notice) {
      return { data: notice };
    }
    return { status: 404, message: '通知不存在' };
  },
  
  createNotice: (data: any) => {
    console.log('Mock API - 创建通知', data);
    // 生成新ID
    const newId = Math.max(...mockNotices.map(n => n.id)) + 1;
    // 创建新通知
    const newNotice = {
      id: newId,
      ...data,
      status: 'draft',
      viewCount: 0,
      confirmCount: 0,
      createdBy: '当前用户',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockNotices.push(newNotice as any);
    return { data: newNotice, message: '创建成功' };
  },
  
  updateNotice: (id: number, data: any) => {
    console.log('Mock API - 更新通知', id, data);
    const index = mockNotices.findIndex(item => item.id === id);
    if (index !== -1) {
      // 更新通知
      const updatedNotice = {
        ...mockNotices[index],
        ...data,
        updatedAt: new Date().toISOString()
      };
      mockNotices[index] = updatedNotice;
      return { data: updatedNotice, message: '更新成功' };
    }
    return { status: 404, message: '通知不存在' };
  },
  
  deleteNotice: (id: number) => {
    console.log('Mock API - 删除通知', id);
    const index = mockNotices.findIndex(item => item.id === id);
    if (index !== -1) {
      mockNotices.splice(index, 1);
      return { message: '删除成功' };
    }
    return { status: 404, message: '通知不存在' };
  },
  
  reviewNotice: (id: number, data: any) => {
    console.log('Mock API - 审核通知', id, data);
    const index = mockNotices.findIndex(item => item.id === id);
    if (index !== -1) {
      // 更新审核状态
      mockNotices[index] = {
        ...mockNotices[index],
        status: data.status,
        reviewedBy: '当前审核员',
        rejectReason: data.status === 'rejected' ? data.reason : undefined,
        publishedAt: data.status === 'published' ? new Date().toISOString() : mockNotices[index].publishedAt,
        updatedAt: new Date().toISOString()
      };
      return { data: mockNotices[index], message: data.status === 'published' ? '发布成功' : '拒绝成功' };
    }
    return { status: 404, message: '通知不存在' };
  },
  
  toggleNoticeTop: (id: number) => {
    console.log('Mock API - 置顶通知', id);
    const index = mockNotices.findIndex(item => item.id === id);
    if (index !== -1) {
      // 切换置顶状态
      mockNotices[index].isTop = !mockNotices[index].isTop;
      mockNotices[index].updatedAt = new Date().toISOString();
      return { data: mockNotices[index], message: mockNotices[index].isTop ? '置顶成功' : '取消置顶成功' };
    }
    return { status: 404, message: '通知不存在' };
  },
  
  confirmNotice: (id: number) => {
    console.log('Mock API - 确认通知', id);
    const index = mockNotices.findIndex(item => item.id === id);
    if (index !== -1) {
      // 增加确认数
      mockNotices[index].confirmCount += 1;
      return { message: '确认成功' };
    }
    return { status: 404, message: '通知不存在' };
  }
};

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