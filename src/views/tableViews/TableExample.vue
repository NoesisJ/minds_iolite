<template>
  <div class="tables-container p-4">
    <h1 class="text-xl font-semibold mb-6 text-gray-700 dark:text-white">数据表格示例</h1>

    <!-- 选中数据展示 -->
    <div v-if="selectedFinanceData.length || selectedUserData.length" class="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h3 class="text-lg font-medium mb-3 text-gray-700 dark:text-white">已选中的数据</h3>
      <div v-if="selectedFinanceData.length > 0">
        <h4 class="text-md font-medium text-gray-600 dark:text-gray-300 mb-2">财务数据</h4>
        <p class="dark:text-gray-300">已选中 {{ selectedFinanceData.length }} 条记录</p>
        <div class="flex flex-wrap gap-2 mt-2">
          <span 
            v-for="item in selectedFinanceData" 
            :key="item.id" 
            class="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-xs">
            {{ item.account }}
          </span>
        </div>
      </div>
      <div v-if="selectedUserData.length > 0" class="mt-4">
        <h4 class="text-md font-medium text-gray-600 dark:text-gray-300 mb-2">用户数据</h4>
        <p class="dark:text-gray-300">已选中 {{ selectedUserData.length }} 条记录</p>
        <div class="flex flex-wrap gap-2 mt-2">
          <span 
            v-for="item in selectedUserData" 
            :key="item.id" 
            class="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 rounded-full text-xs">
            {{ item.username }}
          </span>
        </div>
      </div>
    </div>

    <!-- 表格网格 -->
    <div class="grid grid-cols-1 gap-6">
      <!-- 基础数据表格 -->
      <div class="table-card">
        <div class="table-header">
          <h2 class="text-lg">基础数据表格</h2>
          <SearchBar 
            :fields="[
              { field: 'name', label: '姓名', placeholder: '搜索姓名' },
              { field: 'department', label: '部门', placeholder: '搜索部门' }
            ]"
            :data="employeeData"
            v-model:filteredData="filteredEmployeeData"
            @search="handleSearch"
          />
        </div>
        <div class="table-wrapper">
          <Table 
            :data="filteredEmployeeData" 
            :columns="employeeColumns"
            :rows="5"
            @edit="editItem('employee', $event)"
            @delete="confirmDeleteItem('employee', $event)"
          />
        </div>
      </div>

      <!-- 产品信息表格 -->
      <div class="table-card">
        <div class="table-header">
          <h2 class="text-lg">产品信息表格</h2>
          <SearchBar 
            :fields="[
              { field: 'name', label: '产品名称', placeholder: '搜索产品名称' },
              { field: 'category', label: '类别', placeholder: '搜索类别' }
            ]"
            :data="productData"
            v-model:filteredData="filteredProductData"
            @search="handleSearch"
          />
        </div>
        <div class="table-wrapper">
          <Table 
            :data="filteredProductData" 
            :columns="productColumns"
            :rows="5"
            @edit="editItem('product', $event)"
            @delete="confirmDeleteItem('product', $event)"
          />
        </div>
      </div>

      <!-- 财务数据表格 -->
      <div class="table-card">
        <div class="table-header">
          <h2 class="text-lg">财务数据表格</h2>
          <SearchBar 
            :fields="[
              { field: 'account', label: '账户', placeholder: '搜索账户' },
              { field: 'type', label: '类型', placeholder: '搜索类型' }
            ]"
            :data="financeData"
            v-model:filteredData="filteredFinanceData"
            @search="handleSearch"
          />
        </div>
        <div class="table-wrapper">
          <Table 
            :data="filteredFinanceData" 
            :columns="financeColumns"
            :showSelection="true"
            :rows="5"
            v-model:selection="selectedFinanceData"
            @edit="editItem('finance', $event)"
            @delete="confirmDeleteItem('finance', $event)"
          />
        </div>
      </div>

      <!-- 用户管理表格 -->
      <div class="table-card">
        <div class="table-header">
          <h2 class="text-lg">用户管理表格</h2>
          <SearchBar 
            :fields="[
              { field: 'username', label: '用户名', placeholder: '搜索用户名' },
              { field: 'role', label: '角色', placeholder: '搜索角色' }
            ]"
            :data="userData"
            v-model:filteredData="filteredUserData"
            @search="handleSearch"
          />
        </div>
        <div class="table-wrapper">
          <Table 
            :data="filteredUserData" 
            :columns="userColumns"
            :showSelection="true"
            :rows="5"
            v-model:selection="selectedUserData"
            @edit="editItem('user', $event)"
            @delete="confirmDeleteItem('user', $event)"
          />
        </div>
      </div>
    </div>

    <!-- 操作成功提示 -->
    <Toast />

    <!-- 编辑对话框 -->
    <Dialog 
      v-model:visible="editDialog" 
      :style="{ width: '650px' }" 
      :header="editHeader" 
      :modal="true"
    >
      <div class="p-4">
        <div v-if="currentType === 'employee'" class="grid grid-cols-2 gap-4">
          <div class="form-group">
            <label class="block mb-2 font-medium">姓名</label>
            <InputText v-model="currentItem.name" class="w-full" />
          </div>
          <div class="form-group">
            <label class="block mb-2 font-medium">部门</label>
            <InputText v-model="currentItem.department" class="w-full" />
          </div>
          <div class="form-group">
            <label class="block mb-2 font-medium">职位</label>
            <InputText v-model="currentItem.position" class="w-full" />
          </div>
          <div class="form-group">
            <label class="block mb-2 font-medium">年龄</label>
            <InputNumber v-model="currentItem.age" class="w-full" />
          </div>
          <div class="form-group">
            <label class="block mb-2 font-medium">薪资</label>
            <InputNumber v-model="currentItem.salary" mode="currency" currency="CNY" locale="zh-CN" class="w-full" />
          </div>
        </div>

        <div v-if="currentType === 'product'" class="grid grid-cols-2 gap-4">
          <div class="form-group">
            <label class="block mb-2 font-medium">产品编码</label>
            <InputText v-model="currentItem.code" class="w-full" />
          </div>
          <div class="form-group">
            <label class="block mb-2 font-medium">产品名称</label>
            <InputText v-model="currentItem.name" class="w-full" />
          </div>
          <div class="form-group">
            <label class="block mb-2 font-medium">类别</label>
            <InputText v-model="currentItem.category" class="w-full" />
          </div>
          <div class="form-group">
            <label class="block mb-2 font-medium">价格</label>
            <InputNumber v-model="currentItem.price" mode="currency" currency="CNY" locale="zh-CN" class="w-full" />
          </div>
          <div class="form-group">
            <label class="block mb-2 font-medium">库存</label>
            <InputNumber v-model="currentItem.stock" class="w-full" />
          </div>
        </div>

        <div v-if="currentType === 'finance'" class="grid grid-cols-2 gap-4">
          <div class="form-group">
            <label class="block mb-2 font-medium">账户</label>
            <InputText v-model="currentItem.account" class="w-full" />
          </div>
          <div class="form-group">
            <label class="block mb-2 font-medium">类型</label>
            <Dropdown v-model="currentItem.type" :options="['收入', '支出']" class="w-full" />
          </div>
          <div class="form-group">
            <label class="block mb-2 font-medium">金额</label>
            <InputNumber v-model="currentItem.amount" mode="currency" currency="CNY" locale="zh-CN" class="w-full" />
          </div>
          <div class="form-group">
            <label class="block mb-2 font-medium">日期</label>
            <InputText v-model="currentItem.date" class="w-full" />
          </div>
          <div class="form-group">
            <label class="block mb-2 font-medium">状态</label>
            <Dropdown v-model="currentItem.status" :options="['已结算', '待结算']" class="w-full" />
          </div>
        </div>

        <div v-if="currentType === 'user'" class="grid grid-cols-2 gap-4">
          <div class="form-group">
            <label class="block mb-2 font-medium">用户名</label>
            <InputText v-model="currentItem.username" class="w-full" />
          </div>
          <div class="form-group">
            <label class="block mb-2 font-medium">姓名</label>
            <InputText v-model="currentItem.name" class="w-full" />
          </div>
          <div class="form-group">
            <label class="block mb-2 font-medium">邮箱</label>
            <InputText v-model="currentItem.email" class="w-full" />
          </div>
          <div class="form-group">
            <label class="block mb-2 font-medium">角色</label>
            <Dropdown v-model="currentItem.role" :options="['管理员', '用户', '编辑']" class="w-full" />
          </div>
          <div class="form-group">
            <label class="block mb-2 font-medium">状态</label>
            <Dropdown v-model="currentItem.status" :options="['在线', '离线']" class="w-full" />
          </div>
        </div>
      </div>

      <template #footer>
        <Button label="取消" icon="pi pi-times" outlined class="mr-2" @click="editDialog = false" />
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
        <span>确定要删除{{ deleteItemLabel }}吗？此操作无法撤销。</span>
      </div>
      <template #footer>
        <Button label="取消" icon="pi pi-times" outlined class="mr-2" @click="deleteDialog = false" />
        <Button label="删除" icon="pi pi-trash" severity="danger" @click="deleteItem" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Table from "@/components/Table.vue";
