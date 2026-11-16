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
  background-color: $color-primary;
}

.event-card__poster {
  background-color: $color-accent-secondary;
  height: 150px;
  position: relative;
  overflow: hidden;

  &--red {
    background-color: $color-accent-primary;
  }
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
  padding: $space-md;
  font-family: $font-family-heading;
  font-size: 2.6rem;
  line-height: 1.05;
  color: $color-text;
  display: flex;
  flex-direction: column;
}

.event-card__poster--red .event-card__poster-title {
  color: $color-text-inverted;
}

.event-card__details {
  padding: $padding-card;
  display: flex;
  flex-direction: column;
  gap: $space-xs;
}

.event-card__date {
  margin: 0;
  font-size: $font-size-small;
  font-weight: 700;
  color: $color-accent-primary;
}

.event-card__title {
  margin: 0;
  font-family: $font-family-heading;
  font-size: 1.35rem;
  line-height: 1.25;
  font-weight: 400;
  color: $color-text;
}

.event-card__meta {
  margin: 0;
  font-size: $font-size-small;
  color: color.adjust($color-text, $lightness: 30%);
}
</style>