<template>
  <DataTable
    ref="dt"
    v-model:selection="selection"
    :value="data"
    dataKey="id"
    :rows="rows"
    :filters="filters"
    scrollable
    :tableStyle="tableStyle"
    class="overflow-auto scrollbar-hide"
    v-bind="$attrs"
    paginator
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
      >
        <template #body="slotProps">
          <template
            v-if="
              ['unitPrice', 'shippingCost', 'totalPrice'].includes(col.field) &&
              slotProps.data[col.field]
            "
          >
            {{ slotProps.data[col.field].toFixed(2) }}
          </template>
          <template v-else-if="col.field === 'branch'">
            {{ slotProps.data[col.field] }}
          </template>
          <template v-else>
            {{ slotProps.data[col.field] }}
          </template>
        </template>
      </Column>
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
  tableStyle?: string;
  filters?: Record<string, any>;
  selection?: any[];
}

const props = withDefaults(defineProps<Props>(), {
  showSelection: true,
  showActions: true,
  rows: 5,
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

<style scoped>
.p-datatable-tbody > tr {
  --p-datatable-row-background: #fff;
}
</style>
