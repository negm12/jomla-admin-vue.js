<template>
  <div
    class="catigory card"
    :class="[theme === 'dark' ? 'bg-primary-dark' : 'bg-primary-light']"
  >
    <router-link :to="{ name: 'products', query: { catigory: `${cat._id}` } }">
      <div class="actions">
        <button class="delete" @click="delet">
          <i class="fa-regular fa-trash-can"></i>
        </button>
        <button
          class="update"
          @click="show_form"
          :class="[theme === 'dark' ? 'bg-dark' : 'bg-light']"
        >
          <i class="fa-regular fa-pen-to-square"></i>
        </button>
      </div>
      <h2 class="cat-name">{{ cat.name }}</h2>
      <div class="cat-img">
        <img class="img-fit" :src="cat.image" alt="" />
      </div>
      <div class="cat-statistic">
        <div>
          <span>{{ cat?.products_count }}</span>
          <p>product</p>
        </div>
        <div>
          <span>{{ cat?.products_price }}</span>
          <p>products price</p>
        </div>
      </div>
    </router-link>
  </div>

  <!-- to update catigory -->
  <teleport to="body">
    <transition name="fade">
      <form_modal v-if="open_form" @close="close_form">
        <template #title>
          <h2>update catigory</h2>
        </template>
        <template #content>
          <update_catigory :current_cat="cat" @close="close_form" />
        </template>
      </form_modal>
    </transition>
  </teleport>

  <!-- to delete catigory -->
  <teleport to="body">
    <transition name="fade">
      <modal v-if="delete_cat" @close="close" @confirm="confirm_delete">
        <template #header>
          <h2>are you sure to delete this catigory</h2>
        </template>
        <template #content>
          <p>
            after you confirm for deleting this catigory the products belongs to
            this catigory will be belong to defualt catigry
          </p>
        </template>
      </modal>
    </transition>
  </teleport>
</template>

<script setup>
import modal from "@/components/modal.vue";
import form_modal from "../form_modal.vue";
import update_catigory from "@/components/dashboard/update_catigory.vue";
import { useThemeStore } from "@/stores/theme";
import { storeToRefs } from "pinia";
const theme_store = useThemeStore();
const { theme } = storeToRefs(theme_store);
import { useCatigoryStore } from "@/stores/catigory_store";
const catigory_store = useCatigoryStore();
import { computed, ref } from "vue";

const props = defineProps(["cat"]);

// const product_count = computed(() => {
//   return props.cat.products.length;
// });

// const current_cat = reactive({ name: "cat", image: "image" });
// to  delete cat
const delete_cat = ref(false);
const delet = () => {
  delete_cat.value = true;
};
const close = () => {
  delete_cat.value = false;
};
const confirm_delete = async () => {
  await catigory_store.delete_catigory(props.cat._id);
  await catigory_store.fetch_catigories();
  delete_cat.value = false;
};

//

// to update cat

//

const open_form = ref(false);

const close_form = () => {
  open_form.value = false;
};
const show_form = () => {
  open_form.value = true;
};
</script>

<!--  -->
<!-- 




-->
<!-- style -->
<style lang="scss" scoped>
.hello {
  height: 1000px;
  position: absolute;
}
.catigory {
  max-width: 300px;
  position: relative;
  overflow: hidden;
  transition: all 0.4s ease-in-out;
  .actions {
    position: absolute;
    top: -80px;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 10px;
    font-size: 20px;
    transition: all 0.4s ease-in-out;
    .update,
    .delete {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    .delete {
      background-color: var(--danger-color);
      color: var(--main-color);
    }
  }
  .cat-name {
    font-size: 25px;
    text-transform: capitalize;
    font-weight: 600;
    text-align: center;
    margin-bottom: 15px;
  }
  .cat-img {
    width: 100%;
    height: 250px;
    border-radius: 10px;
    overflow: hidden;
  }
  &:hover {
    transform: skew(3deg);
    .actions {
      top: 0;
    }
  }

  .cat-statistic {
    display: flex;
    justify-content: space-between;
    padding-top: 20px;
    & > div {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
}
</style>
