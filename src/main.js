import "./assets/main.scss";
import "./assets/style.css";
import loading from "./components/loading.vue";
import modal from "./components/modal.vue";
import axios from "axios";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);
app.component("loading", loading);
app.component("modal", modal);

axios.defaults.baseURL = "https://jomla-shop-node-js.vercel.app/";

app.use(createPinia());
app.use(router);

app.mount("#app");
