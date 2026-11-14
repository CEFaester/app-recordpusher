<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Henter varens ID fra URL'en (f.eks. /points/2)
const itemId = route.params.id
</script>

<template>
  <div class="purchase-view">
    <button type="button" @click="router.back()">← Tilbage</button>
    
    <h1>Valgt vare (ID: {{ itemId }})</h1>
    <p>Her bygger vi betaling og QR-kode bagefter.</p>
  </div>
</template>