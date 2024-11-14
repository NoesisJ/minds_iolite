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
      <div class="buttonGroup flex items-center space-x-2">
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
              <InputText
                v-model="item.model"
                placeholder="型号"
              />
            </InputGroup>


          <!-- 单价 -->
          <InputGroup>
            <InputGroupAddon>
              <i class="pi pi-dollar"></i>
            </InputGroupAddon>
            <InputText
            v-model="unitPriceStr"
            :invalid="submitted && !!unitPriceStr && !/^(?!0(\.0+)?$)(\d+(\.\d{1,2})?)$/.test(unitPriceStr)"
            placeholder="单价"
          />
          </InputGroup>

            <!-- 单位 -->
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-flag"></i>
              </InputGroupAddon>
              <InputText
                v-model="item.unit"
                placeholder="单位"
              />
            </InputGroup>

            <!-- 数量 -->
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-hashtag"></i>
              </InputGroupAddon>
              <InputText
                v-model="quantityStr"
                :invalid="submitted && !!quantityStr && !/^\d+$/.test(quantityStr)"
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
                :invalid="submitted && !!item.date && !/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(item.date)"
                placeholder="时间( - 分隔)"
              />
            </InputGroup>

          <!-- 单价 -->
          <InputGroup>
            <InputGroupAddon>
              <i class="pi pi-dollar"></i>
            </InputGroupAddon>
            <InputText
            v-model="shippingCostStr"
            :invalid="submitted && !!shippingCostStr && !/^(?!0(\.0+)?$)(\d+(\.\d{1,2})?)$/.test(shippingCostStr)"
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
              <InputText
                v-model="item.purchaser"
                placeholder="采购人"
              />
            </InputGroup>

            <!-- 链接 -->
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-link"></i>
              </InputGroupAddon>
              <InputText
                v-model="item.link"
                placeholder="链接"
              />
            </InputGroup>

            <!-- 项目 -->
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-briefcase"></i>
              </InputGroupAddon>
              <InputText
                v-model="item.project"
                placeholder="项目"
              />
            </InputGroup>
          </div>
        </div>

        
      <!-- 备注 -->
      <InputGroup class="remarks">
        <InputText
          v-model="item.remarks"
          placeholder="备注"
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
        <span v-if="item">您确定要删除<b>{{ item.name }}</b>吗?</span>
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
    <div class="contentMaterial w-full overflow-auto hide-scrollbar">
      <Table
        ref="dataTable"
        :data="items"
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
import FileUpload from "primevue/fileupload";
import { Input } from "postcss";

const toast = useToast();
const dataTable = ref();

// 搜索值
const nameValue = ref("");
const groupValue = ref("");
const branchValue = ref("");
const filteredNames = ref<string[]>([]);
const filteredGroups = ref<string[]>([]);
const filteredBranches = ref<string[]>([]);

// 表格选中项
const selectedItems = ref<Item[]>([]);

