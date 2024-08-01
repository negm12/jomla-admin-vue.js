<template>
  <aside
    class="sidebar"
    :class="[
      theme === 'dark' ? 'bg-primary-dark' : 'bg-primary-light',
      active_sidebar ? '' : 'active',
    ]"
  >
    <div
      class="icon"
      @click="toggle_sidebar"
      :class="[theme === 'dark' ? 'bg-primary-dark' : 'bg-primary-light']"
    >
      <i class="fa-solid fa-bars"></i>
    </div>

    <div class="links">
      <div
        class="profile-link"
        :class="[theme === 'dark' ? 'bg-dark' : 'bg-light']"
        @click="show_update_profile"
      >
        <img :src="auth_store.user.image" alt="" />
        <div class="name">{{ auth_store.user.firstName }}</div>
      </div>

      <ul>
        <li :class="[theme === 'dark' ? 'bg-dark' : 'bg-light']">
          <router-link to="/">dashboard</router-link>
        </li>
        <li :class="[theme === 'dark' ? 'bg-dark' : 'bg-light']">
          <router-link :to="{ name: 'orders' }">new orders</router-link>
        </li>
        <li :class="[theme === 'dark' ? 'bg-dark' : 'bg-light']">
          <router-link :to="{ name: 'products' }">products</router-link>
        </li>
        <li
          :class="[theme === 'dark' ? 'bg-dark' : 'bg-light']"
          @click="show_add_admin"
          :style="{ padding: '10px', cursor: 'pointer' }"
        >
          add new admin
        </li>
        <li
          :class="[theme === 'dark' ? 'bg-dark' : 'bg-light']"
          @click="show_add_cat"
          :style="{ padding: '10px', cursor: 'pointer' }"
        >
          add new catigory
        </li>
      </ul>
      <div
        class="log-out"
        @click="logout"
        :class="[theme === 'dark' ? 'bg-dark' : 'bg-light']"
      >
        logout
      </div>
    </div>
  </aside>
  <transition name="fade" mode="out-in">
    <div
      class="overlay"
      v-if="active_sidebar"
      @click="active_sidebar = false"
    ></div>
  </transition>

  <!-- add catigory -->
  <teleport to="body">
    <transition name="fade">
      <form_modal v-if="open_add_cat" @close="close_add_cat">
        <template #title>
          <h2>add catigory</h2>
        </template>
        <template #content>
          <add_catigory @close="close_add_cat" />
        </template>
      </form_modal>
    </transition>
  </teleport>

  <!-- add new admin -->
  <teleport to="body">
    <transition name="fade">
      <form_modal v-if="open_add_admin" @close="close_add_admin">
        <template #title>
          <h2>add new admin</h2>
        </template>
        <template #content>
          <add_new_admin @close="close_add_admin" />
        </template>
      </form_modal>
    </transition>
  </teleport>

  <!-- update admin profile -->
  <teleport to="body">
    <transition name="fade">
      <form_modal v-if="open_update_profile" @close="close_update_profile">
        <template #title>
          <h2>update my profile</h2>
        </template>
        <template #content>
          <update_profile @close="close_update_profile" />
        </template>
      </form_modal>
    </transition>
  </teleport>
</template>

<script setup>
import update_profile from "./update_profile.vue";
import { ref } from "vue";
import form_modal from "./form_modal.vue";
import add_new_admin from "@/components/add_new_admin.vue";
import add_catigory from "@/components/dashboard/add_catigory.vue";
import { useThemeStore } from "@/stores/theme";
import { storeToRefs } from "pinia";
const theme_store = useThemeStore();
const { theme } = storeToRefs(theme_store);

import { useAuthStore } from "@/stores/auth";
const auth_store = useAuthStore();

const open_add_admin = ref(false);
const close_add_admin = () => {
  open_add_admin.value = false;
};
const show_add_admin = () => {
  open_add_admin.value = true;
  active_sidebar.value = false;
};

const open_update_profile = ref(false);
const close_update_profile = () => {
  open_update_profile.value = false;
};
const show_update_profile = () => {
  open_update_profile.value = true;
  active_sidebar.value = false;
};

// add catigory
const open_add_cat = ref(false);
const close_add_cat = () => {
  open_add_cat.value = false;
};
const show_add_cat = () => {
  open_add_cat.value = true;
  active_sidebar.value = false;
};

import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
const logout = () => {
  // localStorage.setItem("token", null);
  // localStorage.setItem("user", null);
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  auth_store.set_user({ user: "", token: "" });
  router.push("/login");
  // console.log("log out");
};

const active_sidebar = ref(true);
const toggle_sidebar = () => {
  active_sidebar.value = !active_sidebar.value;
};
</script>

<style lang="scss" scoped>
.sidebar {
  width: 200px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  transition: all 0.4s ease-in-out;
  z-index: 105;
  .icon {
    width: 40px;
    height: 40px;
    padding: 10px;
    display: grid;
    place-items: center;
    position: absolute;
    top: 10px;
    right: -37px;
    border-radius: 5px;
    font-weight: bold;
    font-size: 25px;
    cursor: pointer;
  }
  .links {
    padding: 40px 10px 0;
    .profile-link {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px;
      border-radius: 5px;
      // background-color: #ddd;
      cursor: pointer;
      margin-bottom: 40px;
      img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
      }
      .name {
        font-size: 22px;
        font-weight: bold;
      }
    }
    ul {
      overflow: hidden;
      li {
        font-weight: bold;
        font-size: 18px;
        margin-bottom: 10px;
        // background-color: var(--primary-color);
        border-radius: 5px;
        &:last-of-type {
          &:hover {
            transform: translateX(15px) scale(1.1);
          }
        }
        a {
          padding: 12px 10px;
          border-radius: 5px;
          display: block;
          transition: all 0.4s ease-in-out;
          &:hover {
            transform: translateX(15px) scale(1.1);
          }
        }
      }
    }
    .log-out {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      padding: 15px;
      border-radius: 5px;
      font-weight: bold;
      cursor: pointer;
    }
  }
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease-in-out;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 0.4;
}

.active {
  transform: translateX(-200px);
}
</style>
