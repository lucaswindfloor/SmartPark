import { message } from 'antd';

// 模拟数据存储
let infoData = {
  notice: [], // 通知公告
  policy: [], // 政策文件
  activity: [], // 园区活动
  survey: [], // 调查问卷
  demands: [], // 需求发布
};

// 初始化模拟数据
const initMockData = () => {
  const mockTypes = ['notice', 'policy', 'activity', 'survey', 'demands'];
  const today = new Date();
  
  // 清空原有数据
  mockTypes.forEach(type => {
    infoData[type] = [];
  });
  
  // 生成模拟数据
  for (let type of mockTypes) {
    for (let i = 0; i < 15; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      const commonFields = {
        id: `${type}-${i}`,
        title: getDefaultTitle(type, i),
        publishDate: date.toISOString().split('T')[0],
        status: i % 3 === 0 ? '草稿' : i % 5 === 0 ? '待审核' : '已发布',
        auditStatus: i % 5 === 0 ? '待审核' : i % 7 === 0 ? '已拒绝' : '已通过',
        viewCount: Math.floor(Math.random() * 1000),
        confirmCount: Math.floor(Math.random() * 800),
        isTop: i === 0 || i === 3,
        visibleTo: i % 4 === 0 ? '全部用户' : i % 4 === 1 ? '入驻企业' : i % 4 === 2 ? '特定企业' : '管理员',
        content: `这是${getDefaultTitle(type, i)}的详细内容，包含了相关的信息...`,
        createTime: new Date(date.setHours(date.getHours() - Math.floor(Math.random() * 24))).toISOString()
      };
      
      let specificFields = {};
      
      // 根据不同类型添加特定字段
      switch (type) {
        case 'notice':
          specificFields = {
            needConfirm: i % 4 === 0,
          };
          break;
        case 'policy':
          specificFields = {
            category: i % 2 === 0 ? '财税政策' : '产业政策',
            implementDate: new Date(date.setDate(date.getDate() + 30)).toISOString().split('T')[0]
          };
          break;
        case 'activity':
          specificFields = {
            registerStartDate: date.toISOString().split('T')[0],
            registerEndDate: new Date(date.setDate(date.getDate() + 5)).toISOString().split('T')[0],
            startDate: new Date(date.setDate(date.getDate() + 2)).toISOString().split('T')[0],
            endDate: new Date(date.setDate(date.getDate() + 7)).toISOString().split('T')[0],
            location: '创新中心多功能厅',
            registerCount: Math.floor(Math.random() * 100),
            registrations: generateRegistrations(i)
          };
          break;
        case 'survey':
          specificFields = {
            startDate: date.toISOString().split('T')[0],
            endDate: new Date(date.setDate(date.getDate() + 14)).toISOString().split('T')[0],
            responses: Math.floor(Math.random() * 200),
            hasResult: i % 3 === 0,
            questions: [
              {
                id: 1, 
                title: '您对园区服务满意度如何？', 
                type: 'radio',
                options: ['非常满意', '满意', '一般', '不满意', '非常不满意'],
                results: [30, 40, 20, 7, 3]
              },
              {
                id: 2, 
                title: '您最关注园区的哪些服务？(可多选)', 
                type: 'checkbox',
                options: ['物业服务', '停车管理', '安保服务', '网络设施', '餐饮服务'],
                results: [70, 85, 45, 60, 30]
              },
              {
                id: 3, 
                title: '您对园区服务的其他建议', 
                type: 'text'
              }
            ],
            replies: generateSurveyReplies(i)
          };
          break;
        case 'demands':
          specificFields = {
            demandType: i % 3 === 0 ? '项目合作' : i % 3 === 1 ? '成果展示' : '招聘需求',
            company: `科技公司${i + 1}`,
            contact: `联系人${i + 1}`,
            phone: `1380013800${i}`
          };
          break;
      }
      
      infoData[type].push({
        ...commonFields,
        ...specificFields
      });
    }
  }
};

