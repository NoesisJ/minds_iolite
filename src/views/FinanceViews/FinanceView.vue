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
          v-model="groupValue"
          :suggestions="filteredGroups"
          @complete="searchGroups"
          placeholder="组别"
        />
        <AutoComplete
          v-model="branchValue"
          :suggestions="filteredBranches"
          @complete="searchBranches"
          placeholder="类型"
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

    <div
      class="timeSearch flex items-center h-14 ml-4 mb-2 justify-between w-full"
    >
      <div class="flex items-center">
        <DatePicker
          class=""
          v-model="startDate"
          :maxDate="endDate || undefined"
          dateFormat="yy-mm-dd"
          placeholder="请选择起始时间"
        />
        <DatePicker
          class="ml-2"
          v-model="endDate"
          :minDate="startDate || undefined"
          dateFormat="yy-mm-dd"
          placeholder="请选择终止时间"
        />
      </div>
      <!-- 统计模块 -->
      <div
        class="h-full bg-[rgb(50,50,89)] rounded-lg flex items-center justify-between p-8 w-[30%] mr-16"
      >
        <div class="text-center">
          <div class="text-white text-sm">该时段</div>
          <div class="text-white font-bold">¥{{ getTimeRangeCost() }}</div>
        </div>
        <div class="text-center">
          <div class="text-white text-sm">今日</div>
          <div class="text-white font-bold">¥{{ getTodayCost() }}</div>
        </div>
        <div class="text-center">
          <div class="text-white text-sm">本周</div>
          <div class="text-white font-bold">¥{{ getWeekCost() }}</div>
        </div>
        <div class="text-center">
          <div class="text-white text-sm">本月</div>
          <div class="text-white font-bold">¥{{ getMonthCost() }}</div>
        </div>
      </div>
    </div>

    <!-- 操作成功提示 -->
    <Toast />

    <!-- 添加、编辑物资对话框 -->
    <Dialog
      v-model:visible="itemDialog"
      :style="{ width: '800px' }"
      header="添加物资"
      :modal="true"
    >
      <div class="flex flex-row gap-4">
        <div class="min-w-[350px] flex flex-col gap-6">
          <!-- 物资名称 -->
          <div>
            <label for="name" class="block font-bold mb-3"
              >物资名称 <span class="text-red-500">*</span></label
            >
            <InputText
              id="name"
              v-model.trim="item.name"
              required="true"
              autofocus
              :class="{ 'p-invalid': submitted && !item.name }"
              fluid
            />
            <small v-if="submitted && !item.name" class="text-red-500"
              >物资名称为必填项。</small
            >
          </div>

          <!-- 物资信息 -->
          <div class="card grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- 类型 -->
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-inbox"></i>
              </InputGroupAddon>
              <InputText v-model="item.model" placeholder="型号" />
            </InputGroup>

            <!-- 单价 -->
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-dollar"></i>
              </InputGroupAddon>
              <InputText
                v-model="unitPriceStr"
                :class="{
                  'p-invalid':
                    submitted &&
                    !!unitPriceStr &&
                    !/^(?!0(\.0+)?$)(\d+(\.\d{1,2})?)$/.test(unitPriceStr),
                }"
                placeholder="单价 *"
              />
              <small
                v-if="
                  submitted &&
                  !!unitPriceStr &&
                  !/^(?!0(\.0+)?$)(\d+(\.\d{1,2})?)$/.test(unitPriceStr)
                "
                class="text-red-500"
              >
                请输入有效的单价。
              </small>
            </InputGroup>

            <!-- 单位 -->
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-flag"></i>
              </InputGroupAddon>
              <InputText v-model="item.unit" placeholder="单位" />
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

            <!-- 时间 -->
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-calendar"></i>
              </InputGroupAddon>
              <InputText
                v-model="dateInput"
                :class="{
                  'p-invalid':
                    submitted &&
                    !!item.date &&
                    !/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(
                      item.date
                    ),
                }"
                placeholder="时间 (YYYY-MM-DD)"
              />
              <small
                v-if="
                  submitted &&
                  !!item.date &&
                  !/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(
                    item.date
                  )
                "
                class="text-red-500"
              >
                请使用正确的日期格式 (YYYY-MM-DD)
              </small>
            </InputGroup>

            <!-- 运费 -->
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-dollar"></i>
              </InputGroupAddon>
              <InputText
                v-model="shippingCostStr"
                :invalid="
                  submitted &&
                  !!shippingCostStr &&
                  !/^(?!0(\.0+)?$)(\d+(\.\d{1,2})?)$/.test(shippingCostStr)
                "
                placeholder="运费"
              />
            </InputGroup>

            <!-- 组别 -->
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-th-large"></i>
              </InputGroupAddon>
              <Select
                v-model="item.group"
                :options="groups"
                optionLabel="name"
                optionValue="name"
                placeholder="组别"
              />
            </InputGroup>

            <!-- 兵种 -->
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-ethereum"></i>
              </InputGroupAddon>
              <Select
                v-model="item.branch"
                :options="branches"
                optionLabel="name"
                optionValue="name"
                placeholder="兵种"
              />
            </InputGroup>

            <!-- 校区 -->
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-map-marker"></i>
              </InputGroupAddon>
              <Select
                v-model="item.campus"
                :options="campuses"
                optionLabel="name"
                optionValue="name"
                placeholder="校区"
              />
            </InputGroup>

            <!-- 采购人 -->
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-cart-arrow-down"></i>
              </InputGroupAddon>
              <InputText v-model="item.purchaser" placeholder="采购人" />
            </InputGroup>

            <!-- 链接 -->
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-link"></i>
              </InputGroupAddon>
              <InputText v-model="item.link" placeholder="链接" />
            </InputGroup>

            <!-- 项目 -->
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-briefcase"></i>
              </InputGroupAddon>
              <InputText v-model="item.project" placeholder="项目" />
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
      <!-- 使用最终过滤后的数据 -->
      <Table
        ref="dataTable"
        :data="finalFilteredItems"
        :columns="columns"
        :filters="filters"
        v-model:selection="selectedItems"
        @edit="editItem"
        @delete="confirmDeleteItem"
      />
    </div>

    <!-- 在表格上方添加 API 状态指示器 -->
    <div v-if="apiStatus.loading" class="fixed top-4 right-4 z-50">
      <div
        class="text-white bg-blue-500 px-4 py-2 rounded-md shadow-md flex items-center"
      >
        <i class="pi pi-spin pi-spinner mr-2"></i>
        <span>加载中...</span>
      </div>
    </div>

    <!-- 如果 API 断开连接，显示警告 -->
    <div
      v-if="!apiStatus.connected && !apiStatus.loading"
      class="fixed top-4 right-4 z-50"
    >
      <div
        class="text-white bg-red-500 px-4 py-2 rounded-md shadow-md flex items-center"
      >
        <i class="pi pi-exclamation-triangle mr-2"></i>
        <span>{{ apiStatus.lastError || "服务器连接失败" }}</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Ref, ref, computed, watch, onMounted } from "vue";
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
import DatePicker from "primevue/datepicker";
import { financeApi, type Item, apiStatus } from "../../api/finance";

