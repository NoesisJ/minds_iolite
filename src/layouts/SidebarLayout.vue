<template>
  <div
    class="container w-[12.5rem] h-[100vh] bg-[#323259] py-[.3rem] pl-[.4rem]"
  >
    <hd-scroll>
      <PanelMenu
        :model="navMenus"
        class="w-40 md:w-40"
      >
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
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
// 从 localStorage 获取保存的选中项
const savedActiveItem = localStorage.getItem("activeMenuItem");
const activeItem = ref(savedActiveItem || "人员管理"); // 当前选中的菜单项

// 检查当前路由是否是 item 的路由
const checkActiveState = (route: string) => {
  console.log(route);
  return router.currentRoute.value.path === route;
};

const navMenus = ref([
  {
    label: "人员管理",
    icon: "pi pi-users",
    expanded: checkActiveState("/InformationView"),
    command: () => {
      activeItem.value = "人员管理";
      router.push("/InformationView");
    },
  },
  {
    label: "人员分布",
    icon: "pi pi-chart-bar",
    expanded: checkActiveState("/ChartsView"),
    command: () => {
      activeItem.value = "人员分布";
      router.push("/ChartsView");
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
          activeItem.value = "Test01";
          router.push("/Test01");
        },
      },
      {
        label: "Test02",
        icon: "pi pi-fw pi-pencil",
        command: () => {
          activeItem.value = "Test02";
          router.push("/Test02");
        },
      },
    ],
  },
]);

// 当 activeItem 改变时，将它保存到 localStorage 中
watch(activeItem, (newItem) => {
  localStorage.setItem("activeMenuItem", newItem);
});
</script>

<style scoped>
.p-panelmenu {
  gap: 0.15rem;
}
.p-panelmenu-panel {
  height: 2.5rem;
}

.p-panelmenu {
  --p-panelmenu-item-focus-background: #a16eff;
}

/* .p-panelmenu:has(.active) {
  --p-panelmenu-panel-background: #38bcf6;
} */
</style>
