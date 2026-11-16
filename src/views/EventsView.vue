<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EventCard from '@/components/EventCard.vue'
import IconEvents from '@/components/icons/IconEvents.vue'
import IconHome from '@/components/icons/IconHome.vue'
import IconPoints from '@/components/icons/IconPoints.vue'
import { events } from '@/services/eventService'
import { currentUser, toggleUserSavedEvent } from '@/services/userService'
import vinyl from '@/assets/event-vinyl.svg'

const route = useRoute()
const router = useRouter()

const selectedEvent = computed(() =>
  events.find((event) => event.id === route.query.event)
)

const isSaved = computed(() => {
  if (!currentUser.value || !selectedEvent.value) return false
  return (currentUser.value.savedEvents || []).includes(selectedEvent.value.id)
})

function goToSaved() {
  router.push({ name: 'saved-events' })
}

function openEvent(event) {
  router.push({ name: 'events', query: { event: event.id } })
}

async function toggleSaved() {
  if (!currentUser.value) {
    router.push({ name: 'profile' })
    return
  }
  if (!selectedEvent.value) return
  await toggleUserSavedEvent(selectedEvent.value.id)
}
</script>

<template>
  <div class="events-view">
    <!-- 1. EVENT DETALJE -->
    <template v-if="selectedEvent">
      <div class="subview-header">
        <span>{{ selectedEvent.id === 'fredagslyt' ? 'FREDAGSLYT' : 'VINYL & VENNER' }}</span>
      </div>

      <div class="detail-poster" :class="`detail-poster--${selectedEvent.theme}`">
        <img :src="vinyl" alt="" />
        <h2>
          <span v-for="(line, index) in selectedEvent.poster.split('\n')" :key="index">{{ line }}</span>
        </h2>
        <span class="poster-badge">GRATIS ADGANG</span>
      </div>

      <h1 class="detail-title">{{ selectedEvent.title }}</h1>

      <div class="event-facts">
        <p><IconEvents /> {{ selectedEvent.date }}</p>
        <p><IconHome /> RecordPusher · Odense</p>
        <p><IconPoints /> +{{ selectedEvent.points }} point ved bekræftet eventbesøg</p>
      </div>

      <p class="detail-description">{{ selectedEvent.description }}</p>

      <p class="muted-note">
        Gratis drop-in · Begrænset plads<br />
        At gemme eventet reserverer ikke en plads.
      </p>

      <div class="detail-actions">
        <button class="action-btn action-btn--selected" type="button" @click="toggleSaved">
          <span>
            {{ !currentUser ? 'Log ind for at gemme' : (isSaved ? 'Fjern fra gemte' : 'Gem event') }}
          </span>
          <span class="arrow">→</span>
        </button>

        <p v-if="isSaved" class="saved-confirmation">
          <strong>GEMT. VI SES MELLEM PLADERNE.</strong><br />
          Eventet ligger nu under dine gemte events.
        </p>

        <a
          class="action-btn"
          href="https://www.google.com/maps/search/?api=1&amp;query=RecordPusher%20Odense"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Find vej til RecordPusher</span>
          <span class="arrow">→</span>
        </a>
      </div>
    </template>

    <!-- 2. ALLE EVENTS -->
    <template v-else>
      <header class="page-header">
        <p class="eyebrow">OPDAG · MØD OP · KOM IGEN</p>
        <h1 class="page-title">DET SKER<br />I BUTIKKEN.</h1>
        <p class="page-intro">Små events. Store musikøjeblikke.</p>
      </header>

      <div class="tabs-grid" aria-label="Vis events">
        <button class="action-btn action-btn--selected" type="button" aria-current="page">
          <span>Alle events</span>
          <span class="arrow">→</span>
        </button>
        <button class="action-btn" type="button" @click="goToSaved">
          <span>Gemte</span>
          <span class="arrow">→</span>
        </button>
      </div>

      <p class="section-label">NOVEMBER / KOMMENDE EVENTS</p>

      <div class="events-list">
        <button
          v-for="event in events"
          :key="event.id"
          type="button"
          class="event-button"
          @click="openEvent(event)"
        >
          <EventCard :event="event" />
        </button>
      </div>

      <p class="muted-note">Events her er konceptindhold til prototypen.</p>
    </template>
  </div>
</template>

<style lang="scss" scoped>

.events-view {
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
</style>