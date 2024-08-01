<template>
  <div class="container">
    <form
      @submit.prevent="reset"
      :class="[theme === 'dark' ? 'bg-primary-dark' : 'bg-primary-light']"
    >
      <h2>change your password</h2>
      <div class="input-group">
        <label>new password</label>
        <input type="password" required v-model="pass" />
      </div>
      <div class="input-group">
        <label>password confirmation</label>
        <input type="password" required v-model="pass_confirm" />
      </div>
      <button>reset</button>
    </form>

    <teleport to="body">
      <transition name="fade">
        <modal v-if="error.state" @close="close_error" mode="error">
          <template #header> {{ error.state }}</template>
          <template #content>{{ error.message }}</template>
        </modal>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import { useThemeStore } from "@/stores/theme";
import axios from "axios";
import { storeToRefs } from "pinia";
import { ref } from "vue";
const theme_store = useThemeStore();
const { theme } = storeToRefs(theme_store);

const pass = ref("");
const pass_confirm = ref("");

import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();

const error = ref({});
const reset = async () => {
  if (pass.value !== pass_confirm.value) {
    error.value = {
      state: "error",
      message: "password and confirmation password not the same ",
    };
    return;
  }
  try {
    await axios.patch(`api/shop/auth/reset-password/${route.params.reset_token}`, {
      password: pass.value,
    });
    router.push("/login");
  } catch (err) {
    error.value = err.response.data;
  }
};

const close_error = () => {
  error.value = {};
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  place-items: center;
}

form {
  width: 400px;
  padding: 40px;
  border-radius: 10px;
  h2 {
    margin-bottom: 50px;
    font-weight: bold;
    font-size: 25px;
    text-transform: capitalize;
    text-align: center;
  }
}
</style>
