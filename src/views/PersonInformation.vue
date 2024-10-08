<template>
  <div class="personInformation">
    <div class="HeaderPerson">
      <div class="searchGroup">
        <AutoComplete
          v-model="value"
          :suggestions="filteredNames"
          @complete="search"
          placeholder="姓名"
          class="AutoComplete"
        />
        <AutoComplete
          v-model="value"
          :suggestions="filteredNames"
          @complete="search"
          placeholder="姓名"
          class="AutoComplete"
        />
        <AutoComplete
          v-model="value"
          :suggestions="filteredNames"
          @complete="search"
          placeholder="姓名"
          class="AutoComplete"
        />
      </div>
      <div class="buttonGroup">
        <Button label="添加" severity="success" raised />
        <Button label="添加" severity="success" raised />
        <Button label="添加" severity="success" raised />
        <Button label="添加" severity="success" raised />
      </div>
    </div>

    <div class="contentPerson">
      <DataTable
        :value="students"
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
            <InputText v-model="data[field]" fluid style="width: 100%; height: 40px; display: block;"/>
          </template>
        </Column>
        <Column field="group" header="组别" editor filter>
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
        <Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"></Column>
      </DataTable>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import AutoComplete from "primevue/autocomplete";
import Button from "primevue/button";
// datatable
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';                   // optional

// auto complete
const nameValue = ref(""); // 用户输入的名字
const names = ref([
  // 预定义的名字数组
  "Alice",
  "Bob",
  "Charlie",
  "David",
  "Eva",
  "Frank",
  "Grace",
  "Hannah",
  "Isaac",
  "Jack",
]);

const filteredNames = ref([]); // 过滤后的名字列表

const search = (event) => {
  const query = event.query.toLowerCase(); // 转为小写以实现不区分大小写的搜索
  // 根据用户输入的 query 过滤名字
  filteredNames.nameValue = names.nameValue.filter((name) =>
    name.toLowerCase().includes(query)
  );
};