import SearchBar from "@/components/SearchBar.vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Dropdown from "primevue/dropdown";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";

const toast = useToast();

// 员工表格数据和列定义
const employeeData = ref([
  { id: 1, name: '张三', department: '市场部', position: '市场经理', age: 35, salary: 15000 },
  { id: 2, name: '李四', department: '研发部', position: '高级工程师', age: 32, salary: 18000 },
  { id: 3, name: '王五', department: '销售部', position: '销售总监', age: 38, salary: 20000 },
  { id: 4, name: '赵六', department: '人事部', position: 'HR专员', age: 28, salary: 12000 },
  { id: 5, name: '钱七', department: '财务部', position: '财务主管', age: 40, salary: 16000 },
  { id: 6, name: '孙八', department: '客服部', position: '客服经理', age: 33, salary: 14000 },
  { id: 7, name: '周九', department: '研发部', position: '前端工程师', age: 26, salary: 15000 },
]);
const filteredEmployeeData = ref([...employeeData.value]);

const employeeColumns = ref([
  { field: 'name', header: '姓名', sortable: true },
  { field: 'department', header: '部门', sortable: true },
  { field: 'position', header: '职位', sortable: true },
  { field: 'age', header: '年龄', sortable: true },
  { field: 'salary', header: '薪资', sortable: true },
]);