// 生成默认标题
const getDefaultTitle = (type, index) => {
  switch (type) {
    case 'notice':
      return `关于园区${index + 1}月份物业费缴纳的通知`;
    case 'policy':
      return `湘江科创基地企业扶持政策(${index + 1})`;
    case 'activity':
      return `园区创新创业大赛(第${index + 1}期)`;
    case 'survey':
      return `园区服务满意度调查(${index + 1})`;
    case 'demands':
      return `企业${index + 1}关于AI应用开发的合作需求`;
    default:
      return `标题${index + 1}`;
  }
};

// 生成模拟活动报名数据
const generateRegistrations = (activityIndex) => {
  const registrations = [];
  const count = Math.floor(Math.random() * 20) + 5; // 5-25人报名
  const companies = ['A企业', 'B企业', 'C企业', 'D企业', 'E企业'];
  const today = new Date();
  
  for (let i = 0; i < count; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - Math.floor(Math.random() * 5));
    date.setHours(Math.floor(Math.random() * 24));
    date.setMinutes(Math.floor(Math.random() * 60));
    
    registrations.push({
      id: `reg-${activityIndex}-${i}`,
      name: `参与者${i + 1}`,
      company: companies[Math.floor(Math.random() * companies.length)],
      phone: `1380013${(10000 + Math.floor(Math.random() * 10000)).toString()}`,
      registerTime: date.toISOString().replace('T', ' ').substring(0, 19),
      signStatus: Math.random() > 0.3 ? '已签到' : '未签到'
    });
  }
  
  return registrations;
};

// 生成模拟问卷回复数据
const generateSurveyReplies = (surveyIndex) => {
  const replies = [];
  const count = Math.floor(Math.random() * 30) + 10; // 10-40条回复
  const companies = ['A企业', 'B企业', 'C企业', 'D企业', 'E企业'];
  const today = new Date();
  
  for (let i = 0; i < count; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - Math.floor(Math.random() * 7));
    date.setHours(Math.floor(Math.random() * 24));
    date.setMinutes(Math.floor(Math.random() * 60));
    
    replies.push({
      id: i + 1,
      user: `用户${i + 1}`,
      company: companies[Math.floor(Math.random() * companies.length)],
      replyTime: date.toISOString().replace('T', ' ').substring(0, 19),
      q1: ['非常满意', '满意', '一般', '不满意', '非常不满意'][Math.floor(Math.random() * 5)],
      q2: ['物业服务', '停车管理', '网络设施'].slice(0, Math.floor(Math.random() * 3) + 1).join(','),
      q3: Math.random() > 0.5 ? '希望提升服务质量和响应速度' : ''
    });
  }
  
  return replies;
};

// 初始化数据
initMockData();

