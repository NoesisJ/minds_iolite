<template>
  <div class="container">
    <hd-scroll>
      <!-- 父菜单部分 -->
      <div
        v-for="(item, i) in items"
        :key="i"
        @click="toggleSubmenu(item)"
        class="nav-item"
        :class="{ 'has-submenu': item.items }"
      >
        <i v-if="item.icon" :class="item.icon"></i>
        {{ item.label }}
        <i
          v-if="item.items"
          class="pi"
          :class="isSubmenuOpen(item) ? 'pi-chevron-down' : 'pi-chevron-right'"
          style="font-size: 0.625rem; margin-left: auto"
          @click.stop="toggleSubmenu(item)"
        ></i>

        <!-- 子菜单部分 -->
        <div
          v-for="(subitem, j) in item.items"
          :key="j"
          v-if="isSubmenuOpen(item) && item.items"
          class="nav-childItem"
        >
          <router-link v-if="subitem.to" :to="subitem.to">
            <i v-if="subitem.icon" :class="subitem.icon"></i>
            {{ subitem.label }}
          </router-link>
          <span v-else>{{ subitem.label }}</span>
        </div>
      </div>
    </hd-scroll>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useRouter } from 'vue-router';
import hdScroll from "../components/hdScroll.vue";
// 定义接口
interface MenuItem {
  label: string;
  icon?: string;
  to?: string;
  items?: MenuItem[]; // 允许有子菜单
}

// 选项模型
const model = ref<MenuItem[]>([
{
    label: "人员管理",
    icon: "pi pi-users",
    to: "/PersonInformation",
  },
  {
    label: "人员分布",
    icon: "pi pi-chart-bar",
    to: "/",
  },
  {
    label: "test",
    icon: "pi pi-fw pi-home",
    items: [
      { label: "Test01", icon: "pi pi-fw pi-pencil", to: "/Test01" },
      { label: "Test02", icon: "pi pi-fw pi-pencil", to: "/Test02" },
    ],
  },{
    label: "选项3",
    icon: "pi pi-fw pi-home",
    items: [
      { label: "子选项3.1", icon: "pi pi-fw pi-pencil", to: "/subroute3-1" },
      { label: "子选项3.2", icon: "pi pi-fw pi-pencil", to: "/subroute3-2" },
    ],
  },{
    label: "选项3",
    icon: "pi pi-fw pi-home",
    items: [
      { label: "子选项3.1", icon: "pi pi-fw pi-pencil", to: "/subroute3-1" },
      { label: "子选项3.2", icon: "pi pi-fw pi-pencil", to: "/subroute3-2" },
    ],
  },{
    label: "选项3",
    icon: "pi pi-fw pi-home",
    items: [
      { label: "子选项3.1", icon: "pi pi-fw pi-pencil", to: "/subroute3-1" },
      { label: "子选项3.2", icon: "pi pi-fw pi-pencil", to: "/subroute3-2" },
    ],
  },{
    label: "选项3",
    icon: "pi pi-fw pi-home",
    items: [
      { label: "子选项3.1", icon: "pi pi-fw pi-pencil", to: "/subroute3-1" },
      { label: "子选项3.2", icon: "pi pi-fw pi-pencil", to: "/subroute3-2" },
    ],
  },{
    label: "选项3",
    icon: "pi pi-fw pi-home",
    items: [
      { label: "子选项3.1", icon: "pi pi-fw pi-pencil", to: "/subroute3-1" },
      { label: "子选项3.2", icon: "pi pi-fw pi-pencil", to: "/subroute3-2" },
    ],
  },{
    label: "选项3",
    icon: "pi pi-fw pi-home",
    items: [
      { label: "子选项3.1", icon: "pi pi-fw pi-pencil", to: "/subroute3-1" },
      { label: "子选项3.2", icon: "pi pi-fw pi-pencil", to: "/subroute3-2" },
    ],
  },{
    label: "选项3",
    icon: "pi pi-fw pi-home",
    items: [
      { label: "子选项3.1", icon: "pi pi-fw pi-pencil", to: "/subroute3-1" },
      { label: "子选项3.2", icon: "pi pi-fw pi-pencil", to: "/subroute3-2" },
    ],
  },{
    label: "选项3",
    icon: "pi pi-fw pi-home",
    items: [
      { label: "子选项3.1", icon: "pi pi-fw pi-pencil", to: "/subroute3-1" },
      { label: "子选项3.2", icon: "pi pi-fw pi-pencil", to: "/subroute3-2" },
    ],
  },{
    label: "选项3",
    icon: "pi pi-fw pi-home",
    items: [
      { label: "子选项3.1", icon: "pi pi-fw pi-pencil", to: "/subroute3-1" },
      { label: "子选项3.2", icon: "pi pi-fw pi-pencil", to: "/subroute3-2" },
    ],
  },{
    label: "选项3",
    icon: "pi pi-fw pi-home",
    items: [
      { label: "子选项3.1", icon: "pi pi-fw pi-pencil", to: "/subroute3-1" },
      { label: "子选项3.2", icon: "pi pi-fw pi-pencil", to: "/subroute3-2" },
    ],
  },{
    label: "选项3",
    icon: "pi pi-fw pi-home",
    items: [
      { label: "子选项3.1", icon: "pi pi-fw pi-pencil", to: "/subroute3-1" },
      { label: "子选项3.2", icon: "pi pi-fw pi-pencil", to: "/subroute3-2" },
    ],
  }
]);
// 如果有子菜单则展开
const submenuOpen = ref<string | null>(null);
const router = useRouter(); // 在这里获取路由实例
// 切换子菜单的展开状态
const toggleSubmenu = (item: MenuItem) => {
  if (item.items) {
    submenuOpen.value = submenuOpen.value === item.label ? null : item.label;
  } else if (item.to) {
    // 直接进行路由跳转
    router.push(item.to); // 使用获取到的 router 实例
  }
};
// 判断子菜单是否展开
const isSubmenuOpen = (item: MenuItem) => {
  return submenuOpen.value === item.label;
};
// 导出
const items = computed(() => model.value);
</script>

<style scoped>
.container {
  position: fixed;
  background-color: rgb(50, 50, 89);
  width: 200px;
  height: 100%;
}
.has-submenu {
  cursor: pointer;
}
.nav-item {
  user-select: none;
  cursor: pointer;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 0.625rem;
  color: white;
  border-bottom: 0.0938rem solid rgb(27, 27, 56);
}
.nav-item:hover {
  color: rgb(168, 132, 244);
}
.nav-childItem{
  margin-top: 10px;
  padding:  10.4px 0;
}

.nav-item i {
  margin-right: 1em;
}

</style>
