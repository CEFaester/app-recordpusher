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
.home-view { display: flex; flex-direction: column; gap: 18px; padding-top: 36px; }
.eyebrow { color: $color-accent-primary; font-size: 12px; line-height: 16px; font-weight: 700; margin: 0; }
h1 { font-size: 38px; line-height: 44px; font-weight: 400; }
.campaign {
  display: block; height: 194px; position: relative; overflow: hidden;
  background: $color-accent-primary; text-decoration: none; color: $color-text-inverted;
}
.campaign__vinyl { position: absolute; width: 170px; height: 170px; top: 56px; right: -58px; }
.campaign__title {
  position: absolute; top: 16px; left: 18px; font-family: $font-family-heading;
  font-size: 47px; line-height: 49px;
}
.campaign__subtitle { position: absolute; top: 132px; left: 18px; font-size: 12px; line-height: 16px; }
.campaign__badge {
  position: absolute; top: 159px; left: 18px; padding: 5px 9px; border-radius: 2px;
  background: $color-accent-secondary; color: $color-text; font-size: 12px;
  font-weight: 700; line-height: 16px;
}
.points-preview {
  display: flex; flex-direction: column; gap: 8px; padding: 16px;
  background: $color-primary; color: $color-text; text-decoration: none;
}
.points-preview__headline { display: flex; align-items: center; gap: 10px; }
.points-preview__headline strong { font-family: $font-family-heading; font-size: 27px; line-height: 33px; font-weight: 400; }
.points-preview__icon { width: 32px; height: 32px; }
.points-preview__description, .home-view__footer { font-size: 12px; line-height: 16px; color: #68655e; }
.home-view__section-title { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.home-view__section-title h2 { font-size: 21px; line-height: 27px; font-weight: 400; }
.home-view__section-title a { color: $color-accent-primary; font-size: 12px; font-weight: 700; text-decoration: none; white-space: nowrap; }
.home-view__event { display: block; border: 0; padding: 0; background: none; text-align: left; cursor: pointer; color: inherit; }
.home-view__footer { margin: 0 0 12px; }
</style>