// API服务
const api = {
  // 获取列表数据
  getList: (type, params = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let result = [...infoData[type]];
        
        // 处理搜索
        if (params.searchText) {
          result = result.filter(item => 
            item.title.toLowerCase().includes(params.searchText.toLowerCase())
          );
        }
        
        // 处理状态筛选
        if (params.status) {
          result = result.filter(item => item.status === params.status);
        }
        
        // 处理公开范围筛选
        if (params.visibleTo) {
          result = result.filter(item => item.visibleTo === params.visibleTo);
        }
        
        // 处理日期范围筛选
        if (params.dateRange && params.dateRange.length === 2) {
          const startDate = new Date(params.dateRange[0]);
          const endDate = new Date(params.dateRange[1]);
          
          result = result.filter(item => {
            const itemDate = new Date(item.publishDate);
            return itemDate >= startDate && itemDate <= endDate;
          });
        }
        
        // 处理特殊筛选条件
        if (type === 'notice' && params.needConfirm !== undefined) {
          result = result.filter(item => item.needConfirm === params.needConfirm);
        }
        
        if (type === 'policy' && params.category) {
          result = result.filter(item => item.category === params.category);
        }
        
        if (type === 'demands' && params.demandType) {
          result = result.filter(item => item.demandType === params.demandType);
        }
        
        // 分页处理
        const pageSize = params.pageSize || 10;
        const current = params.current || 1;
        const total = result.length;
        const pagedResult = result.slice((current - 1) * pageSize, current * pageSize);
        
        resolve({
          data: pagedResult,
          total,
          current,
          pageSize
        });
      }, 300);
    });
  },
  
  // 获取详情
  getDetail: (type, id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const item = infoData[type].find(item => item.id === id);
        if (item) {
          resolve(item);
        } else {
          reject(new Error('未找到对应记录'));
        }
      }, 300);
    });
  },
  
  // 创建记录
  create: (type, data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const id = `${type}-${Date.now()}`;
        const newItem = {
          id,
          ...data,
          createTime: new Date().toISOString(),
          viewCount: 0,
          confirmCount: 0,
          isTop: false
        };
        
        infoData[type].unshift(newItem);
        resolve(newItem);
      }, 500);
    });
  },
  
  // 更新记录
  update: (type, id, data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = infoData[type].findIndex(item => item.id === id);
        if (index !== -1) {
          const updatedItem = {
            ...infoData[type][index],
            ...data,
            updateTime: new Date().toISOString()
          };
          infoData[type][index] = updatedItem;
          resolve(updatedItem);
        } else {
          reject(new Error('未找到对应记录'));
        }
      }, 500);
    });
  },
  
  // 删除记录
  delete: (type, id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = infoData[type].findIndex(item => item.id === id);
        if (index !== -1) {
          const deletedItem = infoData[type].splice(index, 1)[0];
          resolve(deletedItem);
        } else {
          reject(new Error('未找到对应记录'));
        }
      }, 500);
    });
  },
  
  // 批量删除
  batchDelete: (type, ids) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let count = 0;
        for (const id of ids) {
          const index = infoData[type].findIndex(item => item.id === id);
          if (index !== -1) {
            infoData[type].splice(index, 1);
            count++;
          }
        }
        resolve({ count });
      }, 500);
    });
  },
  
  // 审核
  audit: (type, id, status, remark = '') => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = infoData[type].findIndex(item => item.id === id);
        if (index !== -1) {
          const updatedItem = {
            ...infoData[type][index],
            auditStatus: status === 'approved' ? '已通过' : '已拒绝',
            auditRemark: remark,
            auditTime: new Date().toISOString()
          };
          infoData[type][index] = updatedItem;
          resolve(updatedItem);
        } else {
          reject(new Error('未找到对应记录'));
        }
      }, 500);
    });
  },
  
  // 批量审核
  batchAudit: (type, ids, status, remark = '') => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let count = 0;
        for (const id of ids) {
          const index = infoData[type].findIndex(item => item.id === id);
          if (index !== -1) {
            infoData[type][index] = {
              ...infoData[type][index],
              auditStatus: status === 'approved' ? '已通过' : '已拒绝',
              auditRemark: remark,
              auditTime: new Date().toISOString()
            };
            count++;
          }
        }
        resolve({ count });
      }, 500);
    });
  },
  
  // 发布/下架
  publish: (type, id, isPublish) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = infoData[type].findIndex(item => item.id === id);
        if (index !== -1) {
          const updatedItem = {
            ...infoData[type][index],
            status: isPublish ? '已发布' : '草稿',
            publishTime: isPublish ? new Date().toISOString() : null
          };
          infoData[type][index] = updatedItem;
          resolve(updatedItem);
        } else {
          reject(new Error('未找到对应记录'));
        }
      }, 500);
    });
  },
  
  // 批量发布
  batchPublish: (type, ids, isPublish) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let count = 0;
        const now = new Date().toISOString();
        for (const id of ids) {
          const index = infoData[type].findIndex(item => item.id === id);
          if (index !== -1 && infoData[type][index].auditStatus === '已通过') {
            infoData[type][index] = {
              ...infoData[type][index],
              status: isPublish ? '已发布' : '草稿',
              publishTime: isPublish ? now : null
            };
            count++;
          }
        }
        resolve({ count });
      }, 500);
    });
  },
  
  // 置顶/取消置顶
  setTop: (type, id, isTop) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = infoData[type].findIndex(item => item.id === id);
        if (index !== -1) {
          const updatedItem = {
            ...infoData[type][index],
            isTop
          };
          infoData[type][index] = updatedItem;
          resolve(updatedItem);
        } else {
          reject(new Error('未找到对应记录'));
        }
      }, 500);
    });
  },
  
  // 获取活动报名信息
  getActivityRegistrations: (activityId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const activity = infoData.activity.find(item => item.id === activityId);
        if (activity && activity.registrations) {
          resolve({
            data: activity.registrations,
            total: activity.registrations.length,
            activityInfo: {
              title: activity.title,
              startDate: activity.startDate,
              endDate: activity.endDate,
              location: activity.location
            }
          });
        } else {
          reject(new Error('未找到对应活动或报名信息'));
        }
      }, 300);
    });
  },
  
  // 导出报名数据（模拟）
  exportRegistrations: (activityId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const activity = infoData.activity.find(item => item.id === activityId);
        if (activity && activity.registrations) {
          // 实际项目中，这里会返回文件下载的URL或者Blob
          resolve({
            success: true,
            message: `成功导出${activity.registrations.length}条报名数据`
          });
        } else {
          reject(new Error('未找到对应活动或报名信息'));
        }
      }, 1000);
    });
  },
  
  // 更新报名签到状态
  updateSignStatus: (activityId, registrationId, signStatus) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const activity = infoData.activity.find(item => item.id === activityId);
        if (activity && activity.registrations) {
          const registration = activity.registrations.find(r => r.id === registrationId);
          if (registration) {
            registration.signStatus = signStatus;
            resolve(registration);
          } else {
            reject(new Error('未找到对应报名记录'));
          }
        } else {
          reject(new Error('未找到对应活动或报名信息'));
        }
      }, 500);
    });
  },
  
  // 发送活动短信通知（模拟）
  sendActivityNotification: (activityId, content, target) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const activity = infoData.activity.find(item => item.id === activityId);
        if (activity && activity.registrations) {
          let targetCount = 0;
          
          switch (target) {
            case 'all':
              targetCount = activity.registrations.length;
              break;
            case 'signed':
              targetCount = activity.registrations.filter(r => r.signStatus === '已签到').length;
              break;
            case 'unsigned':
              targetCount = activity.registrations.filter(r => r.signStatus === '未签到').length;
              break;
            default:
              targetCount = target.length; // 自定义选择的人数
          }
          
          resolve({
            success: true,
            message: `成功发送短信通知给${targetCount}位报名人员`
          });
        } else {
          resolve({
            success: false,
            message: '未找到对应活动或报名信息'
          });
        }
      }, 1000);
    });
  },
  
  // 获取问卷结果数据
  getSurveyResults: (surveyId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const survey = infoData.survey.find(item => item.id === surveyId);
        if (survey && survey.questions) {
          resolve({
            data: survey,
            questions: survey.questions,
            replies: survey.replies,
            summary: {
              viewCount: survey.viewCount,
              responseCount: survey.responses,
              responseRate: Math.round((survey.responses / survey.viewCount) * 100) / 100
            }
          });
        } else {
          reject(new Error('未找到对应问卷或结果信息'));
        }
      }, 300);
    });
  },
  
  // 导出问卷数据（模拟）
  exportSurveyData: (surveyId) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const survey = infoData.survey.find(item => item.id === surveyId);
        if (survey && survey.replies) {
          // 实际项目中，这里会返回文件下载的URL或者Blob
          resolve({
            success: true,
            message: `成功导出${survey.replies.length}条问卷回复数据`
          });
        } else {
          reject(new Error('未找到对应问卷或结果信息'));
        }
      }, 1000);
    });
  }
};

export default api; 