import "./index.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { useApp } from "@/hooks/useApp";
import "primeicons/primeicons.css";
import StyleClass from "primevue/styleclass";
import KeyFilter from "primevue/keyfilter";
import ToastService from "primevue/toastservice";
import ConfirmationService from "primevue/confirmationservice";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";

const app = createApp(App);
const pinia = createPinia();

app
  .use(pinia)
  .use(router)
  .use(ToastService)
  .use(ConfirmationService)
  .directive("keyfilter", KeyFilter)
  .directive("styleclass", StyleClass)
  .use(PrimeVue, {
    theme: { preset: Aura },
    options: {
      prefix: "p",
      darkModeSelector: false,
      cssLayer: false,
    },
  });

const appStore = useApp();
if (appStore.isTauri) {
  await appStore.initialize();
}

app.mount("#app");

declare global {
  interface Window {
    testFinanceApi: {
      checkConnection: () => Promise<boolean>;
      testCreate: () => Promise<any>;
    };
  }
}
