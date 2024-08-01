<template>
  <div class="statistic-list">
    <statistic_card name="users" icon="users" :stats="user_count" />
    <statistic_card
      name="products"
      icon="bag-shopping"
      :stats="product_count"
    />
    <statistic_card
      name="total products price"
      icon="dollar-sign"
      :stats="products_price"
    />
    <statistic_card
      name="orders"
      icon="cart-arrow-down"
      :stats="orders_count"
    />
    <statistic_card
      name="total orders price"
      icon="dollar-sign"
      :stats="orders_price"
    />
  </div>
</template>

<script setup>
import statistic_card from "@/components/dashboard/statistic_card.vue";
import { computed, ref } from "vue";
import axios from "axios";
const user_count = ref(0);
const product_count = ref(0);
const products_price = ref(0);
const orders_count = ref(0);
const orders_price = ref(0);

(async () => {
  try {
    const res = await axios.get(
      "api/shop/auth/user-count",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    user_count.value = await res.data.count[0].user_count;
    // console.log(user_count.value);
  } catch (err) {
    console.log(err);
  }
})();

(async () => {
  try {
    const res = await axios.get(
      "api/shop/products/product-stats",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    product_count.value = await res.data.stats[0].count;
    products_price.value = await res.data.stats[0].price;
    // console.log(user_count.value);
  } catch (err) {
    console.log(err);
  }
})();

(async () => {
  try {
    const res = await axios.get(
      "api/shop/orders/orders-stats",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    orders_count.value = await res.data.stats[0].count;
    orders_price.value = await res.data.stats[0].price;
    // console.log(user_count.value);
  } catch (err) {
    console.log(err.response.data);
  }
})();
</script>

<style lang="scss" scoped>
.statistic-list {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 25px;
  padding-bottom: 30px;
  border-bottom: 1px solid var(--main-text-color);
}
</style>
