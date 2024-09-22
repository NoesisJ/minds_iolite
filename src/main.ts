import { createApp } from "vue";
import { createPinia } from 'pinia'
import App from "./App.vue";
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import router from './router';
import 'primeicons/primeicons.css'

const app = createApp(App)
const pinia = createPinia()


app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
}).use(pinia).use(router).mount("#app");