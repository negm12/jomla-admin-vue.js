<template>
  <div class="modal">
    <div class="overlay" @click.self="$emit('close')"></div>
    <div class="form" :class="[theme === 'dark' ? 'bg-dark' : 'bg-light']">
      <div class="close" @click.self="$emit('close')">X</div>
      <div class="title">
        <slot name="title"></slot>
      </div>

      <slot name="content"></slot>
    </div>
  </div>
</template>

<script setup>
import { useThemeStore } from "@/stores/theme";
import { storeToRefs } from "pinia";
const theme_store = useThemeStore();
const { theme } = storeToRefs(theme_store);
defineEmits(["close"]);
</script>

<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 110;
  .form {
    width: 600px;
    max-height: 80%;
    padding: 40px 30px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 111;
    border-radius: 10px;
    overflow: hidden;
    overflow-y: scroll;
    .close {
      width: 40px;
      height: 40px;
      display: grid;
      place-items: center;
      font-weight: 600;
      font-size: 20px;
      background-color: var(--danger-color);
      color: var(--main-color);
      border-radius: 10px;
      cursor: pointer;
      position: fixed;
      top: 0px;
      right: 0px;
    }
    .title {
      text-align: center;
      margin-bottom: 30px;
      font-weight: 700;
      font-size: 20px;
      text-transform: capitalize;
    }
  }
}

/* width */
::-webkit-scrollbar {
  width: 0px;
}

/* Track */
::-webkit-scrollbar-track {
  background-color: transparent;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 10px;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  -ms-border-radius: 10px;
  -o-border-radius: 10px;
}
</style>
