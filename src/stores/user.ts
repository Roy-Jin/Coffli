import { defineStore } from 'pinia'

interface UserInfo {
  user_id: string
  nickname: string
  last_login: number
  role: string
  gender: number
  reg_time: number
  active: boolean
  avatar: boolean
  info: string
}

interface UserState {
  user: UserInfo | null
  token: string | null
  isAuthenticated: boolean
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
    token: null,
    isAuthenticated: false
  }),
  
  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    isLoggedIn: (state) => state.isAuthenticated,
    getUserId: (state) => state.user?.user_id
  },
  
  actions: {
    setUser(user: UserInfo) {
      this.user = user
      this.isAuthenticated = true
    },
    
    setToken(token: string) {
      this.token = token
    },
    
    clearAuth() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
    },
    
    async get(key: 'user' | 'token'): Promise<any> {
      if (key === 'user') {
        return this.user
      } else if (key === 'token') {
        return this.token
      }
      return null
    }
  },
  
  persist: {
    key: 'coffli-user',
    storage: localStorage
  }
})
