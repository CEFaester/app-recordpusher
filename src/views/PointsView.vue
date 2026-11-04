<script setup>
import { ref, onMounted } from 'vue'

const userPoints = ref(0)
const shopItems = ref([])

onMounted(() => {
  userPoints.value = 1450 

  shopItems.value = [
    { id: 1, name: 'Eksklusiv T-shirt', cost: 500, icon: '👕' },
    { id: 2, name: 'Kold Sodavand', cost: 150, icon: '🥤' },
    { id: 3, name: 'Musik Plakat', cost: 300, icon: '🖼️' },
    { id: 4, name: 'Øl', cost: 200, icon: '🍺' },
    { id: 5, name: 'Film Plakat', cost: 100, icon: '🖼️' },
    { id: 6, name: 'Puslespil', cost: 150, icon: '🧩' }
  ]
})

const handlePurchase = (item) => {
  console.log(`Forbereder QR kode til: ${item.name} for ${item.cost} point`)
}
</script>

<template>
  <div class="points-view">
    <h1 class="page-title">DET GIVER <br> NOGET IGEN.</h1>
    <!-- Point Saldo Boks -->
    <header class="balance-card">
      <h3 class="balance-title">Dine Point</h3>
      <div class="balance-amount">
        <span class="number">{{ userPoints }}</span>
        <span class="label">POINT</span>
      </div>
      <p class="balance-desc">Brug dine point i butikken herunder</p>
    </header>

    <!-- Point Butik -->
    <section class="shop-section">
      <h2 class="shop-title">Din Point Butik</h2>
      
      <div class="shop-grid">
        <article v-for="item in shopItems" :key="item.id" class="shop-item">
          <div class="item-visual">{{ item.icon }}</div>
          
          <div class="item-info">
            <h4 class="item-name">{{ item.name }}</h4>
            <div class="item-price">{{ item.cost }} POINT</div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>


<style lang="scss" scoped>
.points-view {
  display: flex;
  flex-direction: column;
  gap: $space-lg; // Afstand mellem saldo-boks og butik
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
  font-size: 1.25rem;
  font-weight: 700;
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
}

.item-visual {
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