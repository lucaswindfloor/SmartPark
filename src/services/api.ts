import axios from 'axios';

// 创建API实例
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 从localStorage获取token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  response => {
    return response.data;
  },
  error => {
    // 统一处理错误
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        // 未授权，跳转到登录页
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// 信息公开API
export const informationApi = {
  // 通知公告
  getNotices: (params: any) => api.get('/notices', { params }),
  getNoticeById: (id: number) => api.get(`/notices/${id}`),
  createNotice: (data: any) => {
    console.log('创建通知API请求数据:', data);
    return api.post('/notices', data)
      .then(response => {
        console.log('创建通知API响应:', response);
        return response;
      })
      .catch(error => {
        console.error('创建通知API错误:', error.response ? error.response.data : error.message);
        throw error;
      });
  },
  updateNotice: (id: number, data: any) => api.put(`/notices/${id}`, data),
  deleteNotice: (id: number) => api.delete(`/notices/${id}`),
  reviewNotice: (id: number, data: any) => api.post(`/notices/${id}/review`, data),
  toggleNoticeTop: (id: number) => api.post(`/notices/${id}/toggle-top`),
  
  // 政策文件
  getPolicies: (params: any) => api.get('/policies', { params }),
  getPolicyById: (id: number) => api.get(`/policies/${id}`),
  createPolicy: (data: any) => api.post('/policies', data),
  updatePolicy: (id: number, data: any) => api.put(`/policies/${id}`, data),
  deletePolicy: (id: number) => api.delete(`/policies/${id}`),
  reviewPolicy: (id: number, data: any) => api.post(`/policies/${id}/review`, data),
  togglePolicyTop: (id: number) => api.post(`/policies/${id}/toggle-top`),
  uploadPolicyFile: (data: FormData) => api.post('/upload/policy-file', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // 园区活动
  getActivities: (params: any) => api.get('/activities', { params }),
  getActivityById: (id: number) => api.get(`/activities/${id}`),
  createActivity: (data: any) => api.post('/activities', data),
  updateActivity: (id: number, data: any) => api.put(`/activities/${id}`, data),
  deleteActivity: (id: number) => api.delete(`/activities/${id}`),
  reviewActivity: (id: number, data: any) => api.post(`/activities/${id}/review`, data),
  toggleActivityTop: (id: number) => api.post(`/activities/${id}/toggle-top`),
  getActivityParticipants: (id: number) => api.get(`/activities/${id}/participants`),
  uploadActivityImage: (data: FormData) => api.post('/upload/activity-image', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // 调查问卷
  getSurveys: (params: any) => api.get('/surveys', { params }),
  getSurveyById: (id: number) => api.get(`/surveys/${id}`),
  createSurvey: (data: any) => api.post('/surveys', data),
  updateSurvey: (id: number, data: any) => api.put(`/surveys/${id}`, data),
  deleteSurvey: (id: number) => api.delete(`/surveys/${id}`),
  publishSurvey: (id: number, data: any) => api.post(`/surveys/${id}/publish`, data),
  getSurveyStats: (id: number) => api.get(`/surveys/${id}/stats`),
  getSurveyResponses: (id: number) => api.get(`/surveys/${id}/responses`),
  
  // 需求发布
  getDemands: (params: any) => api.get('/demands', { params }),
  getDemandById: (id: number) => api.get(`/demands/${id}`),
  createDemand: (data: any) => api.post('/demands', data),
  updateDemand: (id: number, data: any) => api.put(`/demands/${id}`, data),
  deleteDemand: (id: number) => api.delete(`/demands/${id}`),
  reviewDemand: (id: number, data: any) => api.post(`/demands/${id}/review`, data),
  toggleDemandTop: (id: number) => api.post(`/demands/${id}/toggle-top`),
};

export default api; 