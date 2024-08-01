<template>
  <div class="order-list" :class="[theme === 'dark' ? 'bg-dark' : 'bg-light']">
    <div class="container">
      <table
        class="order-list"
        :class="[theme === 'dark' ? 'bg-dark' : 'bg-light']"
      >
        <thead
          class="order-list"
          :class="[theme === 'dark' ? 'bg-dark' : 'bg-light']"
        >
          <th>product</th>
          <th>price / unit</th>
          <th>sale</th>
          <th>total price</th>
          <th>size</th>
          <th>color</th>
          <th>user</th>
          <th>quantity</th>
          <th>state</th>
          <th>actions</th>
        </thead>
        <tbody>
          <order v-for="(order, i) in orders" :key="i" :order />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import order from "@/components/orders/order.vue";
import { useThemeStore } from "@/stores/theme";
import axios from "axios";
import { storeToRefs } from "pinia";
import { ref } from "vue";
const theme_store = useThemeStore();
const { theme } = storeToRefs(theme_store);

const orders = ref(null);
const error = ref({});
(async () => {
  try {
    const res = await axios.get("api/shop/orders");
    orders.value = await res.data.orders;
    // console.log(orders.value);
  } catch (err) {
    error.value = err.response.data;
  }
})();
</script>

<style lang="scss" scoped>
.order-list {
  padding-top: 30px;
  table {
    width: 100%;
    text-align: center;
    // min-width: 600px;
    thead {
      border-bottom: 1px solid var(--main-text-color);
      width: 100%;
      th {
        padding: 10px 0;
      }
    }
    @media (max-width: 767px) {
      font-size: 10px !important;
    }
  }
}
</style>
