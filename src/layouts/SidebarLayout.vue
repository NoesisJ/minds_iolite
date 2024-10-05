<template>
  <div class="sidebar">
    <ul class="layout-menu">
      <div class="card flex justify-center">
        <VirtualScroller
          :items="items"
          :itemSize="50"
          style="width: 100%; height: 300px"
        >
          <template v-slot:item="{ item }">
            <!-- <div v-for="(item, i) in model" :key="i"> -->
            <li
              @click="toggleSubmenu(item)"
              class="nav-item user-select-none"
              :class="{ 'has-submenu': item.items }"
            >
              <i v-if="item.icon" :class="item.icon"></i>
              <!-- 显示图标 -->
              {{ item.label }}
              <i
                v-if="item.items"
                class="pi"
                :class="
                  isSubmenuOpen(item) ? 'pi-chevron-down' : 'pi-chevron-right'
                "
                style="font-size: 10px; margin-left: auto"
                @click.stop="toggleSubmenu(item)"
              ></i>
            </li>

            <transition name="slide-fade">
              <ul
                v-if="isSubmenuOpen(item) && item.items"
                class="submenu"
                :key="item.label"
              >
                <li v-for="(subitem, j) in item.items" :key="j">
                  <router-link
                    v-if="subitem.to"
                    :to="subitem.to"
                    class="nav-item"
                  >
                    <i v-if="subitem.icon" :class="subitem.icon"></i>
                    <!-- 显示子选项图标 -->
                    {{ subitem.label }}
                  </router-link>
                  <span v-else class="nav-item">{{ subitem.label }}</span>
                  <ul v-if="subitem.items">
                    <li v-for="(subsubitem, k) in subitem.items" :key="k">
                      <router-link
                        v-if="subsubitem.to"
                        :to="subsubitem.to"
                        class="nav-item"
                      >
                        <i v-if="subsubitem.icon" :class="subsubitem.icon"></i>
                        <!-- 显示子子选项图标 -->
                        {{ subsubitem.label }}
                      </router-link>
                      <span v-else class="nav-item">{{
                        subsubitem.label
                      }}</span>
                    </li>
                  </ul>
                </li>
              </ul>
            </transition>
            <!-- </div> -->
          </template>
        </VirtualScroller>
      </div>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import VirtualScroller from "primevue/virtualscroller";

// 定义接口
interface MenuItem {
  label: string;
  icon?: string;
  to?: string;
  items?: MenuItem[]; // 允许有子菜单
}

// 选项模型，以后可直接修改这里的数据。
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
    to: "/route2",
  },
  {
    label: "选项3",
    icon: "pi pi-fw pi-home",
    items: [
      { label: "子选项3.1", icon: "pi pi-fw pi-pencil", to: "/subroute3-1" },
      { label: "子选项3.2", icon: "pi pi-fw pi-pencil", to: "/subroute3-2" },
    ],
  },
  {
    label: "选项5",
    icon: "pi pi-fw pi-list",
    to: "/route5",
  },
  {
    label: "选项4",
    icon: "pi pi-fw pi-list",
    to: "/route4",
  },
  {
    label: "选项4",
    icon: "pi pi-fw pi-list",
    to: "/route4",
  },
  {
    label: "选项4",
    icon: "pi pi-fw pi-list",
    to: "/route4",
  },
]);

const submenuOpen = ref<string | null>(null);

const toggleSubmenu = (item: MenuItem) => {
  if (item.items) {
    submenuOpen.value = submenuOpen.value === item.label ? null : item.label;
  }
};

const isSubmenuOpen = (item: MenuItem) => {
  return submenuOpen.value === item.label;
};

const items = computed(() => {
  const visibleItems: MenuItem[] = [];

  const countVisibleItems = (items: MenuItem[]) => {
    for (const item of items) {
      visibleItems.push(item); // 添加当前项（父选项）
      if (isSubmenuOpen(item) && item.items) {
        visibleItems.push(...item.items); // 添加当前打开的子项
      }
    }
  };

  countVisibleItems(model.value); // 传入原始数据模型
  return visibleItems; // 返回当前显示的父选项和子选项
});
</script>

<style scoped>
.layout-menu {
  list-style-type: none;
  padding: 0;
}

.nav-item {
  height: 52px;
  cursor: pointer;
  display: flex;
  align-items: center;
  /* 垂直居中 */
  padding: 10px;
  /* 添加内边距 */
  color: white;
  /* 字体颜色 */
  border-bottom: 1.5px solid rgb(27, 27, 56);
  /* 底部边框 */
}

.nav-item i {
  margin-right: 1em;
  /* 设置图标与文字之间的间隔为1em */
}

.nav-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  /* 悬停效果 */
}

.submenu {
  list-style-type: none;
  padding-left: 10px;
  /* 为子选项增加缩进 */
  overflow: hidden;
  /* 确保溢出部分不显示 */
}

.user-select-none {
  user-select: none;
  /* 不允许文本选择 */
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: max-height 0.5s ease, opacity 0.5s ease;
}

.slide-fade-enter,
.slide-fade-leave-to {
  max-height: 0;
  opacity: 0;
}

.slide-fade-enter-to,
.slide-fade-leave {
  max-height: 500px;
  /* 设置一个足够大的值以适应内容 */
  opacity: 1;
}
</style>