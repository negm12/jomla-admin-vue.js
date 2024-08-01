<template>
  <div :class="[theme === 'dark' ? 'bg-dark' : 'bg-light']">
    <order_list />
  </div>
</template>

<script setup>
import order_list from "@/components/orders/order_list.vue";
import { useThemeStore } from "@/stores/theme";
import { storeToRefs } from "pinia";
const theme_store = useThemeStore();
const { theme } = storeToRefs(theme_store);
</script>

<style lang="scss" scoped></style>
