<template>
  <div class="add-prod">
    <form @submit.prevent="submit">
      <div class="input-group">
        <label>product name</label>
        <input type="text" required v-model="name" />
      </div>
      <div class="input-group">
        <label>product price</label>
        <input type="text" required v-model="price" />
      </div>
      <div class="input-group">
        <label>product sale</label>
        <input type="text" required v-model="sale" />
      </div>
      <div class="input-group">
        <label>product catigory</label>
        <select required v-model="prod_cat">
          <option
            v-for="(cat, i) in catigory_store.get_catigories"
            :key="i"
            :value="cat._id"
          >
            {{ cat.name }}
          </option>
        </select>
      </div>
      <div class="input-group">
        <label>product brand</label>
        <input type="text" required v-model="brand" />
      </div>
      <div class="input-group">
        <label>product description</label>
        <textarea type="text" required rows="5" v-model="description" />
      </div>

      <!-- product item -->
      <!-- <add_product_item /> -->

      <button type="submit">submit</button>
    </form>
    <loading v-if="load"></loading>
  </div>
</template>

<script setup>
import loading from "./../loading.vue";
import { useCatigoryStore } from "@/stores/catigory_store";
const catigory_store = useCatigoryStore();
catigory_store.fetch_catigories();

import { ref } from "vue";
import { useProductStore } from "@/stores/product_store";
const product_store = useProductStore();

const name = ref("");
const price = ref(0);
const sale = ref(0);
const prod_cat = ref("");
const brand = ref("");
const description = ref("");
import { useRoute } from "vue-router";
const route = useRoute();

const emits = defineEmits(["close"]);
const load = ref(false);
const submit = async () => {
  load.value = true;
  const new_prod = {
    name: name.value,
    price: price.value,
    sale: sale.value,
    brand: brand.value,
    catigory: prod_cat.value,
    description: description.value,
  };
  await product_store.add_product(new_prod);
  await product_store.fetch_products(route.query.catigory);
  emits("close");
  load.value = false;
};
</script>

<style lang="scss" scoped></style>
