<!-- Lavet med hjælp fra AI -->
<script setup>
import { ref, onMounted } from 'vue'
import EventCard from '@/components/EventCard.vue'
import { getEvents, createEvent, updateEvent, deleteEvent, formatEventDates } from '@/services/eventService'

const events = ref([])
const isLoading = ref(true)
const isSaving = ref(false)
const editingId = ref(null)
const errorMessage = ref('')
const successMessage = ref('')
// Samme formular bruges til både nye events og redigering af eksisterende.
const emptyForm = () => ({
  title: '', poster: '', theme: 'yellow', day: '', startTime: '', endTime: '',
  meta: '', description: '', points: 25
})
const form = ref(emptyForm())

async function loadEvents() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    events.value = await getEvents()
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
}

onMounted(loadEvents)

function resetForm() {
  editingId.value = null
  form.value = emptyForm()
}

function startEditing(event) {
  editingId.value = event.id
  form.value = Object.fromEntries(Object.entries(emptyForm()).map(([key, fallback]) => [key, event[key] ?? fallback]))
  errorMessage.value = ''
  successMessage.value = ''
}

async function saveEvent() {
  if (isSaving.value) return
  errorMessage.value = ''
  successMessage.value = ''
  const { title, poster, theme, day, startTime, endTime, meta, description, points } = form.value

  if (!title.trim() || !poster.trim() || !day || !startTime || !meta.trim() || !description.trim() || points === '' || !Number.isInteger(Number(points)) || Number(points) < 0) {
    errorMessage.value = 'Udfyld alle obligatoriske felter. Point skal være et helt tal på mindst 0.'
    return
  }
  if (endTime && endTime <= startTime) {
    errorMessage.value = 'Sluttidspunktet skal ligge efter starttidspunktet.'
    return
  }

  isSaving.value = true
  try {
    const eventData = {
      title: title.trim(), poster: poster.trim(), theme, day, startTime, endTime,
      meta: meta.trim(), description: description.trim(), points: Number(points),
      ...formatEventDates(day, startTime, endTime)
    }
    if (editingId.value) {
      await updateEvent(editingId.value, eventData)
      successMessage.value = 'Eventet er opdateret.'
    } else {
      await createEvent(eventData)
      successMessage.value = 'Eventet er oprettet.'
    }
    resetForm()
    await loadEvents()
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isSaving.value = false
  }
}

