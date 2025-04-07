<template>
  <div class="relative inline-block text-left z-50" ref="dropdownRef">
    <button
      ref="buttonRef"
      type="button"
      class="text-md flex items-center justify-center w-full rounded-lg border border-[#4a4a46] shadow-sm px-3 py-2 bg-[#454545] font-medium text-white hover:bg-[#262624] transition-colors duration-200 ease-in-out"
      @click="toggleOpen"
    >
      <slot></slot>
      <ChevronDown class="w-4 h-4 ml-2" />
    </button>

    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0 -translate-y-2 -translate-x-2"
      enter-to-class="transform scale-100 opacity-100 translate-y-0 translate-x-0"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100 translate-y-0 translate-x-0"
      leave-to-class="transform scale-95 opacity-0 -translate-y-2 -translate-x-2"
    >
      <div
        v-if="isOpen"
        ref="menuRef"
        class="absolute rounded-md shadow-lg bg-[#454545] border border-gray-700/60 z-50 max-h-[200px] overflow-y-auto p-1.5"
        :class="position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'"
        :style="{
          width: menuWidth ? `${menuWidth}px` : 'auto',
          minWidth: '100%',
          [position === 'top' ? 'bottom' : 'top']: '100%',
        }"
      >
        <div
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div
            v-for="(item, index) in items"
            :key="index"
            class="text-md block px-4 py-2 text-[#c2c0b6] hover:bg-[#282726] hover:text-white cursor-pointer z-50 relative whitespace-nowrap transition-colors duration-200 ease-in-out rounded-md"
            role="menuitem"
            @click="handleItemClick(item)"
          >
            {{ item.label }}
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ChevronDown } from "lucide-vue-next";
import { ref, onMounted, onUnmounted, watch } from "vue";

interface DropdownItem {
  label: string;
  value: any;
}

interface Props {
  items: DropdownItem[];
  callback: (item: DropdownItem) => void;
  position?: "top" | "bottom";
}

const props = withDefaults(defineProps<Props>(), {
  position: "bottom",
});

const isOpen = ref(false);
const menuWidth = ref<number | undefined>(undefined);
const dropdownRef = ref<HTMLElement | null>(null);
const buttonRef = ref<HTMLElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);

const toggleOpen = () => {
  isOpen.value = !isOpen.value;
};

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

const handleItemClick = (item: DropdownItem) => {
  props.callback(item);
  isOpen.value = false;
};

onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});

watch(isOpen, (newVal) => {
  if (newVal && buttonRef.value && menuRef.value) {
    const buttonWidth = buttonRef.value.offsetWidth;
    const currentMenuWidth = menuRef.value.offsetWidth;
    menuWidth.value = Math.max(buttonWidth, currentMenuWidth);
  }
});
</script>
