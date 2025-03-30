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

// 导入Naive UI组件
import {
  create,
  NButton,
  NInput,
  NTabs,
  NTabPane,
  NIcon,
  NSelect,
  NFormItem,
  NTag,
  NTooltip
} from 'naive-ui'

// 创建Naive UI提供器
const naive = create({
  components: [
    NButton,
    NInput,
    NTabs,
    NTabPane,
    NIcon,
    NSelect,
    NFormItem,
    NTag,
    NTooltip
  ]
})

const app = createApp(App);
const pinia = createPinia();

app
  .use(pinia)
  .use(router)
  .use(ToastService)
  .use(ConfirmationService)
  .use(naive)
  .directive("keyfilter", KeyFilter)
  .directive("styleclass", StyleClass)
  .use(PrimeVue, {
    theme: { preset: Aura },
    options: {
      prefix: "p",
      darkModeSelector: false,
      cssLayer: false,
    },
  })


const appStore = useApp();
if (appStore.isTauri) {
  await appStore.initialize();
}

app.mount('#app');
