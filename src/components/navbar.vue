<template>
  <nav
    class="navbar"
    :class="[theme === 'dark' ? 'bg-primary-dark' : 'bg-primary-light']"
  >
    <router-link class="logo" to="/">
      <img src="../assets/images/logo.png" alt="logo" />
    </router-link>
    <!-- <div
      class="notification"
      :class="[theme === 'dark' ? 'bg-dark' : 'bg-light']"
    >
      <i class="fa-regular fa-bell"></i>
    </div> -->
    <div class="theme">
      <theme_com />
    </div>
  </nav>
</template>

<script setup>
import theme_com from "@/components/theme.vue";
import { useThemeStore } from "@/stores/theme";
import { storeToRefs } from "pinia";
const theme_store = useThemeStore();
const { theme } = storeToRefs(theme_store);

// import { useAuthStore } from "@/stores/auth";
// const auth_store = useAuthStore();
</script>

<style lang="scss" scoped>
.navbar {
  width: 100%;
  padding: 15px;
  // background-color: #fff;
  display: flex;
  gap: 20px;
  flex-direction: row-reverse;
  align-items: center;
  // box-shadow: var(--main-shadow);
  z-index: 99;
  position: fixed;
  top: 0;
  left: 0;
  .logo {
    width: 120px;
  }
  .notification {
    font-size: 25px;
    font-weight: bold;
    cursor: pointer;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: grid;
    place-items: center;
  }
}
</style>
