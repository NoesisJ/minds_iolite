<template>
  <div class="personInformation w-full flex-grow flex flex-col overflow-auto">
    <!-- Header -->
    <div
      class="header w-full h-[4.5rem] pl-[1rem] pr-[3rem] flex justify-between items-center gap-2"
    >
      <div class="searchGroup flex items-center space-x-2">
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
      <div class="buttonGroup flex items-center space-x-2">
        <Button
          icon="pi pi-upload"
          label="导出"
          severity="info"
          class="header-button"
          @click="exportCSV($event)"
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
          :disabled="!selectedMembers || !selectedMembers.length"
        />
      </div>
    </div>

    <!-- 操作成功提示 -->
    <Toast />

    <!-- 添加、编辑队员对话框 -->
    <Dialog
      v-model:visible="memberDialog"
      :style="{ width: '800px' }"
      header="添加队员"
      :modal="true"
    >
      <div class="flex flex-row gap-4">
        <div class="min-w-[350px] flex flex-col gap-6">
          <!-- 大头 -->
          <img
            v-if="member.image"
            :src="`https://primefaces.org/cdn/primevue/images/product/${member.image}`"
            :alt="member.image"
            class="block m-auto pb-4"
          />
          <!-- 姓名 -->
          <div>
            <label for="name" class="block font-bold mb-3">姓名</label>
            <InputText
              id="name"
              v-model.trim="member.name"
              required="true"
              autofocus
              :invalid="submitted && !member.name"
              fluid
            />
            <small v-if="submitted && !member.name" class="text-red-500"
              >Name is required.</small
            >
          </div>

          <!-- 信息内容 -->
          <div class="card grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- gender -->
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-mars"></i>
              </InputGroupAddon>
              <Select
                v-model="member.gender"
                :options="genders"
                optionLabel="name"
                optionValue="name"
                placeholder="性别"
              />
            </InputGroup>

            <!-- grade -->
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-calendar"></i>
              </InputGroupAddon>
              <Select
                v-model="member.grade"
                :options="years"
                optionLabel="name"
                optionValue="name"
                placeholder="入学年份"
              />
            </InputGroup>

            <!-- id -->
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-info"></i>
              </InputGroupAddon>
              <InputText
                v-model="member.id"
                :invalid="submitted && member.id && !/^\d+$/.test(member.id)"
                placeholder="学号"
                v-keyfilter="{ pattern: /^\d+$/, validateOnly: true }"
              />
            </InputGroup>

            <!-- group -->
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-id-card"></i>
              </InputGroupAddon>
              <Select
                v-model="member.group"
                :options="groups"
                optionLabel="name"
                optionValue="name"
                placeholder="组别"
              />
            </InputGroup>

            <!-- identity -->
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-flag"></i>
              </InputGroupAddon>
              <Select
                v-model="member.identity"
                :options="identities"
                optionLabel="name"
                optionValue="name"
                placeholder="在队身份"
              />
            </InputGroup>

            <!-- branch -->
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-ethereum"></i>
              </InputGroupAddon>
              <Select
                v-model="member.branch"
                :options="branches"
                optionLabel="name"
                optionValue="name"
                placeholder="兵种"
              />
            </InputGroup>

            <!-- campus -->
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-map-marker"></i>
              </InputGroupAddon>
              <Select
                v-model="member.campus"
                :options="campuses"
                optionLabel="name"
                optionValue="name"
                placeholder="校区"
              />
            </InputGroup>

            <!-- major -->
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-map"></i>
              </InputGroupAddon>
              <Select
                v-model="member.major"
                :options="majors"
                optionLabel="name"
                optionValue="name"
                placeholder="专业"
              />
            </InputGroup>

            <!-- phone -->
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-phone"></i>
              </InputGroupAddon>
              <InputText
                v-model="member.phone"
                :invalid="
                  submitted &&
                  member.phone &&
                  (member.phone.length !== 9 || /^\d+$/.test(member.phone))
                "
                v-keyfilter="{
                  pattern: /^[+]?(d{1,13})?$/,
                  validateOnly: true,
                }"
                placeholder="电话"
              />
            </InputGroup>

            <!-- email -->
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-at"></i>
              </InputGroupAddon>
              <InputText
                v-model="member.email"
                :invalid="
                  submitted &&
                  member.email &&
                  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)
                "
                v-keyfilter="{
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  validateOnly: true,
                }"
                placeholder="邮箱"
              />
            </InputGroup>

            <!-- qq -->
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-telegram"></i>
              </InputGroupAddon>
              <InputText
                v-model="member.qq"
                :invalid="submitted && member.qq && !/^\d+$/.test(member.qq)"
                v-keyfilter="{ pattern: /^\d+$/, validateOnly: true }"
                placeholder="QQ"
              />
            </InputGroup>

            <!-- wechat -->
            <InputGroup>
              <InputGroupAddon>
                <i class="pi pi-comments"></i>
              </InputGroupAddon>
              <InputText v-model="member.wechat" placeholder="微信" />
            </InputGroup>
          </div>
        </div>
        <FileUpload
          name="demo[]"
          url="/api/upload"
          @upload="onAdvancedUpload($event)"
          :multiple="true"
          accept="image/*"
          :maxFileSize="1000000"
          :style="{
            'background-color': '#a16eff',
            border: '0px',
          }"
        >
          <template #empty>
            <span>Drag and drop files to here to upload.</span>
          </template>
        </FileUpload>
        <!-- <FileUpload
          ref="fileUpload"
          name="demo[]"
          url="/upload"
          :auto="false"
          :customUpload="true"
          multiple
          :chooseLabel="'Choose'"
          :uploadLabel="'Upload'"
          :cancelLabel="'Cancel'"
          :maxFileSize="1000000"
          @upload="uploadHandler"
          @select="onFileSelect"
          :style="{ width: '400px' }"
        >
          <template #header>
            <div class="p-fileupload-header">
              <Button
                icon="pi pi-plus"
                label="Choose"
                class="p-button-success"
                @click="$refs.fileUpload.choose()"
              />
              <Button
                icon="pi pi-upload"
                label="Upload"
                class="p-button-primary"
                :disabled="!filesSelected"
                @click="onUpload"
              />
              <Button
                icon="pi pi-times"
                label="Cancel"
                class="p-button-danger"
                @click="onCancel"
              />
            </div>
          </template>
          <template #content>
            <div class="p-fileupload-content">
              <p v-if="files.length === 0">
                Drag and drop files to here to upload.
              </p>
              <ul>
                <li v-for="(file, index) in files" :key="index">
                  {{ file.name }}
                </li>
              </ul>
            </div>
          </template>
        </FileUpload> -->
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
          @click="saveMember"
        />
      </template>
    </Dialog>

    <!-- 确认单个删除对话框 -->
    <Dialog
      v-model:visible="deleteMemberDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="member"
          >您确定要删除<b>{{ member.name }}</b
          >吗?
        </span>
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          severity="secondary"
          text
          @click="deleteMemberDialog = false"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          severity="help"
          @click="deleteMember"
        />
      </template>
    </Dialog>

    <!-- 确认批量删除对话框 -->
    <Dialog
      v-model:visible="deleteMembersDialog"
      :style="{ width: '450px' }"
      header="Confirm"
      :modal="true"
    >
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle !text-3xl" />
        <span v-if="selectedMembers">您确定要删除选中的项吗?</span>
      </div>
      <template #footer>
        <Button
          label="No"
          icon="pi pi-times"
          severity="secondary"
          text
          @click="deleteMembersDialog = false"
        />
        <Button
          label="Yes"
          icon="pi pi-check"
          severity="help"
          text
          @click="deleteSelectedMembers"
        />
      </template>
    </Dialog>

    <!-- 信息表格 -->
    <div class="contentPerson w-full overflow-auto hide-scrollbar">
      <DataTable
        ref="dt"
        v-model:selection="selectedMembers"
        :value="filteredMembers"
        dataKey="id"
        :rows="14"
        :filters="filters"
        scrollable
        :scrollHeight="scrollHeight"
        tableStyle="min-width: 1500px; height: fit;"
        class="overflow-auto hide-scrollbar"
      >
        <!-- 多选列 -->
        <Column
          selectionMode="multiple"
          style="width: 3rem"
          :exportable="false"
        ></Column>

        <!-- 队员信息列 -->
        <Column field="name" header="姓名" sortable frozen></Column>
        <Column field="gender" header="性别"></Column>
        <Column field="grade" header="年级"></Column>
        <Column field="id" header="学号"></Column>
        <Column field="group" header="组别"></Column>
        <Column field="identity" header="在队身份"></Column>
        <Column field="branch" header="兵种"></Column>
        <Column field="campus" header="校区"></Column>
        <Column field="major" header="专业"></Column>
        <Column field="phone" header="电话"></Column>
        <Column field="email" header="邮箱"></Column>
        <Column field="qq" header="QQ"></Column>
        <Column field="wechat" header="微信"></Column>

        <!-- 操作列 -->
        <Column :exportable="false">
          <template #body="slotProps" style="min-width: 12rem">
            <Button
              icon="pi pi-pencil"
              outlined
              rounded
              severity="info"
              class="mr-2"
              @click="editMember(slotProps.data)"
            />
            <Button
              icon="pi pi-trash"
              outlined
              rounded
              severity="danger"
              @click="confirmDeleteMember(slotProps.data)"
            />
          </template>
        </Column>
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
import FileUpload from "primevue/fileupload";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import Dialog from "primevue/dialog";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { show } from "@tauri-apps/api/app";
import { identity } from "@vueuse/core";
import { color } from "echarts";