// 产品表格数据和列定义
const productData = ref([
  { id: 1, code: 'P001', name: '智能手机', category: '电子产品', price: 4999, stock: 120 },
  { id: 2, code: 'P002', name: '笔记本电脑', category: '电子产品', price: 6999, stock: 85 },
  { id: 3, code: 'P003', name: '无线耳机', category: '配件', price: 999, stock: 200 },
  { id: 4, code: 'P004', name: '智能手表', category: '穿戴设备', price: 1999, stock: 150 },
  { id: 5, code: 'P005', name: '平板电脑', category: '电子产品', price: 3299, stock: 95 },
  { id: 6, code: 'P006', name: '充电宝', category: '配件', price: 199, stock: 300 },
  { id: 7, code: 'P007', name: '蓝牙音箱', category: '音频设备', price: 499, stock: 180 },
]);
const filteredProductData = ref([...productData.value]);

const productColumns = ref([
  { field: 'code', header: '产品编码', sortable: true },
  { field: 'name', header: '产品名称', sortable: true },
  { field: 'category', header: '类别', sortable: true },
  { field: 'price', header: '价格', sortable: true },
  { field: 'stock', header: '库存', sortable: true },
]);

// 财务表格数据和列定义
const financeData = ref([
  { id: 1, account: '收入账户A', type: '收入', amount: 25000, date: '2023-01-15', status: '已结算' },
  { id: 2, account: '支出账户B', type: '支出', amount: 12500, date: '2023-01-18', status: '已结算' },
  { id: 3, account: '收入账户C', type: '收入', amount: 18000, date: '2023-01-20', status: '待结算' },
  { id: 4, account: '支出账户D', type: '支出', amount: 9800, date: '2023-01-25', status: '已结算' },
  { id: 5, account: '收入账户E', type: '收入', amount: 30000, date: '2023-01-28', status: '待结算' },
  { id: 6, account: '支出账户F', type: '支出', amount: 15600, date: '2023-01-30', status: '已结算' },
  { id: 7, account: '收入账户G', type: '收入', amount: 22000, date: '2023-02-01', status: '待结算' },
]);
const filteredFinanceData = ref([...financeData.value]);

const financeColumns = ref([
  { field: 'account', header: '账户', sortable: true },
  { field: 'type', header: '类型', sortable: true },
  { field: 'amount', header: '金额', sortable: true },
  { field: 'date', header: '日期', sortable: true },
  { field: 'status', header: '状态', sortable: true },
]);

// 用户表格数据和列定义
const userData = ref([
  { id: 1, username: 'user001', name: '张伟', email: 'zhangwei@example.com', role: '管理员', status: '在线' },
  { id: 2, username: 'user002', name: '王芳', email: 'wangfang@example.com', role: '用户', status: '离线' },
  { id: 3, username: 'user003', name: '李明', email: 'liming@example.com', role: '编辑', status: '在线' },
  { id: 4, username: 'user004', name: '赵丽', email: 'zhaoli@example.com', role: '用户', status: '离线' },
  { id: 5, username: 'user005', name: '刘洋', email: 'liuyang@example.com', role: '管理员', status: '在线' },
  { id: 6, username: 'user006', name: '陈晓', email: 'chenxiao@example.com', role: '用户', status: '离线' },
  { id: 7, username: 'user007', name: '杨光', email: 'yangguang@example.com', role: '编辑', status: '在线' },
]);
const filteredUserData = ref([...userData.value]);

const userColumns = ref([
  { field: 'username', header: '用户名', sortable: true },
  { field: 'name', header: '姓名', sortable: true },
  { field: 'email', header: '邮箱', sortable: true },
  { field: 'role', header: '角色', sortable: true },
  { field: 'status', header: '状态', sortable: true },
]);

// 选中数据
const selectedFinanceData = ref([]);
const selectedUserData = ref([]);

