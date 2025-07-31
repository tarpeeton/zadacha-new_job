<script lang="ts" setup>
import { NAVIGATION } from '../../constants/nav-items'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

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

<!-- style -->

<style scoped>
.nav__content {
  width: 280px;
  max-width: 280px;
  padding: 32px 20px;
  height: 100vh;
  position: fixed;
  top: 0;
  background: linear-gradient(to bottom, #334d49, #1f2d3b);
}
.user-info {
  display: flex;
  flex-direction: row;
  gap: 8px;
}
.divider {
  width: 100%;
  height: 2px;
  background-color: white;
  opacity: 11%;
  margin: 20px 0;
}
.user-info__name {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.user-info__name h1 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: white;
}
.user-info__name span {
  margin: 0;
  font-size: 14px;
  color: white;
  opacity: 66%;
}
.user-info__avatar {
  width: 40px;
  max-width: 40px;
  border-radius: 8px;
  aspect-ratio: 1;
}
/* navigation */
.icon {
  width: 24px;
  aspect-ratio: 1;
}

.nav-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.nav-item {
  all: unset;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  padding: 8px 12px;
}
.nav-items__label {
  font-size: 16px;
  color: white;
}
.nav-item.active {
  background: linear-gradient(to right, #2f4746 40%, rgba(255, 255, 255, 0.13) 100%);

  backdrop-filter: blur(10.9px);
  -webkit-backdrop-filter: blur(10.9px);
  font-weight: 700;
  border-radius: 8px;
}

.user-actions {
  position: absolute;
  bottom: 100px;
  left: 100px;
  widows: 90%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: center;
  align-items: center;
}

.support {
  all: unset;
  font-size: 14px;
  color: white;
}
.user-actions__logout {
  background: inherit;
  border: none;
  outline: none;
  cursor: pointer;
  color: #ff5b5b;
  font-size: 14px;
}

</style>
