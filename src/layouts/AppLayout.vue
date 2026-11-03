<template>
  <div class="mobile-app-wrapper">
    <main class="mobile-app-content">
      <router-view />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.mobile-app-wrapper {
  min-height: 100vh;
  background-color: $color-primary;
  display: flex;
  justify-content: center;
}

.mobile-app-content {
  width: 100%;
  max-width: $app-max-width;
  min-height: 100vh;
  background-color: $color-background;
  padding: $space-lg $padding-screen; // 24px top/bund, 16px i siderne
}
</style>