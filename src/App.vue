<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { initAuth } from '@/services/userService'

onMounted(() => {
  initAuth()
})
</script>

<template>
  <router-view />
</template>