const toast = useToast();
const dt = ref();
const scrollHeight = "calc(100vh - 8.5rem)";
// 用户输入
const nameValue = ref("");
const groupValue = ref("");
const branchValue = ref("");
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
// 控制添加队员对话框的显示
const memberDialog = ref(false);
const deleteMemberDialog = ref(false);
const deleteMembersDialog = ref(false);
const member = ref({});
const submitted = ref(false);
// 全部队员数据
const members = ref([
  {
    id: 1,
    sn: 1,
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
    sn: 2,
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
    sn: 3,
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
    sn: 4,
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
    sn: 5,
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
    sn: 6,
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
    sn: 7,
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
    sn: 8,
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
    sn: 9,
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
    sn: 10,
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
    sn: 11,
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
    sn: 12,
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
    sn: 13,
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
    sn: 14,
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
    sn: 15,
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
    sn: 16,
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
]);
// 过滤后的列表
const filteredNames = ref([]);
const filteredGroups = ref([]);
const filteredBranches = ref([]);

// 导出表格 CSV
const exportCSV = () => {
  dt.value.exportCSV();
};

// 搜索
const searchNames = (event) => {
  const query = event.query.toLowerCase();
  filteredNames.value = members.value
    .filter((member) => member.name.toLowerCase().includes(query))
    .map((member) => member.name);
};

const searchGroups = (event) => {
  const query = event.query.toLowerCase();
  const uniqueGroups = [
    ...new Set(members.value.map((member) => member.group)),
  ];
  filteredGroups.value = uniqueGroups.filter((group) =>
    group.toLowerCase().includes(query)
  );
};

const searchBranches = (event) => {
  const query = event.query.toLowerCase();
  const uniqueBranches = [
    ...new Set(members.value.map((member) => member.branch)),
  ];
  filteredBranches.value = uniqueBranches.filter((branch) =>
    branch.toLowerCase().includes(query)
  );
};

// 过滤后的队员列表
const filteredMembers = computed(() => {
  return members.value.filter(
    (member) =>
      (!nameValue.value || member.name.includes(nameValue.value)) &&
      (!groupValue.value || member.group.includes(groupValue.value)) &&
      (!branchValue.value || member.branch.includes(branchValue.value)) // 使用 branchValue
  );
});

// 过滤器配置
const filters = ref({
  name: { value: null, matchMode: "contains" },
  gender: { value: null, matchMode: "contains" },
  grade: { value: null, matchMode: "contains" },
  id: { value: null, matchMode: "equals" },
  group: { value: null, matchMode: "contains" },
  identity: { value: null, matchMode: "contains" },
  branch: { value: null, matchMode: "contains" },
  campus: { value: null, matchMode: "contains" },
  major: { value: null, matchMode: "contains" },
  phone: { value: null, matchMode: "contains" },
  email: { value: null, matchMode: "contains" },
  qq: { value: null, matchMode: "contains" },
  wechat: { value: null, matchMode: "contains" },
});

// 要删除的队员数据
const selectedMembers = ref();

// 新增的队员数据(仅用于规范数据结构，不实际使用)
const newMember = ref({
  name: "",
  gender: "",
  grade: "",
  id: null,
  group: "",
  identity: "",
  branch: "",
  campus: "",
  major: "",
  phone: null,
  email: "",
  qq: "",
  wechat: "",
});

// 显示添加队员
const openNew = () => {
  member.value = {};
  submitted.value = false;
  memberDialog.value = true;
};

// 显示编辑队员
const editMember = (memb) => {
  member.value = { ...memb };
  memberDialog.value = true;
};

// 上传图片文件
const onAdvancedUpload = () => {
  toast.add({
    severity: "info",
    summary: "Success",
    detail: "File Uploaded",
    life: 3000,
  });
};

const files = ref([]);
const filesSelected = ref(false);

const onFileSelect = (event) => {
  files.value = event.files;
  filesSelected.value = true;
};

const onUpload = () => {
  // Custom upload logic, if any
  console.log('Uploading files: ', files.value);
};

const onCancel = () => {
  files.value = [];
  filesSelected.value = false;
  console.log('Upload cancelled');
};

const uploadHandler = (event) => {
  // Handle the file upload event
  console.log('Uploaded files:', event.files);
};

// 添加、编辑队员
const saveMember = () => {
  submitted.value = true;

  if (
    member?.value.name?.trim() &&
    (!member.id || (member.id && /^\d+$/.test(member.id))) &&
    (!member.phone ||
      (member.phone &&
        member.phone.length == 9 &&
        /^\d+$/.test(member.phone))) &&
    (!member.email ||
      (member.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email))) &&
    (!member.qq || (member.qq && /^\d+$/.test(member.qq)))
  ) {
    if (member.value.sn) {
      const index = findIndexBySN(member.value.sn);
      if (index !== -1) {
        members.value[index] = member.value; // 更新成员信息
        showToast("编辑成功！");
      } else {
        showToast("成员未找到，编辑失败！");
      }
    } else {
      member.value.sn = createSN();
      // member.value.image = "product-placeholder.svg";
      members.value.push({ ...member.value });
      showToast("添加成功！");
    }

    memberDialog.value = false;
    member.value = {};
  }
};

