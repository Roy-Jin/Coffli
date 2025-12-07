import { useUserStore } from "@/stores/user";

// API基础URL
const BASE_URL = "https://coffli.yiiy.dpdns.org";

// 统一响应格式
interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
  results?: T[];
}

// 用户信息接口
interface User {
  user_id: string;
  nickname: string;
  last_login: number;
  role: string;
  gender: number;
  reg_time: number;
  active: boolean;
  avatar: boolean;
  info: string;
}

// 登录响应
interface LoginResponse {
  user: User;
  token: string;
}

// 博客接口
interface Blog {
  id: number;
  user_id: string;
  title: string;
  content: string;
  created_at: number;
}

class APIClient {
  private baseUrl: string;
  private userStore: ReturnType<typeof useUserStore>;

  constructor() {
    this.baseUrl = BASE_URL;
    this.userStore = useUserStore();
  }

  // 获取认证头信息
  private async getAuthHeaders(): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // 添加认证头信息
    const userId = this.userStore.getUserId;
    const token = this.userStore.getToken;

    if (userId && token) {
      headers["X-User-Id"] = userId;
      headers["Authorization"] = token;
    }

    return headers;
  }

  // 基础请求方法
  private async request<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const url = new URL(path, this.baseUrl);
    const authHeaders = await this.getAuthHeaders();

    const response = await fetch(url.toString(), {
      ...options,
      headers: {
        ...authHeaders,
        ...options.headers,
      },
    });

    try {
      const data = await response.json();
      return {
        code: response.status,
        message: data.message || "Request completed",
        data: data.data,
        results: data.results,
      };
    } catch (error) {
      return {
        code: response.status,
        message: "Failed to parse response",
        data: null as any,
      };
    }
  }

  // GET请求
  async get<T>(
    path: string,
    params?: Record<string, string>,
  ): Promise<ApiResponse<T>> {
    const url = new URL(path, this.baseUrl);
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== undefined) {
          url.searchParams.append(key, params[key]);
        }
      });
    }
    return this.request<T>(url.pathname + url.search);
  }

  // POST请求
  async post<T>(path: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(path, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // ========== 用户管理接口 ==========

  // 用户注册
  async register(userData: {
    user_id: string;
    password: string;
    nickname?: string;
  }): Promise<ApiResponse> {
    return this.post("/user/register", userData);
  }

  // 用户登录
  async login(credentials: {
    id: string;
    password: string;
  }): Promise<ApiResponse<LoginResponse>> {
    const response = await this.post<LoginResponse>("/user/login", credentials);

    if (response.code === 200 && response.data) {
      this.userStore.setUser(response.data.user);
      this.userStore.setToken(response.data.token);
    }

    return response;
  }

  // 用户登出
  async logout(): Promise<ApiResponse> {
    const response = await this.post("/user/logout");

    if (response.code === 200) {
      this.userStore.clearAuth();
    }

    return response;
  }

  // 获取用户信息
  async getUserInfo(userId: string): Promise<ApiResponse<User>> {
    return this.get<User>("/user/get", { id: userId });
  }

  // 获取用户头像
  async getUserAvatar(userId: string): Promise<ApiResponse<string>> {
    return this.get<string>("/user/avatar", { id: userId });
  }

  // 上传用户头像
  async uploadAvatar(avatarData: string): Promise<ApiResponse> {
    return this.post("/user/avatar", { avatar: avatarData });
  }

  // ========== 博客管理接口 ==========

  // 获取博客
  async getBlog(blogId: string): Promise<ApiResponse<Blog>> {
    return this.get<Blog>("/blog/get", { id: blogId });
  }

  // 创建博客
  async createBlog(blogData: {
    title: string;
    content: string;
  }): Promise<ApiResponse> {
    return this.post("/blog/create", blogData);
  }

  // 删除博客
  async deleteBlog(blogId: string): Promise<ApiResponse> {
    return this.post("/blog/delete", { blog_id: blogId });
  }

  // 健康检查
  async healthCheck(): Promise<ApiResponse<string>> {
    return this.get<string>("/");
  }
}

// 创建单例实例
const apiClient = new APIClient();

export default apiClient;
