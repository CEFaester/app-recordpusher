<!-- Lavet med hjælp fra AI -->
<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getShopItems } from '@/services/shopService'
import { currentUser } from '@/services/userService'

const router = useRouter()
const shopItems = ref([])
const isLoading = ref(true)
const errorMessage = ref('')

onMounted(async () => {
  try {
    isLoading.value = true
    shopItems.value = await getShopItems()
  } catch (error) {
    errorMessage.value = 'Kunne ikke indlæse varer lige nu.'
    console.error(error)
  } finally {
    isLoading.value = false
  }
})

const handlePurchase = (item) => {
  router.push({ name: 'purchase', params: { id: item.id } })
}
</script>

<template>
  <div class="points-view">

      <div class="page-header">
        <p class="eyebrow">GOD MUSIK. GODE FORDELE.</p>
        <h1 class="page-title">DET SKER<br />I BUTIKKEN.</h1>
      </div>
    
    <header class="balance-card">
      <h3 class="balance-title">Dine Point</h3>
      <div class="balance-amount">
        <span class="number">{{ currentUser ? currentUser.points : 0 }}</span>
        <span class="label">POINT</span>
      </div>
      <p class="balance-desc">
        {{ currentUser ? 'Brug dine point i butikken herunder' : 'Log ind på din profil for at bruge point' }}
      </p>
    </header>

    <!-- Point Butik -->
    <section class="shop-section">
      <h2 class="shop-title">Din Point Butik</h2>
      
      <p v-if="isLoading" class="status-text">Indlæser butik...</p>
      <p v-else-if="errorMessage" class="status-text error">{{ errorMessage }}</p>

      <div v-else class="shop-grid">
        <button 
          v-for="item in shopItems" 
          :key="item.id" 
          type="button"
          class="shop-item"
          @click="handlePurchase(item)"
        >
          <div class="item-visual">
            <img v-if="item.image" :src="item.image" :alt="item.name" />
            <span v-else>{{ item.icon || '🎁' }}</span>
          </div>
          
          <div class="item-info">
            <h4 class="item-name">{{ item.name }}</h4>
            <div class="item-price">{{ item.cost }} POINT</div>
          </div>
        </button>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.points-view {
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

/* =========================================
   SALDO BOKS
   ========================================= */
.balance-card {
  background-color: $color-accent-primary;
  color: $color-text-inverted;
  padding: $space-lg;
  text-align: flex-start;
  margin-top: $space-md;
}

.balance-title {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: $space-xs;
}

.balance-amount {
  display: flex;
  align-items: baseline;
  justify-content: flex-start;
  gap: 4px;
  
  .number {
    font-size: 3rem;
    font-weight: 800;
    line-height: 1;
  }
  
  .label {
    font-size: 1.2rem;
    font-weight: 600;
  }
}

.balance-desc {
  font-size: 0.85rem;
  margin-top: $space-sm;
  opacity: 0.8;
}

.shop-title {
  font-size: $font-size-large;
  font-weight: 500;
  margin-bottom: $space-md;
  color: $color-text;
}

.shop-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: $space-md;
}

.shop-item {
  background-color: $color-primary;
  padding: $space-md;
  display: flex;
  flex-direction: column;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  border: none;
  width: 100%;
  text-align: left;
  font-family: inherit;
  cursor: pointer;
  transition: transform 0.15s ease, opacity 0.15s ease;

  &:active {
    transform: scale(0.97);
    opacity: 0.9;
  }
}

.item-visual {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex: 1;
  min-height: 0;
  font-size: 3rem; // Gør emojien stor - udskift med <img> tag senere
  margin-bottom: $space-xs;
  align-self: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain; // Bevarer billedets proportioner perfekt (ingen strækning eller beskæring)
  }
}

.item-info {
  display: flex;
  flex-direction: column;
  margin-bottom: $space-xs;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 4px;
}

.item-name {
  font-size: $font-size-small;
  font-weight: 600;
  color: $color-text;
  line-height: 1.3;
  margin: 0;
}

.item-price {
  background-color: $color-accent-secondary;
  padding: $space-xs $space-sm;
  font-size: $font-size-small;
  color: $color-text;
  font-weight: 700;
}
</style>