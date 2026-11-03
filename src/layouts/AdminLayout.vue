<!-- AdminLayout.vue -->
<template>
  <div class="admin-wrapper">
    <aside class="admin-sidebar">
      <!-- Admin navigation -->
    </aside>
    
    <main class="admin-main">
      <router-view />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.admin-wrapper {
  display: flex;
  min-height: 100vh;
  background-color: $color-background;
}

.admin-sidebar {
  width: 260px;
  padding: $space-lg;
  background-color: $color-primary;
}

.admin-main {
  flex: 1;
  padding: $padding-admin-page;
  max-width: 1600px;
  margin: 0 auto;
}
</style>