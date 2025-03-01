<template>
  <div class="container w-fit h-[100vh] bg-[#323259] py-[.3rem] px-[.4rem]">
    <!-- <hd-scroll> -->
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
        <a v-else class="flex items-center cursor-pointer px-2 py-1">
          <span :class="item.icon" />
          <span class="ml-6">{{ item.label }}</span>
          <span
            v-if="item.items"
            class="pi pi-angle-down text-primary ml-auto"
          />
        </a>
      </template>
    </PanelMenu>
    <!-- </hd-scroll> -->
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
// import hdScroll from "../components/hdScroll.vue";
import PanelMenu from "primevue/panelmenu";

const router = useRouter();
const savedActiveItem = localStorage.getItem("activeMenuItem");
const activeItem = ref(savedActiveItem || "人员管理");

// 检查当前路由是否匹配
const checkActiveState = (route: string) => {
  return router.currentRoute.value.path === route;
};

// 更新导航菜单配置
const navMenus = ref([
  {
    label: "人员管理",
    icon: "pi pi-users",
    expanded: checkActiveState("/information"),
    command: () => {
      activeItem.value = "人员管理";
      router.push("/information");
    },
  },
  {
    label: "人员分布",
    icon: "pi pi-chart-bar",
    expanded: checkActiveState("/infoCharts"),
    command: () => {
      activeItem.value = "人员分布";
      router.push("/infoCharts");
    },
  },
  {
    label: "财务管理",
    icon: "pi pi-dollar",
    items: [
      {
        label: "财务数据",
        icon: "pi pi-box",
        route: "/finance/list",
      },
      {
        label: "财务统计",
        icon: "pi pi-chart-pie",
        route: "/finance/charts",
      },
    ],
  },
  {
    label: "物资管理",
    icon: "pi pi-database",
    items: [
      {
        label: "在库物资",
        icon: "pi pi-inbox",
        route: "/material/storage",
      },
      {
        label: "入库审批",
        icon: "pi pi-filter",
        route: "/material/requestLogs",
      },
    ],
  },
  {
    label: "报名管理",
    icon: "pi pi-cog",
    command: () => {
      activeItem.value = "报名管理";
      router.push("/signUp");
    },
  },
]);

// 保存激活项
watch(activeItem, (newItem) => {
  if (newItem) {
    localStorage.setItem("activeMenuItem", newItem);
  }
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
</style>