const toast = useToast();
const dataTable = ref();
const startDate: Ref<Date | null> = ref(null);
const endDate: Ref<Date | null> = ref(null);
// 搜索值
const nameValue = ref("");
const groupValue = ref("");
const branchValue = ref("");
const filteredNames = ref<string[]>([]);
const filteredGroups = ref<string[]>([]);
const filteredBranches = ref<string[]>([]);

// 表格选中项
const selectedItems = ref<Item[]>([]);

// 添加、修改下拉框数据
// 年份下拉框数据已移除，因为未使用
const groups = ref([
  { name: "机械组", code: "NY" },
  { name: "AI组", code: "RM" },
  { name: "视觉组", code: "LDN" },
  { name: "电控组", code: "IST" },
  { name: "软件组", code: "PRS" },
  { name: "运营组", code: "WTF" },
]);
const branches = ref([
  { name: "步兵", code: "NY" },
  { name: "哨兵", code: "RM" },
  { name: "英雄", code: "LDN" },
  { name: "飞镖", code: "IST" },
  { name: "工程", code: "PRS" },
  { name: "无人机", code: "WTF" },
  { name: "雷达站", code: "CTF" },
]);
const campuses = ref([
  { name: "前卫南区", code: "NY" },
  { name: "南湖", code: "RM" },
  { name: "南岭", code: "LDN" },
]);
// 专业下拉框数据已移除，因为未使用

