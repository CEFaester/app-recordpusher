<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EventCard from '@/components/EventCard.vue'
import IconBack from '@/components/icons/IconBack.vue'
import IconEvents from '@/components/icons/IconEvents.vue'
import IconHome from '@/components/icons/IconHome.vue'
import IconPoints from '@/components/icons/IconPoints.vue'
import { events, getSavedEventIds, saveEventIds } from '@/services/eventService'
import vinyl from '@/assets/event-vinyl.svg'

const route = useRoute()
const router = useRouter()
const savedIds = ref(getSavedEventIds())
const activeView = computed(() => {
  if (route.query.saved === 'true') return 'saved'
  if (events.some(event => event.id === route.query.event)) return 'detail'
  return 'all'
})
const selectedEvent = computed(() => events.find(event => event.id === route.query.event))
const savedEvents = computed(() => events.filter(event => savedIds.value.includes(event.id)))
const isSaved = computed(() => !!selectedEvent.value && savedIds.value.includes(selectedEvent.value.id))

function goToAll() { router.push({ name: 'events' }) }
function goToSaved() { router.push({ name: 'events', query: { saved: 'true' } }) }
function openEvent(event) { router.push({ name: 'events', query: { event: event.id } }) }
function toggleSaved() {
  if (!selectedEvent.value) return
  const id = selectedEvent.value.id
  const nextIds = savedIds.value.includes(id) ? savedIds.value.filter(saved => saved !== id) : [...savedIds.value, id]
  if (saveEventIds(nextIds)) savedIds.value = nextIds
}
// Undersiderne ligger i eventsiden, så der ikke skal ændres i din vens router.
function goBack() { if (activeView.value === 'detail' && route.query.from === 'saved') goToSaved(); else goToAll() }
watch(() => route.query, () => { savedIds.value = getSavedEventIds() })
</script>

<template>
  <div class="events-view">
    <template v-if="activeView === 'all'">
      <p class="eyebrow">OPDAG · MØD OP · KOM IGEN</p>
      <h1>DET SKER<br />I BUTIKKEN.</h1>
      <p class="events-view__intro">Små events. Store musikøjeblikke.</p>
      <div class="events-view__tabs" aria-label="Vis events">
        <button class="action action--selected" type="button" aria-current="page">Alle events <span>→</span></button>
        <button class="action" type="button" @click="goToSaved">Gemte <span>→</span></button>
      </div>
      <p class="events-view__month">NOVEMBER / EKSEMPELEVENTS</p>
      <button v-for="event in events" :key="event.id" type="button" class="event-button" @click="openEvent(event)">
        <EventCard :event="event" />
      </button>
      <p class="events-view__note">Events her er konceptindhold til prototypen.</p>
    </template>

    <template v-else-if="activeView === 'detail' && selectedEvent">
      <div class="events-view__backline">
        <button type="button" class="back-button" aria-label="Tilbage til events" @click="goBack"><IconBack /></button>
        <span>{{ selectedEvent.id === 'fredagslyt' ? 'FREDAGSLYT' : 'VINYL & VENNER' }}</span>
      </div>
      <div class="detail-poster" :class="`detail-poster--${selectedEvent.theme}`">
        <img :src="vinyl" alt="" />
        <h2><span v-for="(line, index) in selectedEvent.poster.split('\n')" :key="index">{{ line }}</span></h2>
        <strong>GRATIS ADGANG</strong>
      </div>
      <h1 class="detail-title">{{ selectedEvent.title }}</h1>
      <div class="event-facts">
        <p><IconEvents /> {{ selectedEvent.date }}</p>
        <p><IconHome /> RecordPusher · Odense</p>
        <p><IconPoints /> +{{ selectedEvent.points }} point ved bekræftet eventbesøg</p>
      </div>
      <p class="detail-description">{{ selectedEvent.description }}</p>
      <p class="detail-note">Gratis drop-in · Begrænset plads<br />At gemme eventet reserverer ikke en plads.</p>
      <button class="action action--full action--selected" type="button" @click="toggleSaved">
        {{ isSaved ? 'Fjern fra gemte' : 'Gem event' }} <span>→</span>
      </button>
      <p v-if="isSaved" class="saved-confirmation"><strong>GEMT. VI SES MELLEM PLADERNE.</strong><br />Eventet ligger nu under dine gemte events.</p>
      <a class="action action--full" href="https://www.google.com/maps/search/?api=1&amp;query=RecordPusher%20Odense" target="_blank" rel="noopener noreferrer">Find vej til RecordPusher <span>→</span></a>
    </template>

    <template v-else-if="activeView === 'saved'">
      <div class="events-view__backline">
        <button type="button" class="back-button" aria-label="Tilbage til events" @click="goToAll"><IconBack /></button>
        <span>GEMTE EVENTS</span>
      </div>
      <p class="eyebrow">DIN NÆSTE MUSIKPAUSE</p>
      <h1>GEMT TIL DIG.</h1>
      <p class="events-view__intro">Dit næste besøg starter her.</p>
      <template v-if="savedEvents.length">
        <button v-for="event in savedEvents" :key="event.id" type="button" class="event-button" @click="router.push({name: 'events', query: {event: event.id, from: 'saved'}})">
          <EventCard :event="event" />
        </button>
      </template>
      <p v-else class="empty-saved">Du har ikke gemt nogen events endnu. Find et event, du har lyst til at besøge.</p>
      <div class="saved-info">
        <svg class="saved-info__bookmark" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="M6 3h12v18l-6-4-6 4z" /></svg>
        <h2>Én god grund til at komme igen.</h2>
        <p>Et gemt event er en huskeliste, ikke en billet.</p>
      </div>
      <button class="action action--full" type="button" @click="goToAll">Opdag flere events <span>→</span></button>
    </template>
  </div>
