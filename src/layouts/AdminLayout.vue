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
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background-color: $color-background;
}

.admin-topbar {
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  background-color: $color-primary;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.topbar-inner {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: $space-md clamp($space-md, 3vw, $space-xl);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: $space-sm $space-lg;
}

.topbar-brand {
  display: flex;
  align-items: center;
  gap: $space-md;
}

.brand-title {
  font-size: $font-size-base;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: $color-text;
}

.back-to-app {
  font-size: $font-size-small;
  color: $color-text;
  opacity: 0.7;
  text-decoration: none;

  &:hover {
    opacity: 1;
    text-decoration: underline;
  }
}

.admin-nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: $space-xs;
}

.nav-link {
  padding: $space-xs $space-md;
  font-size: $font-size-small;
  font-weight: 600;
  color: $color-text;
  text-decoration: none;
  border-radius: 6px;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  &.router-link-exact-active {
    background-color: $color-accent-primary;
    color: $color-text-inverted;
  }
}

.admin-main {
  flex: 1;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  // clamp() tilpasser automatisk luft i siderne fra mobil (16px) til stor skærm (32px)
  padding: clamp($space-md, 3vw, $space-xl);
}
</style>