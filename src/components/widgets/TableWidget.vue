<template>
  <div class="table-widget" :style="styles">
    <div v-if="isLoading" class="table-loading">
      <i class="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
      <p class="mt-2 text-gray-600 dark:text-gray-300">加载数据中...</p>
    </div>
    
    <div v-else-if="loadError" class="table-error">
      <i class="pi pi-exclamation-triangle text-4xl text-red-500"></i>
      <p class="mt-2 text-gray-600 dark:text-gray-300">{{ loadError }}</p>
    </div>
    
    <div v-else-if="tableType && tableData.length > 0" class="table-container">
      <div v-if="showTitle" class="table-title mb-4">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
          {{ title }}
        </h3>
        <p
          v-if="subtitle"
          class="text-sm text-gray-500 dark:text-gray-400 mt-1"
        >
          {{ subtitle }}
        </p>
      </div>

      <Table
        :data="tableData"
        :columns="columns"
        :rows="Number(rows)"
        :showSelection="showSelection"
        v-model:selection="selectedItems"
        @edit="handleEdit"
        @delete="handleDelete"
      />

      <!-- 选中数据展示 -->
      <div
        v-if="showSelection && selectedItems.length > 0"
        class="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
      >
        <h4 class="text-md font-medium text-gray-600 dark:text-gray-300 mb-2">
          已选中数据
        </h4>
        <p class="dark:text-gray-300">
          已选中 {{ selectedItems.length }} 条记录
        </p>
        <div class="flex flex-wrap gap-2 mt-2">
          <span
            v-for="item in selectedItems"
            :key="item.id"
            class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-xs"
          >
            {{ getPrimaryField(item) }}
          </span>
        </div>
      </div>
    </div>
    <div v-else class="table-placeholder">
      <i class="pi pi-table text-4xl text-gray-400"></i>
      <p class="text-gray-500 mt-2">
        {{ tableData.length === 0 ? "暂无数据" : "表格类型未指定" }}
      </p>
    </div>

    <!-- 操作成功提示 -->
    <Toast />

    <!-- 编辑对话框 -->
    <Dialog
      v-model:visible="editDialog"
      :style="{ width: '650px' }"
      :header="`编辑${title || '数据'}`"
      :modal="true"
    >
      <div class="p-4">
        <div class="grid grid-cols-2 gap-4">
          <div v-for="column in columns" :key="column.field" class="form-group">
            <label class="block mb-2 font-medium">{{ column.header }}</label>
            <div>
              <!-- 根据字段类型选择不同的输入组件 -->
              <InputNumber
                v-if="isNumberField(column.field)"
                v-model="currentItem[column.field]"
                class="w-full"
                :mode="isCurrencyField(column.field) ? 'currency' : 'decimal'"
                :currency="isCurrencyField(column.field) ? 'CNY' : undefined"
                :locale="isCurrencyField(column.field) ? 'zh-CN' : undefined"
              />
              <Dropdown
                v-else-if="isOptionField(column.field)"
                v-model="currentItem[column.field]"
                :options="getFieldOptions(column.field)"
                class="w-full"
              />
              <InputText
                v-else
                v-model="currentItem[column.field]"
                class="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <Button
          label="取消"
          icon="pi pi-times"
          outlined
          class="mr-2"
          @click="editDialog = false"
        />
        <Button label="保存" icon="pi pi-check" @click="saveItem" />
      </template>
    </Dialog>

    <!-- 删除确认对话框 -->
    <Dialog
      v-model:visible="deleteDialog"
      :style="{ width: '450px' }"
      header="确认删除"
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle text-yellow-500 text-2xl"></i>
        <span>确定要删除此数据吗？此操作无法撤销。</span>
      </div>
      <template #footer>
        <Button
          label="取消"
          icon="pi pi-times"
          outlined
          class="mr-2"
          @click="deleteDialog = false"
        />
        <Button
          label="删除"
          icon="pi pi-trash"
          severity="danger"
          @click="deleteConfirmed"
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, onMounted, watch } from "vue";
import Table from "@/components/Table.vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Dropdown from "primevue/dropdown";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { databaseService } from "@/services/databaseService";

