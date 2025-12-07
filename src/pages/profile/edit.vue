<template>
  <div class="edit-profile-page">
    <Header />

    <main class="main-content">
      <div class="container">
        <!-- 编辑表单卡片 -->
        <div class="edit-card card card-lg">
          <h1 class="page-title text-gradient">{{ $t('editProfile.title') }}</h1>
          
          <form @submit.prevent="handleSubmit" class="edit-form">
            <!-- 基本信息 -->
            <div class="form-section">
              <h2 class="section-title">{{ $t('editProfile.basicInfo') }}</h2>
              
              <!-- 昵称 -->
              <div class="form-group">
                <label for="nickname" class="form-label">{{ $t('editProfile.nickname') }}</label>
                <input
                  id="nickname"
                  v-model="formData.nickname"
                  type="text"
                  class="form-input"
                  :placeholder="$t('editProfile.nicknamePlaceholder')"
                />
              </div>

              <!-- 性别 -->
              <div class="form-group">
                <label class="form-label">{{ $t('editProfile.gender') }}</label>
                <div class="radio-group">
                  <label class="radio-label">
                    <input
                      type="radio"
                      v-model="formData.gender"
                      :value="1"
                      class="radio-input"
                    />
                    <span class="radio-text">{{ $t('profile.male') }}</span>
                  </label>
                  <label class="radio-label">
                    <input
                      type="radio"
                      v-model="formData.gender"
                      :value="2"
                      class="radio-input"
                    />
                    <span class="radio-text">{{ $t('profile.female') }}</span>
                  </label>
                  <label class="radio-label">
                    <input
                      type="radio"
                      v-model="formData.gender"
                      :value="3"
                      class="radio-input"
                    />
                    <span class="radio-text">{{ $t('profile.unknown') }}</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- 额外信息 -->
            <div class="form-section">
              <h2 class="section-title">{{ $t('editProfile.additionalInfo') }}</h2>
              
              <!-- 邮箱 -->
              <div class="form-group">
                <label for="email" class="form-label">{{ $t('editProfile.email') }}</label>
                <input
                  id="email"
                  v-model="formData.info.email"
                  type="email"
                  class="form-input"
                  :placeholder="$t('editProfile.emailPlaceholder')"
                />
              </div>

              <!-- 电话 -->
              <div class="form-group">
                <label for="phone" class="form-label">{{ $t('editProfile.phone') }}</label>
                <input
                  id="phone"
                  v-model="formData.info.phone"
                  type="tel"
                  class="form-input"
                  :placeholder="$t('editProfile.phonePlaceholder')"
                />
              </div>

              <!-- 生日 -->
              <div class="form-group">
                <label for="birthday" class="form-label">{{ $t('editProfile.birthday') }}</label>
                <input
                  id="birthday"
                  v-model="formData.info.birthday"
                  type="date"
                  class="form-input"
                />
              </div>

              <!-- 个人简介 -->
              <div class="form-group">
                <label for="bio" class="form-label">{{ $t('editProfile.bio') }}</label>
                <textarea
                  id="bio"
                  v-model="formData.info.bio"
                  class="form-textarea"
                  :placeholder="$t('editProfile.bioPlaceholder')"
                  rows="4"
                ></textarea>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="action-section">
              <button type="button" class="cancel-btn button" @click="goBack">
                <i class="fas fa-times"></i>
                {{ $t('editProfile.cancel') }}
              </button>
              <button type="submit" class="save-btn button" :disabled="loading">
                <i class="fas fa-save"></i>
                {{ loading ? $t('editProfile.saving') : $t('editProfile.save') }}
              </button>
            </div>
          </form>
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

// 表单数据
const formData = ref({
  nickname: '',
  gender: 3,
  info: {
    email: '',
    phone: '',
    birthday: '',
    bio: ''
  }
})

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

