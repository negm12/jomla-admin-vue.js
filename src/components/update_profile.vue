<template>
  <div class="add-admin">
    <form @submit.prevent="submit">
      <div class="input-group">
        <label>first name</label>
        <input type="text" required v-model="current_user.firstName" />
      </div>
      <div class="input-group">
        <label>last name</label>
        <input type="text" required v-model="current_user.lastName" />
      </div>
      <div class="input-group">
        <label>email</label>
        <input type="email" required v-model="current_user.email" />
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
            <img :src="current_user.image" alt="" />
          </div>
        </div>
      </div>
      <button>submit</button>
    </form>
    <br />
    <br />

    <h2
      :style="{
        borderTop: '1px solid var(--danger-color)',
        padding: '20px 0',
        fontWeight: 'bold',
        textAlign: 'center',
        textTransform: 'capitalize',
        fontSize: '20px',
      }"
    >
      update your password
    </h2>
    <form @submit.prevent="update_pass">
      <div class="input-group">
        <label>current password</label>
        <input type="password" required v-model="current_pass" />
      </div>
      <div class="input-group">
        <label>new password</label>
        <input type="password" required v-model="new_pass" />
      </div>
      <div class="input-group">
        <label> new password confirm</label>
        <input type="password" required v-model="new_pass_confirm" />
      </div>
      <button>submit</button>
    </form>
    <loading v-if="load"></loading>

    <Teleport to="body">
      <Transition name="fade">
        <modal v-if="error.state" @close="close_error" mode="error">
          <template #header>{{ error.state }}</template>
          <template #content>{{ error.message }}</template>
        </modal>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import modal from "./modal.vue";
import loading from "./loading.vue";
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";
const auth_store = useAuthStore();

const emits = defineEmits(["close"]);

const current_user = ref({
  firstName: auth_store.user.firstName,
  lastName: auth_store.user.lastName,
  email: auth_store.user.email,
  image: auth_store.user.image,
});

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
    current_user.value.image = filereader.result;
  });
  filereader.readAsDataURL(e.target.files[0]);
};

import { storage } from "@/firebase/firebase";
import { uploadBytes, getDownloadURL, ref as storeRef } from "firebase/storage";
import axios from "axios";
const load = ref(false);
const error = ref({});
const submit = async () => {
  load.value = true;
  try {
    if (auth_store.user.image !== current_user.value.image) {
      const storage_ref = storeRef(
        storage,
        `users/${current_user.value.email}`
      );
      await uploadBytes(storage_ref, image.value);
      current_user.value.image = await getDownloadURL(storage_ref);
    }
    const res = await axios.patch(
      "api/shop/auth/update-me",
      {
        ...current_user.value,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth_store.token}`,
        },
      }
    );
    const user = await res.data.user;
    // console.log(user);
    localStorage.setItem("user", JSON.stringify(user));
    auth_store.set_user({ user, token: localStorage.getItem("token") });
    emits("close");
  } catch (err) {
    error.value = err.response.data;
  }
  load.value = false;
  // check if pass and pas confirm is the same or not
  // if same go to next step
  // if not error
  // 2 / check if image hase changed or not
  // if changed re upload it to fb
  // if not  dont re upload it and go next
  // if have upload to firebase first
  // if not fetch api directly
};

const current_pass = ref("");
const new_pass = ref("");
const new_pass_confirm = ref("");

const update_pass = async () => {
  load.value = true;
  if (new_pass.value !== new_pass_confirm.value) {
    error.value = {
      state: "error",
      message: "password and confirmation password is deffirent ",
    };
    return;
  }
  try {
    await axios.patch(
      "api/shop/auth/update-password",
      {
        currentPassword: current_pass.value,
        password: new_pass.value,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth_store.token}`,
        },
      }
    );
    emits("close");
  } catch (err) {
    // console.log(err.response.data);
    error.value = err.response.data;
  }
  load.value = false;
};

const close_error = () => {
  error.value = {};
  //  emits("close");
};
</script>

<style lang="scss" scoped></style>
