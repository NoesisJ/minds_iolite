<template>
  <DataTable
    ref="dt"
    v-model:selection="selection"
    :value="data"
    dataKey="id"
    :rows="Number(rows)"
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
  rows?: number | string;
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

// Log the rows value for debugging
console.log("Table component - rows:", props.rows, "type:", typeof props.rows);

defineExpose({
  dt,
});
</script>

<style scoped>
/* 修改表格背景色和字体颜色 */
:deep(.p-datatable) {
  background-color: #1e1e1e !important;
  color: white !important;
}

:deep(.p-datatable-thead > tr > th) {
  background-color: #2d2d2d !important;
  color: white !important;
  border-color: #444 !important;
}

:deep(.p-datatable-tbody > tr) {
  background-color: #1e1e1e !important;
  color: white !important;
}

:deep(.p-datatable-tbody > tr:hover) {
  background-color: #333 !important;
}

:deep(.p-datatable-tbody > tr > td) {
  border-color: #444 !important;
  color: white !important;
}

/* 分页器样式 */
:deep(.p-paginator) {
  background-color: #1e1e1e !important;
  color: white !important;
}

:deep(.p-paginator .p-paginator-element) {
  color: white !important;
}

/* 滚动条样式 */
:deep(*::-webkit-scrollbar) {
  width: 8px;
  height: 8px;
}

:deep(*::-webkit-scrollbar-track) {
  background: #333333;
}

:deep(*::-webkit-scrollbar-thumb) {
  background-color: #1e2939 !important;
  border-radius: 4px;
}

/* 单选框样式 */
:deep(.p-radiobutton .p-radiobutton-box.p-highlight) {
  border-color: #ecfdf5 !important;
  background: #ecfdf5 !important;
}

:deep(.p-radiobutton .p-radiobutton-box.p-highlight .p-radiobutton-icon) {
  color: #1e1e1e !important;
}

:deep(.p-radiobutton:not(.p-disabled):hover .p-radiobutton-box) {
  border-color: #ecfdf5 !important;
}

/* 操作按钮样式 */
:deep(.p-button.p-button-icon-only) {
  border-color: #222222 !important;
}

:deep(.p-button.p-button-outlined) {
  border-color: #222222 !important;
}

/* 编辑和删除按钮 */
:deep(.p-datatable .p-button.p-button-text) {
  border: 1px solid #222222 !important;
  background-color: transparent !important;
}

:deep(.p-datatable .p-button.p-button-text:hover) {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

/* 去掉原有的白色背景设置 */
.p-datatable-tbody > tr {
  --p-datatable-row-background: #1e1e1e;
}
</style>
