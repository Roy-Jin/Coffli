import { useUserStore } from './stores/user'

// 创建兼容性store，适配示例代码中的store.get()方法
class Store {
  constructor() {
    this.userStore = useUserStore()
  }

  async get(key) {
    if (key === 'user') {
      return this.userStore.getUser
    } else if (key === 'token') {
      return this.userStore.getToken
    } else if (key === 'user_id') {
      return this.userStore.getUserId
    }
    return null
  }

  // 可选：添加其他兼容方法
  set(key, value) {
    if (key === 'user') {
      this.userStore.setUser(value)
    } else if (key === 'token') {
      this.userStore.setToken(value)
    }
  }

  clear() {
    this.userStore.clearAuth()
  }
}

// 创建单例实例
const store = new Store()

export default store
