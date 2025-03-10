<template>
  <Dialog
    v-model:visible="visible"
    :style="{ width: '450px' }"
    header="确认"
    :modal="true"
  >
    <div class="flex items-center gap-4">
      <i class="pi pi-exclamation-triangle !text-3xl" />
      <span>{{ message }}</span>
    </div>
    <template #footer>
      <Button
        label="取消"
        icon="pi pi-times"
        severity="secondary"
        text
        @click="visible = false"
      />
      <Button
        label="确认"
        icon="pi pi-check"
        severity="help"
        @click="$emit('confirm')"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";

const props = defineProps<{
  visible: boolean;
  message: string;
}>();

const emit = defineEmits(["update:visible", "confirm"]);

const visible = ref(props.visible);

watch(
  () => props.visible,
  (newVal) => {
    visible.value = newVal;
  }
);
</script>
