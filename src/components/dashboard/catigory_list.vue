<template>
  <div class="cat-list">
    <catigory v-for="(cat, i) in catigory_store.get_catigories" :cat :key="i" />
    <loading v-if="load" />
  </div>
</template>

<script setup>
import catigory from "@/components/dashboard/catigory.vue";
import { useCatigoryStore } from "@/stores/catigory_store";
import loading from "@/components/loading.vue";

import { ref } from "vue";
const catigory_store = useCatigoryStore();
const load = ref("false");

(async () => {
  load.value = true;
  await catigory_store.fetch_catigories();
  load.value = false;
})();
</script>

<style lang="scss" scoped>
.cat-list {
  margin-top: 30px;
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
</style>