// 添加、修改队员下拉框数据
const genders = ref([
  { name: "男", code: "M" },
  { name: "女", code: "FM" },
]);
const years = ref([
  { name: "2020", code: "1" },
  { name: "2021", code: "2" },
  { name: "2022", code: "3" },
  { name: "2023", code: "4" },
  { name: "2024", code: "5" },
]);
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
const majors = ref([
  { name: "计算机", code: "NY" },
  { name: "软件工程", code: "RM" },
  { name: "人工智能", code: "LDN" },
  { name: "网络安全", code: "IST" },
  { name: "物联网", code: "PRS" },
  { name: "大数据", code: "WTF" },
  { name: "信息管理", code: "WTF" },
]);
const identities = ref([
  { name: "梯队队员", code: "NY" },
  { name: "正式队员", code: "RM" },
  { name: "组长", code: "LDN" },
  { name: "已退队", code: "IST" },
  { name: "已毕业", code: "PRS" },
  { name: "已转专业", code: "WTF" },
]);

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
type Item = {
  id: string;
  name: string;
  model: string;
  unitPrice: number;
  quantity: number;
  unit: string;
  shippingCost: number;
  totalPrice: number;
  purchaser: string;
  date: string;
  campus: string;
  group: string;
  branch: string;
  link: string;
  project: string;
  remarks: string;
};

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
// 全部队员数据
const items = ref([
  { id: "1", name: "打印机", model: "HP-LJ123", unitPrice: 1500, quantity: 2, unit: "台", shippingCost: 50, totalPrice: 3050, purchaser: "张三", date: "2023-01-15", campus: "南校区", group: "A组", branch: "通信", link: "https://example.com/item1", project: "办公设备更新", remarks: "用于文印室" },
  { id: "2", name: "投影仪", model: "Epson-EV104", unitPrice: 3000, quantity: 1, unit: "台", shippingCost: 75, totalPrice: 3075, purchaser: "李四", date: "2023-02-10", campus: "北校区", group: "B组", branch: "技术", link: "https://example.com/item2", project: "教学设备购置", remarks: "用于大教室" },
  { id: "3", name: "办公桌", model: "IKEA-OF234", unitPrice: 500, quantity: 5, unit: "张", shippingCost: 100, totalPrice: 2600, purchaser: "王五", date: "2023-02-18", campus: "西校区", group: "C组", branch: "后勤", link: "https://example.com/item3", project: "家具采购", remarks: "新职员办公使用" },
  { id: "4", name: "笔记本电脑", model: "Dell-XPS13", unitPrice: 8000, quantity: 3, unit: "台", shippingCost: 150, totalPrice: 24150, purchaser: "赵六", date: "2023-03-05", campus: "南校区", group: "D组", branch: "研发", link: "https://example.com/item4", project: "科研项目A", remarks: "用于软件开发" },
  { id: "5", name: "文件柜", model: "Steel-FileCab", unitPrice: 1200, quantity: 2, unit: "个", shippingCost: 60, totalPrice: 2460, purchaser: "孙七", date: "2023-03-12", campus: "东校区", group: "E组", branch: "行政", link: "https://example.com/item5", project: "存档室建设", remarks: "用于文件存储" },
  { id: "6", name: "白板", model: "OffSup-WB400", unitPrice: 300, quantity: 4, unit: "块", shippingCost: 30, totalPrice: 1230, purchaser: "钱八", date: "2023-03-22", campus: "南校区", group: "F组", branch: "技术", link: "https://example.com/item6", project: "会议室设备更新", remarks: "用于团队会议" },
  { id: "7", name: "显示器", model: "Samsung-M24", unitPrice: 1200, quantity: 3, unit: "台", shippingCost: 80, totalPrice: 3680, purchaser: "王九", date: "2023-04-02", campus: "北校区", group: "G组", branch: "设计", link: "https://example.com/item7", project: "设计部更新", remarks: "用于图形设计" },
  { id: "8", name: "无线键盘", model: "Logi-K380", unitPrice: 200, quantity: 10, unit: "个", shippingCost: 20, totalPrice: 2020, purchaser: "李十", date: "2023-04-11", campus: "西校区", group: "H组", branch: "行政", link: "https://example.com/item8", project: "办公室补充", remarks: "替换旧设备" },
  { id: "9", name: "移动硬盘", model: "WD-MyPass", unitPrice: 500, quantity: 4, unit: "个", shippingCost: 25, totalPrice: 2025, purchaser: "张三", date: "2023-04-15", campus: "南校区", group: "A组", branch: "数据管理", link: "https://example.com/item9", project: "数据备份", remarks: "用于数据存储" },
  { id: "10", name: "剪刀", model: "OffSup-SC300", unitPrice: 15, quantity: 20, unit: "把", shippingCost: 10, totalPrice: 310, purchaser: "李四", date: "2023-04-18", campus: "东校区", group: "B组", branch: "后勤", link: "https://example.com/item10", project: "文具采购", remarks: "日常办公用品" },
  { id: "11", name: "打印机", model: "HP-LJ123", unitPrice: 1500, quantity: 2, unit: "台", shippingCost: 50, totalPrice: 3050, purchaser: "张三", date: "2023-01-15", campus: "南校区", group: "A组", branch: "通信", link: "https://example.com/item1", project: "办公设备更新", remarks: "用于文印室" },
  { id: "12", name: "投影仪", model: "Epson-EV104", unitPrice: 3000, quantity: 1, unit: "台", shippingCost: 75, totalPrice: 3075, purchaser: "李四", date: "2023-02-10", campus: "北校区", group: "B组", branch: "技术", link: "https://example.com/item2", project: "教学设备购置", remarks: "用于大教室" },
  { id: "13", name: "办公桌", model: "IKEA-OF234", unitPrice: 500, quantity: 5, unit: "张", shippingCost: 100, totalPrice: 2600, purchaser: "王五", date: "2023-02-18", campus: "西校区", group: "C组", branch: "后勤", link: "https://example.com/item3", project: "家具采购", remarks: "新职员办公使用" },
  { id: "14", name: "笔记本电脑", model: "Dell-XPS13", unitPrice: 8000, quantity: 3, unit: "台", shippingCost: 150, totalPrice: 24150, purchaser: "赵六", date: "2023-03-05", campus: "南校区", group: "D组", branch: "研发", link: "https://example.com/item4", project: "科研项目A", remarks: "用于软件开发" },
  { id: "15", name: "文件柜", model: "Steel-FileCab", unitPrice: 1200, quantity: 2, unit: "个", shippingCost: 60, totalPrice: 2460, purchaser: "孙七", date: "2023-03-12", campus: "东校区", group: "E组", branch: "行政", link: "https://example.com/item5", project: "存档室建设", remarks: "用于文件存储" },
  { id: "16", name: "白板", model: "OffSup-WB400", unitPrice: 300, quantity: 4, unit: "块", shippingCost: 30, totalPrice: 1230, purchaser: "钱八", date: "2023-03-22", campus: "南校区", group: "F组", branch: "技术", link: "https://example.com/item6", project: "会议室设备更新", remarks: "用于团队会议" },
  { id: "17", name: "显示器", model: "Samsung-M24", unitPrice: 1200, quantity: 3, unit: "台", shippingCost: 80, totalPrice: 3680, purchaser: "王九", date: "2023-04-02", campus: "北校区", group: "G组", branch: "设计", link: "https://example.com/item7", project: "设计部更新", remarks: "用于图形设计" },
  { id: "18", name: "无线键盘", model: "Logi-K380", unitPrice: 200, quantity: 10, unit: "个", shippingCost: 20, totalPrice: 2020, purchaser: "李十", date: "2023-04-11", campus: "西校区", group: "H组", branch: "行政", link: "https://example.com/item8", project: "办公室补充", remarks: "替换旧设备" },
  { id: "19", name: "移动硬盘", model: "WD-MyPass", unitPrice: 500, quantity: 4, unit: "个", shippingCost: 25, totalPrice: 2025, purchaser: "张三", date: "2023-04-15", campus: "南校区", group: "A组", branch: "数据管理", link: "https://example.com/item9", project: "数据备份", remarks: "用于数据存储" },
]);