// 列配置
const columns = [
  { field: "name", header: "名称", sortable: true, frozen: true },
  { field: "model", header: "型号" },
  { field: "unitPrice", header: "单价" },
  { field: "quantity", header: "数量" },
  { field: "unit", header: "单位" },
  { field: "shippingCost", header: "运费" },
  { field: "totalPrice", header: "总价" },
  { field: "purchaser", header: "采购人" },
  { field: "date", header: "时间" },
  { field: "campus", header: "校区" },
  { field: "group", header: "组别" },
  { field: "branch", header: "兵种" },
  { field: "link", header: "链接" },
  { field: "project", header: "项目" },
  { field: "remarks", header: "备注" },
];

// 控制添加队员对话框的显示
const itemDialog = ref(false);
const deleteItemDialog = ref(false);
const deleteItemsDialog = ref(false);

// 在items定义后添加
const items = ref<Item[]>([]);

// 在item定义后添加
const item = ref<Item>({
  id: "",
  name: "",
  model: "",
  unitPrice: 0,
  quantity: 0,
  unit: "",
  shippingCost: 0,
  totalPrice: 0,
  purchaser: "",
  date: "",
  campus: "",
  group: "",
  branch: "",
  link: "",
  project: "",
  remarks: "",
});
const submitted = ref(false);

// 在item定义后添加计算属性
const unitPriceStr = computed<string>({
  get: () => item.value.unitPrice.toString(),
  set: (val: string) => (item.value.unitPrice = parseFloat(val) || 0),
});

const quantityStr = computed({
  get: () => item.value.quantity.toString(),
  set: (val) => (item.value.quantity = parseInt(val) || 0),
});

const shippingCostStr = computed({
  get: () => item.value.shippingCost.toString(),
  set: (val) => (item.value.shippingCost = parseFloat(val) || 0),
});

// 添加生命周期钩子
onMounted(async () => {
  console.group("【组件初始化】");
  console.log("检查API连接状态...");

  try {
    const connectionOk = await financeApi.checkConnection();
    console.log("API连接状态:", connectionOk ? "✅ 连接正常" : "❌ 连接失败");

    console.log("正在从后端获取财务数据...");
    const data = await financeApi.getList();
    console.log(`获取到${data.length}条原始财务数据`);
    console.log("数据示例:", data.length > 0 ? data[0] : "无数据");

    // 将后端数据映射到前端显示格式
    items.value = data.map((item: any) => {
      return formatApiResponseForFrontend(item);
    });

    console.log(`成功加载${items.value.length}条财务数据`);
    if (items.value.length > 0) {
      console.log("物资示例:", items.value[0]);
    }
  } catch (error) {
    console.error("初始化失败:", error);
    showToast("获取数据失败");
  }

  console.groupEnd();
});

// 修改保存方法以充分利用新的 API 功能
const saveItem = async () => {
  console.group("【添加/更新物资】- 开始处理");
  console.log("表单状态: 已提交");
  submitted.value = true;

  console.log("正在验证表单数据...");
  const validationResult = validateItem();
  console.log("表单验证结果:", validationResult ? "✅ 通过" : "❌ 失败");

  if (validationResult) {
    try {
      // 格式化数据为API需要的格式
      const financialItem = formatItemForApi(item.value);
      console.log("前端数据格式:", item.value);
      console.log("转换为API格式:", financialItem);

      if (item.value.id) {
        console.log(`📝 更新操作 - ID:${item.value.id}`);
        console.time("更新请求耗时");
        const response = await financeApi.update(item.value.id, financialItem);
        console.timeEnd("更新请求耗时");
        console.log("API响应:", response);

        if (!response.success) {
          console.error("❌ 更新失败:", response.error);
          throw new Error(response.error || "更新失败");
        }

        console.log("✅ 更新成功，更新本地数据...");
        const updatedItem = response.data
          ? formatApiResponseForFrontend(response.data)
          : { ...item.value };

        const index = items.value.findIndex((i) => i.id === item.value.id);
        if (index !== -1) {
          items.value[index] = updatedItem;
          console.log("本地数据已更新:", items.value[index]);
        } else {
          console.warn("⚠️ 未找到要更新的数据，添加为新记录");
          items.value.push(updatedItem);
        }
      } else {
        console.log("➕ 创建操作 - 新物资");
        console.time("创建请求耗时");
        const response = await financeApi.create(financialItem);
        console.timeEnd("创建请求耗时");
        console.log("API响应:", response);

        if (!response.success) {
          console.error("❌ 创建失败:", response.error);
          throw new Error(response.error || "创建失败");
        }

        console.log("✅ 创建成功，更新本地数据...");
        const formattedItem = formatApiResponseForFrontend(response.data);
        console.log("API返回数据:", response.data);
        console.log("格式化后的前端数据:", formattedItem);
        items.value.push(formattedItem);
        console.log("本地数据列表现有记录数:", items.value.length);
      }

      console.log("操作完成，关闭对话框");
      itemDialog.value = false;
      submitted.value = false;
      resetItem();
    } catch (error) {
      console.error("❌ 操作异常:", error);
      const errorMessage =
        error instanceof Error ? error.message : "操作失败，请稍后重试";

      showToast(errorMessage, "error", "错误");
    }
  }
  console.groupEnd();
};

