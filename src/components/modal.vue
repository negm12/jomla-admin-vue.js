<template>
  <div class="modal">
    <div class="overlay" @click="$emit('close')"></div>
    <div
      class="content-cont"
      :class="[
        // theme === 'dark' ? 'bg-dark' : 'bg-light',
        mode === 'error' ? 'error' : theme === 'dark' ? 'bg-dark' : 'bg-light',
      ]"
    >
      <div class="header">
        <slot name="header"></slot>
      </div>
      <div class="content">
        <slot name="content"></slot>
      </div>

      <div class="actions">
        <button
          v-if="mode !== 'error'"
          class="confirm"
          @click="$emit('confirm')"
        >
          confirm
        </button>
        <button class="close" @click="$emit('close')">cancle</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useThemeStore } from "@/stores/theme";
import { storeToRefs } from "pinia";
const theme_store = useThemeStore();
const { theme } = storeToRefs(theme_store);

defineEmits(["close", "confirm"]);

const props = defineProps(["mode"]);
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 110;
  .content-cont {
    width: 450px;
    min-height: 200px;
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 111;
    border-radius: 10px;
    padding: 20px;
    .actions {
      position: absolute;
      bottom: 0;
      width: 100%;
      display: flex;
      gap: 20px;
      justify-content: center;
      color: rgb(255, 255, 255);
      padding: 10px;
      button {
        padding: 10px;
        border-radius: 5px;
      }
      .confirm {
        background-color: var(--danger-color);
      }
      .close {
        background-color: var(--agree-color);
      }
    }
    .header {
      text-align: center;
      font-size: 20px;
      text-transform: capitalize;
      font-weight: 600;
    }
    .content {
      padding-top: 20px;
    }
  }
}
.error {
  background-color: #dd3232;
  color: var(--main-color);
  text-align: center;
}
</style>
