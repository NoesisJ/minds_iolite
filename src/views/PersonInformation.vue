<template>
  <div class="personInformation">
    <div class="HeaderPerson">
      <div class="searchGroup">
        <AutoComplete
          v-model="nameValue"
          :suggestions="filteredNames"
          @complete="searchNames"
          placeholder="姓名"
          class="AutoComplete"
        />
        <AutoComplete
          v-model="groupValue"
          :suggestions="filteredGroups"
          @complete="searchGroups"
          placeholder="组别"
          class="AutoComplete"
        />
        <AutoComplete
          v-model="branchValue"
          :suggestions="filteredBranches"
          @complete="searchBranches"
          placeholder="兵种"
          class="AutoComplete"
        />
      </div>
      <div class="buttonGroup">
        <Button label="添加" severity="success" raised @click="showAddDialog" />
        <Button label="删除" severity="danger" raised @click="deleteSelected" />
      </div>
    </div>

    <!-- 删除确认对话框 -->
    <Toast ref="toast" />

    <Dialog
      v-model:visible="confirmDeleteVisible"
      header="确认删除"
      @hide="resetDelete"
      modal
    >
      <p>您确定要删除选中的项吗？</p>
      <template #footer>
        <Button label="取消" @click="resetDelete" />
        <Button label="确认" @click="confirmDelete" severity="danger" />
      </template>
    </Dialog>

    <!-- 添加学生对话框 -->
    <Dialog
      v-model:visible="addStudentVisible"
      header="添加学生"
      @hide="resetAddStudent"
      modal
    >
      <div>
        <InputText v-model="newStudent.name" placeholder="姓名" />
        <InputText v-model="newStudent.group" placeholder="组别" />
        <InputText v-model="newStudent.branch" placeholder="兵种" />
        <InputText v-model="newStudent.gender" placeholder="性别" />
        <InputText v-model="newStudent.grade" placeholder="年级" />
        <InputText v-model="newStudent.major" placeholder="专业" />
        <InputText v-model="newStudent.campus" placeholder="校区" />
        <InputText v-model="newStudent.phone" placeholder="电话" />
        <InputText v-model="newStudent.qq" placeholder="QQ" />
        <InputText v-model="newStudent.wechat" placeholder="微信" />
      </div>
      <template #footer>
        <Button label="取消" @click="resetAddStudent" />
        <Button label="确认" @click="confirmAddStudent" severity="success" />
      </template>
    </Dialog>

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
        class="dataTable"
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
// datatable
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import Dialog from "primevue/dialog";
import Toast from "primevue/toast";

// auto complete
const nameValue = ref(""); // 用户输入的名字
const groupValue = ref(""); // 用户输入的组别
const branchValue = ref(""); // 用户输入的兵种

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
  group: "",
  branch: "",
  gender: "",
  grade: "",
  major: "",
  campus: "",
  phone: "",
  qq: "",
  wechat: "",
});
// 控制添加学生对话框的显示
const addStudentVisible = ref(false);

const showAddDialog = () => {
  newStudent.value = { name: "", group: "", branch: "", gender: "", grade: "", major: "", campus: "", phone: "", qq: "", wechat: "" }; // 清空输入框
  addStudentVisible.value = true; // 显示对话框
};

const resetAddStudent = () => {
  addStudentVisible.value = false;
};

const confirmAddStudent = () => {
  const newId = students.value.length ? Math.max(...students.value.map(s => s.id)) + 1 : 1;
  students.value.push({ id: newId, ...newStudent.value });
  resetAddStudent(); // 关闭对话框
  showToast("添加成功！"); // 提示添加成功
};


const deleteSelected = () => {
  confirmDeleteVisible.value = true; // 打开确认删除对话框
};

// 删除确认对话框
const confirmDeleteVisible = ref(false);
const studentToDelete = ref(null);

const openConfirmDelete = (student) => {
  studentToDelete.value = student;
  confirmDeleteVisible.value = true;
};

const resetDelete = () => {
  confirmDeleteVisible.value = false;
  studentToDelete.value = null;
};



const confirmDelete = () => {
  selectedStudents.value.forEach((student) => {
    const index = students.value.findIndex((s) => s.id === student.id);
    if (index !== -1) {
      students.value.splice(index, 1);
    }
  });
  selectedStudents.value = []; // 清空选择
  resetDelete();
  showToast("删除成功！");
};

const toast = ref(null); // 声明 toast 的 ref
defineExpose({ toast });

const showToast = (message) => {
  toast.value.add({
    severity: "success",
    summary: "成功",
    detail: message,
    life: 3000,
  });
};
</script>
<style scoped>
/* personInformation */
.personInformation {
  width: 100%;
  min-width: 82rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}
/* headerPerson */
.HeaderPerson {
  margin-top: 1rem;
  width: 100%;
  height: 3.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.searchGroup {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 46rem;
  height: 100%;
  margin-left: 2rem;
}
.buttonGroup {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 16rem;
  height: 100%;
}

Button {
  height: 2.2rem;
  width: 6rem;
  font-size: 1rem;
  font-weight: 900;
  margin-right: 0.5rem;
}

/* contentPerson */
.contentPerson {
  margin-top: 1rem;
  width: 100%;
  height: 50rem;
}
input {
  display: block; /* 确保输入框为块级元素 */
}
</style>