// 导出CSV方法
const exportCSV = async () => {
  try {
    console.log("正在请求导出财务数据...");
    const blob = await financeApi.export();
    console.log(
      "导出数据响应成功，数据类型:",
      blob.type,
      "数据大小:",
      blob.size,
      "bytes"
    );

    // 创建下载链接并触发下载
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const fileName = `财务数据_${formatDate(new Date())}.csv`;
    link.setAttribute("download", fileName);
    console.log("准备下载文件:", fileName);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    console.log("文件下载完成");
    showToast("导出成功");
  } catch (error) {
    console.error("导出财务数据失败:", error);
    showToast("导出失败", "error", "错误");
  }
};

// 过滤后的数据数组
const filteredByTime = ref([...items.value]);
const filteredByName = ref([...items.value]);
const filteredByGroup = ref([...items.value]);
const filteredByBranch = ref([...items.value]);

// 搜索
const searchNames = (event: { query: string }) => {
  const query = event.query.toLowerCase();
  // 更新建议列表
  filteredNames.value = items.value
    .filter((item: Item) => item.name.toLowerCase().includes(query))
    .map((item: Item) => item.name);
  // 更新过滤后的数据
  filteredByName.value = items.value.filter((item: Item) =>
    item.name.toLowerCase().includes(query)
  );
};

const searchGroups = (event: { query: string }) => {
  const query = event.query.toLowerCase();
  // 更新建议列表
  const uniqueGroups = [
    ...new Set(items.value.map((item: Item) => item.group)),
  ];
  filteredGroups.value = uniqueGroups.filter((group) =>
    group.toLowerCase().includes(query)
  );
  // 更新过滤后的数据
  filteredByGroup.value = items.value.filter((item: Item) =>
    item.group.toLowerCase().includes(query)
  );
};

const searchBranches = (event: { query: string }) => {
  const query = event.query.toLowerCase();
  // 更新建议列表
  const uniqueBranches = [
    ...new Set(items.value.map((item: Item) => item.branch)),
  ];
  filteredBranches.value = uniqueBranches.filter((branch) =>
    branch.toLowerCase().includes(query)
  );
  // 更新过滤后的数据
  filteredByBranch.value = items.value.filter((item: Item) =>
    item.branch.toLowerCase().includes(query)
  );
};

// 时间搜索函数

// 监听输入值的变化
watch(nameValue, (newValue) => {
  if (!newValue) {
    filteredByName.value = [...items.value];
  }
});

watch(groupValue, (newValue) => {
  if (!newValue) {
    filteredByGroup.value = [...items.value];
  }
});

watch(branchValue, (newValue) => {
  if (!newValue) {
    filteredByBranch.value = [...items.value];
  }
});

// 监听日期变化
watch([startDate, endDate], ([newStart, newEnd]) => {
  if (!newStart || !newEnd) {
    filteredByTime.value = [...items.value];
  }
});

