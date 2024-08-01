<template>
  <div class="theme" :class="[theme === 'dark' ? 'bg-dark' : 'bg-light']">
    <div class="light" @click="toggle_theme('dark')" v-if="theme === 'light'">
      <i class="fa-regular fa-sun"></i>
    </div>
    <div class="dark" @click="toggle_theme('light')" v-if="theme === 'dark'">
      <i class="fa-regular fa-moon"></i>
    </div>
  </div>
</template>

<script setup>
import { useThemeStore } from "@/stores/theme";
import { storeToRefs } from "pinia";
const theme_store = useThemeStore();
const { theme } = storeToRefs(theme_store);
const { toggle_theme } = theme_store;
</script>

<style lang="scss" scoped>
.theme {
  cursor: pointer;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  gap: 15px;
  width: 40px;
  border-radius: 50px;
  .light,
  .dark {
    padding: 5px;
    width: 100%;
    height: 100%;
    border-radius: 50px;
    transition: all 0.4s ease-in-out;
  }
  .light {
    display: flex;
    flex-direction: row;
  }
  .dark {
    display: flex;
    flex-direction: row-reverse;
  }
}

// .bg-dark {
//   background-color: var(--primary-bg-dark);
//   color: var(--main-color);
// }
// .bg-light {
//   background-color: var(--primary-color);
// }
</style>
