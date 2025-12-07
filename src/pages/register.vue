<template>
  <div class="register-page">
    <!-- 使用Header组件 -->
    <Header />

    <!-- 注册内容区域 -->
    <div class="register-content">
      <div class="register-container">
        <!-- 注册卡片 -->
        <div class="register-card">
          <div class="register-card-header">
            <h1 class="register-title">{{ $t('register.title') }}</h1>
            <p class="register-subtitle">{{ $t('register.subtitle') }}</p>
          </div>

          <div class="register-form">
            <!-- 用户ID输入 -->
            <div class="form-group">
              <label for="userId" class="form-label">
                <i class="form-icon fas fa-user"></i>
                {{ $t('register.userId') }}
              </label>
              <input id="userId" v-model="form.userId" type="text" class="form-input"
                :placeholder="$t('register.userIdPlaceholder')" required />
            </div>

            <!-- 密码输入 -->
            <div class="form-group">
              <label for="password" class="form-label">
                <i class="form-icon fas fa-lock"></i>
                {{ $t('register.password') }}
              </label>
              <input id="password" v-model="form.password" type="password" class="form-input"
                :placeholder="$t('register.passwordPlaceholder')" required />
            </div>

            <!-- 确认密码输入 -->
            <div class="form-group">
              <label for="confirmPassword" class="form-label">
                <i class="form-icon fas fa-lock"></i>
                {{ $t('register.confirmPassword') }}
              </label>
              <input id="confirmPassword" v-model="form.confirmPassword" type="password" class="form-input"
                :placeholder="$t('register.confirmPasswordPlaceholder')" required />
            </div>

            <!-- 注册按钮 -->
            <button type="button" class="register-btn" :disabled="isLoading" @click="handleRegister">
              <i class="btn-icon fas fa-user-plus"></i>
              {{ isLoading ? '注册中...' : $t('register.registerButton') }}
            </button>

            <!-- 登录链接 -->
            <div class="login-section">
              <p class="login-text">{{ $t('register.haveAccount') }}</p>
              <a @click="navigateToLogin" class="login-link" style="cursor: pointer;">{{ $t('register.loginLink') }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import Header from '../components/useHeader.vue'
import apiClient from '../api/index'

const router = useRouter()

// 注入全局Modal方法
const modal = inject('modal') as {
  showToast: (options: any) => void
  hideToast: () => void
  showModal: (options: any) => void
  hideModal: () => void
}

// 表单数据
const form = ref({
  userId: '',
  password: '',
  confirmPassword: ''
})

// 加载状态
const isLoading = ref(false)

// 显示错误消息
const showError = (message: string, type: string = 'error') => {
  modal?.showToast({
    type,
    title: type === 'error' ? '错误' : type === 'warning' ? '警告' : '提示',
    message,
    duration: 5000
  })
}

// 注册处理函数
const handleRegister = async () => {
  // 表单验证
  if (!form.value.userId.trim()) {
    showError('请输入用户ID', 'warning')
    return
  }

  if (!form.value.password.trim()) {
    showError('请输入密码', 'warning')
    return
  }

  if (!form.value.confirmPassword.trim()) {
    showError('请确认密码', 'warning')
    return
  }

  if (form.value.password !== form.value.confirmPassword) {
    showError('密码和确认密码不匹配', 'error')
    return
  }

  if (form.value.userId.length < 3) {
    showError('用户ID至少需要3个字符', 'warning')
    return
  }

  if (form.value.password.length < 6) {
    showError('密码至少需要6个字符', 'warning')
    return
  }

  isLoading.value = true

  try {
    const response = await apiClient.register({
      user_id: form.value.userId.trim(),
      password: form.value.password.trim()
    })

    if (response.code === 200) {
      // 注册成功，显示成功消息并跳转到登录页面
      modal?.showToast({
        type: 'success',
        title: '注册成功',
        message: '正在跳转到登录页面...',
        duration: 2000
      })
      
      setTimeout(() => {
        router.replace('/login')
      }, 1000)
    } else {
      showError(response.message || '注册失败，请稍后重试')
    }
  } catch (error) {
    console.error('注册错误:', error)
    showError('网络错误，请稍后重试')
  } finally {
    isLoading.value = false
  }
}

// 导航到登录页面
const navigateToLogin = () => {
  router.replace('/login')
}
</script>

<style scoped>
.register-page {
  display: flex;
  flex-direction: column;
}

.register-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: safe center;
  padding: 2rem 1rem;
  position: relative;
  z-index: 1;
  background: radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
}

.register-container {
  width: 100%;
  max-width: 440px;
}

.register-card {
  background: var(--gradient-card);
  border: var(--border-light);
  border-radius: 1rem;
  padding: 2.5rem;
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
}

.register-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
  border-color: rgba(255, 255, 255, 0.2);
}

.register-card-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.register-title {
  font-size: 2.25rem;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
  font-weight: 600;
  background: linear-gradient(135deg, var(--text-primary) 0%, var(--theme-color) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.register-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.form-icon {
  color: var(--theme-color);
  font-size: 0.9rem;
  width: 16px;
}

.btn-icon {
  font-size: 0.9rem;
}

.login-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 2rem;
}

.login-text {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .register-content {
    padding: 1.5rem 1rem;
    min-height: calc(100vh - 70px);
  }

  .register-card {
    padding: 2rem;
    margin: 0;
  }

  .register-title {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .register-card {
    padding: 1.5rem;
  }

  .register-title {
    font-size: 1.75rem;
  }

  .register-subtitle {
    font-size: 1rem;
  }
}
</style>
