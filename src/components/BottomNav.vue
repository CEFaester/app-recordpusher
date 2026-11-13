<script setup>
import IconHome from '@/components/icons/IconHome.vue'
import IconEvents from '@/components/icons/IconEvents.vue'
import IconPoints from '@/components/icons/IconPoints.vue'
import IconProfile from '@/components/icons/IconProfile.vue'
</script>

<template>
  <nav class="bottom-nav">
    <RouterLink :to="{ name: 'home' }" class="nav-item">
      <IconHome class="nav-icon" />
      <span class="nav-label">Forside</span>
    </RouterLink>

    <RouterLink :to="{ name: 'events' }" class="nav-item">
      <IconEvents class="nav-icon" />
      <span class="nav-label">Events</span>
    </RouterLink>

    <RouterLink :to="{ name: 'points' }" class="nav-item">
      <IconPoints class="nav-icon" />
      <span class="nav-label">Point</span>
    </RouterLink>

    <RouterLink :to="{ name: 'profile' }" class="nav-item">
      <IconProfile class="nav-icon" />
      <span class="nav-label">Profil</span>
    </RouterLink>
  </nav>
</template>

<style lang="scss" scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: $app-max-width;
  height: 64px;
  background-color: $color-background;
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: $space-xs;
  flex: 1;
  text-decoration: none;
  color: $color-text;
  transition: color 0.2s ease;

  .nav-icon {
    width: 32px;
    height: 32px;
  }

  .nav-label {
    font-size: 0.75rem;
    font-weight: 500;
  }

  &.router-link-exact-active {
    color: $color-accent-primary;

    .nav-label {
      font-weight: 600;
    }
  }
}
</style>