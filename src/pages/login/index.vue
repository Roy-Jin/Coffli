<template>
  <div class="login-page">
    <!-- 使用Header组件 -->
    <Header />

    <!-- 登录内容区域 -->
    <div class="login-content">
      <div class="login-container">
        <!-- 登录卡片 -->
        <div class="login-card">
          <div class="login-card-header">
            <h1 class="login-title">{{ $t('login.title') }}</h1>
            <p class="login-subtitle">{{ $t('login.subtitle') }}</p>
          </div>

          <div class="login-form">
            <!-- 用户ID输入 -->
            <div class="form-group">
              <label for="userId" class="form-label">
                <i class="form-icon fas fa-user"></i>
                {{ $t('login.username') }}
              </label>
              <input id="userId" v-model="form.userId" type="text" class="form-input"
                :placeholder="$t('login.usernamePlaceholder')" required />
            </div>

            <!-- 密码输入 -->
            <div class="form-group">
              <label for="password" class="form-label">
                <i class="form-icon fas fa-lock"></i>
                {{ $t('login.password') }}
              </label>
              <input id="password" v-model="form.password" type="password" class="form-input"
                :placeholder="$t('login.passwordPlaceholder')" required />
            </div>

            <!-- 登录按钮 -->
            <button type="button" class="login-btn" :disabled="isLoading" @click="handleLogin">
              <i class="btn-icon fas fa-sign-in-alt"></i>
              {{ isLoading ? '登录中...' : $t('login.loginButton') }}
            </button>

            <!-- 注册链接 -->
            <div class="register-section">
              <p class="register-text">{{ $t('login.noAccount') }}</p>
              <a @click="navigateToRegister" class="register-link" style="cursor: pointer;">{{ $t('login.registerLink')
              }}</a>
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
import { useI18n } from 'vue-i18n'
import Header from '@/components/useHeader.vue'
import apiClient from '@/api/index'

const router = useRouter()
const { t } = useI18n()

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
  password: ''
})

// 加载状态
const isLoading = ref(false)

// 显示错误消息
const showError = (message: string, type: string = 'error') => {
  modal?.showToast({
    type,
    title: type === 'error' ? t('modal.error') : type === 'warning' ? t('modal.warning') : t('modal.info'),
    message,
    duration: 5000
  })
}

// 登录处理函数
const handleLogin = async () => {
  // 表单验证
  if (!form.value.userId.trim()) {
    showError(t('login.validation.userIdRequired'), 'warning')
    return
  }

  if (!form.value.password.trim()) {
    showError(t('login.validation.passwordRequired'), 'warning')
    return
  }

  isLoading.value = true

  try {
    const response = await apiClient.login({
      id: form.value.userId.trim(),
      password: form.value.password.trim()
    })

    if (response.code === 200) {
      // 登录成功，显示成功消息并跳转到首页
      modal?.showToast({
        type: 'success',
        title: t('modal.success'),
        message: t('login.successMessage')
      })

      router.replace('/')
    } else {
      showError(response.message || t('login.validation.loginFailed'))
    }
  } catch (error) {
    console.error('登录错误:', error)
    showError(t('login.validation.networkError'))
  } finally {
    isLoading.value = false
  }
}

// 导航到注册页面
const navigateToRegister = () => {
  router.replace('/register')
}
</script>

<style scoped>
.login-page {
  display: flex;
  flex-direction: column;
}

.login-content {
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

.login-container {
  width: 100%;
  max-width: 440px;
}

.login-card {
  background: var(--gradient-card);
  border: var(--border-light);
  border-radius: 1rem;
  padding: 2.5rem;
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
}

.login-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
  border-color: rgba(255, 255, 255, 0.2);
}

.login-card-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.login-title {
  font-size: 2.25rem;
  color: var(--text-primary);
  margin-bottom: 0.75rem;
  font-weight: 600;
  background: linear-gradient(135deg, var(--text-primary) 0%, var(--theme-color) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.login-form {
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

.register-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 2rem;
}

.register-text {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin: 0;
}

.error-message {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.error-message i {
  font-size: 0.8rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-content {
    padding: 1.5rem 1rem;
    min-height: calc(100vh - 70px);
  }

  .login-card {
    padding: 2rem;
    margin: 0;
  }

  .login-title {
    font-size: 2rem;
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 1.5rem;
  }

  .login-title {
    font-size: 1.75rem;
  }

  .login-subtitle {
    font-size: 1rem;
  }
}
</style>
