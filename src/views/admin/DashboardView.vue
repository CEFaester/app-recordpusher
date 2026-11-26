<!-- Lavet med hjælp fra AI -->
<script setup>
import { ref } from 'vue'

// Konceptdata til prototypen
const kpiStats = ref([
  {
    id: 'members',
    label: 'Aktive medlemmer',
    value: '148',
    trend: '+18% denne måned',
    accent: 'red'
  },
  {
    id: 'saved',
    label: 'Gemte events i alt',
    value: '92',
    trend: 'I brugernes huskelister',
    accent: 'yellow'
  },
  {
    id: 'redeemed',
    label: 'Indløste pointvarer',
    value: '64',
    trend: '18.350 point brugt',
    accent: 'default'
  },
  {
    id: 'checkin',
    label: 'Fremmøde på gemte',
    value: '78%',
    trend: 'Bekræftet via QR i butik',
    accent: 'default'
  }
])

const topShopItems = ref([
  {
    id: 'item2',
    name: 'Kold Sodavand',
    icon: '🥤',
    redemptions: 31,
    totalPoints: 4650,
    percent: 100
  },
  {
    id: 'item1',
    name: 'Eksklusiv T-shirt',
    icon: '👕',
    redemptions: 19,
    totalPoints: 9500,
    percent: 61
  },
  {
    id: 'item3',
    name: 'Musik Plakat',
    icon: '🖼️',
    redemptions: 14,
    totalPoints: 4200,
    percent: 45
  }
])

const topEvents = ref([
  {
    id: 'fredagslyt',
    title: 'Fredagslyt hos RecordPusher',
    date: 'Fredag · Kl. 16:00',
    savedCount: 54,
    attendedCount: 42,
    attendanceRate: 78
  },
  {
    id: 'vinyl-venner',
    title: 'Vinyl & Venner',
    date: 'Lørdag · Kl. 13:00',
    savedCount: 38,
    attendedCount: 31,
    attendanceRate: 82
  },
  {
    id: 'pladebytte',
    title: 'Søndags-kaffe & Pladebytte',
    date: 'Søndag · Kl. 11:00',
    savedCount: 29,
    attendedCount: 21,
    attendanceRate: 72
  }
])

const recentActivity = ref([
  {
    id: 1,
    user: 'Carl Emil',
    action: 'indløste Eksklusiv T-shirt',
    badge: '-500 POINT',
    badgeType: 'red',
    time: 'For 12 min. siden'
  },
  {
    id: 2,
    user: 'Sofie M.',
    action: 'gemte Fredagslyt hos RecordPusher',
    badge: 'GEMT EVENT',
    badgeType: 'yellow',
    time: 'For 34 min. siden'
  },
  {
    id: 3,
    user: 'Mikkel K.',
    action: 'optjente point ved eventbesøg',
    badge: '+25 POINT',
    badgeType: 'yellow',
    time: 'For 2 timer siden'
  },
  {
    id: 4,
    user: 'Freja L.',
    action: 'indløste Kold Sodavand',
    badge: '-150 POINT',
    badgeType: 'red',
    time: 'I går'
  }
])
</script>

<template>
  <div class="admin-page">
    <header class="page-header">
      <div class="header-top">
        <h1 class="page-title">Oversigt & Indsigt</h1>
        <span class="concept-badge">KONCEPTDATA · SENESTE 30 DAGE</span>
      </div>
      <p class="page-desc">
        Få overblik over hvilke events der trækker folk i butikken, og hvilke varer medlemmerne bruger deres point på.
      </p>
    </header>

    <!-- 1. NØGLETAL (KPI KORT) -->
    <section class="kpi-grid" aria-label="Nøgletal">
      <article
        v-for="stat in kpiStats"
        :key="stat.id"
        class="kpi-card"
        :class="`kpi-card--${stat.accent}`"
      >
        <span class="kpi-label">{{ stat.label }}</span>
        <strong class="kpi-value">{{ stat.value }}</strong>
        <span class="kpi-trend">{{ stat.trend }}</span>
      </article>
    </section>

    <!-- 2. EVENTS & POINTBUTIK SIDE OM SIDE -->
    <section class="analytics-grid">
      <!-- Mest populære pointvarer -->
      <article class="panel-card">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">Mest indløste pointvarer</h2>
            <p class="panel-subtitle">Fordelt på antal indløsninger i butikken</p>
          </div>
          <RouterLink :to="{ name: 'admin-points' }" class="panel-link">
            Administrer →
          </RouterLink>
        </div>

        <div class="bar-list">
          <div v-for="item in topShopItems" :key="item.id" class="bar-item">
            <div class="bar-item__top">
              <span class="bar-item__name">
                <span class="item-emoji">{{ item.icon }}</span>
                {{ item.name }}
              </span>
              <span class="bar-item__meta">
                <strong>{{ item.redemptions }} stk.</strong> ({{ item.totalPoints }} pt)
              </span>
            </div>

            <div class="bar-track">
              <div
                class="bar-fill bar-fill--red"
                :style="{ width: `${item.percent}%` }"
              ></div>
            </div>
          </div>
        </div>
      </article>

      <!-- Events der klarer sig bedst -->
      <article class="panel-card">
        <div class="panel-header">
          <div>
            <h2 class="panel-title">Events der klarer sig bedst</h2>
            <p class="panel-subtitle">Gemte huskelister sammenlignet med fremmøde</p>
          </div>
          <RouterLink :to="{ name: 'admin-events' }" class="panel-link">
            Administrer →
          </RouterLink>
        </div>

        <div class="bar-list">
          <div v-for="event in topEvents" :key="event.id" class="bar-item">
            <div class="bar-item__top">
              <div class="event-heading">
                <span class="bar-item__name">{{ event.title }}</span>
                <span class="event-date">{{ event.date }}</span>
              </div>
              <span class="rate-badge">{{ event.attendanceRate }}% mødt op</span>
            </div>

            <div class="bar-track">
              <div
                class="bar-fill bar-fill--yellow"
                :style="{ width: `${event.attendanceRate}%` }"
              ></div>
            </div>

            <p class="bar-item__footnote">
              {{ event.savedCount }} har gemt eventet · {{ event.attendedCount }} bekræftede besøg
            </p>
          </div>
        </div>
      </article>
    </section>

    <!-- 3. SENESTE MEDLEMSAKTIVITET -->
    <section class="panel-card">
      <div class="panel-header">
        <div>
          <h2 class="panel-title">Seneste aktivitet i appen</h2>
          <p class="panel-subtitle">Eksempel på live-hændelser fra medlemmerne</p>
        </div>
      </div>

      <ul class="activity-list">
        <li v-for="entry in recentActivity" :key="entry.id" class="activity-row">
          <div class="activity-main">
            <strong>{{ entry.user }}</strong> {{ entry.action }}
            <span class="activity-time">{{ entry.time }}</span>
          </div>
          <span
            class="activity-badge"
            :class="`activity-badge--${entry.badgeType}`"
          >
            {{ entry.badge }}
          </span>
        </li>
      </ul>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.admin-page {
  display: flex;
  flex-direction: column;
  gap: $space-lg;
  box-sizing: border-box;
}

