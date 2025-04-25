<template>
  <div class="table-widget" :style="styles">
    <div v-if="isLoading" class="table-loading">
      <i class="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
      <p class="mt-2 text-gray-300">加载数据中...</p>
    </div>

    <div v-else-if="loadError" class="table-error">
      <i class="pi pi-exclamation-triangle text-4xl text-red-500"></i>
      <p class="mt-2 text-gray-300">{{ loadError }}</p>
    </div>

    <div v-else-if="tableType && tableData.length > 0" class="table-container">
      <div v-if="showTitle" class="table-title mb-4">
        <h3 class="text-xl font-semibold text-gray-200">
          {{ title }}
        </h3>
        <p v-if="subtitle" class="text-sm text-gray-400 mt-1">
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
        class="mt-4 p-3 bg-gray-800 rounded-lg"
      >
        <h4 class="text-md font-medium text-gray-300 mb-2">已选中数据</h4>
        <p class="text-gray-300">已选中 {{ selectedItems.length }} 条记录</p>
        <div class="flex flex-wrap gap-2 mt-2">
          <span
            v-for="item in selectedItems"
            :key="item.id"
            class="px-3 py-1 bg-blue-900 text-blue-100 rounded-full text-xs"
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
import { getActiveSession } from "@/services/sessionStore";

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
    default: "default", // 默认使用示例数据
  },
  // 数据库配置
  databaseConfig: {
    type: Object,
    default: () => ({
      sessionId: "",
      collection: "",
      filter: {},
      sort: {},
      fields: [],
    }),
  },
});

const emit = defineEmits(["update:data"]);

// 本地状态
const localData = ref([]);
const isLoading = ref(false);
const loadError = ref(null);

