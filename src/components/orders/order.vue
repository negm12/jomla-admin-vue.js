<template>
  <tr
    class="order card"
    :class="[theme === 'dark' ? 'bg-primary-dark' : 'bg-primary-light']"
  >
    <td>{{ order.name }}</td>
    <td>{{ order.price }}</td>
    <td>{{ order.sale }}</td>
    <td>{{ total_price }}</td>
    <td>{{ order.size }}</td>
    <td>
      <span
        :style="{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: `${order.color}`,
          display: 'inline-block',
        }"
      ></span>
    </td>
    <td>{{ order.user.firstName }}</td>
    <td>{{ order.quantity }}</td>
    <td>{{ order.state }}</td>
    <td class="actions">
      <div class="reject" @click="reject = true">
        <i class="fa-solid fa-xmark"></i>
      </div>
      <div class="agree" @click="accept_order">
        <i class="fa-solid fa-check"></i>
      </div>
    </td>
  </tr>
  <teleport to="body">
    <transition name="fade">
      <modal v-if="reject" @close="close" @confirm="confirm_delete">
        <template #header>
          <h2>are you sure to reject this order</h2>
        </template>
        <template #content>
          <p>
            after you confirm for reject this order you can not be able to
            rocovery again
          </p>
        </template>
      </modal>
    </transition>
  </teleport>
</template>

<script setup>
import modal from "@/components/modal.vue";
import { useThemeStore } from "@/stores/theme";
import axios from "axios";
import { storeToRefs } from "pinia";
const theme_store = useThemeStore();
const { theme } = storeToRefs(theme_store);
import { computed, ref } from "vue";

const total_price = computed(() => {
  return (props.order.price - props.order.sale) * props.order.quantity;
});

const props = defineProps(["order"]);

const reject = ref(false);

import { useAuthStore } from "@/stores/auth";
const auth_store = useAuthStore();

const close = () => {
  reject.value = false;
};
const confirm_delete = async () => {
  // console.log(props.order._id);
  try {
    await axios.patch(
      `api/shop/orders/reject/${props.order._id}`,
      {
        state: "rejected",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth_store.token}`,
        },
      }
    );
  } catch (err) {
    console.log(err.response.data);
  }
  reject.value = false;
};

const accept_order = async () => {
  // console.log(props.order._id);
  try {
    await axios.patch(
      `api/shop/orders/accept/${props.order._id}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth_store.token}`,
        },
      }
    );
  } catch (err) {
    console.log(err.response.data);
  }
};
</script>

<style lang="scss" scoped>
tr {
  border-bottom: 1px solid var(--main-text-color);
  &:hover {
    opacity: 0.7;
  }
  td {
    padding: 20px 0 !important;
  }
  .actions {
    width: 70px;
    div {
      width: 20px;
      height: 20px;
      border-radius: 5px;
      font-size: 15px;
      display: grid;
      place-items: center;
      display: inline-block;
      color: #fff;
      cursor: pointer;
      &:not(:last-of-type) {
        margin-right: 10px;
      }
    }
    .agree {
      background-color: var(--agree-color);
    }
    .reject {
      background-color: var(--danger-color);
    }
  }
}
</style>
