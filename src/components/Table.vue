<template>
  <DataTable
    ref="dt"
    v-model:selection="selection"
    :value="data"
    dataKey="id"
    :rows="rows"
    :filters="filters"
    scrollable
    :scrollHeight="scrollHeight"
    :tableStyle="tableStyle"
    class="overflow-auto scrollbar-hide"
    v-bind="$attrs"
  >
    <!-- 多选列 -->
    <Column
      v-if="showSelection"
      selectionMode="multiple"
      style="width: 3rem"
      :exportable="false"
    />

    <!-- 动态数据列 -->
    <template v-for="col in columns" :key="col.field">
      <Column
        :field="col.field"
        :header="col.header"
        :sortable="col.sortable"
        :frozen="col.frozen"
      />
    </template>

    <!-- 操作列 -->
    <Column v-if="showActions" :exportable="false">
      <template #body="slotProps" style="min-width: 12rem">
        <Button
          icon="pi pi-pencil"
          outlined
          rounded
          severity="info"
          class="mr-2"
          @click="$emit('edit', slotProps.data)"
        />
        <Button
          icon="pi pi-trash"
          outlined
          rounded
          severity="danger"
          @click="$emit('delete', slotProps.data)"
        />
      </template>
    </Column>
  </DataTable>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";

// 接口定义
interface Props {
  data: any[];
  columns: any[];
  showSelection?: boolean;
  showActions?: boolean;
  rows?: number;
  scrollHeight?: string;
  tableStyle?: string;
  filters?: Record<string, any>;
  selection?: any[];
}

const props = withDefaults(defineProps<Props>(), {
  showSelection: true,
  showActions: true,
  rows: 14,
  scrollHeight: "calc(100vh - 8.5rem)",
  tableStyle: "min-width: 1500px; height: fit;",
  filters: () => ({}),
  selection: () => [],
});

const emit = defineEmits(["update:selection", "edit", "delete"]);

// 表格引用
const dt = ref();

// 内部选择状态
const selection = ref(props.selection);

// 监听选择变化
watch(selection, (newValue) => {
  emit("update:selection", newValue);
});

// 监听props中selection的变化
watch(
  () => props.selection,
  (newValue) => {
    selection.value = newValue;
  }
);

defineExpose({
  dt,
});
</script>
