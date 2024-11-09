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
                :invalid="submitted && !!member.id && !/^\d+$/.test(member.id)"
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
                  Boolean(
                    submitted &&
                      member.phone &&
                      (member.phone.length !== 9 || /^\d+$/.test(member.phone))
                  )
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
                  Boolean(
                    submitted &&
                      member.email &&
                      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)
                  )
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
                :invalid="
                  Boolean(submitted && member.qq && !/^\d+$/.test(member.qq))
                "
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
          @upload="onAdvancedUpload()"
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
      <Table
        ref="dataTable"
        :data="members"
        :columns="columns"
        :filters="filters"
        v-model:selection="selectedMembers"
        @edit="editMember"
        @delete="confirmDeleteMember"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import Table from "../components/Table.vue";
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
const selectedMembers = ref<Member[]>([]);

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
  { field: "name", header: "姓名", sortable: true, frozen: true },
  { field: "gender", header: "性别" },
  { field: "grade", header: "年级" },
  { field: "id", header: "学号" },
  { field: "group", header: "组别" },
  { field: "identity", header: "在队身份" },
  { field: "branch", header: "兵种" },
  { field: "campus", header: "校区" },
  { field: "major", header: "专业" },
  { field: "phone", header: "电话" },
  { field: "email", header: "邮箱" },
  { field: "qq", header: "QQ" },
  { field: "wechat", header: "微信" },
];

// 控制添加队员对话框的显示
const memberDialog = ref(false);
const deleteMemberDialog = ref(false);
const deleteMembersDialog = ref(false);
type Member = {
  name: string;
  gender: string;
  grade: string;
  id: string;
  group: string;
  identity: string;
  branch: string;
  campus: string;
  major: string;
  phone: string;
  email: string;
  qq: string;
  wechat: string;
};
const member = ref<Member>({
  name: "",
  gender: "",
  grade: "",
  id: "",
  group: "",
  identity: "",
  branch: "",
  campus: "",
  major: "",
  phone: "",
  email: "",
  qq: "",
  wechat: "",
});
const submitted = ref(false);
// 全部队员数据
const members = ref([
  {
    id: "1",
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
    identity: "正式队员",
    email: "zhangsan@example.com",
  },
  {
    id: "2",
    name: "李四",
    group: "B组",
    gender: "女",
    grade: "二年级",
    major: "软件工程",
    campus: "北校区",
    phone: "987654321",
    qq: "654321",
    identity: "正式队员",
    email: "lisi@example.com",
    wechat: "lisi",
    branch: "炮兵",
  },
  {
    id: "3",
    name: "王五",
    group: "A组",
    gender: "男",
    grade: "三年级",
    major: "人工智能",
    campus: "南校区",
    identity: "正式队员",
    email: "wangwu@example.com",
    phone: "135246809",
    qq: "234567",
    wechat: "wangwu",
    branch: "特种兵",
  },
  {
    id: "4",
    name: "赵六",
    group: "B组",
    gender: "女",
    grade: "四年级",
    identity: "正式队员",
    email: "zhaoliu@example.com",
    major: "网络安全",
    campus: "北校区",
    phone: "139876543",
    qq: "765432",
    wechat: "zhaoliu",
    branch: "机械兵",
  },
  {
    id: "5",
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
    identity: "正式队员",
    email: "sunqi@example.com",
  },
  {
    id: "6",
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
    identity: "正式队员",
    email: "zhouba@example.com",
  },
  {
    id: "7",
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
    identity: "正式队员",
    email: "wujia@example.com",
  },
  {
    id: "8",
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
    identity: "正式队员",
    email: "zhengshi@example.com",
  },
  {
    id: "9",
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
    identity: "正式队员",
    email: "wangshiyi@example.com",
  },
  {
    id: "10",
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
    identity: "正式队员",
    email: "lishier@example.com",
  },
  {
    id: "11",
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
    identity: "正式队员",
    email: "qianshisan@example.com",
  },
  {
    id: "12",
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
    identity: "正式队员",
    email: "dingshisi@example.com",
  },
  {
    id: "13",
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
    identity: "正式队员",
    email: "yangshiwu@example.com",
  },
  {
    id: "14",
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
    identity: "正式队员",
    email: "wushiliu@example.com",
  },
  {
    id: "15",
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
    identity: "正式队员",
    email: "zhaoshiyi@example.com",
  },
  {
    id: "16",
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
    identity: "正式队员",
    email: "sunshiba@example.com",
  },
]);

