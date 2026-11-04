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

    <!-- Point Saldo Boks -->
    <header class="balance-card">
      <h2 class="balance-title">Din Pointsaldo</h2>
      <div class="balance-amount">
        <span class="number">{{ userPoints }}</span>
        <span class="label">pt</span>
      </div>
      <p class="balance-desc">Brug dine point i butikken herunder</p>
    </header>

    <!-- Point Butik -->
    <section class="shop-section">
      <h3 class="shop-title">Point Butik</h3>
      
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
  text-align: center;
  margin-top: $space-md;
}

.balance-title {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: $space-xs;
  opacity: 0.9;
}

.balance-amount {
  display: flex;
  align-items: baseline;
  justify-content: center;
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
  background-color: $color-accent-secondary;
  padding: $space-md;
  display: flex;
  flex-direction: column;
  align-items: left;
  text-align: left;
}

.item-visual {
  font-size: 3rem; // Gør emojien stor - udskift med <img> tag senere
  margin-bottom: $space-sm;
}

.item-info {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: $space-md;
}

.item-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: $color-text;
  line-height: 1.3;
}

.item-price {
  background-color: $color-primary;
  padding: $space-xs $space-sm;
  font-size: 0.85rem;
  color: $color-text;
  font-weight: 700;
}

.buy-btn {
  width: 100%;
  padding: 8px 16px;
  background-color: #f1f5f9;
  color: $color-text;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:active {
    background-color: $color-primary;
    color: #ffffff;
  }
}
</style>