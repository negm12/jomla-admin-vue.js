import { ref, computed } from "vue";
import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: "",
  }),
  getters: {
    get_is_auth: function () {
      return !!this.token.length;
    },
  },
  actions: {
    login: async function (payload) {
      const res = await axios.post(
        "api/shop/auth/login",
        {
          email: payload.email,
          password: payload.password,
        },
        { withCredentials: true }
      );
      // const data = await res.data;
      localStorage.setItem("token", await res.data.token);
      localStorage.setItem("user", JSON.stringify(await res.data.user));
      this.set_user({
        token: await res.data.token,
        user: await res.data.user,
      });
      // this.user = await { ...res.data.user };
      // this.token = await res.data.token;
      // console.log(await res.data.user);
    },

    set_user: function (payload) {
      this.user = payload.user;
      this.token = payload.token;
      // console.log(payload);
      // console.log(this.user.email, this.token);
    },
  },
});