async function removeEvent(event) {
  if (isSaving.value || !window.confirm(`Vil du slette "${event.title}"?`)) return
  isSaving.value = true
  errorMessage.value = ''
  successMessage.value = ''
  try {
    await deleteEvent(event.id)
    if (editingId.value === event.id) resetForm()
    events.value = events.value.filter((item) => item.id !== event.id)
    successMessage.value = 'Eventet er slettet.'
  } catch (error) {
    errorMessage.value = error.message
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="admin-page">
    <header>
      <h1 class="page-title">Administrer events</h1>
      <p class="page-desc">Opret, rediger og slet events. Ændringerne gemmes i Firebase og vises i appen, næste gang events hentes.</p>
    </header>

    <form class="admin-form" @submit.prevent="saveEvent">
      <h2>{{ editingId ? 'Rediger event' : 'Opret nyt event' }}</h2>
      <fieldset class="form-grid" :disabled="isSaving || isLoading">
        <label>Eventnavn
          <input v-model="form.title" class="form-input" required maxlength="90" placeholder="Fredagslyt hos RecordPusher" />
        </label>
        <label>Plakattekst (én linje pr. række)
          <textarea v-model="form.poster" class="form-input" required rows="2" maxlength="32" placeholder="FREDAGS&#10;LYT." />
        </label>
        <label>Plakatfarve
          <select v-model="form.theme" class="form-input">
            <option value="yellow">Gul</option>
            <option value="red">Rød</option>
          </select>
        </label>
        <label>Dato
          <input v-model="form.day" class="form-input" type="date" required />
        </label>
        <label>Starttidspunkt
          <input v-model="form.startTime" class="form-input" type="time" required />
        </label>
        <label>Sluttidspunkt (valgfrit)
          <input v-model="form.endTime" class="form-input" type="time" />
        </label>
        <label>Point ved eventbesøg
          <input v-model.number="form.points" class="form-input" type="number" min="0" step="1" required />
        </label>
        <label>Kort information
          <input v-model="form.meta" class="form-input" required maxlength="120" placeholder="Gratis · Tag en ven med" />
        </label>
        <label class="form-wide">Beskrivelse
          <textarea v-model="form.description" class="form-input" rows="4" required />
        </label>
        <div class="form-actions form-wide">
          <button type="submit" class="action-btn">{{ isSaving ? 'Gemmer...' : editingId ? 'Gem ændringer' : '+ Opret event' }}</button>
          <button v-if="editingId" type="button" class="secondary-btn" @click="resetForm">Annuller</button>
        </div>
      </fieldset>
    </form>

    <p v-if="errorMessage" class="message message--error" role="alert">{{ errorMessage }}</p>
    <p v-if="successMessage" class="message" role="status">{{ successMessage }}</p>

    <section class="event-section">
      <h2>Events i databasen</h2>
      <p v-if="isLoading" role="status">Henter events...</p>
      <button v-else-if="errorMessage" type="button" class="secondary-btn" :disabled="isSaving" @click="loadEvents">Hent listen igen</button>
      <p v-if="!isLoading && !errorMessage && !events.length">Der er ingen events endnu. Opret det første ovenfor.</p>
      <div class="items-grid">
        <article v-for="event in events" :key="event.id" class="admin-card">
          <EventCard :event="event" />
          <div class="form-actions">
            <button type="button" class="secondary-btn" :disabled="isSaving || isLoading" @click="startEditing(event)">Rediger</button>
            <button type="button" class="delete-btn" :disabled="isSaving || isLoading" @click="removeEvent(event)">Slet event</button>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.admin-page { display: flex; flex-direction: column; gap: $space-lg; }
.page-title { font-size: $font-size-large; color: $color-text; margin: 0 0 $space-xs; }
.page-desc { margin: 0; font-size: $font-size-small; opacity: 0.75; }
h2 { font-size: $font-size-base; margin: 0 0 $space-md; }
.admin-form { background: $color-primary; padding: $space-md; }
.form-grid { border: 0; padding: 0; margin: 0; min-width: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 230px), 1fr)); gap: $space-md; }
.form-grid label { display: flex; flex-direction: column; gap: $space-xs; font-size: $font-size-small; font-weight: 600; min-width: 0; }
.form-input { width: 100%; padding: $space-sm; border: 1px solid rgba(0,0,0,.15); background: $color-background; color: $color-text; font: inherit; font-weight: 400; box-sizing: border-box; }
textarea { resize: vertical; }
.form-wide { grid-column: 1 / -1; }
.form-actions { display: flex; gap: $space-sm; flex-wrap: wrap; }
.action-btn, .secondary-btn, .delete-btn { font: inherit; font-weight: 600; padding: $space-sm $space-md; cursor: pointer; border: 1px solid $color-text; background: transparent; color: $color-text; }
.action-btn { background: $color-accent-primary; color: $color-text-inverted; border-color: $color-accent-primary; }
.delete-btn { color: $color-accent-primary; border-color: $color-accent-primary; }
button:disabled { opacity: .5; cursor: not-allowed; }
.items-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: $space-md; }
.admin-card { background: $color-primary; padding: $space-md; display: flex; flex-direction: column; gap: $space-md; min-width: 0; }
.admin-card .form-actions { margin-top: auto; }
.message { margin: 0; padding: $space-sm $space-md; background: $color-primary; }
.message--error { border-left: 3px solid $color-accent-primary; }
</style>
