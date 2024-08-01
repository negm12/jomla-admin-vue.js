import { defineStore } from "pinia";
import axios from "axios";

import { storage } from "@/firebase/firebase";
import { uploadBytes, getDownloadURL, ref as storeRef } from "firebase/storage";

export const useCatigoryStore = defineStore("catigory", {
  state: () => ({
    Catigories: {},
    storage_ref: "",
  }),
  getters: {
    get_catigories() {
      return this.Catigories.data;
    },

    async get_img_url_from_firebase() {
      return await getDownloadURL(this.storage_ref);
    },
  },
  actions: {
    async upload_cat_imag_to_firebase(img, cat_name) {
      this.storage_ref = storeRef(storage, `catigories/${cat_name}`);
      await uploadBytes(this.storage_ref, img);
    },

    async fetch_catigories() {
      // this.Catigories = await (
      //   await fetch("http://127.0.0.1:3000/api/shop/catigory")
      // ).json();
      try {
        const res = await axios.get("api/shop/catigory");
        this.Catigories = await res.data;
        // console.log(this.Catigories);
      } catch (err) {
        console.log(err.response.data);
      }
    },

    async updat_catigory(cat) {
      await axios.patch(
        `api/shop/catigory/${cat._id}`,
        {
          ...cat,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    },

    async delete_catigory(id) {
      await axios.delete(`api/shop/catigory/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    },

    async add_catigory(catigory) {
      await axios.post(
        `api/shop/catigory`,
        {
          ...catigory,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    },
  },
});