// 合并所有过滤条件
const finalFilteredItems = computed(() => {
  let result = [...items.value];

  // 按名称过滤
  if (nameValue.value) {
    result = result.filter((item: Item) =>
      item.name.toLowerCase().includes(nameValue.value.toLowerCase())
    );
  }

  // 按组别过滤
  if (groupValue.value) {
    result = result.filter((item: Item) =>
      item.group.toLowerCase().includes(groupValue.value.toLowerCase())
    );
  }

  // 按兵种过滤
  if (branchValue.value) {
    result = result.filter((item: Item) =>
      item.branch.toLowerCase().includes(branchValue.value.toLowerCase())
    );
  }

  // 按时间范围过滤
  if (startDate.value && endDate.value) {
    const start = new Date(startDate.value);
    const end = new Date(endDate.value);
    result = result.filter((item: Item) => {
      const itemDate = new Date(item.date);
      return itemDate >= start && itemDate <= end;
    });
  }

  return result;
});
// 过滤值
const filters = computed(() => ({
  name: nameValue.value,
  group: groupValue.value,
  branch: branchValue.value,
}));

// 计算不同时段的费用
const getTimeRangeCost = () => {
  if (!startDate.value || !endDate.value) return "0.00";
  return finalFilteredItems.value
    .reduce((sum, item) => sum + item.totalPrice, 0)
    .toFixed(2);
};

const getTodayCost = () => {
  const today = new Date();
  const todayStr = formatDate(today);
  return items.value
    .filter((item: Item) => item.date === todayStr)
    .reduce((sum: number, item: Item) => sum + item.totalPrice, 0)
    .toFixed(2);
};

const getWeekCost = () => {
  const today = new Date();
  const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
  const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));
  return items.value
    .filter((item: Item) => {
      const itemDate = new Date(item.date);
      return itemDate >= weekStart && itemDate <= weekEnd;
    })
    .reduce((sum, item) => sum + item.totalPrice, 0)
    .toFixed(2);
};

const getMonthCost = () => {
  const today = new Date();
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return items.value
    .filter((item: Item) => {
      const itemDate = new Date(item.date);
      return itemDate >= monthStart && itemDate <= monthEnd;
    })
    .reduce((sum, item) => sum + item.totalPrice, 0)
    .toFixed(2);
};

// 重置物资信息
const resetItem = () => {
  item.value = {
    id: "",
    name: "",
    model: "",
    unitPrice: 0,
    quantity: 0,
    unit: "",
    shippingCost: 0,
    totalPrice: 0,
    purchaser: "",
    date: "",
    campus: "",
    group: "",
    branch: "",
    link: "",
    project: "",
    remarks: "",
  };
};

// 显示添加物资
const openNew = () => {
  console.log("【打开添加表单】重置表单数据");
  resetItem();
  console.log("表单当前数据:", JSON.stringify(item.value));
  itemDialog.value = true;
};

