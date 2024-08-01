<template>
  <div class="add-admin">
    <form @submit.prevent="submit">
      <div class="input-group">
        <label>first name</label>
        <input type="text" required v-model="new_admin.fname" />
      </div>
      <div class="input-group">
        <label>last name</label>
        <input type="text" required v-model="new_admin.lname" />
      </div>
      <div class="input-group">
        <label>email</label>
        <input type="email" required v-model="new_admin.email" />
      </div>
      <div class="input-group">
        <label>password</label>
        <input type="password" required v-model="new_admin.password" />
      </div>
      <div class="input-group">
        <label>password confirm</label>
        <input type="password" required v-model="new_admin.pass_confirm" />
      </div>

      <div class="input-group">
        <label>image</label>
        <input
          type="file"
          @change="on_file_change"
          :style="{ display: 'none' }"
          ref="file"
        />
        <div class="image">
          <div class="btn-file" @click="click_on_file">choose image</div>
          <div class="img-review">
            <img :src="img_url_review" alt="" v-if="img_url_review" />
          </div>
        </div>
      </div>

      <button>submit</button>
    </form>
  </div>
  <loading v-if="load"></loading>
  <teleport to="body">
    <Transition name="fade">
      <modal v-if="!!error.state" @close="close_error" mode="error">
        <template #header>
          {{ error.state }}
        </template>
        <template #content>
          {{ error.message }}
        </template>
      </modal>
    </Transition>
  </teleport>
</template>

<script setup>
import modal from "./modal.vue";
// import loading from "./loading.vue";
import { reactive, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
const auth_store = useAuthStore();
const image = ref({});
const img_url_review = ref("");
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

const emits = defineEmits(["close"]);
const new_admin = ref({
  fname: "",
  lname: "",
  email: "",
  password: "",
  pass_confirm: "",
  img_url: "",
});

import { storage } from "@/firebase/firebase";
import { uploadBytes, getDownloadURL, ref as storeRef } from "firebase/storage";
import axios from "axios";

const error = ref({
  state: "",
  message: "",
});
const load = ref(false);

const submit = async () => {
  load.value = true;
  if (new_admin.value.pass_confirm !== new_admin.value.password) {
    error.value.state = "errro";
    error.value.message = "password and passowrd confirm is not the same ";
    console.log(error.value);
    return;
  } else {
    try {
      if (!!image.value) {
        const storage_ref = storeRef(storage, `users/${new_admin.value.email}`);
        await uploadBytes(storage_ref, image.value);
        new_admin.img_url = await getDownloadURL(storage_ref);
      }

      await axios.post(
        `api/shop/auth/add-admin`,
        {
          firstName: new_admin.value.fname,
          lastName: new_admin.value.lname,
          email: new_admin.value.email,
          password: new_admin.value.password,
          image: new_admin.value.img_url,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      emits("close");
    } catch (err) {
      error.value = err.response.data;
      console.log(error.value);
    }
  }
  load.value = false;
};
const close_error = () => {
  emits("close");
  error.value = { state: "", message: "" };
};
</script>

<style lang="scss" scoped></style>
