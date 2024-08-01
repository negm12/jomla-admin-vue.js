<template>
  <div
    class="card"
    :class="[theme === 'dark' ? 'bg-primary-dark' : 'bg-primary-light']"
  >
    <div class="icon" :class="[theme === 'dark' ? 'bg-dark' : 'bg-light']">
      <i class="fa-solid" :class="`fa-${icon}`"></i>
    </div>
    <div class="main">
      <div class="count">{{ stats }}</div>
      <div class="statistic-name">{{ name }}</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(["name", "icon", "stats"]);
import { useThemeStore } from "@/stores/theme";
import { storeToRefs } from "pinia";
const theme_store = useThemeStore();
const { theme } = storeToRefs(theme_store);

// console.log(props.statistic.count);
// const counter = () => {
//   const count = 0;
//   const divedBy = 100;
//   const
// };
</script>

<style lang="scss" scoped>
.bg-primary-dark {
  box-shadow: var(--main-dark-shadow) !important;
}
.bg-primary-light {
  box-shadow: var(--main-shadow) !important;
}
.card {
  display: flex;
  gap: 15px;
  align-items: center;
  justify-content: center;
  .icon {
    font-size: 20px;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: grid;
    place-items: center;
  }
  .main {
    font-weight: bold;
    .count {
      font-size: 18px;
    }
    .statistic-name {
      color: var(--main-text-color);
      font-size: 12px;
    }
  }
}
</style>
