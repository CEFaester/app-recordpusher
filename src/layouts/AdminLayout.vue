<script setup>
</script>

<template>
  <div class="admin-wrapper">
    <header class="admin-topbar">
      <div class="topbar-inner">
        <div class="topbar-brand">
          <span class="brand-title">ADMIN</span>
          <RouterLink :to="{ name: 'home' }" class="back-to-app">← Til app</RouterLink>
        </div>

        <nav class="admin-nav">
          <RouterLink :to="{ name: 'admin-dashboard' }" class="nav-link">
            Oversigt
          </RouterLink>
          <RouterLink :to="{ name: 'admin-events' }" class="nav-link">
            Events
          </RouterLink>
          <RouterLink :to="{ name: 'admin-points' }" class="nav-link">
            Point Butik
          </RouterLink>
        </nav>
      </div>
    </header>

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