// 取消添加、编辑队员
const hideDialog = () => {
  memberDialog.value = false;
  submitted.value = false;
};

// 确认删除队员
const confirmDeleteMember = (memb) => {
  deleteMemberDialog.value = true;
  member.value = memb;
};

// 删除队员
const deleteMember = () => {
  members.value = members.value.filter((memb) => memb !== member.value);
  updateSnValues();
  deleteMemberDialog.value = false;
  member.value = {};
  showToast("删除成功！");
};

// 确认批量删除
const confirmDeleteSelected = () => {
  deleteMembersDialog.value = true;
};

// 批量删除队员
const deleteSelectedMembers = () => {
  members.value = members.value.filter(
    (member) => !selectedMembers.value.includes(member)
  );
  updateSnValues();
  deleteMembersDialog.value = false;
  selectedMembers.value = []; // 清空选中的队员
  showToast("删除成功！");
};

// 生成 SN
const createSN = () => {
  // 上一版生成 SN 的方法
  // const newId = members.value.length
  //   ? Math.max(...members.value.map((s) => s.id)) + 1
  //   : 1;

  // 使用 reduce 一次遍历找到最大 SN
  const newSN =
    members.value.reduce((maxSN, member) => Math.max(maxSN, member.sn), 0) + 1;
  return newSN;
};

// 查询 SN
const findIndexBySN = (sn) => members.value.findIndex((memb) => memb.sn === sn);

// 更新 SN
const updateSnValues = () => {
  members.value.forEach((memb, index) => {
    memb.sn = index + 1;
  });
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

/* 
.p-datatable-tbody > tr {
  max-height: 2.5rem;
}

.hide-scrollbar {
  scrollbar-width: none; For Firefox
}

.hide-scrollbar::-webkit-scrollbar {
  display: none; For Chrome, Safari, and Edge
}

.p-datatable-table-container {
  scrollbar-width: none;
}

.p-datatable-table-container::-webkit-scrollbar {
  display: none;
}

.p-datatable-table {
  scrollbar-width: none;
}

.p-datatable-table::-webkit-scrollbar {
  display: none;
}

.p-datatable-scrollable-table {
  scrollbar-width: none;
}

.p-datatable-scrollable-table::-webkit-scrollbar {
  display: none;
}

.p-datatable-scrollable {
  scrollbar-width: none;
}

.p-datatable-scrollable::-webkit-scrollbar {
  display: none;
}

.p-datatable {
  scrollbar-width: none;
}

.p-datatable::-webkit-scrollbar {
  display: none;
} */
</style>
