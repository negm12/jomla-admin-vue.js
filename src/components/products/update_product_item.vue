<template>
  <div class="update-prod">
    <form @submit.prevent="submit">
      <div class="input-group">
        <label>product item color</label>
        <input
          type="color"
          v-model="prod_item.color"
          :style="{ width: '100px', height: '100px' }"
          value="#000000"
        />
        <!-- <select required v-model="prod_item.color"> -->
        <!-- <option
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
          <div class="remove" @click="remove_size(size)">X</div>
        </span>
      </div>
      <p class="err" v-if="size_error">{{ size_error }}</p>

      <!-- images -->
      <div class="input-group">
        <label>product item images</label>
        <input
          type="file"
          ref="file"
          multiple
          :style="{ display: 'none' }"
          @change="on_file_change"
        />
        <div class="image">
          <div class="btn-file" @click="click_on_file">
            choose product images
          </div>
          <div class="img-review">
            <div v-for="(img, i) in current_imgs" :key="i">
              <img :src="img" alt="" />
              <div class="remove" @click="remove_from_current_imgs(img)">X</div>
            </div>
            <div v-for="(img, i) in img_url_review" :key="i">
              <img :src="img" alt="" />
            </div>
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
import { reactive } from "vue";
import { ref } from "vue";

const props = defineProps(["prod_item"]);
const emits = defineEmits(["close"]);

// images reviews when choosing image
const file = ref(null);
const images = ref([]);
const img_url_review = ref();
const current_imgs = ref([...props.prod_item.images]);
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
const sizes = ref([...props.prod_item.sizes]);
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

const remove_from_current_imgs = (img) => {
  current_imgs.value = current_imgs.value.filter((i) => i !== img);
};

import { useProductStore } from "@/stores/product_store";
const product_store = useProductStore();
//
//
//
import { useRoute } from "vue-router";
const route = useRoute();
const load = ref(false);
import { storage } from "@/firebase/firebase";
import { uploadBytes, getDownloadURL, ref as storeRef } from "firebase/storage";
const submit = async () => {
  load.value = true;
  // console.log(updated_prod_item);
  // check if new img + current img is 3 or less
  // if true
  // upload new images to fire base
  // then push new url to current img then
  // update the data
  if (current_imgs.value.length + images.value.length <= 3) {
    for (let i = 0; i < images.value.length; i++) {
      const storage_ref = storeRef(storage, `products/${Date.now()}`);
      await uploadBytes(storage_ref, images.value[i]);
      current_imgs.value.push(await getDownloadURL(storage_ref));
    }
    const updated_prod_item = {
      color: props.prod_item.color,
      sizes: sizes.value,
      images: current_imgs.value,
    };
    if (sizes.value.length === 0) {
      size_error.value = "product sizes is required add at least one size ";
      return;
    } else if (current_imgs.value.length === 0) {
      img_length_err.value =
        "product images is required add at least one image ";
      return;
    } else {
      await product_store.Update_product_item(
        updated_prod_item,
        props.prod_item._id
      );
      await product_store.fetch_products(route.query.catigory);
    }
    emits("close");

    // upload new img to firebase
  } else {
    img_length_err.value = "only 3 images is allowed for one product item";
    return;
  }
  load.value = false;
};
</script>

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
  & > div {
    width: 55px !important;
    height: 55px !important;
    position: relative;
  }
  &:hover {
    .remove {
      display: grid;
    }
  }
  img {
    width: 100%;
    height: 100%;
  }
}
.err {
  color: var(--danger-color);
  font-weight: bold;
}
</style>
