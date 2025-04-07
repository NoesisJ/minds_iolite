<template>
  <div class="materialInformation w-full flex-grow flex flex-col overflow-auto">
    <!-- Header -->
    <div
      class="header w-full h-[4.5rem] pl-[1rem] pr-[3rem] flex justify-between items-center gap-2"
    >
      <div class="searchGroup flex items-center space-x-2">
        <AutoComplete
          v-model="nameValue"
          :suggestions="filteredNames"
          @complete="searchNames"
          placeholder="物资名称"
        />
        <AutoComplete
          v-model="categoryValue"
          :suggestions="filteredCategories"
          @complete="searchCategories"
          placeholder="物资类别"
        />
        <AutoComplete
          v-model="locationValue"
          :suggestions="filteredLocations"
          @complete="searchLocations"
          placeholder="所处位置"
        />
      </div>
      <div class="buttonGroup flex items-center space-x-3">
        <Button
          icon="pi pi-upload"
          label="导出"
          severity="info"
          class="header-button"
          @click="exportCSV()"
        />
        <Button
          icon="pi pi-plus"
          label="添加"
          severity="help"
          class="header-button"
          raised
          @click="openNew"
        />
        <Button
          icon="pi pi-trash"
          label="删除"
          severity="danger"
          class="header-button"
          outlined
          raised
          @click="confirmDeleteSelected"
          :disabled="!selectedItems || !selectedItems.length"
        />
      </div>
    </div>

    <!-- 操作成功提示 -->
    <Toast />

    <!-- 添加、编辑物资对话框 -->
    <Dialog
      v-model:visible="itemDialog"
      :style="{ width: '800px' }"
      header="物资信息"
      :modal="true"
    >
      <div class="flex flex-row gap-4">
        <div class="min-w-[350px] flex flex-col gap-6">
          <!-- 物资名称 -->
          <div>
            <label for="name" class="block font-bold mb-3">物资名称</label>
            <InputText
              id="name"
              v-model.trim="item.name"
              required="true"
              autofocus
              :invalid="submitted && !item.name"
              fluid
            />
            <small v-if="submitted && !item.name" class="text-red-500"
              >名称为必填项</small
            >
          </div>

          <!-- 物资信息 -->
          <div class="card grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- 物资类别 -->
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-tags"></i>
              </InputGroupAddon>
              <Select
                v-model="item.category"
                :options="categories"
                optionLabel="name"
                optionValue="name"
                placeholder="物资类别"
              />
            </InputGroup>

            <!-- 数量 -->
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-hashtag"></i>
              </InputGroupAddon>
              <InputText
                v-model="quantityStr"
                :invalid="
                  submitted && !!quantityStr && !/^\d+$/.test(quantityStr)
                "
                placeholder="数量"
                v-keyfilter="{ pattern: /^\d+$/, validateOnly: true }"
              />
            </InputGroup>

            <!-- 单位 -->
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-flag"></i>
              </InputGroupAddon>
              <InputText v-model="item.unit" placeholder="单位" />
            </InputGroup>

            <!-- 所处位置 -->
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-map-marker"></i>
              </InputGroupAddon>
              <Select
                v-model="item.location"
                :options="locations"
                optionLabel="name"
                optionValue="name"
                placeholder="所处位置"
              />
            </InputGroup>

            <!-- 用途 -->
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-briefcase"></i>
              </InputGroupAddon>
              <InputText v-model="item.purpose" placeholder="用途" />
            </InputGroup>
          </div>
        </div>

        <!-- 备注 -->
        <InputGroup class="remarks">
          <Textarea
            id="remarks"
            v-model="item.remarks"
            placeholder="请输入备注信息..."
            rows="8"
            class="flex-1"
            autoResize
          />
        </InputGroup>
      </div>

      <template #footer>
        <Button
          label="取消"
          icon="pi pi-times"
          severity="info"
          text
          @click="hideDialog"
        />
        <Button
          label="确认"
          icon="pi pi-check"
          severity="help"
          @click="saveItem"
        />
      </template>
    </Dialog>

    <!-- 确认单个删除对话框 -->
    <Dialog
      v-model:visible="deleteItemDialog"
      :style="{ width: '450px' }"
      header="确认"
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="item"
          >您确定要删除<b>{{ item.name }}</b
          >吗?</span
        >
      </div>
      <template #footer>
        <Button
          label="否"
          icon="pi pi-times"
          severity="secondary"
          text
          @click="deleteItemDialog = false"
        />
        <Button
          label="是"
          icon="pi pi-check"
          severity="help"
          @click="deleteItem"
        />
      </template>
    </Dialog>

    <!-- 确认批量删除对话框 -->
    <Dialog
      v-model:visible="deleteItemsDialog"
      :style="{ width: '450px' }"
      header="确认"
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="selectedItems">您确定要删除选中的项吗?</span>
      </div>
      <template #footer>
        <Button
          label="否"
          icon="pi pi-times"
          severity="secondary"
          text
          @click="deleteItemsDialog = false"
        />
        <Button
          label="是"
          icon="pi pi-check"
          severity="help"
          text
          @click="deleteSelectedItems"
        />
      </template>
    </Dialog>

    <!-- 物资表格 -->
    <div class="contentMaterial w-full overflow-auto scrollbar-hide">
      <Table
        ref="dataTable"
        :data="finalFilteredItems"
        :columns="columns"
        v-model:selection="selectedItems"
        @edit="editItem"
        @delete="confirmDeleteItem"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Table from "../../components/Table.vue";