// datatable
// 假数据
const students = ref([
{ id: 1, name: '张三', group: 'A组', gender: '男', grade: '一年级', major: '计算机', campus: '南校区', phone: '123456789', qq: '123456', wechat: 'zhangsan' },
  { id: 2, name: '李四', group: 'B组', gender: '女', grade: '二年级', major: '软件工程', campus: '北校区', phone: '987654321', qq: '654321', wechat: 'lisi' },
  { id: 3, name: '王五', group: 'A组', gender: '男', grade: '三年级', major: '人工智能', campus: '南校区', phone: '135246809', qq: '234567', wechat: 'wangwu' },
  { id: 4, name: '赵六', group: 'B组', gender: '女', grade: '四年级', major: '网络安全', campus: '北校区', phone: '139876543', qq: '765432', wechat: 'zhaoliu' },
  { id: 5, name: '孙七', group: 'C组', gender: '男', grade: '一年级', major: '物联网', campus: '西校区', phone: '158963741', qq: '876543', wechat: 'sunqi' },
  { id: 6, name: '周八', group: 'A组', gender: '女', grade: '二年级', major: '大数据', campus: '南校区', phone: '159753842', qq: '435267', wechat: 'zhouba' },
  { id: 7, name: '吴九', group: 'B组', gender: '男', grade: '三年级', major: '信息管理', campus: '北校区', phone: '137951482', qq: '546728', wechat: 'wujia' },
  { id: 8, name: '郑十', group: 'C组', gender: '女', grade: '四年级', major: '物联网', campus: '西校区', phone: '139258741', qq: '678321', wechat: 'zhengshi' },
  { id: 9, name: '王十一', group: 'A组', gender: '男', grade: '一年级', major: '计算机', campus: '南校区', phone: '187654321', qq: '432156', wechat: 'wangshiyi' },
  { id: 10, name: '李十二', group: 'C组', gender: '女', grade: '三年级', major: '人工智能', campus: '西校区', phone: '135879654', qq: '125763', wechat: 'lishier' },
  // 继续生成更多学生数据...
  { id: 11, name: '钱十三', group: 'A组', gender: '男', grade: '四年级', major: '物联网', campus: '南校区', phone: '187654322', qq: '777321', wechat: 'qianshisan' },
  { id: 12, name: '丁十四', group: 'B组', gender: '女', grade: '二年级', major: '大数据', campus: '北校区', phone: '147852369', qq: '888456', wechat: 'dingshisi' },
  { id: 13, name: '杨十五', group: 'C组', gender: '男', grade: '一年级', major: '计算机', campus: '西校区', phone: '138741258', qq: '999789', wechat: 'yangshiwu' },
  { id: 14, name: '吴十六', group: 'A组', gender: '女', grade: '三年级', major: '信息管理', campus: '南校区', phone: '139753951', qq: '111654', wechat: 'wushiliu' },
  { id: 15, name: '赵十七', group: 'B组', gender: '男', grade: '四年级', major: '物联网', campus: '北校区', phone: '147963852', qq: '222987', wechat: 'zhaoshiyi' },
  { id: 16, name: '孙十八', group: 'C组', gender: '女', grade: '二年级', major: '人工智能', campus: '西校区', phone: '187456321', qq: '333432', wechat: 'sunshiba' },
  { id: 17, name: '周十九', group: 'A组', gender: '男', grade: '一年级', major: '网络安全', campus: '南校区', phone: '186321753', qq: '444345', wechat: 'zhoushijiu' },
  { id: 18, name: '郑二十', group: 'B组', gender: '女', grade: '三年级', major: '信息管理', campus: '北校区', phone: '159357486', qq: '555678', wechat: 'zhengershi' },
  { id: 19, name: '王二十一', group: 'C组', gender: '男', grade: '四年级', major: '计算机', campus: '西校区', phone: '136258741', qq: '666912', wechat: 'wangershiyi' },
  { id: 20, name: '李二十二', group: 'A组', gender: '女', grade: '一年级', major: '大数据', campus: '南校区', phone: '148951753', qq: '777234', wechat: 'liershier' },
  // 再继续生成更多数据，直到50条...
  { id: 21, name: '刘二十三', group: 'B组', gender: '男', grade: '二年级', major: '人工智能', campus: '北校区', phone: '178321456', qq: '888432', wechat: 'liuershisan' },
  { id: 22, name: '钱二十四', group: 'C组', gender: '女', grade: '三年级', major: '物联网', campus: '西校区', phone: '189357248', qq: '999657', wechat: 'qianershisi' },
  { id: 23, name: '吴二十五', group: 'A组', gender: '男', grade: '四年级', major: '计算机', campus: '南校区', phone: '186753951', qq: '111321', wechat: 'wuershiwu' },
]);

// 过滤器配置
const filters = ref({
  'name': { value: null, matchMode: 'contains' },
  'group': { value: null, matchMode: 'contains' },
  'gender': { value: null, matchMode: 'contains' },
  'grade': { value: null, matchMode: 'contains' },
  'major': { value: null, matchMode: 'contains' },
  'campus': { value: null, matchMode: 'contains' },
  'phone': { value: null, matchMode: 'contains' },
  'qq': { value: null, matchMode: 'contains' },
  'wechat': { value: null, matchMode: 'contains' },
  'id': { value: null, matchMode: 'equals' },
});

// 行编辑相关
const editingRows = ref([]);
const selectedStudents = ref([]);

// 行编辑初始化
const onRowEditInit = (event) => {
  // 在行编辑开始时，可以添加一些自定义逻辑
  console.log('开始编辑行:', event.data);
};

const onRowEditSave = (event) => {
  let { newData, index } = event;
  students.value[index] = newData; // 更新数据
  editingRows.value = editingRows.value.filter(row => row.id !== newData.id); // 清除编辑状态
};

const onRowEditCancel = (event) => {
  // 在行编辑取消时，可以添加一些自定义逻辑
  console.log('取消编辑行:', event.data);
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
  width: 48%;
  height: 100%;
  margin-left: 2rem;
}
.buttonGroup {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 36%;
  height: 100%;
  margin-right: 2rem;
}
Button {
  height: 2.2rem;
  width: 6rem;
  font-size: 1rem;
  font-weight: 900;
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
