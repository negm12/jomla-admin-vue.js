import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useThemeStore = defineStore("theme", () => {
  const theme = ref("light");
  // const doubleCount = computed(() => count.value * 2);
  function toggle_theme(payload) {
    localStorage.setItem("theme", payload);

    theme.value = localStorage.getItem("theme");
    // console.log(theme.value);
    // console.log(theme.value);
  }
  // function increment() {
  //   count.value++;
  // }

  return { theme, toggle_theme };
});
