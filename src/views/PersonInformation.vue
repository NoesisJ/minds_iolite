<template>
  <div class="personInformation w-full flex flex-col">
    <div
      class="header w-full h-[4.5rem] pl-[1rem] pr-[3rem] flex justify-between items-center"
    >
      <div class="searchGroup space-x-2">
        <AutoComplete
          v-model="nameValue"
          :suggestions="filteredNames"
          @complete="searchNames"
          placeholder="姓名"
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
          placeholder="兵种"
        />
      </div>
      <div class="buttonGroup space-x-2">
        <Button label="添加" severity="help" raised @click="showAddDialog" />
        <Button label="删除" severity="info" raised @click="confirmDelete" />
      </div>
    </div>

    <!-- 操作成功提示 -->
    <Toast />

    <!-- 确认删除对话框 -->
    <ConfirmDialog></ConfirmDialog>

    <!-- 添加学生对话框 -->
    <Dialog v-model:visible="addStudentVisible" header="添加学生" modal>
      <div class="card grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- name -->
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-user"></i>
          </InputGroupAddon>
          <InputText v-model="newStudent.name" placeholder="姓名" />
        </InputGroup>

        <!-- gender -->
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-mars"></i>
          </InputGroupAddon>
          <Select
            v-model="newStudent.gender"
            :options="genders"
            optionLabel="name"
            placeholder="性别"
          />
        </InputGroup>

        <!-- grade -->
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-calendar"></i>
          </InputGroupAddon>
          <Select
            v-model="newStudent.grade"
            :options="years"
            optionLabel="name"
            placeholder="入学年份"
          />
        </InputGroup>

        <!-- id -->
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-info"></i>
          </InputGroupAddon>
          <InputNumber v-model="newStudent.id" placeholder="学号" />
        </InputGroup>

        <!-- group -->
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-id-card"></i>
          </InputGroupAddon>
          <Select
            v-model="newStudent.group"
            :options="groups"
            optionLabel="name"
            placeholder="组别"
          />
        </InputGroup>

        <!-- identity -->
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-flag"></i>
          </InputGroupAddon>
          <Select
            v-model="newStudent.identity"
            :options="identities"
            optionLabel="name"
            placeholder="在队身份"
          />
        </InputGroup>

        <!-- campus -->
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-map-marker"></i>
          </InputGroupAddon>
          <Select
            v-model="newStudent.campus"
            :options="campuses"
            optionLabel="name"
            placeholder="校区"
          />
        </InputGroup>

        <!-- major -->
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-map"></i>
          </InputGroupAddon>
          <Select
            v-model="newStudent.major"
            :options="majors"
            optionLabel="name"
            placeholder="专业"
          />
        </InputGroup>

        <!-- phone -->
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-phone"></i>
          </InputGroupAddon>
          <InputNumber v-model="newStudent.phone" placeholder="电话" />
        </InputGroup>

        <!-- email -->
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-at"></i>
          </InputGroupAddon>
          <InputText v-model="newStudent.email" placeholder="邮箱" />
        </InputGroup>

        <!-- qq -->
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-user"></i>
          </InputGroupAddon>
          <InputText v-model="newStudent.qq" placeholder="QQ" />
        </InputGroup>

        <!-- wechat -->
        <InputGroup>
          <InputGroupAddon>
            <i class="pi pi-comments"></i>
          </InputGroupAddon>
          <InputText v-model="newStudent.wechat" placeholder="微信" />
        </InputGroup>
      </div>
      <template #footer>
        <Button label="取消" @click="resetAddStudent" severity="info" />
        <Button label="确认" @click="AddStudent" severity="help" />
      </template>
    </Dialog>

    <!-- 表格 -->
    <div class="contentPerson">
      <DataTable
        :value="filteredStudents"
        :paginator="true"
        :rows="14"
        :filters="filters"
        v-model:selection="selectedStudents"
        v-model:editingRows="editingRows"
        selection-mode="multiple"
        editMode="row"
        dataKey="id"
        scrollable
        scroll-height="100vh"
        @row-edit-init="onRowEditInit"
        @row-edit-save="onRowEditSave"
        @row-edit-cancel="onRowEditCancel"
      >
        <!-- 多选列 -->
        <Column selectionMode="multiple" headerStyle="width: 3em"></Column>

        <!-- 可编辑和筛选的列 -->
        <Column field="name" header="姓名" editor filter>
          <template #editor="{ data, field }">
            <InputText
              v-model="data[field]"
              fluid
              style="width: 100%; height: 40px; display: block"
            />
          </template>
        </Column>
        <Column field="group" header="组别" editor filter>
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" fluid />
          </template>
        </Column>
        <Column field="branch" header="兵种" editor filter>
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" fluid />
          </template>
        </Column>
        <Column field="gender" header="性别" editor filter>
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" fluid />
          </template>
        </Column>
        <Column field="grade" header="年级" editor filter>
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" fluid />
          </template>
        </Column>
        <Column field="major" header="专业" editor filter>
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" fluid />
          </template>
        </Column>
        <Column field="campus" header="校区" editor filter>
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" fluid />
          </template>
        </Column>
        <Column field="phone" header="电话" editor filter>
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" fluid />
          </template>
        </Column>
        <Column field="qq" header="QQ" editor filter>
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" fluid />
          </template>
        </Column>
        <Column field="wechat" header="微信" editor filter>
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" fluid />
          </template>
        </Column>
        <Column field="id" header="ID" :editor filter>
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" fluid />
          </template>
        </Column>

        <!-- 行编辑器 -->
        <Column
          :rowEditor="true"
          style="width: 10%; min-width: 8rem"
          bodyStyle="text-align:center"
        ></Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import AutoComplete from "primevue/autocomplete";
