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
.events-view { display: flex; flex-direction: column; gap: 18px; padding-top: 36px; }
.eyebrow { margin: 0; font-size: 12px; line-height: 16px; color: $color-accent-primary; font-weight: 700; }
h1 { font-size: 38px; line-height: 44px; font-weight: 400; }
.events-view__intro { margin: 0; color: #68655e; font-size: 14px; line-height: 20px; }
.events-view__tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.action {
  height: 52px; width: 100%; background: transparent; color: $color-text;
  border: 1px solid #d8d2c5; border-radius: 4px; padding: 0 18px;
  font: 700 14px/20px $font-family-base; text-align: left;
  display: flex; align-items: center; justify-content: space-between;
  text-decoration: none; cursor: pointer; box-sizing: border-box;
}
.action span { font-size: 22px; font-weight: 400; }
.action--selected { background: $color-text; border-color: $color-text; color: $color-text-inverted; }
.action--full { width: 100%; }
.events-view__month { color: #68655e; font-size: 12px; line-height: 16px; font-weight: 700; margin: 0; }
.event-button { display: block; width: 100%; border: 0; padding: 0; background: none; text-align: left; cursor: pointer; color: inherit; }
.events-view__note { color: #68655e; font-size: 12px; line-height: 16px; margin: 0 0 12px; }
.events-view__backline { height: 36px; display: flex; align-items: center; gap: 20px; margin: -19px 0 0; padding-bottom: 30px; border-bottom: 1px solid #d8d2c5; font-size: 12px; font-weight: 700; }
.back-button { width: 36px; height: 36px; padding: 6px; border: 0; background: transparent; cursor: pointer; color: $color-text; display: grid; place-items: center; }
.back-button :deep(svg) { width: 24px; height: 24px; }
.detail-poster { position: relative; height: 188px; overflow: hidden; background: $color-accent-secondary; }
.detail-poster--red { background: $color-accent-primary; }
.detail-poster img { position: absolute; height: 170px; width: 170px; right: -44px; bottom: -20px; }
.detail-poster h2 { position: relative; margin: 17px 18px; font-size: 47px; line-height: 46px; font-weight: 400; display: flex; flex-direction: column; }
.detail-poster--red h2 { color: $color-text-inverted; }
.detail-poster strong { position: absolute; left: 27px; bottom: 25px; font-size: 12px; }
.detail-title { font-size: 27px; line-height: 33px; }
.event-facts { display: flex; flex-direction: column; gap: 18px; }
.event-facts p { margin: 0; display: flex; align-items: center; gap: 10px; color: #68655e; font-size: 14px; line-height: 20px; }
.event-facts :deep(svg) { color: $color-text; width: 18px; height: 18px; flex-shrink: 0; }
.detail-description { margin: 0; color: #68655e; font-size: 14px; line-height: 20px; }
.detail-note { margin: 0; color: #68655e; font-size: 12px; line-height: 16px; }
.saved-confirmation { background: $color-primary; padding: 16px; margin: 0; font-size: 12px; line-height: 22px; color: #68655e; }
.saved-confirmation strong { color: $color-text; }
.empty-saved { margin: 0; padding: 24px 16px; background: #fff; font-size: 14px; line-height: 20px; color: #68655e; }
.saved-info { padding: 18px; background: $color-primary; }
.saved-info__bookmark { width: 26px; height: 26px; display: block; margin-bottom: 12px; }
.saved-info h2 { font-size: 21px; line-height: 27px; font-weight: 400; }
.saved-info p { font-size: 14px; line-height: 20px; color: #68655e; margin: 10px 0 0; }
</style>
