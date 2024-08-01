<template>
  <div :class="[theme === 'dark' ? 'bg-dark' : 'bg-light']">
    <div class="container">
      <statistic_list />
      <catigory_list />
    </div>
  </div>
</template>

<script setup>
import statistic_list from "@/components/dashboard/statistic_list.vue";
import catigory_list from "@/components/dashboard/catigory_list.vue";
import { useThemeStore } from "@/stores/theme";
import { storeToRefs } from "pinia";
const theme_store = useThemeStore();
const { theme } = storeToRefs(theme_store);
</script>

<style lang="scss" scoped></style>
