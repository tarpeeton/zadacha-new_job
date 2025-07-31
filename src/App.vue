<script setup lang="ts">
import Navigation from './components/Navigation/Navigation.vue'
</script>

<template>
  <Navigation />
  <div class="content">
    <router-view />
  </div>
</template>

<style scoped>
.content {
  padding-left: 320px;
}
</style>
