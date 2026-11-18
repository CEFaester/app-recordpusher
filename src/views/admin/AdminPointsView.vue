<script setup>
import { ref, onMounted } from 'vue'
import { getShopItems, createShopItem, deleteShopItem } from '@/services/shopService'

const items = ref([])
const newName = ref('')
const newCost = ref('')
const newImage = ref('')
const newIcon = ref('🎁')
const fileInputRef = ref(null)
const isSaving = ref(false)
const isProcessingImage = ref(false)

onMounted(async () => {
  items.value = await getShopItems()
})

/**
 * Skalerer og komprimerer billedet i browseren til WebP (~15-25 KB),
 * så det ikke belaster Firebase Realtime Database
 */
const compressImage = (file, maxSize = 320, quality = 0.75) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      let { width, height } = img

      if (width > height && width > maxSize) {
        height = Math.round((height * maxSize) / width)
        width = maxSize
      } else if (height > maxSize) {
        width = Math.round((width * maxSize) / height)
        height = maxSize
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)

      resolve(canvas.toDataURL('image/webp', quality))
    }

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('Kunne ikke indlæse billedfilen.'))
    }

    img.src = objectUrl
  })
}

const handleFileUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  try {
    isProcessingImage.value = true
    newImage.value = await compressImage(file)
  } catch (error) {
    console.error(error)
  } finally {
    isProcessingImage.value = false
  }
}

const clearSelectedImage = () => {
  newImage.value = ''
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const addItem = async () => {
  if (!newName.value || !newCost.value) return

  try {
    isSaving.value = true
    const created = await createShopItem({
      name: newName.value.trim(),
      cost: Number(newCost.value),
      image: newImage.value,
      icon: newIcon.value.trim() || '🎁'
    })

    items.value.push(created)
    newName.value = ''
    newCost.value = ''
    newIcon.value = '🎁'
    clearSelectedImage()
  } catch (error) {
    console.error(error)
  } finally {
    isSaving.value = false
  }
}

const removeItem = async (id) => {
  try {
    await deleteShopItem(id)
    items.value = items.value.filter((item) => item.id !== id)
  } catch (error) {
    console.error(error)
  }
}
</script>

<template>
  <div class="admin-page">
    <header class="page-header">
      <h1 class="page-title">Administrer Point Butik</h1>
      <p class="page-desc">
        Upload et billede direkte fra din enhed, eller brug en emoji som reserve.
      </p>
    </header>

    <form @submit.prevent="addItem" class="admin-form">
      <input v-model="newName" type="text" placeholder="Varenavn" class="form-input" required />
      <input v-model="newCost" type="number" placeholder="Pris i point" class="form-input" required />

      <!-- Billed-upload knap -->
      <label class="file-upload-btn">
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          class="hidden-file-input"
          @change="handleFileUpload"
        />
        <span v-if="isProcessingImage">Behandler billede...</span>
        <span v-else-if="newImage">✓ Billede valgt (skift)</span>
        <span v-else>+ Vælg billede</span>
      </label>

      <!-- Forhåndsvisning hvis et billede er valgt -->
      <div v-if="newImage" class="upload-preview">
        <img :src="newImage" alt="Forhåndsvisning" />
        <button type="button" class="clear-preview-btn" @click="clearSelectedImage" aria-label="Fjern billede">
          &times;
        </button>
      </div>

      <input v-model="newIcon" type="text" placeholder="Emoji (🎁)" class="form-input icon-input" />
      
      <button type="submit" class="action-btn" :disabled="isSaving || isProcessingImage">
        {{ isSaving ? 'Gemmer...' : '+ Tilføj vare' }}
      </button>
    </form>

    <div class="items-grid">
      <article v-for="item in items" :key="item.id" class="admin-card">
        <div class="card-top">
          <div class="card-visual">
            <img v-if="item.image" :src="item.image" :alt="item.name" />
            <span v-else class="card-icon">{{ item.icon || '🎁' }}</span>
          </div>
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
  align-items: center;
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

.hidden-file-input {
  display: none;
}

.file-upload-btn {
  flex: 1 1 180px;
  padding: $space-sm $space-md;
  border: 1px dashed $color-text;
  background-color: $color-background;
  color: $color-text;
  font-size: $font-size-small;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  user-select: none;

  &:active {
    opacity: 0.8;
  }
}

.upload-preview {
  position: relative;
  width: 44px;
  height: 44px;
  background-color: $color-background;
  border: 1px solid rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.clear-preview-btn {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 18px;
  height: 18px;
  border: none;
  background-color: $color-accent-primary;
  color: $color-text-inverted;
  font-size: 12px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
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

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
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

.card-visual {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
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