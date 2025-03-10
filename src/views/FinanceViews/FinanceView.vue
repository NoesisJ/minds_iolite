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
                :invalid="
                  submitted &&
                  !!unitPriceStr &&
                  !/^(?!0(\.0+)?$)(\d+(\.\d{1,2})?)$/.test(unitPriceStr)
                "
                placeholder="单价"
              />
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
                v-model="item.date"
                :invalid="
                  submitted &&
                  !!item.date &&
                  !/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(
                    item.date
                  )
                "
                placeholder="时间( - 分隔)"
              />
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
import { financeApi, type Item } from '../../api/finance';

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
  set: (val: string) => item.value.unitPrice = parseFloat(val) || 0
});

const quantityStr = computed({
  get: () => item.value.quantity.toString(),
  set: (val) => item.value.quantity = parseInt(val) || 0
});

const shippingCostStr = computed({
  get: () => item.value.shippingCost.toString(),
  set: (val) => item.value.shippingCost = parseFloat(val) || 0
});

// 添加生命周期钩子
onMounted(async () => {
  try {
    const data = await financeApi.getList();
    // 将后端数据映射到前端显示格式
    items.value = data.map((item: any) => ({
      id: item.id.toString(),
      name: item.name,
      model: item.model,
      unitPrice: parseFloat(item.price) || 0,
      quantity: parseInt(item.quantity) || 0,
      unit: item.unit,
      shippingCost: parseFloat(item.extra_price) || 0,
      totalPrice: (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0) + (parseFloat(item.extra_price) || 0),
      purchaser: item.purchaser,
      date: item.post_date,
      campus: item.campus,
      group: item.group_name,
      branch: item.troop_type_project,
      link: item.purchase_link,
      project: item.troop_type_project,
      remarks: item.remarks
    }));
  } catch (error) {
    showToast('获取数据失败');
  }
});

// 修改保存方法
const saveItem = async () => {
  submitted.value = true;
  
  if (validateItem()) {
    try {
      // 将Item类型转换为后端需要的格式
      const financialItem = {
        id: item.value.id,
        name: item.value.name,
        model: item.value.model,
        quantity: item.value.quantity.toString(),
        unit: item.value.unit,
        price: item.value.unitPrice.toString(),
        extra_price: item.value.shippingCost.toString(),
        purchase_link: item.value.link,
        post_date: item.value.date,
        purchaser: item.value.purchaser,
        campus: item.value.campus,
        group_name: item.value.group,
        troop_type_project: item.value.branch,
        remarks: item.value.remarks
      };
      
      if (item.value.id) {
        await financeApi.update(item.value.id, financialItem);
        const index = items.value.findIndex(i => i.id === item.value.id);
        if (index !== -1) {
          items.value[index] = { ...item.value };
        }
      } else {
        const newItem = await financeApi.create(financialItem);
        // 将返回的数据转换为前端格式
        const formattedItem = {
          id: newItem.id.toString(),
          name: newItem.name,
          model: newItem.model,
          unitPrice: parseFloat(newItem.price) || 0,
          quantity: parseInt(newItem.quantity) || 0,
          unit: newItem.unit,
          shippingCost: parseFloat(newItem.extra_price) || 0,
          totalPrice: (parseFloat(newItem.price) || 0) * (parseInt(newItem.quantity) || 0) + (parseFloat(newItem.extra_price) || 0),
          purchaser: newItem.purchaser,
          date: newItem.post_date,
          campus: newItem.campus,
          group: newItem.group_name,
          branch: newItem.troop_type_project,
          link: newItem.purchase_link,
          project: newItem.troop_type_project,
          remarks: newItem.remarks
        };
        items.value.push(formattedItem);
      }
      showToast("操作成功！");
      itemDialog.value = false;
    } catch (error) {
      showToast('操作失败');
    }
  }
};

// 导出CSV方法
const exportCSV = async () => {
  try {
    const blob = await financeApi.export();
    // 创建下载链接并触发下载
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `财务数据_${formatDate(new Date())}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    showToast('导出成功');
  } catch (error) {
    showToast('导出失败', 'error', '错误');
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
  const uniqueGroups = [...new Set(items.value.map((item: Item) => item.group))];
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
  const uniqueBranches = [...new Set(items.value.map((item: Item) => item.branch))];
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
  resetItem();
  itemDialog.value = true;
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
      await financeApi.delete(item.value.id);
      items.value = items.value.filter((i) => i.id !== item.value.id);
      deleteItemDialog.value = false;
      resetItem();
      showToast("删除成功！");
    }
  } catch (error) {
    showToast('删除失败，请重试');
  }
};

// 批量删除
const deleteSelectedItems = async () => {
  try {
    const ids = selectedItems.value.map(item => item.id).filter(Boolean) as string[];
    
    if (ids.length > 0) {
      await financeApi.batchDelete(ids);
      items.value = items.value.filter(
        (item) => !selectedItems.value.includes(item)
      );
      deleteItemsDialog.value = false;
      selectedItems.value = [];
      showToast("批量删除成功！");
    }
  } catch (error) {
    showToast('批量删除失败，请重试');
  }
};

// 物资信息验证
const validateItem = () => {
  // 计算总价
  item.value.totalPrice = (item.value.unitPrice * item.value.quantity) + item.value.shippingCost;
  
  return (
    item.value.name?.trim() && // 验证物资名称是否非空
    (!item.value.id || typeof item.value.id === 'string') && // 验证物资编号（id）
    item.value.quantity >= 0 &&
    item.value.unitPrice >= 0 &&
    item.value.shippingCost >= 0 &&
    item.value.totalPrice >= 0
  );
};

// 提示消息
const showToast = (message: string, severity: "success" | "info" | "warn" | "error" | "secondary" | "contrast" = "success", summary: string = "成功") => {
  toast.add({
    severity: severity,
    summary: summary,
    detail: message,
    life: 3000,
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
