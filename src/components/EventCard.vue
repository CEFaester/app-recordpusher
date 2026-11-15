<script setup>
import { computed } from 'vue'
import vinyl from '@/assets/event-vinyl.svg'

const props = defineProps({
  event: { type: Object, required: true }
})

const posterLines = computed(() => props.event.poster.split('\n'))
</script>

<template>
  <!-- Eventkortet bruges både på forsiden og på eventsiden. -->
  <article class="event-card">
    <div class="event-card__poster" :class="`event-card__poster--${event.theme}`">
      <img :src="vinyl" alt="" class="event-card__vinyl" />
      <div class="event-card__poster-title">
        <span v-for="(line, index) in posterLines" :key="index">{{ line }}</span>
      </div>
    </div>
    <div class="event-card__details">
      <p class="event-card__date">{{ event.shortDate }}</p>
      <h3>{{ event.title }}</h3>
      <p class="event-card__meta">{{ event.meta }}</p>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.event-card {
  width: 100%;
  overflow: hidden;
  border-radius: 6px;
  background: #fff;
}
.event-card__poster {
  background: $color-accent-secondary;
  height: 150px;
  position: relative;
  overflow: hidden;
  &--red { background: $color-accent-primary; }
}
.event-card__vinyl {
  position: absolute;
  width: 152px;
  height: 152px;
  top: 22px;
  right: -27px;
}
.event-card__poster-title {
  position: relative;
  z-index: 1;
  padding: 13px 18px;
  font-family: $font-family-heading;
  font-size: 42px;
  line-height: 43px;
  color: $color-text;
  display: flex;
  flex-direction: column;
}
.event-card__poster--red .event-card__poster-title { color: $color-text-inverted; }
.event-card__details { padding: 16px; display: flex; flex-direction: column; gap: 7px; }
.event-card__details p { margin: 0; }
.event-card__date { font-size: 12px; line-height: 16px; font-weight: 700; color: $color-accent-primary; }
.event-card__details h3 { font-family: $font-family-heading; font-size: 21px; line-height: 27px; font-weight: 400; margin: 0; }
.event-card__meta { font-size: 12px; line-height: 16px; color: #68655e; }
</style>