</template>

<style lang="scss" scoped>

.events-view {
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

.section-label {
  color: color.adjust($color-text, $lightness: 30%);
  font-size: $font-size-small;
  font-weight: 700;
  margin: 0;
}

.muted-note {
  color: color.adjust($color-text, $lightness: 30%);
  font-size: $font-size-small;
  line-height: 1.4;
  margin: 0;
}

/* =========================================
   KNAPPER & TABS
   ========================================= */
.tabs-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-sm;
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
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.2s ease, background-color 0.2s ease;

  &:active {
    opacity: 0.8;
  }

  .arrow {
    font-size: 1.25rem;
    font-weight: 400;
  }

  &--selected {
    background-color: $color-text;
    color: $color-text-inverted;
  }
}

/* =========================================
   EVENT LISTE
   ========================================= */
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

/* =========================================
   UNDERSIDE HEADER & DETALJER
   ========================================= */
.subview-header {
  padding-bottom: $space-sm;
  border-bottom: 1px solid color.adjust($color-primary, $lightness: -12%);
  font-size: $font-size-small;
  font-weight: 700;
  color: $color-text;
}

.detail-poster {
  position: relative;
  height: 188px;
  overflow: hidden;
  background-color: $color-accent-secondary;

  &--red {
    background-color: $color-accent-primary;

    h2 {
      color: $color-text-inverted;
    }
  }

  img {
    position: absolute;
    height: 170px;
    width: 170px;
    right: -44px;
    bottom: -20px;
  }

  h2 {
    position: relative;
    margin: $space-md;
    font-family: $font-family-heading;
    font-size: 2.9rem;
    line-height: 1;
    font-weight: 400;
    color: $color-text;
    display: flex;
    flex-direction: column;
  }

  .poster-badge {
    position: absolute;
    left: $space-md;
    bottom: $space-md;
    font-size: $font-size-small;
    font-weight: 700;
    color: $color-text;
  }

  &--red .poster-badge {
    color: $color-text-inverted;
  }
}

.detail-title {
  font-family: $font-family-heading;
  font-size: $font-size-large;
  font-weight: 400;
  color: $color-text;
  margin: 0;
}

.event-facts {
  display: flex;
  flex-direction: column;
  gap: $space-md;

  p {
    margin: 0;
    display: flex;
    align-items: center;
    gap: $space-sm;
    color: color.adjust($color-text, $lightness: 30%);
    font-size: $font-size-base;
  }

  :deep(svg) {
    color: $color-text;
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
}

.detail-description {
  margin: 0;
  color: $color-text;
  font-size: $font-size-base;
  line-height: 1.5;
}

.detail-actions {
  display: flex;
  flex-direction: column;
  gap: $space-sm;
}

.saved-confirmation {
  background-color: $color-primary;
  padding: $space-md;
  margin: 0;
  font-size: $font-size-small;
  line-height: 1.5;
  color: color.adjust($color-text, $lightness: 30%);

  strong {
    color: $color-text;
  }
}

/* =========================================
   GEMTE EVENTS
   ========================================= */
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
</style>