import AutoComplete from "primevue/autocomplete";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import Textarea from "primevue/textarea";

const toast = useToast();
const dataTable = ref();

// 搜索值
const nameValue = ref("");
const categoryValue = ref("");
const locationValue = ref("");
const filteredNames = ref<string[]>([]);
const filteredCategories = ref<string[]>([]);
const filteredLocations = ref<string[]>([]);

// 表格选中项
const selectedItems = ref<Item[]>([]);

// 下拉框数据
const categories = ref([
  { name: "电子设备", code: "ELEC" },
  { name: "办公用品", code: "OFFICE" },
  { name: "工具器材", code: "TOOL" },
  { name: "耗材", code: "CONSUM" },
]);

const locations = ref([
  { name: "仓库A区", code: "WH-A" },
  { name: "仓库B区", code: "WH-B" },
  { name: "实验室", code: "LAB" },
  { name: "办公室", code: "OFFICE" },
]);

// 列配置
const columns = [
  { field: "name", header: "名称", sortable: true, frozen: true },
  { field: "category", header: "类别" },
  { field: "quantity", header: "数量" },
  { field: "unit", header: "单位" },
  { field: "location", header: "位置" },
  { field: "purpose", header: "用途" },
  { field: "remarks", header: "备注" },
];

// 控制对话框显示
const itemDialog = ref(false);
const deleteItemDialog = ref(false);
const deleteItemsDialog = ref(false);

type Item = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  location: string;
  purpose: string;
  remarks: string;
};

const item = ref<Item>({
  id: "",
  name: "",
  category: "",
  quantity: 0,
  unit: "",
  location: "",
  purpose: "",
  remarks: "",
});

const submitted = ref(false);

// 示例数据
const items = ref([
  {
    id: "1",
    name: "万用表",
    category: "电子设备",
    quantity: 5,
    unit: "台",
    location: "实验室",
    purpose: "电路检测",
    remarks: "精密仪器小心保管",
  },
  {
    id: "2",
    name: "A4打印纸",
    category: "办公用品",
    quantity: 20,
    unit: "箱",
    location: "仓库A区",
    purpose: "日常办公",
    remarks: "剩余库存不足需补货",
  },
]);

const quantityStr = computed({
  get() {
    return item.value.quantity ? item.value.quantity.toString() : "";
  },
  set(value: string) {
    item.value.quantity = parseInt(value) || 0;
  },
});

// 导出CSV
const exportCSV = () => {
  dataTable.value.exportCSV();
};

