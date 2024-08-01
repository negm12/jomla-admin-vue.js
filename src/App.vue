<template>
  <sidebar v-if="auth_store.get_is_auth" />
  <navbar v-if="auth_store.get_is_auth" />
  <div class="pages" :class="[theme === 'dark' ? 'bg-dark' : 'bg-light']">
    <RouterView v-slot="{ Component }">
      <transition name="route" mode="out-in" appear>
        <component :is="Component"></component>
      </transition>
    </RouterView>
  </div>
</template>

<script setup>
import axios from "axios";
import sidebar from "@/components/sidebar.vue";
import navbar from "@/components/navbar.vue";
import { RouterView } from "vue-router";
import { useThemeStore } from "@/stores/theme";
import { storeToRefs } from "pinia";
const theme_store = useThemeStore();
const { theme } = storeToRefs(theme_store);

import { useAuthStore } from "./stores/auth";
const auth_store = useAuthStore();
import { useRoute, useRouter } from "vue-router";
const router = useRouter();
const route = useRoute();

// console.log(route.);

// console.log(auth);

const { toggle_theme } = theme_store;
toggle_theme(localStorage.getItem("theme") || "light");

// auto login
const token = localStorage.getItem("token") || "";
const userStr = localStorage.getItem("user");
const user = JSON.parse(userStr) || "";

// console.log(user);
auth_store.set_user({
  user,
  token,
});
</script>

<style lang="scss">
.pages {
  padding-top: 62px;
  min-height: 100vh;
  width: 100%;
}

.route-enter-from {
  transform: translateX(-100%);
  /* transform: scale(0.2); */
  opacity: 0;
}
.route-leave-to {
  transform: translateX(100%);
  /* transform: scale(0.2); */

  opacity: 0;
}
.route-leave-from,
.route-enter-to {
  /* transform: translateX(0); */
  transform: scale(1);

  opacity: 1;
}
.route-leave-active,
.route-enter-active {
  transition: all 0.5s ease-in-out;
}
</style>
