<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import EventCard from '@/components/EventCard.vue'
import { events } from '@/services/eventService'
import { currentUser } from '@/services/userService'

const router = useRouter()

const savedEvents = computed(() => {
  if (!currentUser.value) return []
  const userSavedIds = currentUser.value.savedEvents || []
  return events.filter((event) => userSavedIds.includes(event.id))
})

function openEvent(event) {
  router.push({ name: 'events', query: { event: event.id } })
}

function goToAllEvents() {
  router.push({ name: 'events' })
}

function goToProfile() {
  router.push({ name: 'profile' })
}
</script>

<template>
  <div class="saved-events-view">
    <header class="page-header">
      <p class="eyebrow">DIN NÆSTE MUSIKPAUSE</p>
      <h1 class="page-title">GEMTE EVENTS.</h1>
      <p class="page-intro">Dit næste besøg starter her.</p>
    </header>

    <!-- Hvis man IKKE er logget ind -->
    <template v-if="!currentUser">
      <p class="empty-saved">
        Du skal være logget ind på din profil for at se og gemme events.
      </p>
      <button class="action-btn action-btn--selected" type="button" @click="goToProfile">
        <span>Log ind på profil</span>
        <span class="arrow">→</span>
      </button>
    </template>

    <!-- Hvis man ER logget ind -->
    <template v-else>
      <div v-if="savedEvents.length" class="events-list">
        <button
          v-for="event in savedEvents"
          :key="event.id"
          type="button"
          class="event-button"
          @click="openEvent(event)"
        >
          <EventCard :event="event" />
        </button>
      </div>

      <p v-else class="empty-saved">
        Du har ikke gemt nogen events endnu. Find et event, du har lyst til at besøge.
      </p>

      <div class="saved-info">
        <svg
          class="saved-info__bookmark"
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.7"
          stroke-linejoin="round"
        >
          <path d="M6 3h12v18l-6-4-6 4z" />
        </svg>
        <h2>Én god grund til at komme igen.</h2>
        <p>Et gemt event er en huskeliste, ikke en billet.</p>
      </div>

      <button class="action-btn" type="button" @click="goToAllEvents">
        <span>Opdag flere events</span>
        <span class="arrow">→</span>
      </button>
    </template>
  </div>
</template>

<style lang="scss" scoped>

.saved-events-view {
  display: flex;
  flex-direction: column;
  gap: $space-lg;
}

.page-header {
  display: flex;
  flex-direction: column;
  gap: $space-xs;
}

.eyebrow {
  margin: 0;
  font-size: $font-size-small;
  color: $color-accent-primary;
  font-weight: 700;
}

.page-title {
  font-family: $font-family-heading;
  font-size: 2.375rem;
  line-height: 1.15;
  font-weight: 400;
  color: $color-text;
  margin: 0;
}

.page-intro {
  margin: $space-xs 0 0 0;
  color: color.adjust($color-text, $lightness: 30%);
  font-size: $font-size-base;
  line-height: 1.4;
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: $space-md;
}

.event-button {
  display: block;
  width: 100%;
  border: none;
  padding: 0;
  background: none;
  text-align: left;
  font-family: inherit;
  cursor: pointer;
  color: inherit;
  transition: transform 0.15s ease, opacity 0.15s ease;

  &:active {
    transform: scale(0.98);
    opacity: 0.9;
  }
}

.empty-saved {
  margin: 0;
  padding: $space-lg $space-md;
  background-color: $color-primary;
  font-size: $font-size-base;
  line-height: 1.4;
  color: color.adjust($color-text, $lightness: 30%);
}

.saved-info {
  padding: $space-md;
  background-color: $color-primary;

  &__bookmark {
    width: 24px;
    height: 24px;
    display: block;
    margin-bottom: $space-sm;
    color: $color-text;
  }

  h2 {
    font-family: $font-family-heading;
    font-size: 1.35rem;
    font-weight: 400;
    color: $color-text;
    margin: 0;
  }

  p {
    font-size: $font-size-base;
    line-height: 1.4;
    color: color.adjust($color-text, $lightness: 30%);
    margin: $space-xs 0 0 0;
  }
}

.action-btn {
  width: 100%;
  min-height: 52px;
  background-color: $color-primary;
  color: $color-text;
  border: none;
  padding: $space-sm $space-md;
  font-family: inherit;
  font-size: $font-size-base;
  font-weight: 600;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:active {
    opacity: 0.8;
  }

  .arrow {
    font-size: 1.25rem;
    font-weight: 400;
  }
}
</style>