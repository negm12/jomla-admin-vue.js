<template>
  <div
    class="product card"
    :class="[theme === 'dark' ? 'bg-primary-dark' : 'bg-primary-light']"
  >
    <div class="details">
      <div class="name"><span> name : </span>{{ prod.name }}</div>
      <div class="catigory">
        <span> catigory : </span>{{ prod?.catigory?.name }}
      </div>
      <div class="price"><span>price : </span>{{ prod.price }} $</div>
      <div class="sale"><span>sale : </span>{{ prod.sale }} $</div>
      <div class="brand"><span> brand : </span>{{ prod.brand }}</div>
      <div class="rating">
        <span>rating : </span>{{ prod.ratingAvg.toFixed(1) }}
      </div>
      <div class="actions">
        <button class="delete" @click="show_modal_delete_prod">
          <i class="fa-regular fa-trash-can"></i>
        </button>
        <button class="update" @click="show_update">
          <i class="fa-regular fa-pen-to-square"></i>
        </button>
        <button class="add" @click="show_add">add item</button>
      </div>
    </div>

    <!-- items  -->
    <div class="product-items" v-if="prod.productItems.length">
      <div
        class="product-item"
        :class="[theme === 'dark' ? 'bg-dark' : 'bg-light']"
        v-for="(item, i) in prod.productItems"
        :key="i"
      >
        <div class="color" :style="{ backgroundColor: item.color }"></div>
        <div class="sizes">
          <table>
            <thead>
              <th>size</th>
              <th v-for="(size, i) in item.sizes">{{ size.size }}</th>
            </thead>
            <tbody>
              <tr>
                <td>quantity</td>
                <td v-for="(size, i) in item.sizes">{{ size.quantity }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="images">
          <img v-for="(img, i) in item.images" :src="img" :key="i" alt="" />
        </div>
        <div class="actions">
          <button class="delete" @click="show_modal_delete_item(item._id)">
            <i class="fa-regular fa-trash-can"></i>
          </button>
          <button class="update" @click="show_modal_update_item(item)">
            <i class="fa-regular fa-pen-to-square"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="no-items" v-else>
      no items you can add items for this product or delete it
    </div>
  </div>

  <!-- add new item component -->
  <teleport to="body">
    <transition name="fade">
      <form_modal v-if="open_add" @close="close_add">
        <template #title>
          <h2>add new item to this product</h2>
        </template>
        <template #content>
          <add_product :product="prod._id" @close="close_add" />
        </template>
      </form_modal>
    </transition>
  </teleport>

  <!-- update current product -->

  <teleport to="body">
    <transition name="fade">
      <form_modal v-if="open_update" @close="close_update">
        <template #title>
          <h2>update product</h2>
        </template>
        <template #content>
          <update_product @close="close_update" :product="prod" />
        </template>
      </form_modal>
    </transition>
  </teleport>

  <!-- confirm modal when delete current product -->
  <teleport to="body">
    <transition name="fade">
      <modal
        v-if="delete_prod"
        @close="close_modal_delete_prod"
        @confirm="confirm_delete_prod"
      >
        <template #header>
          <h2>are you sure to delete this product</h2>
        </template>
        <template #content>
          <p>
            after you confirm for deleting this product the products items
            belongs to this product will be deleted also and you can nor recover
            them
          </p>
        </template>
      </modal>
    </transition>
  </teleport>

  <!-- confirm modal when delete current product item -->
  <teleport to="body">
    <transition name="fade">
      <modal
        v-if="open_modal_delete_item"
        @close="close_modal_delete_item"
        @confirm="confirm_delete_item"
      >
        <template #header>
          <h2>are you sure to delete this item</h2>
        </template>
        <template #content>
          <p>
            after you confirm for deleting this item you can not recover it
            again
          </p>
        </template>
      </modal>
    </transition>
  </teleport>

  <!-- update current product item -->

  <teleport to="body">
    <transition name="fade">
      <form_modal
        v-if="open_modal_update_item"
        @close="close_modal_update_item"
      >
        <template #title>
          <h2>update product</h2>
        </template>
        <template #content>
          <update_product_item
            :prod_item="current_prod_item_update"
            @close="close_modal_update_item"
          />
        </template>
      </form_modal>
    </transition>
  </teleport>
</template>

<script setup>
import modal from "@/components/modal.vue";
import form_modal from "../form_modal.vue";
import add_product from "@/components/products/add_product_item.vue";
import update_product_item from "./update_product_item.vue";
import update_product from "./update_product.vue";
import { useThemeStore } from "@/stores/theme";
import { storeToRefs } from "pinia";
import { ref } from "vue";
const theme_store = useThemeStore();
const { theme } = storeToRefs(theme_store);

import { useProductStore } from "@/stores/product_store";
const product_store = useProductStore();

import { useRoute } from "vue-router";
const route = useRoute();

const props = defineProps(["prod"]);

// modal actions for delete product
const delete_prod = ref(false);
const show_modal_delete_prod = () => {
  delete_prod.value = true;
};
const close_modal_delete_prod = () => {
  delete_prod.value = false;
};

const confirm_delete_prod = async () => {
  await product_store.delete_product(props.prod._id);
  delete_prod.value = false;
  await product_store.fetch_products(route.query.catigory);
};

// modal actions for update product
const open_update = ref(false);
const close_update = () => {
  open_update.value = false;
};
const show_update = () => {
  open_update.value = true;
};

// modal actions for add product item
const open_add = ref(false);
const close_add = () => {
  open_add.value = false;
};
const show_add = () => {
  open_add.value = true;
};

// modal actions for delete product item
const current_prod_item_id = ref("");
const open_modal_delete_item = ref(false);

const show_modal_delete_item = (id) => {
  current_prod_item_id.value = id;
  open_modal_delete_item.value = true;
};
const close_modal_delete_item = () => {
  open_modal_delete_item.value = false;
};
const confirm_delete_item = async () => {
  await product_store.delete_product_item(current_prod_item_id.value);
  open_modal_delete_item.value = false;
  await product_store.fetch_products(route.query.catigory);
};

// modal actions for update product item

const current_prod_item_update = ref({});
const open_modal_update_item = ref(false);
const show_modal_update_item = (prod_item) => {
  open_modal_update_item.value = true;
  current_prod_item_update.value = prod_item;
  // console.log(current_prod_item_update.value);
};
const close_modal_update_item = () => {
  open_modal_update_item.value = false;
};
</script>

<style lang="scss" scoped>
.product {
  box-shadow: var(--main-shadow);
  .actions {
    display: flex;
    gap: 10px;
    button {
      padding: 5px;
      min-width: 30px;
      min-height: 30px;
      border-radius: 10px;
      font-weight: bold;
      color: #fff;
    }
    .delete {
      background-color: var(--danger-color);
    }
    .add {
      background-color: var(--agree-color);
    }
    .update {
      background-color: var(--update-color);
    }
  }
  .details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40px;
    & > div {
      span {
        font-weight: bold;
        color: var(--agree-color);
      }
      @media (max-width: 768px) {
        font-size: 12px;
        display: flex;
        flex-direction: column;
      }
    }
    @media (max-width: 1279px) {
      font-size: 14px;
    }
  }
  .no-items {
    width: 100%;
    padding: 10px;
    background-color: var(--danger-color);
    border-radius: 10px;
    text-align: center;
    font-weight: bold;
  }
  .product-items {
    .product-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      border-radius: 10px;
      margin-bottom: 25px;

      .color {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: aqua;
        border: 1px solid var(--main-text-color);
      }
      .sizes {
        table {
          th,
          td {
            padding: 5px;
            border: 1px solid var(--danger-color);
          }
          th {
            padding-bottom: 10px;
            border-bottom: 1px solid var(--danger-color);
          }
          td {
            padding-top: 10px;
          }
        }
      }
      @media (max-width: 1023px) {
        .sizes {
          font-size: 12px;
        }
        .images {
          img {
            width: 30px;
            height: 30px;
          }
        }
        // table {
        //   td,
        //   th {
        //     padding: 0 10px;
        //   }
        // }
        .color {
          width: 25px;
          height: 25px;
        }
        .actions {
          button {
            width: 20px;
            height: 20px;
            padding: 3px;
            font-size: 15px;
          }
        }
      }
    }

    .images {
      display: flex;
      gap: 10px;
      img {
        width: 50px;
        height: 50px;
        border-radius: 5px;
      }
    }
  }
}
</style>
