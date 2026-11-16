<script setup>
import { ref, onMounted } from 'vue'
import { getShopItems } from '@/services/shopService'

const items = ref([])
const newName = ref('')
const newCost = ref('')
const newIcon = ref('🎁')

onMounted(async () => {
  items.value = await getShopItems()
})

const addItem = () => {
  if (!newName.value || !newCost.value) return

  items.value.push({
    id: Date.now(),
    name: newName.value,
    cost: Number(newCost.value),
    icon: newIcon.value || '🎁'
  })

  newName.value = ''
  newCost.value = ''
  newIcon.value = '🎁'
}

const removeItem = (id) => {
  items.value = items.value.filter((item) => item.id !== id)
}
</script>

<template>
  <div class="admin-page">
    <header class="page-header">
      <h1 class="page-title">Administrer Point Butik</h1>
      <p class="page-desc">Tilføj eller fjern varer, som brugerne kan købe for deres point.</p>
    </header>

    <!-- Formular til ny vare (bryder automatisk på små skærme) -->
    <form @submit.prevent="addItem" class="admin-form">
      <input v-model="newIcon" type="text" placeholder="Ikon (f.eks. 👕)" class="form-input icon-input" />
      <input v-model="newName" type="text" placeholder="Varenavn" class="form-input" required />
      <input v-model="newCost" type="number" placeholder="Pris i point" class="form-input" required />
      <button type="submit" class="action-btn">+ Tilføj vare</button>
    </form>

    <!-- Responsivt grid uden media queries -->
    <div class="items-grid">
      <article v-for="item in items" :key="item.id" class="admin-card">
        <div class="card-top">
          <span class="card-icon">{{ item.icon }}</span>
          <span class="card-badge">{{ item.cost }} POINT</span>
        </div>
        <h3 class="card-title">{{ item.name }}</h3>
        <button type="button" class="delete-btn" @click="removeItem(item.id)">Fjern vare</button>
      </article>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.admin-page {
  display: flex;
  flex-direction: column;
  gap: $space-lg;
}

.page-title {
  font-size: $font-size-large;
  font-weight: 700;
  color: $color-text;
  margin: 0 0 $space-xs 0;
}

.page-desc {
  font-size: $font-size-small;
  color: $color-text;
  opacity: 0.75;
  margin: 0;
}

.admin-form {
  display: flex;
  flex-wrap: wrap;
  gap: $space-sm;
  background-color: $color-primary;
  padding: $space-md;
}

.form-input {
  flex: 1 1 180px;
  padding: $space-sm;
  border: 1px solid rgba(0, 0, 0, 0.15);
  background-color: $color-background;
  color: $color-text;
  font-family: inherit;
  font-size: $font-size-base;

  &.icon-input {
    flex: 0 1 90px;
    text-align: center;
  }
}

.action-btn {
  flex: 1 1 160px;
  padding: $space-sm $space-md;
  background-color: $color-accent-primary;
  color: $color-text-inverted;
  border: none;
  font-weight: 600;
  font-size: $font-size-base;
  cursor: pointer;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
  gap: $space-md;
}

.admin-card {
  background-color: $color-primary;
  padding: $space-md;
  display: flex;
  flex-direction: column;
  gap: $space-sm;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-icon {
  font-size: 2rem;
}

.card-badge {
  background-color: $color-accent-secondary;
  color: $color-text;
  font-size: $font-size-small;
  font-weight: 700;
  padding: 4px $space-sm;
}

.card-title {
  font-size: $font-size-base;
  font-weight: 600;
  color: $color-text;
  margin: 0;
}

.delete-btn {
  margin-top: auto;
  align-self: flex-start;
  background: none;
  border: 1px solid $color-accent-primary;
  color: $color-accent-primary;
  padding: 6px $space-sm;
  font-size: $font-size-small;
  font-weight: 600;
  cursor: pointer;
}
</style>