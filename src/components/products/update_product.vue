<template>
  <div class="update-prod">
    <form @submit.prevent="submit">
      <div class="input-group">
        <label>product name</label>
        <input type="text" required v-model="product.name" />
      </div>
      <div class="input-group">
        <label>product price</label>
        <input type="number" required v-model="product.price" />
      </div>
      <div class="input-group">
        <label>product sale</label>
        <input type="number" required v-model="product.sale" />
      </div>
      <div class="input-group">
        <label>product catigory</label>
        <select required v-model="product.catigory._id">
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
        <input type="text" required v-model="product.brand" />
      </div>
      <div class="input-group">
        <label>product description</label>
        <textarea type="text" rows="5" v-model="product.description" />
      </div>
      <button type="submit">submit</button>
    </form>
    <loading v-if="load"></loading>
    <Teleport to="body">
      <transition name="fade">
        <modal v-if="error.state" @close="close_error" mode="error">
          <template #header>{{ error.state }}</template>
          <template #content>{{ error.message }}</template>
        </modal>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import modal from "./../modal.vue";
import loading from "./../loading.vue";
import { useProductStore } from "@/stores/product_store";
const product_store = useProductStore();
import { useCatigoryStore } from "@/stores/catigory_store";
import { ref } from "vue";
const catigory_store = useCatigoryStore();
const emits = defineEmits(["close"]);
const props = defineProps(["product"]);

catigory_store.fetch_catigories();

const load = ref(false);
const error = ref({});
const submit = async () => {
  load.value = true;

  const updated_prod = {
    name: props.product.name,
    price: props.product.price,
    sale: props.product.sale,
    catigory: props.product.catigory._id,
    brand: props.product.brand,
    description: props.product.description,
  };
  // console.log(updated_prod);
  try {
    await product_store.update_product(updated_prod, props.product._id);
    await product_store.fetch_products(route.query.catigory);
    emits("close");
  } catch (err) {
    error.value = err.response.data;
    console.log(err);
  }
  load.value = false;
};

const close_error = () => {
  error.value = {};
};
</script>

<style lang="sass" scoped></style>
