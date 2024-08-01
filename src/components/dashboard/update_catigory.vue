<template>
  <div class="update-cat">
    <form @submit.prevent="submit">
      <div class="input-group">
        <label>catigory name</label>
        <input type="text" v-model="current_cat.name" />
      </div>
      <div class="input-group">
        <label>catigory image</label>
        <input
          type="file"
          @change="on_file_change"
          :style="{ display: 'none' }"
          ref="file"
        />
        <div class="image">
          <div class="btn-file" @click="click_on_file">
            choose catigory image
          </div>
          <div class="img-review">
            <img :src="current_cat.image" alt="" />
          </div>
        </div>
      </div>
      <button type="submit">submit</button>
    </form>
    <loading v-if="load"></loading>

    <teleport to="body">
      <transition name="fade">
        <modal v-if="error.state" @close="close_error" mode="error">
          <template #header>{{ error.state }}</template>
          <template #content>{{ error.message }}</template>
        </modal>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import modal from "./../modal.vue";
import { ref } from "vue";
const emits = defineEmits(["close"]);
const props = defineProps(["current_cat"]);
const current_catigory = { ...props.current_cat };

const image = ref(null);
const file = ref(null);
const click_on_file = () => {
  file.value.click();
};
const on_file_change = (e) => {
  image.value = e.target.files[0];
  const filereader = new FileReader();
  filereader.addEventListener("load", () => {
    props.current_cat.image = filereader.result;
  });
  filereader.readAsDataURL(e.target.files[0]);
};

import { useCatigoryStore } from "@/stores/catigory_store";
const catigory_store = useCatigoryStore();

const error = ref({});
const load = ref(false);
const submit = async () => {
  // befor submitting compare the old value by new one and update the diffrence only
  load.value = true;
  try {
    if (current_catigory.image === props.current_cat.image) {
      await catigory_store.updat_catigory(props.current_cat);
      emits("close");
    } else {
      await catigory_store.upload_cat_imag_to_firebase(
        image.value,
        props.current_cat.name
      );
      props.current_cat.image = await catigory_store.get_img_url_from_firebase;
      await catigory_store.updat_catigory(props.current_cat);
      emits("close");
    }
  } catch (err) {
    error.value = err.response.data;
  }
  await catigory_store.fetch_catigories();
  load.value = false;
};
const close_error = () => {
  error.value = {};
  emits("close");
};
</script>

<style lang="scss" scoped></style>