// 对话框状态
const editDialog = ref(false);
const deleteDialog = ref(false);
const currentItem = ref({});
const currentType = ref('');
const currentIndex = ref(-1);

// 对话框标题
const editHeader = computed(() => {
  const typeMap = {
    'employee': '员工',
    'product': '产品',
    'finance': '财务',
    'user': '用户'
  };
  return `编辑${typeMap[currentType.value] || ''}`;
});

// 删除项标签
const deleteItemLabel = computed(() => {
  if (!currentItem.value) return '';
  
  const typeMap = {
    'employee': `员工"${currentItem.value.name}"`,
    'product': `产品"${currentItem.value.name}"`,
    'finance': `财务记录"${currentItem.value.account}"`,
    'user': `用户"${currentItem.value.username}"`
  };
  
  return typeMap[currentType.value] || '';
});

// 获取数据源引用
const getDataSource = (type) => {
  const dataMap = {
    'employee': employeeData,
    'product': productData,
    'finance': financeData,
    'user': userData
  };
  return dataMap[type];
};

// 获取过滤后数据引用
const getFilteredData = (type) => {
  const dataMap = {
    'employee': filteredEmployeeData,
    'product': filteredProductData,
    'finance': filteredFinanceData,
    'user': filteredUserData
  };
  return dataMap[type];
};

// 编辑项
const editItem = (type, item) => {
  currentType.value = type;
  // 创建深拷贝以避免直接修改原数据
  currentItem.value = JSON.parse(JSON.stringify(item));
  // 查找索引
  const dataSource = getDataSource(type);
  currentIndex.value = dataSource.value.findIndex(i => i.id === item.id);
  // 显示编辑对话框
  editDialog.value = true;
};

// 确认删除项
const confirmDeleteItem = (type, item) => {
  currentType.value = type;
  currentItem.value = item;
  // 查找索引
  const dataSource = getDataSource(type);
  currentIndex.value = dataSource.value.findIndex(i => i.id === item.id);
  // 显示删除确认对话框
  deleteDialog.value = true;
};

// 保存项
const saveItem = () => {
  if (currentIndex.value !== -1) {
    // 获取数据源和过滤后数据
    const dataSource = getDataSource(currentType.value);
    const filteredData = getFilteredData(currentType.value);
    
    // 更新原始数据
    dataSource.value[currentIndex.value] = { ...currentItem.value };
    
    // 更新过滤后的数据
    const filteredIndex = filteredData.value.findIndex(item => item.id === currentItem.value.id);
    if (filteredIndex !== -1) {
      filteredData.value[filteredIndex] = { ...currentItem.value };
    }
    
    // 显示成功消息
    showToast('修改成功', 'success');
    
    // 关闭对话框
    editDialog.value = false;
  }
};

// 删除项
const deleteItem = () => {
  if (currentIndex.value !== -1) {
    // 获取数据源和过滤后数据
    const dataSource = getDataSource(currentType.value);
    const filteredData = getFilteredData(currentType.value);
    
    // 从原始数据中删除
    dataSource.value = dataSource.value.filter(item => item.id !== currentItem.value.id);
    
    // 从过滤后的数据中删除
    filteredData.value = filteredData.value.filter(item => item.id !== currentItem.value.id);
    
    // 如果删除的是选中项，也从选中数据中移除
    if (currentType.value === 'finance') {
      selectedFinanceData.value = selectedFinanceData.value.filter(item => item.id !== currentItem.value.id);
    } else if (currentType.value === 'user') {
      selectedUserData.value = selectedUserData.value.filter(item => item.id !== currentItem.value.id);
    }
    
    // 显示成功消息
    showToast('删除成功', 'success');
    
    // 关闭对话框
    deleteDialog.value = false;
  }
};

// 显示提示消息
const showToast = (message, severity = 'success') => {
  toast.add({
    severity: severity,
    summary: severity === 'success' ? '成功' : '错误',
    detail: message,
    life: 3000
  });
};

// 搜索处理
const handleSearch = (searchEvent) => {
  console.log('搜索事件:', searchEvent);
};
</script>

<style scoped>
.tables-container {
  min-height: 100vh;
  background-color: #f5f7fb;
}

:global(.dark) .tables-container {
  background-color: rgb(48, 48, 48);
}

.table-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

:global(.dark) .table-card {
  background-color: #242736;
}

.table-header {
  padding: 16px 20px;
  border-bottom: 1px solid #eef1f6;
}

:global(.dark) .table-header {
  border-bottom: 1px solid #36394a;
}

.table-header h2 {
  color: #333;
  font-weight: 600;
  margin-bottom: 1rem;
}

:global(.dark) .table-header h2 {
  color: #e5e7eb;
}

.table-wrapper {
  padding: 16px;
  overflow-x: auto;
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