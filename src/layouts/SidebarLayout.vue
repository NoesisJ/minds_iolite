<template>
  <div class="container w-[12.5rem] h-[100vh] bg-[#323259] py-[.3rem] pl-[.4rem]">
    <hd-scroll>
      <PanelMenu :model="navMenus" class="w-40 md:w-40">
        <template #item="{ item }">
          <router-link
            v-if="item.route"
            v-slot="{ href, navigate }"
            :to="item.route"
            custom
          >
            <a
              class="flex items-center cursor-pointer px-2 py-1"
              :href="href"
              @click="navigate"
            >
              <span :class="item.icon" />
              <span class="ml-2">{{ item.label }}</span>
            </a>
          </router-link>
          <a
            v-else
            class="flex items-center cursor-pointer px-2 py-1"
            :href="item.url"
            :target="item.target"
          >
            <span :class="item.icon" />
            <span class="ml-6">{{ item.label }}</span>
            <span
              v-if="item.items"
              class="pi pi-angle-down text-primary ml-auto"
            />
          </a>
        </template>
      </PanelMenu>
    </hd-scroll>
  </div>
</template>

<script lang="ts" setup>
import hdScroll from "../components/hdScroll.vue";
import PanelMenu from "primevue/panelmenu";
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();

const navMenus = ref([
  {
    label: "人员管理",
    icon: "pi pi-users",
    command: () => {
      router.push("/PersonInformation");
    },
  },
  {
    label: "人员分布",
    icon: "pi pi-chart-bar",
    command: () => {
      router.push("/");
    },
  },
  {
    label: "test",
    icon: "pi pi-fw pi-home",
    items: [
      {
        label: "Test01",
        icon: "pi pi-fw pi-pencil",
        command: () => {
          router.push("/Test01");
        },
      },
      {
        label: "Test02",
        icon: "pi pi-fw pi-pencil",
        command: () => {
          router.push("/Test02");
        },
      },
    ],
  }
]);
</script>

<style scoped>
.p-panelmenu {
  gap: 0.15rem;
}
.p-panelmenu-panel {
  height: 2.5rem;
}
</style>