/* =========================================
   HEADER
   ========================================= */
.page-header {
  display: flex;
  flex-direction: column;
  gap: $space-xs;
}

.header-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: $space-sm;
}

.page-title {
  font-size: $font-size-large;
  font-weight: 700;
  color: $color-text;
  margin: 0;
}

.concept-badge {
  background-color: $color-accent-secondary;
  color: $color-text;
  font-size: $font-size-small;
  font-weight: 700;
  padding: 4px $space-sm;
}

.page-desc {
  font-size: $font-size-small;
  color: $color-text;
  opacity: 0.75;
  margin: 0;
}

/* =========================================
   KPI KORT
   ========================================= */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
  gap: $space-md;
}

.kpi-card {
  background-color: $color-primary;
  padding: $space-md;
  display: flex;
  flex-direction: column;
  gap: $space-xs;
  min-width: 0;
  box-sizing: border-box;

  &--red {
    background-color: $color-accent-primary;
    color: $color-text-inverted;

    .kpi-label,
    .kpi-trend {
      opacity: 0.9;
    }
  }

  &--yellow {
    background-color: $color-accent-secondary;
    color: $color-text;
  }
}

.kpi-label {
  font-size: $font-size-small;
  font-weight: 600;
}

.kpi-value {
  font-family: $font-family-heading;
  font-size: 2.25rem;
  font-weight: 400;
  line-height: 1.1;
  margin: $space-xs 0;
}

.kpi-trend {
  font-size: $font-size-small;
  opacity: 0.75;
}

/* =========================================
   ANALYSE PANELER & SØJLER
   ========================================= */
.analytics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 360px), 1fr));
  gap: $space-md;
}

.panel-card {
  background-color: $color-primary;
  padding: $space-md;
  display: flex;
  flex-direction: column;
  gap: $space-md;
  min-width: 0;
  box-sizing: border-box;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: $space-sm;
  padding-bottom: $space-sm;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.panel-title {
  font-size: $font-size-base;
  font-weight: 700;
  color: $color-text;
  margin: 0;
}

.panel-subtitle {
  font-size: $font-size-small;
  color: $color-text;
  opacity: 0.7;
  margin: 2px 0 0 0;
}

.panel-link {
  font-size: $font-size-small;
  font-weight: 700;
  color: $color-accent-primary;
  text-decoration: none;
  white-space: nowrap;

  &:hover {
    text-decoration: underline;
  }
}

.bar-list {
  display: flex;
  flex-direction: column;
  gap: $space-md;
}

.bar-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.bar-item__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: $space-sm;
}

.bar-item__name {
  font-size: $font-size-base;
  font-weight: 600;
  color: $color-text;
  display: flex;
  align-items: center;
  gap: $space-xs;
}

.item-emoji {
  font-size: 1.15rem;
}

.event-heading {
  display: flex;
  flex-direction: column;
}

.event-date {
  font-size: $font-size-small;
  opacity: 0.7;
}

.bar-item__meta {
  font-size: $font-size-small;
  color: $color-text;
  white-space: nowrap;
}

.rate-badge {
  background-color: $color-background;
  color: $color-text;
  font-size: $font-size-small;
  font-weight: 700;
  padding: 2px $space-sm;
  white-space: nowrap;
}

.bar-track {
  width: 100%;
  height: 10px;
  background-color: $color-background;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  transition: width 0.3s ease;

  &--red {
    background-color: $color-accent-primary;
  }

  &--yellow {
    background-color: $color-text;
  }
}

.bar-item__footnote {
  margin: 0;
  font-size: $font-size-small;
  color: $color-text;
  opacity: 0.75;
}

/* =========================================
   AKTIVITETSLISTE
   ========================================= */
.activity-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.activity-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: $space-sm;
  padding: $space-sm 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
}

.activity-main {
  font-size: $font-size-small;
  color: $color-text;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: $space-xs;
}

.activity-time {
  opacity: 0.6;
  margin-left: $space-xs;
}

.activity-badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 3px $space-sm;

  &--red {
    background-color: $color-accent-primary;
    color: $color-text-inverted;
  }

  &--yellow {
    background-color: $color-accent-secondary;
    color: $color-text;
  }
}
</style>