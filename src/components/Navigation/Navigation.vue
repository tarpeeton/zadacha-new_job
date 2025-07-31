<script lang="ts" setup>
import { NAVIGATION } from '../../constants/nav-items'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import '@/assets/Navigation.css'

const route = useRoute()

const activeUrl = computed(() => route.path)
</script>

<template>
  <div class="nav__content">
    <div class="user-info">
      <img
        class="user-info__avatar"
        src="https://ucarecdn.com/35b56c68-9277-4a72-b839-89bd03255103/-/preview/256x256/"
        alt="Rustam Kidiraliyev Avatar"
        loading="lazy"
      />
      <div class="user-info__name">
        <h1>Kidiraliyev Rustam</h1>
        <span> 1 500 000 сум</span>
      </div>
    </div>
    <div class="divider"></div>

    <div class="nav-items">
      <router-link
        v-for="item in NAVIGATION"
        :key="item.id"
        :to="item.url"
        class="nav-item"
        :class="{ active: activeUrl === item.url }"
      >
        <div class="icon">
          <img :src="item.icon" alt="icon" class="icon" loading="lazy" />
        </div>
        <span class="nav-items__label">{{ item.name }}</span>
      </router-link>
    </div>

    <div class="user-actions">
      <a href="/support" class="support"> Поддержка </a>
      <button class="user-actions__logout">Выйти</button>
    </div>
  </div>
</template>
