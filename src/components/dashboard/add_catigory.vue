<template>
  <div class="add-cat">
    <form @submit.prevent="submit">
      <div class="input-group">
        <label>catigory name</label>
        <input type="text" v-model="name" />
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
            <img :src="img_url_review" alt="" v-if="img_url_review" />
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
import { useCatigoryStore } from "@/stores/catigory_store";
const catigory_store = useCatigoryStore();
const image = ref(null);
const img_url_review = ref("");

const name = ref("");
const img_url = ref("");

const file = ref(null);
const click_on_file = () => {
  file.value.click();
};

const on_file_change = (e) => {
  image.value = e.target.files[0];
  const filereader = new FileReader();
  filereader.addEventListener("load", () => {
    img_url_review.value = filereader.result;
  });
  filereader.readAsDataURL(e.target.files[0]);
};

const load = ref(false);
const error = ref({});
const submit = async () => {
  // emits("close");
  load.value = true;
  try {
    // upload image to fb
    await catigory_store.upload_cat_imag_to_firebase(image.value, name.value);
    // get img url after uploaded
    img_url.value = await catigory_store.get_img_url_from_firebase;
    // dispatch add catigory action
    await catigory_store.add_catigory({
      name: name.value,
      image: img_url.value,
    });
    // fetch all cats again to load tha added cat
    await catigory_store.fetch_catigories();
    emits("close");
  } catch (err) {
    error.value = err.response.data;
    // console.log(error.value.state);
  }
  load.value = false;
};

const close_error = () => {
  error.value = {};
  emits("close");
};
</script>

<style lang="scss" scoped></style>
