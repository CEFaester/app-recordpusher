<script setup>
import { useRouter } from 'vue-router'
import EventCard from '@/components/EventCard.vue'
import IconPoints from '@/components/icons/IconPoints.vue'
import { events } from '@/services/eventService'
import vinyl from '@/assets/event-vinyl.svg'

const router = useRouter()

// Forsiden viser kun det første event. Resten ligger på eventsiden.
function openEvent() {
  router.push({ name: 'events', query: { event: events[0].id } })
}
</script>

<template>
  <div class="home-view">
    <p class="eyebrow">DIN LOKALE PLADESPILLER</p>
    <h1>MERE END<br />EN PLADEBUTIK.</h1>

    <RouterLink :to="{ name: 'events' }" class="campaign" aria-label="Se kommende events">
      <img :src="vinyl" class="campaign__vinyl" alt="" />
      <span class="campaign__title">LIVE.<br />TÆT PÅ.</span>
      <span class="campaign__subtitle">Gratis musik. Midt i Odense.</span>
      <span class="campaign__badge">SE EVENTS →</span>
    </RouterLink>

    <RouterLink :to="{ name: 'points' }" class="points-preview">
      <span class="points-preview__headline">
        <IconPoints class="points-preview__icon" />
        <strong>367 POINT</strong>
      </span>
      <span class="points-preview__description">83 point til din næste T-shirt.</span>
    </RouterLink>

    <div class="home-view__section-title">
      <h2>NÆSTE GANG HOS OS</h2>
      <RouterLink :to="{ name: 'events' }">Se alle →</RouterLink>
    </div>

    <button type="button" class="home-view__event" @click="openEvent">
      <EventCard :event="events[0]" />
    </button>
    <p class="home-view__footer">Musik er bedre, når vi deler den.</p>
  </div>
</template>

<style lang="scss" scoped>

.home-view {
  display: flex;
  flex-direction: column;
  gap: $space-lg;
}

/* =========================================
   HEADER & TYPOGRAFI
   ========================================= */
.page-header {
  display: flex;
  flex-direction: column;
  gap: $space-xs;
}

.eyebrow {
  color: $color-accent-primary;
  font-size: $font-size-small;
  font-weight: 700;
  margin: 0;
}

.page-title {
  font-family: $font-family-heading;
  font-size: 2.375rem;
  line-height: 1.15;
  font-weight: 400;
  color: $color-text;
  margin: 0;
}

/* =========================================
   KAMPAGNE BANNER
   ========================================= */
.campaign {
  display: block;
  height: 194px;
  position: relative;
  overflow: hidden;
  background-color: $color-accent-primary;
  text-decoration: none;
  color: $color-text-inverted;
  transition: opacity 0.2s ease;

  &:active {
    opacity: 0.9;
  }

  &__vinyl {
    position: absolute;
    width: 170px;
    height: 170px;
    top: 56px;
    right: -58px;
  }

  &__title {
    position: absolute;
    top: $space-md;
    left: $space-md;
    font-family: $font-family-heading;
    font-size: 2.9rem;
    line-height: 1.05;
  }

  &__subtitle {
    position: absolute;
    bottom: 46px;
    left: $space-md;
    font-size: $font-size-small;
  }

  &__badge {
    position: absolute;
    bottom: $space-md;
    left: $space-md;
    padding: $space-xs $space-sm;
    background-color: $color-accent-secondary;
    color: $color-text;
    font-size: $font-size-small;
    font-weight: 700;
  }
}

/* =========================================
   POINT PREVIEW KORT
   ========================================= */
.points-preview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $space-md;
  padding: $space-md;
  background-color: $color-primary;
  color: $color-text;
  text-decoration: none;
  transition: background-color 0.2s ease;

  &:active {
    background-color: color.adjust($color-primary, $lightness: -6%);
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: $space-xs;
  }

  &__headline {
    display: flex;
    align-items: center;
    gap: $space-sm;

    strong {
      font-family: $font-family-heading;
      font-size: $font-size-large;
      font-weight: 400;
      line-height: 1.2;
    }
  }

  &__icon {
    width: 28px;
    height: 28px;
  }

  &__description {
    font-size: $font-size-small;
    color: color.adjust($color-text, $lightness: 30%);
  }

  &__arrow {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    color: $color-text;
  }
}

/* =========================================
   SEKTION: NÆSTE EVENT
   ========================================= */
.home-events {
  display: flex;
  flex-direction: column;
  gap: $space-md;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $space-sm;
}

.section-title {
  font-family: $font-family-heading;
  font-size: 1.35rem;
  font-weight: 400;
  color: $color-text;
  margin: 0;
}

.section-link {
  color: $color-accent-primary;
  font-size: $font-size-small;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
}

.event-trigger {
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

.home-footer {
  font-size: $font-size-small;
  color: color.adjust($color-text, $lightness: 30%);
  margin: 0;
}
</style>