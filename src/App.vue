<script setup lang="ts">
import { ref, provide } from 'vue'
import Modal from './components/useModal.vue'

const modalRef = ref()

provide('modal', {
  showToast: (options: any) => modalRef.value?.showToast(options),
  hideToast: () => modalRef.value?.hideToast(),
  showModal: (options: any) => modalRef.value?.showModal(options),
  hideModal: () => modalRef.value?.hideModal()
})
</script>

<template>
  <router-view id="view" />
  <Modal ref="modalRef" />
</template>

<style>
@import '@styles/base.css';
@import '@fortawesome/fontawesome-free/css/all.css';

#view {
  height: 100dvh;
}
</style>
