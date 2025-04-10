<template>
  <Dialog
    v-model:visible="visible"
    :style="{ width: '450px' }"
    :header="title"
    :modal="true"
  >
    <div class="flex items-center gap-4">
      <i class="pi pi-question-circle !text-3xl text-blue-500" />
      <span>{{ message }}</span>
    </div>
    <template #footer>
      <Button
        :label="cancelLabel"
        icon="pi pi-times"
        severity="secondary"
        text
        @click="handleCancel"
      />
      <Button
        :label="confirmLabel"
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
    default: "确认",
  },
  type: {
    type: String,
    default: "primary", // primary, danger, warning
  },
  confirmLabel: {
    type: String,
    default: "确认",
  },
  cancelLabel: {
    type: String,
    default: "取消",
  },
});

const emit = defineEmits(["update:visible", "confirm", "cancel"]);

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

const severity = computed(() => {
  switch (props.type) {
    case "danger":
      return "danger";
    case "warning":
      return "warning";
    default:
      return "primary";
  }
});

const handleConfirm = () => {
  visible.value = false;
  emit("confirm");
};

const handleCancel = () => {
  visible.value = false;
  emit("cancel");
};
</script>
