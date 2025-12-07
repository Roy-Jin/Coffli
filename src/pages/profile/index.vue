<template>
  <div class="profile-page">
    <Header />

    <main class="main-content">
      <div class="container">
        <!-- 用户信息卡片 -->
        <div class="profile-card card card-lg">
          <!-- 头像区域 -->
          <div class="avatar-section">
            <div class="avatar-container">
              <img :src="userAvatar" alt="User Avatar" class="avatar" />
            </div>
            <h1 class="username text-gradient">{{ userInfo.nickname || userInfo.user_id }}</h1>
            <p class="user-id">@{{ userInfo.user_id }}</p>
          </div>

          <!-- 基本信息 -->
          <div class="info-section">
            <h2 class="section-title">{{ $t('profile.basicInfo') }}</h2>
            <div class="info-grid">
              <div class="info-item">
                <label class="info-label">{{ $t('profile.role') }}:</label>
                <span class="info-value">{{ userInfo.role }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">{{ $t('profile.gender') }}:</label>
                <span class="info-value">{{ getGenderText(userInfo.gender) }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">{{ $t('profile.status') }}:</label>
                <span class="info-value" :class="{ 'active': userInfo.active, 'inactive': !userInfo.active }">
                  {{ userInfo.active ? $t('profile.active') : $t('profile.inactive') }}
                </span>
              </div>
              <div class="info-item">
                <label class="info-label">{{ $t('profile.registrationTime') }}:</label>
                <span class="info-value">{{ formatTime(userInfo.reg_time) }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">{{ $t('profile.lastLogin') }}:</label>
                <span class="info-value">{{ formatTime(userInfo.last_login) }}</span>
              </div>
            </div>
          </div>

          <!-- 额外信息 -->
          <div v-if="hasAdditionalInfo" class="info-section">
            <h2 class="section-title">{{ $t('profile.additionalInfo') }}</h2>
            <div class="info-grid">
              <div v-if="extraInfo.email" class="info-item">
                <label class="info-label">{{ $t('profile.email') }}:</label>
                <span class="info-value">{{ extraInfo.email }}</span>
              </div>
              <div v-if="extraInfo.phone" class="info-item">
                <label class="info-label">{{ $t('profile.phone') }}:</label>
                <span class="info-value">{{ extraInfo.phone }}</span>
              </div>
              <div v-if="extraInfo.birthday" class="info-item">
                <label class="info-label">{{ $t('profile.birthday') }}:</label>
                <span class="info-value">{{ extraInfo.birthday }}</span>
              </div>
              <div v-if="extraInfo.bio" class="info-item">
                <label class="info-label">{{ $t('profile.bio') }}:</label>
                <span class="info-value">{{ extraInfo.bio }}</span>
              </div>
            </div>
          </div>

          <!-- 操作按钮区域 -->
          <div class="action-section">
            <button class="back-btn button" @click="goBack">
              <i class="fas fa-arrow-left"></i>
              {{ $t('profile.back') }}
            </button>
            <button class="edit-btn button" @click="handleEdit">
              <i class="fas fa-edit"></i>
              {{ $t('profile.edit') }}
            </button>
            <button class="logout-btn button" @click="handleLogout">
              <i class="fas fa-sign-out-alt"></i>
              {{ $t('profile.logout') }}
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import apiClient from '@/api/index'
import Header from '@/components/useHeader.vue'
import defaultAvatar from '@/assets/icon.png'

const router = useRouter()
const { t } = useI18n()
const userStore = useUserStore()
const loading = ref(false)

// 注入全局Modal方法
const modal = inject('modal') as {
  showToast: (options: any) => void
  hideToast: () => void
  showModal: (options: any) => void
  hideModal: () => void
}

// 用户信息
const userInfo = computed(() => userStore.user || {
  user_id: '',
  nickname: '',
  last_login: 0,
  role: 'USER',
  gender: 3,
  reg_time: 0,
  active: true,
  avatar: false,
  info: '{"ip": "", "email": "", "phone": "", "birthday": "", "bio": ""}'
})

// 用户头像
const userAvatar = computed(() => {
  if (userInfo.value.avatar && userInfo.value.user_id) {
    return `/api/user/avatar?id=${userInfo.value.user_id}`
  }
  return defaultAvatar
})

// 解析额外信息
const extraInfo = computed(() => {
  try {
    return JSON.parse(userInfo.value.info)
  } catch {
    return {
      ip: '',
      email: '',
      phone: '',
      birthday: '',
      bio: ''
    }
  }
})

// 检查是否有额外信息
const hasAdditionalInfo = computed(() => {
  const info = extraInfo.value
  return info.email || info.phone || info.birthday || info.bio
})

// 格式化时间
const formatTime = (timestamp: number) => {
  if (!timestamp) return t('profile.unknown')
  return new Date(timestamp).toLocaleString()
}

// 获取性别文本
const getGenderText = (gender: number) => {
  const genderMap = {
    1: t('profile.male'),
    2: t('profile.female'),
    3: t('profile.unknown')
  }
  return genderMap[gender as keyof typeof genderMap] || t('profile.unknown')
}

// 返回上一页
const goBack = () => {
  router.replace('/')
}

// 编辑用户信息
const handleEdit = () => {
  router.replace('/profile/edit')
}

// 获取用户信息
const fetchUserInfo = async () => {
  if (!userStore.isLoggedIn || !userStore.getUserId) return

  loading.value = true
  try {
    const response = await apiClient.getUserInfo(userStore.getUserId)
    if (response.code === 200 && response.data) {
      userStore.setUser(response.data)
    }
  } catch (error) {
    console.error('Failed to fetch user info:', error)
  } finally {
    loading.value = false
  }
}

// 退出登录
const handleLogout = async () => {
  // 显示确认对话框
  modal?.showModal({
    type: 'confirm',
    title: t('confirmation.logoutTitle'),
    message: t('confirmation.logoutMessage'),
    confirmText: t('confirmation.confirm'),
    cancelText: t('confirmation.cancel'),
    onConfirm: async () => {
      loading.value = true

      try {
        const response = await apiClient.logout()

        if (response.code === 200) {
          // 显示成功消息
          modal?.showToast({
            type: 'success',
            title: t('modal.success'),
            message: t('profile.logoutSuccess')
          })

          // 跳转到登录页面
          router.replace('/login')
        } else {
          modal?.showToast({
            type: 'error',
            title: t('modal.error'),
            message: response.message || t('profile.logoutFailed'),
            duration: 5000
          })
        }
      } catch (error) {
        console.error('退出登录错误:', error)
        modal?.showToast({
          type: 'error',
          title: t('modal.error'),
          message: t('profile.networkError'),
          duration: 5000
        })
      } finally {
        loading.value = false
      }
    },
    onCancel: () => {
      // 用户取消，不执行任何操作
    }
  })
}

onMounted(() => {
  // 如果没有登录，跳转到登录页面
  if (!userStore.isLoggedIn) {
    router.replace('/login')
    return
  }

  // 获取最新的用户信息
  fetchUserInfo()
})
</script>

<style scoped>
.main-content {
  padding: 2rem 0;
  display: flex;
  align-items: center;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
  width: 100%;
}

.profile-card {
  border-radius: 1.5rem;
  transition: all 0.3s ease;
}

.avatar-section {
  text-align: center;
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.avatar-container {
  margin-bottom: 1.5rem;
}

.avatar {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  border: 4px solid var(--theme-color);
  object-fit: cover;
  box-shadow: var(--shadow-lg);
  transition: all 0.3s ease;
}

.avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 30px var(--theme-hover);
}

.username {
  font-size: 2.25rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.user-id {
  font-size: 1.2rem;
  margin: 0;
  font-weight: 500;
}

.info-section {
  margin-bottom: 2.5rem;
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-title::before {
  content: '';
  width: 4px;
  height: 1.5rem;
  background: var(--theme-color);
  border-radius: 2px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.25rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.info-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--theme-color);
}

.info-label {
  font-weight: 600;
  font-size: 1rem;
}

.info-value {
  font-weight: 500;
}

.info-value.active {
  color: var(--success-color);
  font-weight: 600;
}

.info-value.inactive {
  color: var(--error-color);
  font-weight: 600;
}

.action-section {
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.back-btn {
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
}

.edit-btn {
  background: linear-gradient(135deg, var(--theme-color) 0%, var(--theme-hover) 100%);
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
}

.edit-btn:hover {
  box-shadow: 0 10px 25px var(--theme-hover);
}

.logout-btn {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
}

.logout-btn:hover {
  box-shadow: 0 10px 25px rgba(239, 68, 68, 0.4);
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem 0;
  }

  .avatar {
    width: 120px;
    height: 120px;
  }

  .username {
    font-size: 2rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    text-align: left;
  }
}

@media (max-width: 480px) {
  .avatar {
    width: 100px;
    height: 100px;
  }

  .username {
    font-size: 1.75rem;
  }

  .section-title {
    font-size: 1.25rem;
  }

  .action-section {
    flex-direction: column;
    gap: 0.75rem;
  }

  .back-btn,
  .edit-btn,
  .logout-btn {
    width: 100%;
  }
}
</style>