const exportCSV = () => {
  dataTable.value.exportCSV();
};

// 搜索
const searchNames = (event: { query: string }) => {
  const query = event.query.toLowerCase();
  filteredNames.value = members.value
    .filter((member) => member.name.toLowerCase().includes(query))
    .map((member) => member.name);
};

const searchGroups = (event: { query: string }) => {
  const query = event.query.toLowerCase();
  const uniqueGroups = [
    ...new Set(members.value.map((member) => member.group)),
  ];
  filteredGroups.value = uniqueGroups.filter((group) =>
    group.toLowerCase().includes(query)
  );
};

const searchBranches = (event: { query: string }) => {
  const query = event.query.toLowerCase();
  const uniqueBranches = [
    ...new Set(members.value.map((member) => member.branch)),
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

// 显示添加队员
const openNew = () => {
  member.value = {
    name: "",
    gender: "",
    grade: "",
    id: "",
    group: "",
    identity: "",
    branch: "",
    campus: "",
    major: "",
    phone: "",
    email: "",
    qq: "",
    wechat: "",
  };
  submitted.value = false;
  memberDialog.value = true;
};

// 显示编辑队员
const editMember = (m: Member) => {
  member.value = { ...m };
  memberDialog.value = true;
};

// 显示确认删除队员
const confirmDeleteMember = (data: Member) => {
  member.value = data;
  deleteMemberDialog.value = true;
};

// 显示确认批量删除
const confirmDeleteSelected = () => {
  deleteMembersDialog.value = true;
};

// 上传图片文件
const onAdvancedUpload = () => {
  showToast("File uploaded!");
};

// 添加、编辑队员
const saveMember = () => {
  submitted.value = true;

  if (validateMember()) {
    const index = members.value.findIndex((m) => m.id === member.value.id);
    // 更新现有成员
    if (index !== -1) {
      members.value[index] = {
        ...member.value,
      };
      showToast("编辑成功！");
    } else {
      // 添加新成员
      members.value.push({ ...member.value });
      showToast("添加成功！");
    }

    memberDialog.value = false;
    member.value = {
      name: "",
      gender: "",
      grade: "",
      id: "",
      group: "",
      identity: "",
      branch: "",
      campus: "",
      major: "",
      phone: "",
      email: "",
      qq: "",
      wechat: "",
    };
  }
};

// 取消添加、编辑队员
const hideDialog = () => {
  memberDialog.value = false;
  submitted.value = false;
};

// 删除队员
const deleteMember = () => {
  members.value = members.value.filter((m) => m.id !== member.value.id);
  deleteMemberDialog.value = false;
  member.value = {
    name: "",
    gender: "",
    grade: "",
    id: "",
    group: "",
    identity: "",
    branch: "",
    campus: "",
    major: "",
    phone: "",
    email: "",
    qq: "",
    wechat: "",
  };
  showToast("删除成功！");
};

// 批量删除队员
const deleteSelectedMembers = () => {
  members.value = members.value.filter(
    (member) => !selectedMembers.value.includes(member)
  );
  deleteMembersDialog.value = false;
  selectedMembers.value = []; // 清空选中的队员
  showToast("删除成功！");
};

// 验证队员信息
const validateMember = () => {
  return (
    member.value.name?.trim() &&
    (!member.value.id || /^\d+$/.test(String(member.value.id))) &&
    (!member.value.phone ||
      (member.value.phone.length === 9 && /^\d+$/.test(member.value.phone))) &&
    (!member.value.email ||
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.value.email)) &&
    (!member.value.qq || /^\d+$/.test(member.value.qq))
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
