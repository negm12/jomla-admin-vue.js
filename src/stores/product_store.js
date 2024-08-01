import { defineStore } from "pinia";
import { storage } from "@/firebase/firebase";
import { uploadBytes, getDownloadURL, ref as storeRef } from "firebase/storage";
import axios from "axios";
import { useAuthStore } from "./auth";
import { watch } from "vue";

export const useProductStore = defineStore("product", {
  state: () => ({
    products: {},
    storage_ref: "",
    auth_store: useAuthStore(),
  }),
  getters: {
    async get_img_url_from_firebase() {
      return await getDownloadURL(this.storage_ref);
    },

    get_products() {
      return this.products;
    },
  },
  actions: {
    async upload_cat_imag_to_firebase(img, cat_name) {
      this.storage_ref = storeRef(storage, `catigories/${cat_name}`);
      await uploadBytes(this.storage_ref, img);
    },

    async fetch_products(catigory) {
      // const q = { ...query };
      let url = !!catigory
        ? `api/shop/products?catigory=${catigory}`
        : `api/shop/products`;
      const res = await axios.get(`${url}`);
      this.products = await res.data.products;
      // console.log(this.products);
    },

    async add_product(prod) {
      const res = await axios.post(
        `api/shop/products`,
        {
          ...prod,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.auth_store.token}`,
          },
        }
      );
    },

    async delete_product(prod_id) {
      await axios.delete(`api/shop/products/${prod_id}`, {
        headers: {
          Authorization: `Bearer ${this.auth_store.token}`,
        },
      });
    },

    async update_product(product, id) {
      await axios.patch(
        `api/shop/products/${id}`,
        {
          ...product,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.auth_store.token}`,
          },
        }
      );
    },

    //
    //
    //
    //
    //
    // product items

    async add_product_item(prod_item) {
      await axios.post(
        `api/shop/product_item`,
        {
          ...prod_item,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.auth_store.token}`,
          },
        }
      );
    },

    async delete_product_item(id) {
      await axios.delete(`api/shop/product_item/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.auth_store.token}`,
        },
      });
    },

    async Update_product_item(prod_item, id) {
      await axios.patch(
        `api/shop/product_item/${id}`,
        {
          ...prod_item,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.auth_store.token}`,
          },
        }
      );
    },
  },
});
