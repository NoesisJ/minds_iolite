<template>
  <div class="expandable-panel">
    <button
      @click="handleHeaderClick"
      class="panel-header"
      :class="{
        active: isActive,
        hoverable: !isActive,
        'has-children': hasChildren,
      }"
    >
      <slot name="header" />
      <span v-if="hasChildren" class="toggle-icon">
        {{ isOpen ? "-" : "+" }}
      </span>
    </button>

    <transition name="slide-fade">
      <div
        v-if="hasChildren"
        class="panel-content"
        :style="{ maxHeight: isOpen ? contentHeight : '0px' }"
        ref="content"
      >
        <slot name="content"></slot>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const props = defineProps({
  isActive: Boolean,
  defaultOpen: Boolean,
  routePath: String,
  hasChildren: Boolean,
});

const emit = defineEmits(["headerClick"]);

const isOpen = ref(props.defaultOpen);
const content = ref<HTMLElement | null>(null);
const contentHeight = ref("auto");

const handleHeaderClick = () => {
  if (props.hasChildren) {
    // 有子菜单时触发展开/折叠
    togglePanel();
  } else {
    // 无子菜单时触发路由跳转
    emit("headerClick", props.routePath);
  }
};

const togglePanel = () => {
  isOpen.value = !isOpen.value;
  if (isOpen.value && content.value) {
    contentHeight.value = `${content.value.scrollHeight}px`;
  }
};

onMounted(() => {
  if (isOpen.value && content.value) {
    contentHeight.value = `${content.value.scrollHeight}px`;
  }
});
</script>

<style scoped>
.panel-header {
  position: relative;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.75rem 1rem;
  background-color: transparent;
  border: none;
  text-align: left;
  width: 100%;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}

.panel-header.hoverable:hover {
  background-color: var(--material-item-bg-hover);
}

.panel-header.active {
  background-color: var(--material-item-bg-selected);
  color: white;
}

.panel-header.active:hover {
  background-color: var(--material-item-bg-selected-hover);
}

.toggle-icon {
  margin-left: auto;
  font-weight: bold;
}

.panel-content {
  width: 93%;
    margin: 0 auto;
  overflow: hidden;
  background-color: var(--material-item-bg);
  transition: max-height 0.3s ease-in-out;
}
</style>