// 显示编辑物资
const editItem = (i: Item) => {
  console.group("【编辑物资】");
  console.log("原始数据:", JSON.stringify(i));
  item.value = { ...i };
  console.log("编辑表单数据:", JSON.stringify(item.value));
  console.groupEnd();
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

// 上传文件

// 取消编辑或添加
const hideDialog = () => {
  itemDialog.value = false;
  submitted.value = false;
};

// 删除物资
const deleteItem = async () => {
  try {
    if (item.value.id) {
      console.log(`正在删除ID为${item.value.id}的物资数据...`);
      const response = await financeApi.delete(item.value.id);
      console.log("删除物资响应数据:", response);

      // 从前端数据中移除已删除的物资
      const beforeLength = items.value.length;
      items.value = items.value.filter((i) => i.id !== item.value.id);
      console.log(
        `前端数据更新: 从${beforeLength}条记录减少到${items.value.length}条记录`
      );

      deleteItemDialog.value = false;
      resetItem();
      showToast("删除成功！");
    }
  } catch (error) {
    console.error("删除物资数据失败:", error);
    showToast("删除失败，请重试");
  }
};

// 批量删除
const deleteSelectedItems = async () => {
  try {
    const ids = selectedItems.value
      .map((item) => item.id)
      .filter(Boolean) as string[];
    console.log("准备批量删除的物资ID:", ids);

    if (ids.length > 0) {
      console.log(`正在批量删除${ids.length}条物资数据...`);
      const response = await financeApi.batchDelete(ids);
      console.log("批量删除响应数据:", response);

      // 从前端数据中移除已删除的物资
      const beforeLength = items.value.length;
      items.value = items.value.filter(
        (item) => !selectedItems.value.includes(item)
      );
      console.log(
        `前端数据更新: 从${beforeLength}条记录减少到${items.value.length}条记录`
      );

      deleteItemsDialog.value = false;
      selectedItems.value = [];
      showToast("批量删除成功！");
    }
  } catch (error) {
    console.error("批量删除物资数据失败:", error);
    showToast("批量删除失败，请重试");
  }
};

// 物资信息验证
const validateItem = () => {
  console.group("【验证表单数据】");
  // 设置错误标志
  let isValid = true;
  let errorMessages = [];

  // 验证必填字段
  console.log("检查物资名称:", item.value.name);
  if (!item.value.name?.trim()) {
    isValid = false;
    errorMessages.push("物资名称不能为空");
    console.warn("❌ 物资名称为空");
  }

  // 验证数字字段
  console.log("检查单价:", item.value.unitPrice);
  if (item.value.unitPrice < 0) {
    isValid = false;
    errorMessages.push("单价不能为负数");
    console.warn("❌ 单价为负数");
  }

  console.log("检查数量:", item.value.quantity);
  if (item.value.quantity < 0 || !Number.isInteger(item.value.quantity)) {
    isValid = false;
    errorMessages.push("数量必须是非负整数");
    console.warn("❌ 数量无效");
  }

  console.log("检查运费:", item.value.shippingCost);
  if (item.value.shippingCost < 0) {
    isValid = false;
    errorMessages.push("运费不能为负数");
    console.warn("❌ 运费为负数");
  }

  // 验证日期格式
  console.log("检查日期格式:", item.value.date);
  if (
    item.value.date &&
    !/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(item.value.date)
  ) {
    isValid = false;
    errorMessages.push("日期格式应为YYYY-MM-DD");
    console.warn("❌ 日期格式错误");
  }

  // 如果有错误，显示第一个错误信息
  if (!isValid && errorMessages.length > 0) {
    console.error("表单验证失败:", errorMessages);
    showToast(errorMessages[0], "error", "验证失败");
  } else {
    console.log("✅ 表单验证通过");
  }

  // 计算总价
  item.value.totalPrice =
    item.value.unitPrice * item.value.quantity + item.value.shippingCost;
  console.log(
    `总价计算: ${item.value.unitPrice} × ${item.value.quantity} + ${item.value.shippingCost} = ${item.value.totalPrice}`
  );

  console.groupEnd();
  return isValid;
};

// 提示消息
const showToast = (
  message: string,
  severity:
    | "success"
    | "info"
    | "warn"
    | "error"
    | "secondary"
    | "contrast" = "success",
  summary: string = "成功"
) => {
  return toast.add({
    severity: severity,
    summary: summary,
    detail: message,
    life: severity === "error" ? 5000 : 3000,
  });
};

// 日期选择

// 格式化日期为 'YYYY-MM-DD' 格式
const formatDate = (date: Date | null): string => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// 获取时间段

// 添加格式化表单数据的方法
const formatItemForApi = (itemData: Item) => {
  console.group("【数据格式转换】前端→API");
  console.log("原始前端数据:", JSON.stringify(itemData));

  // 将Item类型转换为后端需要的格式
  const formattedItem = {
    id: itemData.id,
    name: itemData.name,
    model: itemData.model,
    quantity: itemData.quantity.toString(),
    unit: itemData.unit,
    price: itemData.unitPrice.toFixed(2),
    extra_price: itemData.shippingCost.toFixed(2),
    purchase_link: itemData.link,
    post_date: itemData.date,
    purchaser: itemData.purchaser,
    campus: itemData.campus,
    group_name: itemData.group,
    troop_type: itemData.branch,
    project: itemData.project,
    remarks: itemData.remarks,
  };

  console.log("转换后API数据:", JSON.stringify(formattedItem));
  console.groupEnd();
  return formattedItem;
};

// 添加格式化API返回数据的方法
const formatApiResponseForFrontend = (apiItem: any) => {
  console.group("【数据格式转换】API→前端");
  console.log("原始API数据:", JSON.stringify(apiItem));

  const formattedItem = {
    id: apiItem.id?.toString() || "",
    name: apiItem.name || "",
    model: apiItem.model || "",
    unitPrice: parseFloat(apiItem.price) || 0,
    quantity: parseInt(apiItem.quantity) || 0,
    unit: apiItem.unit || "",
    shippingCost: parseFloat(apiItem.extra_price) || 0,
    totalPrice:
      (parseFloat(apiItem.price) || 0) * (parseInt(apiItem.quantity) || 0) +
      (parseFloat(apiItem.extra_price) || 0),
    purchaser: apiItem.purchaser || "",
    date: apiItem.post_date || "",
    campus: apiItem.campus || "",
    group: apiItem.group_name || "",
    branch: apiItem.troop_type || "",
    link: apiItem.purchase_link || "",
    project: apiItem.project || "",
    remarks: apiItem.remarks || "",
  };

  console.log("转换后前端数据:", JSON.stringify(formattedItem));
  console.groupEnd();
  return formattedItem;
};

// 添加输入处理函数 - 日期自动格式化
const formatInputDate = (dateString: string) => {
  // 移除非数字和连字符
  let cleaned = dateString.replace(/[^\d-]/g, "");

  // 检查是否符合YYYY-MM-DD格式
  const datePattern = /^(\d{4})(-?)(\d{2})(-?)(\d{2})$/;
  const match = cleaned.match(datePattern);

  if (match) {
    // 自动添加分隔符
    return `${match[1]}-${match[3]}-${match[5]}`;
  }

  return cleaned;
};

// 添加日期输入处理
const dateInput = computed({
  get: () => item.value.date,
  set: (val: string) => {
    item.value.date = formatInputDate(val);
  },
});

// 修改日期表单字段

// 添加API调用日志工具函数到全局，方便在控制台手动测试
window.testFinanceApi = {
  checkConnection: async () => {
    console.log("测试API连接...");
    const result = await financeApi.checkConnection();
    console.log("连接测试结果:", result ? "✅ 连接成功" : "❌ 连接失败");
    return result;
  },
  testCreate: async () => {
    console.log("测试创建物资...");
    const testData = {
      name: "测试物资-" + new Date().getTime(),
      model: "TEST-MODEL",
      quantity: "5",
      unit: "个",
      price: "99.99",
      extra_price: "10.00",
      purchase_link: "http://example.com",
      post_date: formatDate(new Date()),
      purchaser: "测试人员",
      campus: "前卫南区",
      group_name: "机械组",
      troop_type: "步兵",
      project: "测试项目",
      remarks: "API测试",
    };

    console.log("测试数据:", testData);
    try {
      const response = await financeApi.create(testData);
      console.log("创建响应:", response);
      return response;
    } catch (error) {
      console.error("测试失败:", error);
      return error;
    }
  },
};

// 在控制台打印API测试指令
console.log("==== 财务管理系统调试工具已加载 ====");
console.log("可用的测试命令:");
console.log("- window.testFinanceApi.checkConnection() - 测试后端连接");
console.log("- window.testFinanceApi.testCreate() - 测试创建物资");
</script>

<style scoped>
.header-button {
  height: 2.2rem;
  width: 6rem;
  font-size: 1rem;
  font-weight: 900;
  margin-right: 0.5rem;
}

.p-fileupload {
  width: 30rem;
  overflow: hidden;
}

.p-inputtext {
  --p-inputtext-hover-border-color: #a16eff;
  --p-inputtext-focus-border-color: #a16eff;
}

.p-select {
  --p-select-hover-border-color: #a16eff;
  --p-select-focus-border-color: #a16eff;
}

.remarks {
  flex: 1;
  min-width: 300px;
}

.remarks .p-inputgroup {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.remarks textarea {
  flex: 1;
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.remarks textarea:hover {
  border-color: #a16eff;
}

.remarks textarea:focus {
  border-color: #a16eff;
  box-shadow: 0 0 0 2px rgba(161, 110, 255, 0.2);
}

.remarks .p-inputtext {
  font-size: 14px;
  line-height: 1.5;
}
</style>