// 用于将数字转换为字符串，并处理与inputtext双向绑定
const unitPriceStr = computed({
  // getter，返回 item.unitPrice 的字符串形式
  get() {
    return item.value.unitPrice ? item.value.unitPrice.toString() : '';
  },
  // setter，更新 item.unitPrice 为用户输入的数字
  set(value: string) {
    item.value.unitPrice = parseFloat(value);
  }
});

const quantityStr = computed({
  // getter，返回 item.unitPrice 的字符串形式
  get() {
    return item.value.quantity ? item.value.quantity.toString() : '';
  },
  // setter，更新 item.unitPrice 为用户输入的数字
  set(value: string) {
    item.value.quantity = parseFloat(value);
  }
});

const shippingCostStr = computed({
  // getter，返回 item.unitPrice 的字符串形式
  get() {
    return item.value.shippingCost ? item.value.shippingCost.toString() : '';
  },
  // setter，更新 item.unitPrice 为用户输入的数字
  set(value: string) {
    item.value.shippingCost = parseFloat(value);
  }
});
const exportCSV = () => {
  dataTable.value.exportCSV();
};

// 搜索
const searchNames = (event: { query: string }) => {
  const query = event.query.toLowerCase();
  filteredNames.value = items.value
    .filter((items) => items.name.toLowerCase().includes(query))
    .map((items) => items.name);
};

const searchGroups = (event: { query: string }) => {
  const query = event.query.toLowerCase();
  const uniqueGroups = [
    ...new Set(items.value.map((items) => items.group)),
  ];
  filteredGroups.value = uniqueGroups.filter((group) =>
    group.toLowerCase().includes(query)
  );
};

const searchBranches = (event: { query: string }) => {
  const query = event.query.toLowerCase();
  const uniqueBranches = [
    ...new Set(items.value.map((item) => item.branch)),
  ];
  filteredBranches.value = uniqueBranches.filter((branch) =>
    branch.toLowerCase().includes(query)
  );
};

// 过滤值
const filters = computed(() => ({
  name: nameValue.value,
  group: groupValue.value,
  branch: branchValue.value,
}));

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
const onAdvancedUpload = () => {
  showToast("文件已上传！");
};

// 保存物资信息（添加或编辑）
const saveItem = () => {
  submitted.value = true;

  if (validateItem()) {
    const index = items.value.findIndex((i) => i.id === item.value.id);
    if (index !== -1) {
      // 更新物资
      items.value[index] = { ...item.value };
      showToast("编辑成功！");
    } else {
      // 添加新物资
      items.value.push({ ...item.value });
      showToast("添加成功！");
    }

    itemDialog.value = false;
    resetItem();
  }
};

// 取消编辑或添加
const hideDialog = () => {
  itemDialog.value = false;
  submitted.value = false;
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

// 物资信息验证
const validateItem = () => {
  return (
    item.value.name?.trim() && // 验证物资名称是否非空
    (!item.value.id || /^\d+$/.test(String(item.value.id))) && // 验证物资编号（id）是否为数字
    (item.value.quantity >= 0) && 
    (item.value.unitPrice >= 0) && 
    (item.value.shippingCost >= 0) && 
    (item.value.totalPrice >= 0)
  );
};

// 查询是否有此队员

// 成功提示
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

</style>
