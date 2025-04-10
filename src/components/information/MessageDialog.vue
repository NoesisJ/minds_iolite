<template>
  <Dialog
    v-model:visible="visible"
    :style="{ width: '450px' }"
    :header="title"
    :modal="true"
  >
    <div class="flex items-center gap-4">
      <i :class="[iconClass, '!text-3xl']" />
      <span>{{ message }}</span>
    </div>
    <template #footer>
      <Button
        :label="buttonLabel"
        icon="pi pi-check"
        :severity="severity"
        @click="handleConfirm"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "消息",
  },
  type: {
    type: String,
    default: "info", // info, success, warning, error
  },
  buttonLabel: {
    type: String,
    default: "确定",
  },
});

const emit = defineEmits(["update:visible", "confirm"]);

const visible = ref(props.visible);

watch(
  () => props.visible,
  (newVal) => {
    visible.value = newVal;
  }
);

watch(
  () => visible.value,
  (newVal) => {
    emit("update:visible", newVal);
  }
);

const iconClass = computed(() => {
  switch (props.type) {
    case "success":
      return "pi pi-check-circle text-green-500";
    case "warning":
      return "pi pi-exclamation-triangle text-yellow-500";
    case "error":
      return "pi pi-times-circle text-red-500";
    default:
      return "pi pi-info-circle text-blue-500";
  }
});

const severity = computed(() => {
  switch (props.type) {
    case "success":
      return "success";
    case "warning":
      return "warning";
    case "error":
      return "danger";
    default:
      return "info";
  }
});

const handleConfirm = () => {
  visible.value = false;
  emit("confirm");
};
</script>
