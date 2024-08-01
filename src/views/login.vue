<template>
  <div class="login">
    <div class="container">
      <transition name="fade" mode="out-in">
        <form
          v-if="!forgot"
          @submit.prevent="login"
          :class="[theme === 'dark' ? 'bg-primary-dark' : 'bg-primary-light']"
        >
          <h2>login</h2>
          <div class="input-group">
            <label>email</label>
            <input type="email" required v-model="email" />
          </div>
          <!-- <p class="err" v-if="email_err">{{ email_err }}</p> -->
          <div class="input-group">
            <label>password</label>
            <input type="password" required v-model="pass" />
          </div>

          <span class="forgot" @click="toggle_forgot">forgot password</span>
          <!-- <p class="err" v-if="pass_err">{{ pass_err }}</p> -->
          <button>login</button>
        </form>

        <form
          @submit.prevent="send_reset_token"
          class="forgot-form"
          v-else
          :class="[theme === 'dark' ? 'bg-primary-dark' : 'bg-primary-light']"
        >
          <div class="input-group">
            <label>your email</label>
            <input type="email" required v-model="email_for_reset_pass" />
          </div>
          <div class="send" v-if="send">check your email for reset link</div>
          <span class="forgot" @click="toggle_forgot">back to login</span>
          <button>send</button>
        </form>
      </transition>
    </div>
    <loading v-if="load"></loading>
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
import loading from "./../components/loading.vue";
import modal from "@/components/modal.vue";
import { useThemeStore } from "@/stores/theme";
import { storeToRefs } from "pinia";
const theme_store = useThemeStore();
const { theme } = storeToRefs(theme_store);

import { useAuthStore } from "@/stores/auth";
const auth_store = useAuthStore();

import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const route = useRoute();

import { ref } from "vue";
import axios from "axios";

const email = ref();
const pass = ref();

const error = ref({});

const close_error = () => {
  error.value = {};
};

const load = ref(false);

const login = async () => {
  load.value = true;
  try {
    await auth_store.login({ email: email.value, password: pass.value });
    router.push("/");
  } catch (err) {
    error.value = err.response.data;
    // console.log(err);
  }
  load.value = false;
};

const forgot = ref(false);

const toggle_forgot = () => {
  forgot.value = !forgot.value;
};
const email_for_reset_pass = ref("");
const send = ref(false);
const send_reset_token = async () => {
  load.value = true;
  try {
    await axios.post(
      "api/shop/auth/forgot-password",
      {
        email: email_for_reset_pass.value,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    send.value = true;
  } catch (err) {
    error.value = err.response.data;
    // console.log(err.response.data);
  }
  load.value = false;
};
</script>

<style lang="scss" scoped>
.container {
  display: grid;
  place-items: center;
  // height: 100vh;
  // padding-top: 100px;
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

.forgot {
  color: var(--update-color);
  text-decoration: underline;
  cursor: pointer;
  margin: 20px 0;
}
.send {
  padding: 10px;
  border-radius: 10px;
  color: var(--main-text-color);
  background-color: var(--agree-color);
  margin-bottom: 10px;
}
</style>