import Button from "primevue/button";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Select from "primevue/select";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import Dialog from "primevue/dialog";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import ConfirmDialog from "primevue/confirmdialog";
import { useConfirm } from "primevue/useconfirm";
import { show } from "@tauri-apps/api/app";
import { identity } from "@vueuse/core";

const toast = useToast();
const confirm = useConfirm();

// auto complete
const nameValue = ref(""); // 用户输入的名字
const groupValue = ref(""); // 用户输入的组别
const branchValue = ref(""); // 用户输入的兵种
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

// 统一的学生数据
// datatable
const students = ref([
  {
    id: 1,
    name: "张三",
    group: "A组",
    gender: "男",
    grade: "一年级",
    major: "计算机",
    campus: "南校区",
    phone: "123456789",
    qq: "123456",
    wechat: "zhangsan",
    branch: "步兵",
  },
  {
    id: 2,
    name: "李四",
    group: "B组",
    gender: "女",
    grade: "二年级",
    major: "软件工程",
    campus: "北校区",
    phone: "987654321",
    qq: "654321",
    wechat: "lisi",
    branch: "炮兵",
  },
  {
    id: 3,
    name: "王五",
    group: "A组",
    gender: "男",
    grade: "三年级",
    major: "人工智能",
    campus: "南校区",
    phone: "135246809",
    qq: "234567",
    wechat: "wangwu",
    branch: "特种兵",
  },
  {
    id: 4,
    name: "赵六",
    group: "B组",
    gender: "女",
    grade: "四年级",
    major: "网络安全",
    campus: "北校区",
    phone: "139876543",
    qq: "765432",
    wechat: "zhaoliu",
    branch: "机械兵",
  },
  {
    id: 5,
    name: "孙七",
    group: "C组",
    gender: "男",
    grade: "一年级",
    major: "物联网",
    campus: "西校区",
    phone: "158963741",
    qq: "876543",
    wechat: "sunqi",
    branch: "步兵",
  },
  {
    id: 6,
    name: "周八",
    group: "A组",
    gender: "女",
    grade: "二年级",
    major: "大数据",
    campus: "南校区",
    phone: "159753842",
    qq: "435267",
    wechat: "zhouba",
    branch: "炮兵",
  },
  {
    id: 7,
    name: "吴九",
    group: "B组",
    gender: "男",
    grade: "三年级",
    major: "信息管理",
    campus: "北校区",
    phone: "137951482",
    qq: "546728",
    wechat: "wujia",
    branch: "特种兵",
  },
  {
    id: 8,
    name: "郑十",
    group: "C组",
    gender: "女",
    grade: "四年级",
    major: "物联网",
    campus: "西校区",
    phone: "139258741",
    qq: "678321",
    wechat: "zhengshi",
    branch: "机械兵",
  },
  {
    id: 9,
    name: "王十一",
    group: "A组",
    gender: "男",
    grade: "一年级",
    major: "计算机",
    campus: "南校区",
    phone: "187654321",
    qq: "432156",
    wechat: "wangshiyi",
    branch: "步兵",
  },
  {
    id: 10,
    name: "李十二",
    group: "C组",
    gender: "女",
    grade: "三年级",
    major: "人工智能",
    campus: "西校区",
    phone: "135879654",
    qq: "125763",
    wechat: "lishier",
    branch: "炮兵",
  },
  {
    id: 11,
    name: "钱十三",
    group: "A组",
    gender: "男",
    grade: "四年级",
    major: "物联网",
    campus: "南校区",
    phone: "187654322",
    qq: "777321",
    wechat: "qianshisan",
    branch: "特种兵",
  },
  {
    id: 12,
    name: "丁十四",
    group: "B组",
    gender: "女",
    grade: "二年级",
    major: "大数据",
    campus: "北校区",
    phone: "147852369",
    qq: "888456",
    wechat: "dingshisi",
    branch: "机械兵",
  },
  {
    id: 13,
    name: "杨十五",
    group: "C组",
    gender: "男",
    grade: "一年级",
    major: "计算机",
    campus: "西校区",
    phone: "138741258",
    qq: "999789",
    wechat: "yangshiwu",
    branch: "步兵",
  },
  {
    id: 14,
    name: "吴十六",
    group: "A组",
    gender: "女",
    grade: "三年级",
    major: "信息管理",
    campus: "南校区",
    phone: "139753951",
    qq: "111654",
    wechat: "wushiliu",
    branch: "炮兵",
  },
  {
    id: 15,
    name: "赵十七",
    group: "B组",
    gender: "男",
    grade: "四年级",
    major: "物联网",
    campus: "北校区",
    phone: "147963852",
    qq: "222987",
    wechat: "zhaoshiyi",
    branch: "特种兵",
  },
  {
    id: 16,
    name: "孙十八",
    group: "C组",
    gender: "女",
    grade: "二年级",
    major: "人工智能",
    campus: "西校区",
    phone: "187456321",
    qq: "333432",
    wechat: "sunshiba",
    branch: "机械兵",
  },
  {
    id: 17,
    name: "周十九",
    group: "A组",
    gender: "男",
    grade: "一年级",
    major: "网络安全",
    campus: "南校区",
    phone: "186321753",
    qq: "444345",
    wechat: "zhoushijiu",
    branch: "步兵",
  },
  {
    id: 18,
    name: "郑二十",
    group: "B组",
    gender: "女",
    grade: "三年级",
    major: "信息管理",
    campus: "北校区",
    phone: "159357486",
    qq: "555678",
    wechat: "zhengershi",
    branch: "炮兵",
  },
  {
    id: 19,
    name: "王二十一",
    group: "C组",
    gender: "男",
    grade: "四年级",
    major: "计算机",
    campus: "西校区",
    phone: "136258741",
    qq: "666912",
    wechat: "wangershiyi",
    branch: "特种兵",
  },
  {
    id: 20,
    name: "李二十二",
    group: "A组",
    gender: "女",
    grade: "一年级",
    major: "大数据",
    campus: "南校区",
    phone: "148951753",
    qq: "777234",
    wechat: "liershier",
    branch: "机械兵",
  },
  {
    id: 21,
    name: "刘二十三",
    group: "B组",
    gender: "男",
    grade: "二年级",
    major: "人工智能",
    campus: "北校区",
    phone: "178321456",
    qq: "888432",
    wechat: "liuershisan",
    branch: "步兵",
  },
  {
    id: 22,
    name: "钱二十四",
    group: "C组",
    gender: "女",
    grade: "三年级",
    major: "物联网",
    campus: "西校区",
    phone: "189357248",
    qq: "999657",
    wechat: "qianershisi",
    branch: "炮兵",
  },
  {
    id: 23,
    name: "吴二十五",
    group: "A组",
    gender: "男",
    grade: "四年级",
    major: "计算机",
    campus: "南校区",
    phone: "186753951",
    qq: "111321",
    wechat: "wuershiwu",
    branch: "特种兵",
  },
  {
    id: 24,
    name: "张二十六",
    group: "B组",
    gender: "女",
    grade: "一年级",
    major: "软件工程",
    campus: "北校区",
    phone: "147852369",
    qq: "222345",
    wechat: "zhangerli",
    branch: "机械兵",
  },
  {
    id: 25,
    name: "李二十七",
    group: "C组",
    gender: "男",
    grade: "二年级",
    major: "大数据",
    campus: "南校区",
    phone: "159357159",
    qq: "333987",
    wechat: "liershijiu",
    branch: "步兵",
  },
  {
    id: 26,
    name: "王二十八",
    group: "A组",
    gender: "女",
    grade: "三年级",
    major: "人工智能",
    campus: "西校区",
    phone: "178951258",
    qq: "444567",
    wechat: "wangershijiu",
    branch: "炮兵",
  },
  {
    id: 27,
    name: "赵二十九",
    group: "B组",
    gender: "男",
    grade: "四年级",
    major: "网络安全",
    campus: "北校区",
    phone: "187456951",
    qq: "555678",
    wechat: "zhaoshan",
    branch: "特种兵",
  },
]);

