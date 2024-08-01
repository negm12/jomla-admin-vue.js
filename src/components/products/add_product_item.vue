<template>
  <div class="update-prod">
    <form @submit.prevent="submit">
      <div class="input-group">
        <label>product item color</label>
        <!-- {{ color }} -->
        <input
          type="color"
          :style="{
            width: '100px',
            height: '50px',
            padding: '0',
            border: 'none',
          }"
          value="#000000"
          v-model="color"
        />
        <!-- <select required v-model="color">
          <option
            v-for="(color, i) in colors"
            :style="{ backgroundColor: color }"
            :key="i"
            :value="color"
          >
            {{ color }}
          </option>
        </select> -->
      </div>

      <!-- sizes -->
      <div class="sizes">
        <!-- size -->
        <div class="input-group">
          <label>size</label>
          <input
            type="text"
            v-model="size.size"
            placeholder="enter item size"
          />
        </div>

        <!-- qty -->
        <div class="input-group">
          <label>quantity</label>
          <input type="number" v-model="size.quantity" value="0" />
        </div>

        <div class="enter">
          <button type="button" @click="on_enter_size">
            <i class="fa-solid fa-check"></i>
          </button>
        </div>
      </div>
      <div class="size-review">
        <span v-for="(size, i) in sizes" :key="i"
          >{{ size.size }} / {{ size.quantity }}
          <div class="remove" @click="remove_size(size)">X</div></span
        >
      </div>
      <p class="err" v-if="size_error">{{ size_error }}</p>

      <!-- images -->
      <div class="input-group">
        <label>product item images</label>
        <input
          type="file"
          ref="file"
          required
          multiple
          :style="{ display: 'none' }"
          @change="on_file_change"
        />
        <div class="image">
          <div class="btn-file" @click="click_on_file">
            choose product images
          </div>
          <div class="img-review">
            <img
              v-for="(img, i) in img_url_review"
              :src="img"
              alt="image"
              :key="i"
            />
          </div>
        </div>
      </div>
      <p class="err" v-if="img_length_err">{{ img_length_err }}</p>

      <button type="submit">submit</button>
    </form>
    <loading v-if="load"></loading>
  </div>
</template>

<script setup>
import loading from "./../loading.vue";
import { reactive, ref } from "vue";
const props = defineProps(["product"]);
const emits = defineEmits(["close"]);

// images reviews when choosing image
const file = ref(null);
const images = ref([]);
const img_url_review = ref([]);
const img_length_err = ref("");

const click_on_file = () => {
  file.value.click();
};

const on_file_change = (e) => {
  img_url_review.value = [];
  images.value = e.target.files;
  if (images.value.length > 3) {
    img_length_err.value = "maximum images is 3 images for one item";
    return;
  } else {
    img_length_err.value = "";
    for (let i = 0; i < images.value.length; i++) {
      const filereader = new FileReader();
      filereader.addEventListener("load", () => {
        img_url_review.value.push(filereader.result);
      });
      filereader.readAsDataURL(images.value[i]);
    }
  }
};

// sizes
const size = reactive({ size: "", quantity: 0 });
const sizes = ref([]);
const size_error = ref("");

const on_enter_size = () => {
  size_error.value = "";
  if (!size.size || size.quantity <= 0) {
    size_error.value =
      "size must have avalue and quantity must be greater thans 0";
    return;
  }

  if (sizes.value.find((s) => s.size === size.size)) {
    size_error.value =
      "this size already exist please delete it to enter the correct quantity if you want ";
    return;
  }
  sizes.value.push({ ...size });
  size.size = "";
  size.quantity = "";
};

const remove_size = (size) => {
  sizes.value = sizes.value.filter((s) => s.size !== size.size);
};

const color = ref("#000000");

// submit form
//
//
//
import { storage } from "@/firebase/firebase";
import { uploadBytes, getDownloadURL, ref as storeRef } from "firebase/storage";
import { useProductStore } from "@/stores/product_store";
const product_store = useProductStore();

import { useRoute } from "vue-router";
const route = useRoute();

const load = ref(false);
const submit = async () => {
  load.value = true;
  // for in images and upload it one by one
  const img_urls = [];
  // upload imaged to fb
  for (let i = 0; i < images.value.length; i++) {
    const storage_ref = storeRef(storage, `products/${Date.now()}`);
    await uploadBytes(storage_ref, images.value[i]);
    img_urls.push(await getDownloadURL(storage_ref));
  }

  await product_store.add_product_item({
    color: color.value,
    sizes: sizes.value,
    images: img_urls,
    product: props.product,
  });

  emits("close");
  await product_store.fetch_products(route.query.catigory);
  load.value = false;
};
</script>
<!-- 





-->
<!-- style -->
<style lang="scss" scoped>
select {
  option {
    padding: 10px;
    margin-bottom: 10px;
  }
  option:hover {
    box-shadow: 0 0 10px 100px red inset !important;
  }
}

.sizes {
  display: flex;
  align-items: center;
  gap: 20px;
  .enter {
    button {
      border-radius: 5px;
      padding: 5px;
    }
  }
}
.size-review {
  display: flex;
  gap: 20px;
  span {
    padding: 5px 10px;
    border-radius: 5px;
    background-color: var(--update-color);
    position: relative;
    color: var(--main-color);
    font-weight: bold;
    .remove {
      position: absolute;
      top: 0px;
      right: 0px;
      font-size: 12px;
      width: 15px;
      height: 15px;
      border-radius: 4px;
      display: grid;
      place-items: center;
      background-color: var(--danger-color);
      display: none;
      cursor: pointer;
    }
    &:hover {
      .remove {
        display: grid;
      }
    }
  }
}

.img-review {
  display: flex;
  gap: 10px;
  align-items: center;
  img {
    width: 50px !important;
    height: 50px !important;
  }
}
.err {
  color: var(--danger-color);
  font-weight: bold;
}
</style>
