import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import orders from "@/views/orders.vue";
import products from "@/views/products.vue";
import login from "@/views/login.vue";
import not_found from "@/views/404.vue";
import reset_password from "@/views/reset_password.vue";

import { useAuthStore } from "@/stores/auth";
// cont store = useAuthStore

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: {
        requireAuth: true,
      },
    },
    {
      path: "/new-orders",
      name: "orders",
      component: orders,
      meta: {
        requireAuth: true,
      },
    },
    {
      path: "/products",
      name: "products",
      component: products,
      meta: {
        requireAuth: true,
      },
    },
    {
      path: "/login",
      name: "login",
      component: login,
      meta: {
        requireAuth: false,
      },
    },
    {
      path: "/reset-password/:reset_token",
      name: "reset_password",
      component: reset_password,
      meta: {
        requireAuth: false,
      },
    },
    {
      path: "/:notfound",
      name: "not-found",
      component: not_found,
    },
  ],
});

router.beforeEach((to, form, next) => {
  const auth_store = useAuthStore();
  if (to.meta.requireAuth && !auth_store.get_is_auth) {
    next("/login");
  } else if (!to.meta.requireAuth && auth_store.get_is_auth) {
    next("/");
  } else {
    next();
  }
});

export default router;
