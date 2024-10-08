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
    label: "选项1",
    icon: "pi pi-fw pi-home",
    items: [
      { label: "子选项1.1", icon: "pi pi-fw pi-pencil", to: "/subroute1-1" },
      { label: "子选项1.2", icon: "pi pi-fw pi-pencil", to: "/subroute1-2" },
    ],
  },
  {
    label: "选项2",
    icon: "pi pi-fw pi-list",
    to: "/",
  },
  {
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
  },
]);
// 如果有子菜单则展开
const submenuOpen = ref<string | null>(null);
// 切换子菜单的展开状态
const toggleSubmenu = (item: MenuItem) => {
  if (item.items) {
    submenuOpen.value = submenuOpen.value === item.label ? null : item.label;
  }
};
// 判断子菜单是否展开
const isSubmenuOpen = (item: MenuItem) => {
  return submenuOpen.value === item.label;
};
// 导出
const items = computed(() => model.value);
</script>

<style lang="scss" scoped>
.container {
  position: fixed;
  background-color: rgb(50, 50, 89);
  width: 200px;
  height: 100%;
}
.has-submenu {
  cursor: pointer; // 鼠标移动到有子菜单的选项上时显示手型
}
.nav-item {
  user-select: none;
  // height: 52px;
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