const toast = useToast();
const props = defineProps({
  // 表格类型: basic, product, finance, user 等
  tableType: {
    type: String,
    default: "basic",
  },
  // 表格标题
  title: {
    type: String,
    default: "",
  },
  // 表格副标题
  subtitle: {
    type: String,
    default: "",
  },
  // 是否显示标题
  showTitle: {
    type: Boolean,
    default: true,
  },
  // 表格数据
  data: {
    type: Array,
    default: () => [],
  },
  // 表格列定义
  columns: {
    type: Array,
    default: () => [],
  },
  // 每页行数
  rows: {
    type: [Number, String],
    default: 5,
  },
  // 是否显示选择框
  showSelection: {
    type: Boolean,
    default: false,
  },
  // 字段选项配置 (用于下拉菜单)
  fieldOptions: {
    type: Object,
    default: () => ({}),
  },
  // 数值字段
  numberFields: {
    type: Array,
    default: () => [],
  },
  // 货币字段
  currencyFields: {
    type: Array,
    default: () => [],
  },
  // 选项字段
  optionFields: {
    type: Array,
    default: () => [],
  },
  // 主要显示字段
  primaryField: {
    type: String,
    default: "name",
  },
  // 样式
  styles: {
    type: Object,
    default: () => ({}),
  },
  // 新增数据源属性
  dataSource: {
    type: String,
    default: "default" // 默认使用示例数据
  },
  // 数据库配置
  databaseConfig: {
    type: Object,
    default: () => ({
      sessionId: "",
      collection: "",
      filter: {},
      sort: {},
      fields: []
    })
  }
});

const emit = defineEmits(["update:data"]);

// 本地状态
const localData = ref([]);
const isLoading = ref(false);
const loadError = ref(null);

// 组合数据源
const tableData = computed(() => {
  // 如果使用默认数据，直接返回props.data
  if (props.dataSource === "default") {
    return props.data;
  }
  // 否则使用从数据库加载的数据
  return localData.value;
});

// 监听数据源变化
watch(() => props.dataSource, loadDataIfNeeded);
watch(() => props.databaseConfig, loadDataIfNeeded, { deep: true });

// 在组件挂载时加载数据
onMounted(loadDataIfNeeded);

// 加载数据的方法
async function loadDataIfNeeded() {
  // 如果使用默认数据，不需要加载
  if (props.dataSource === "default") {
    return;
  }
  
  // 如果没有会话ID，也不加载
  if (!props.databaseConfig.sessionId) {
    loadError.value = "未配置数据库会话ID";
    return;
  }
  
  try {
    isLoading.value = true;
    loadError.value = null;
    
    // 从数据库服务获取数据
    const result = await databaseService.getTableData({
      sessionId: props.databaseConfig.sessionId,
      collection: props.databaseConfig.collection,
      table: props.databaseConfig.collection, // 同时支持MongoDB和MySQL
      fields: props.databaseConfig.fields,
      limit: parseInt(props.rows) * 5, // 获取多页数据以支持客户端分页
      filter: props.databaseConfig.filter,
      sort: props.databaseConfig.sort
    });
    
    // 更新本地数据
    localData.value = result;
    
    // 成功提示
    if (result.length > 0) {
      toast.add({
        severity: 'success',
        summary: '数据加载成功',
        detail: `已从数据库加载 ${result.length} 条记录`,
        life: 3000
      });
    } else {
      toast.add({
        severity: 'info',
        summary: '数据加载完成',
        detail: '没有找到符合条件的数据',
        life: 3000
      });
    }
  } catch (error) {
    console.error('加载数据失败:', error);
    loadError.value = error.message || '加载数据时出错';
    toast.add({
      severity: 'error',
      summary: '数据加载失败',
      detail: loadError.value,
      life: 5000
    });
  } finally {
    isLoading.value = false;
  }
}

// 对话框状态和数据
const editDialog = ref(false);
const deleteDialog = ref(false);
const currentItem = ref({});
const currentIndex = ref(-1);
const selectedItems = ref([]);

