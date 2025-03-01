import "./index.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import router from "./router";
import "primeicons/primeicons.css";
import StyleClass from "primevue/styleclass";
import KeyFilter from "primevue/keyfilter";
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";

const app = createApp(App);
const pinia = createPinia();

app
  .use(pinia)
  .use(router)
  .use(ToastService)
  .use(ConfirmationService)
  .use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: ".my-app-dark",
      },
    },
    options: {
      prefix: "p",
      cssLayer: false,
    },
  })
  .directive("keyfilter", KeyFilter)
  .directive("styleclass", StyleClass)
  .mount("#app");