// 过滤后的列表
const filteredNames = ref([]);
const filteredGroups = ref([]);
const filteredBranches = ref([]);

// 搜索函数
const searchNames = (event) => {
  const query = event.query.toLowerCase();
  filteredNames.value = students.value
    .filter((student) => student.name.toLowerCase().includes(query))
    .map((student) => student.name);
};

const searchGroups = (event) => {
  const query = event.query.toLowerCase();
  const uniqueGroups = [
    ...new Set(students.value.map((student) => student.group)),
  ];
  filteredGroups.value = uniqueGroups.filter((group) =>
    group.toLowerCase().includes(query)
  );
};

const searchBranches = (event) => {
  const query = event.query.toLowerCase();
  const uniqueBranches = [
    ...new Set(students.value.map((student) => student.branch)),
  ];
  filteredBranches.value = uniqueBranches.filter((branch) =>
    branch.toLowerCase().includes(query)
  );
};

// 过滤后的学生列表
const filteredStudents = computed(() => {
  return students.value.filter(
    (student) =>
      (!nameValue.value || student.name.includes(nameValue.value)) &&
      (!groupValue.value || student.group.includes(groupValue.value)) &&
      (!branchValue.value || student.branch.includes(branchValue.value)) // 使用 branchValue
  );
});

// 过滤器配置
const filters = ref({
  name: { value: null, matchMode: "contains" },
  group: { value: null, matchMode: "contains" },
  branch: { value: null, matchMode: "contains" },
  gender: { value: null, matchMode: "contains" },
  grade: { value: null, matchMode: "contains" },
  major: { value: null, matchMode: "contains" },
  campus: { value: null, matchMode: "contains" },
  phone: { value: null, matchMode: "contains" },
  qq: { value: null, matchMode: "contains" },
  wechat: { value: null, matchMode: "contains" },
  id: { value: null, matchMode: "equals" },
});