// 搜索逻辑
const searchNames = (event: { query: string }) => {
  const query = event.query.toLowerCase();
  filteredNames.value = items.value
    .filter((item) => item.name.toLowerCase().includes(query))
    .map((item) => item.name);
};

const searchCategories = (event: { query: string }) => {
  const query = event.query.toLowerCase();
  const uniqueCategories = [
    ...new Set(items.value.map((item) => item.category)),
  ];
  filteredCategories.value = uniqueCategories.filter((cat) =>
    cat.toLowerCase().includes(query)
  );
};

const searchLocations = (event: { query: string }) => {
  const query = event.query.toLowerCase();
  const uniqueLocations = [
    ...new Set(items.value.map((item) => item.location)),
  ];
  filteredLocations.value = uniqueLocations.filter((loc) =>
    loc.toLowerCase().includes(query)
  );
};

// 最终过滤数据
const finalFilteredItems = computed(() => {
  let result = [...items.value];

  if (nameValue.value) {
    result = result.filter((item) =>
      item.name.toLowerCase().includes(nameValue.value.toLowerCase())
    );
  }

  if (categoryValue.value) {
    result = result.filter((item) =>
      item.category.toLowerCase().includes(categoryValue.value.toLowerCase())
    );
  }

  if (locationValue.value) {
    result = result.filter((item) =>
      item.location.toLowerCase().includes(locationValue.value.toLowerCase())
    );
  }

  return result;
});

// 其他方法（保存、删除等）保持不变...
// 此处应包含与原始代码相同的业务逻辑方法，仅修改字段对应关系
// 由于篇幅限制，具体实现参考原始代码逻辑进行调整

// 重置物资信息
const resetItem = () => {
  item.value = {
    id: "",
    name: "",
    category: "",
    quantity: 0,
    unit: "",
    location: "",
    purpose: "",
    remarks: "",
  };
};

// 显示添加物资
const openNew = () => {
  resetItem();
  itemDialog.value = true;
};

// 隐藏对话框
const hideDialog = () => {
  itemDialog.value = false;
};

// 显示编辑物资
const editItem = (i: Item) => {
  item.value = { ...i };
  itemDialog.value = true;
};

// 显示确认删除物资
const confirmDeleteItem = (data: Item) => {
  item.value = data;
  deleteItemDialog.value = true;
};

// 显示确认批量删除
const confirmDeleteSelected = () => {
  deleteItemsDialog.value = true;
};

// 保存物资信息
const saveItem = () => {
  submitted.value = true;

  if (validateItem()) {
    const index = items.value.findIndex((i) => i.id === item.value.id);
    if (index !== -1) {
      items.value[index] = { ...item.value };
      showToast("编辑成功！");
    } else {
      items.value.push({ ...item.value });
      showToast("添加成功！");
    }
    itemDialog.value = false;
    resetItem();
  }
};

// 删除物资
const deleteItem = () => {
  items.value = items.value.filter((i) => i.id !== item.value.id);
  deleteItemDialog.value = false;
  resetItem();
  showToast("删除成功！");
};

// 批量删除
const deleteSelectedItems = () => {
  items.value = items.value.filter(
    (item) => !selectedItems.value.includes(item)
  );
  deleteItemsDialog.value = false;
  selectedItems.value = [];
  showToast("删除成功！");
};

// 验证
const validateItem = () => {
  return item.value.name?.trim() && item.value.quantity >= 0;
};

// 提示
const showToast = (message: string) => {
  toast.add({
    severity: "success",
    summary: "成功",
    detail: message,
    life: 3000,
  });
};
</script>

<style scoped>
/* 保持原有样式不变 */
.header-button {
  height: 2.2rem;
  width: 6rem;
  font-size: 1rem;
  font-weight: 900;
  margin-right: 0.5rem;
}

.p-inputtext {
  --p-inputtext-hover-border-color: #a16eff;
  --p-inputtext-focus-border-color: #a16eff;
}

.p-select {
  --p-select-hover-border-color: #a16eff;
  --p-select-focus-border-color: #a16eff;
}
</style>
