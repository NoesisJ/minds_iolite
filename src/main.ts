import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import router from "./router";
import "primeicons/primeicons.css";
import StyleClass from "primevue/styleclass";
import ToastService from 'primevue/toastservice';
const app = createApp(App);
const pinia = createPinia();

app
  .use(pinia)
  .use(router)
  .use(ToastService)
  .use(PrimeVue, {
    theme: {
      preset: Aura,
    },
    options: {
        prefix: "p",
        cssLayer: false,
      },
  })
  .directive('styleclass', StyleClass)
  .mount("#app");