// 行编辑相关
const editingRows = ref([]);
const selectedStudents = ref([]);
// 删除确认对话框
const studentToDelete = ref(null);

// 行编辑初始化
const onRowEditInit = (event) => {
  console.log("开始编辑行:", event.data);
};

const onRowEditSave = (event) => {
  let { newData, index } = event;
  students.value[index] = newData;
  editingRows.value = editingRows.value.filter((row) => row.id !== newData.id);
};

const onRowEditCancel = (event) => {
  console.log("取消编辑行:", event.data);
};

// 添加和删除学生

// 新增的学生数据
const newStudent = ref({
  name: "",
  gender: "",
  grade: "",
  id: null,
  group: "",
  identity: "",
  campus: "",
  major: "",
  phone: null,
  email: "",
  qq: "",
  wechat: "",
});

// 控制添加学生对话框的显示
const addStudentVisible = ref(false);

const showAddDialog = () => {
  newStudent.value = {
    name: "",
    gender: "",
    grade: "",
    id: null,
    group: "",
    identity: "",
    campus: "",
    major: "",
    phone: null,
    email: "",
    qq: "",
    wechat: "",
  }; // 清空输入框
  addStudentVisible.value = true; // 显示对话框
};

// 添加学生
const AddStudent = () => {
  // const newId = students.value.length
  //   ? Math.max(...students.value.map((s) => s.id)) + 1
  //   : 1;

  // 使用 reduce 一次遍历找到最大 ID
  const newId =
    students.value.reduce((maxId, student) => Math.max(maxId, student.id), 0) +
    1;
  students.value.push({ id: newId, ...newStudent.value });
  showToast("添加成功！"); // 提示添加成功
};

// 取消添加
const resetAddStudent = () => {
  addStudentVisible.value = false;
};

// 删除商品
const confirmDelete = () => {
  if (selectedStudents.value) {
    confirm.require({
      message: "您确定要删除选中的项吗？",
      header: "确认删除",
      icon: "pi pi-exclamation-triangle",
      rejectProps: {
        label: "取消",
        severity: "secondary",
        outlined: true,
      },
      acceptProps: {
        label: "确定",
        severity: "confirm",
      },
      accept: () => {
        students.value = students.value.filter(
          (student) => !selectedStudents.value.includes(student)
        );
        studentToDelete.value = null;
        showToast("删除成功！");
      },
    });
  }
};

// 成功提示
const showToast = (message) => {
  toast.add({
    severity: "success",
    summary: "成功",
    detail: message,
    life: 3000,
  });
};
</script>

<style scoped>
Button {
  height: 2.2rem;
  width: 6rem;
  font-size: 1rem;
  font-weight: 900;
  margin-right: 0.5rem;
}
</style>
