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

<style lang="scss">

.app-wrapper {
  width: 100%;
  min-height: 100dvh;
  background-color: $color-background;
}

</style>
