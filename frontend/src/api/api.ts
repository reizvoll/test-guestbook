import axios from "axios";
import Router from "next/router";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const API = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    withCredentials: true,
    validateStatus: status => status < 500,
    headers: {
        "Content-Type": "application/json",
    },
});

// 인증 관련 API
export const authApi = {
  login: (email: string, password: string) => 
    API.post('/api/auth/login', { email, password }),
  register: (email: string, password: string, nickname: string) => 
    API.post('/api/auth/register', { email, password, nickname }),
  logout: () => API.post('/api/auth/logout'),
  getProfile: () => API.get('/api/auth/profile'),
};

// 콘텐츠 관련 API
export const contentsApi = {
  getContents: () => API.get('/api/guestbook/contents'),
  getContent: (id: number) => API.get(`/api/guestbook/contents/${id}`),
  createContent: (data: any) => API.post('/api/guestbook/contents', data),
  updateContent: (id: number, data: any) => API.put(`/api/guestbook/contents/${id}`, data),
  deleteContent: (id: number) => API.delete(`/api/guestbook/contents/${id}`),
};

// 방명록 관련 API
export const guestbookApi = {
  getGuestbooks: () => API.get('/api/guestbook'),
  createGuestbook: (data: { contents: string; user_id: number; user_nickname: string }) => 
    API.post('/api/guestbook', data),
  updateGuestbook: (id: number, data: { contents: string }) => 
    API.put(`/api/guestbook/${id}`, data),
  deleteGuestbook: (id: number) => API.delete(`/api/guestbook/${id}`),
};

// 좋아요 관련 API
export const likesApi = {
  updateLike: (id: number, user_id: number) => API.put(`/api/likes/${id}`, { user_id, action: 'like' }),
  updateUnlike: (id: number, user_id: number) => API.put(`/api/likes/${id}`, { user_id, action: 'unlike' }),
};

// 요청 인터셉터 - 토큰 추가
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 에러 처리
API.interceptors.response.use(
  (response) => {
    console.log('Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      Router.push('/sign-in');
    }
    return Promise.reject(error);
  }
);

export default API;
