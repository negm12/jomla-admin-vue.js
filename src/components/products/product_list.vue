<template>
  <div
    class="product-list"
    :class="[theme === 'dark' ? 'bg--primary-dark' : 'bg--primary-light']"
  >
    <div class="container">
      <product_card
        v-for="(prod, i) in product_store.get_products"
        :key="i"
        :prod
      />
    </div>
  </div>
</template>

<script setup>
import product_card from "@/components/products/product_card.vue";
import { useThemeStore } from "@/stores/theme";
import { storeToRefs } from "pinia";
const theme_store = useThemeStore();
const { theme } = storeToRefs(theme_store);

import { useProductStore } from "@/stores/product_store";
const product_store = useProductStore();
import { useRoute } from "vue-router";
import { watch } from "vue";
const route = useRoute();
// console.log(route.query);

product_store.fetch_products(route.query.catigory);

watch(
  () => route.query,
  () => {
    product_store.fetch_products(route.query.catigory);
  }
);
</script>

<style lang="scss" scoped>
.product-list {
  margin-top: 30px;
  .container {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }
}
</style>