// 初始化表单数据
const initializeFormData = () => {
  formData.value = {
    nickname: userInfo.value.nickname || '',
    gender: userInfo.value.gender || 3,
    info: {
      email: extraInfo.value.email || '',
      phone: extraInfo.value.phone || '',
      birthday: extraInfo.value.birthday || '',
      bio: extraInfo.value.bio || ''
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (loading.value) return

  loading.value = true

  try {
    const updateData: any = {}
    
    // 只提交有变化的字段
    if (formData.value.nickname !== userInfo.value.nickname) {
      updateData.nickname = formData.value.nickname
    }
    
    if (formData.value.gender !== userInfo.value.gender) {
      updateData.gender = formData.value.gender
    }

    // 检查info字段是否有变化
    const currentInfo = extraInfo.value
    const hasInfoChanges = 
      formData.value.info.email !== currentInfo.email ||
      formData.value.info.phone !== currentInfo.phone ||
      formData.value.info.birthday !== currentInfo.birthday ||
      formData.value.info.bio !== currentInfo.bio

    if (hasInfoChanges) {
      updateData.info = {
        ...currentInfo,
        ...formData.value.info
      }
    }

    // 如果没有需要更新的字段
    if (Object.keys(updateData).length === 0) {
      modal?.showToast({
        type: 'info',
        title: t('modal.info'),
        message: t('editProfile.noChanges')
      })
      return
    }

    const response = await apiClient.updateUserInfo(updateData)

    if (response.code === 200) {
      modal?.showToast({
        type: 'success',
        title: t('modal.success'),
        message: t('editProfile.updateSuccess')
      })

      // 更新本地用户信息
      if (userStore.user) {
        const updatedUser = {
          ...userStore.user,
          ...updateData,
          info: updateData.info ? JSON.stringify(updateData.info) : userStore.user.info
        }
        userStore.setUser(updatedUser)
      }

      goBack()
    } else {
      modal?.showToast({
        type: 'error',
        title: t('modal.error'),
        message: response.message || t('editProfile.updateFailed'),
        duration: 5000
      })
    }
  } catch (error) {
    console.error('更新用户信息错误:', error)
    modal?.showToast({
      type: 'error',
      title: t('modal.error'),
      message: t('editProfile.networkError'),
      duration: 5000
    })
  } finally {
    loading.value = false
  }
}

// 返回上一页
const goBack = () => {
  router.replace("/profile")
}

onMounted(() => {
  // 检查登录状态
  if (!userStore.isLoggedIn) {
    modal?.showToast({
      type: 'error',
      title: t('modal.error'),
      message: t('editProfile.loginRequired')
    })
    router.replace('/login')
    return
  }

  // 初始化表单数据
  initializeFormData()
})
</script>

<style scoped>
.main-content {
  padding: 2rem 0;
  display: flex;
  align-items: center;
  min-height: calc(100vh - 80px);
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 1rem;
  width: 100%;
}

.edit-card {
  border-radius: 1.5rem;
  transition: all 0.3s ease;
}

.page-title {
  font-size: 2.25rem;
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 700;
}

.form-section {
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

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 1rem;
  border: 2px solid var(--border-color);
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: var(--bg-color);
  color: var(--text-color);
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--theme-color);
  box-shadow: 0 0 0 3px var(--theme-hover);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.radio-group {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.radio-label:hover {
  background: var(--bg-hover);
}

.radio-input {
  margin: 0;
}

.radio-text {
  font-weight: 500;
}

.action-section {
  display: flex;
  gap: 1rem;
  justify-content: center;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.cancel-btn {
  background: var(--bg-color);
  color: var(--text-color);
  border: 2px solid var(--border-color);
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
}

.cancel-btn:hover {
  background: var(--bg-hover);
  border-color: var(--theme-color);
}

.save-btn {
  background: linear-gradient(135deg, var(--theme-color) 0%, var(--theme-hover) 100%);
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
}

.save-btn:hover:not(:disabled) {
  box-shadow: 0 10px 25px var(--theme-hover);
}

.save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem 0;
  }

  .page-title {
    font-size: 2rem;
  }

  .radio-group {
    flex-direction: column;
    gap: 0.75rem;
  }

  .action-section {
    flex-direction: column;
  }

  .cancel-btn,
  .save-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.75rem;
  }

  .section-title {
    font-size: 1.25rem;
  }

  .form-input,
  .form-textarea {
    padding: 0.875rem;
  }
}
</style>