// 模拟数据 - 当选择数据库模式时使用
const mockDatabaseData = [
  {
    id: 1001,
    account: "瑞锋紧固件厂",
    type: "六角螺栓",
    amount: 356.5,
    date: "2024-05-01",
    status: "已结算",
  },
  {
    id: 1002,
    account: "恒强五金制品有限公司",
    type: "不锈钢螺母",
    amount: 298.0,
    date: "2024-05-02",
    status: "已结算",
  },
  {
    id: 1003,
    account: "德美机械配件厂",
    type: "内六角螺丝",
    amount: 425.0,
    date: "2024-05-05",
    status: "待结算",
  },
  {
    id: 1004,
    account: "汇力紧固系统有限公司",
    type: "膨胀螺栓",
    amount: 185.0,
    date: "2024-05-07",
    status: "已结算",
  },
  {
    id: 1005,
    account: "宇航标准件有限公司",
    type: "自攻螺丝",
    amount: 153.8,
    date: "2024-05-08",
    status: "已结算",
  },
  {
    id: 1006,
    account: "金石机械零部件厂",
    type: "弹簧垫圈",
    amount: 72.5,
    date: "2024-05-10",
    status: "待结算",
  },
  {
    id: 1007,
    account: "鑫辉标准件有限公司",
    type: "铆钉",
    amount: 120.0,
    date: "2024-05-12",
    status: "已结算",
  },
  {
    id: 1008,
    account: "华迈机械配件有限公司",
    type: "梅花螺丝",
    amount: 350.0,
    date: "2024-05-13",
    status: "待结算",
  },
  {
    id: 1009,
    account: "东升紧固件厂",
    type: "开口销",
    amount: 80.0,
    date: "2024-05-15",
    status: "已结算",
  },
  {
    id: 1010,
    account: "奥力五金制品厂",
    type: "尼龙螺母",
    amount: 270.5,
    date: "2024-05-16",
    status: "已结算",
  },
  {
    id: 1011,
    account: "豪特标准件有限公司",
    type: "圆柱销",
    amount: 130.0,
    date: "2024-05-18",
    status: "待结算",
  },
  {
    id: 1012,
    account: "兴达紧固件配件厂",
    type: "木螺丝",
    amount: 160.8,
    date: "2024-05-19",
    status: "已结算",
  },
  {
    id: 1013,
    account: "精锐五金制品公司",
    type: "T型螺栓",
    amount: 420.0,
    date: "2024-05-20",
    status: "待结算",
  },
  {
    id: 1014,
    account: "航宇机械五金厂",
    type: "蝶形螺母",
    amount: 95.0,
    date: "2024-05-21",
    status: "已结算",
  },
  {
    id: 1015,
    account: "联胜工业紧固件公司",
    type: "十字沉头螺丝",
    amount: 680.0,
    date: "2024-05-22",
    status: "待结算",
  },
  {
    id: 1016,
    account: "正大标准件有限公司",
    type: "平垫圈",
    amount: 65.5,
    date: "2024-05-23",
    status: "已结算",
  },
  {
    id: 1017,
    account: "宏德机械配件厂",
    type: "U型螺栓",
    amount: 578.0,
    date: "2024-05-25",
    status: "已结算",
  },
  {
    id: 1018,
    account: "强盛五金制品厂",
    type: "扁头螺钉",
    amount: 315.0,
    date: "2024-05-26",
    status: "待结算",
  },
  {
    id: 1019,
    account: "恒信紧固件有限公司",
    type: "锁紧螺母",
    amount: 280.5,
    date: "2024-05-28",
    status: "已结算",
  },
  {
    id: 1020,
    account: "鑫隆标准件厂",
    type: "半圆头螺栓",
    amount: 730.0,
    date: "2024-05-29",
    status: "待结算",
  },
  {
    id: 1021,
    account: "盛达机械零部件厂",
    type: "双头螺栓",
    amount: 290.8,
    date: "2024-05-30",
    status: "已结算",
  },
  {
    id: 1022,
    account: "永固紧固系统有限公司",
    type: "止动垫圈",
    amount: 165.0,
    date: "2024-05-31",
    status: "待结算",
  },
];

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

  // 显示加载状态
  isLoading.value = true;
  loadError.value = null;

  try {
    // 模拟API调用延迟
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 使用模拟数据而不是真正调用数据库
    console.log("使用模拟数据代替真实数据库连接");

    // 可以在这里根据过滤条件筛选模拟数据
    let filteredData = [...mockDatabaseData];

    // 如果有过滤条件，模拟过滤
    if (
      props.databaseConfig.filter &&
      Object.keys(props.databaseConfig.filter).length > 0
    ) {
      const filters = props.databaseConfig.filter;
      filteredData = mockDatabaseData.filter((item) => {
        for (const key in filters) {
          if (item[key] !== filters[key]) {
            return false;
          }
        }
        return true;
      });
    }

    // 如果有排序条件，模拟排序
    if (
      props.databaseConfig.sort &&
      Object.keys(props.databaseConfig.sort).length > 0
    ) {
      const sortField = Object.keys(props.databaseConfig.sort)[0];
      const sortOrder = props.databaseConfig.sort[sortField]; // 1为升序，-1为降序

      filteredData.sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortOrder === 1 ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortOrder === 1 ? 1 : -1;
        return 0;
      });
    }

    // 更新本地数据
    localData.value = filteredData;

    // 成功提示
    if (filteredData.length > 0) {
      toast.add({
        severity: "success",
        summary: "数据加载成功",
        detail: `已从数据库加载 ${filteredData.length} 条记录`,
        life: 3000,
      });
    } else {
      toast.add({
        severity: "info",
        summary: "数据加载完成",
        detail: "没有找到符合条件的数据",
        life: 3000,
      });
    }
  } catch (error) {
    console.error("加载数据失败:", error);
    loadError.value = error.message || "加载数据时出错";
    toast.add({
      severity: "error",
      summary: "数据加载失败",
      detail: loadError.value,
      life: 5000,
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
          data: updatedData,
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
          data: updatedData,
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

.table-loading,
.table-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  background-color: #f8fafc;
  border-radius: 4px;
  padding: 20px;
}

:global(.dark) .table-loading,
:global(.dark) .table-error {
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