// 样式组合
const styles = computed(() => {
  // 基本样式
  const baseStyles = {
    width: "100%",
    overflow: "hidden",
    padding: "16px",
  };

  // 合并组件的样式
  return { ...baseStyles, ...props.styles };
});

// 处理编辑
const handleEdit = (item) => {
  currentItem.value = JSON.parse(JSON.stringify(item));
  currentIndex.value = props.data.findIndex((i) => i.id === item.id);
  editDialog.value = true;
};

// 处理删除
const handleDelete = (item) => {
  currentItem.value = item;
  currentIndex.value = props.data.findIndex((i) => i.id === item.id);
  deleteDialog.value = true;
};

// 保存编辑项
const saveItem = () => {
  if (currentIndex.value !== -1) {
    // 创建新的数据数组
    const updatedData = [...props.data];
    updatedData[currentIndex.value] = { ...currentItem.value };
    
    // 更新组件属性
    if (window.__DESIGNER_MODE__) {
      // 在设计器环境中
      const designerStore = window.$designerStore;
      if (designerStore && designerStore.selectedComponentId) {
        designerStore.updateComponentProps(designerStore.selectedComponentId, {
          data: updatedData
        });
      }
    } else {
      // 常规环境中
      emit("update:data", updatedData);
    }
    
    // 显示成功消息
    showToast("修改成功");
    
    // 关闭对话框
    editDialog.value = false;
  }
};

// 确认删除
const deleteConfirmed = () => {
  if (currentIndex.value !== -1) {
    // 创建不包含被删除项的新数组
    const updatedData = props.data.filter(
      (item) => item.id !== currentItem.value.id
    );
    
    // 更新组件属性
    if (window.__DESIGNER_MODE__) {
      // 在设计器环境中
      const designerStore = window.$designerStore;
      if (designerStore && designerStore.selectedComponentId) {
        designerStore.updateComponentProps(designerStore.selectedComponentId, {
          data: updatedData
        });
      }
    } else {
      // 常规环境中
      emit("update:data", updatedData);
    }
    
    // 如果删除的是选中项，也从选中数据中移除
    selectedItems.value = selectedItems.value.filter(
      (item) => item.id !== currentItem.value.id
    );
    
    // 显示成功消息
    showToast("删除成功");
    
    // 关闭对话框
    deleteDialog.value = false;
  }
};

// 显示提示消息
const showToast = (message, severity = "success") => {
  toast.add({
    severity: severity,
    summary: severity === "success" ? "成功" : "错误",
    detail: message,
    life: 3000,
  });
};

// 判断字段类型的辅助函数
const isNumberField = (field) => {
  return (
    props.numberFields.includes(field) || props.currencyFields.includes(field)
  );
};

const isCurrencyField = (field) => {
  return props.currencyFields.includes(field);
};

const isOptionField = (field) => {
  return props.optionFields.includes(field);
};

// 获取字段选项
const getFieldOptions = (field) => {
  return props.fieldOptions[field] || [];
};

// 获取主要字段值 (用于选择展示)
const getPrimaryField = (item) => {
  return item[props.primaryField] || item.id;
};
</script>

<style scoped>
.table-widget {
  width: 100%;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

:global(.dark) .table-widget {
  background-color: #242736;
}

.table-container {
  width: 100%;
}

.table-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  background-color: #f5f5f5;
  border: 1px dashed #ccc;
  border-radius: 4px;
}

:global(.dark) .table-placeholder {
  background-color: #1a1d2d;
  border-color: #36394a;
}

.table-loading, .table-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  background-color: #f8fafc;
  border-radius: 4px;
  padding: 20px;
}

:global(.dark) .table-loading, :global(.dark) .table-error {
  background-color: #1a1d2d;
}

/* 表单样式 */
:deep(.p-dropdown) {
  width: 100%;
}

:deep(.p-inputnumber) {
  width: 100%;
}

.form-group {
  margin-bottom: 1rem;
}

:deep(.p-dialog-content) {
  padding: 0 !important;
}
</style>
