<template>
  <div class="products">
    <button class="add-prod-btn" @click="show_add_product">
      add new product
    </button>
    <teleport to="body">
      <transition name="fade">
        <form_modal @close="close_add_product" v-if="open_add_product">
          <template #title>
            <h2>add new product</h2>
          </template>
          <template #content>
            <add_product @close="close_add_product" />
          </template>
        </form_modal>
      </transition>
    </teleport>

    <!--  -->
    <product_list />
    <!-- <loading /> -->
  </div>
</template>

<script setup>
import product_list from "@/components/products/product_list.vue";
import form_modal from "@/components/form_modal.vue";
import add_product from "@/components/products/add_product.vue";
import { ref } from "vue";

const open_add_product = ref(false);
const close_add_product = () => {
  open_add_product.value = false;
};
const show_add_product = () => {
  open_add_product.value = true;
};
</script>

<style lang="scss" scoped>
.add-prod-btn {
  padding: 10px;
  margin: 20px auto;
  display: block;
  border-radius: 10px;
  background-color: var(--update-color);
  font-weight: bold;
  font-size: 22px;
  text-transform: capitalize;
  color: var(--main-color);
}
</style>
