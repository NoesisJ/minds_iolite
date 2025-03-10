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
            <label for="nickname" class="block font-bold mb-3">姓名</label>
            <InputText
              id="nickname"
              v-model.trim="member.nickname"
              required="true"
              autofocus
              :invalid="submitted && !member.nickname"
              fluid
            />
            <small v-if="submitted && !member.nickname" class="text-red-500"
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
                v-model="member.sex"
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
                v-model="member.age"
                :options="years"
                optionLabel="name"
                optionValue="name"
                placeholder="年龄"
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
                v-model="member.jlugroup"
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
                v-model="member.subjects"
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
                v-model="member.school"
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
                v-model="member.study"
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
          >您确定要删除<b>{{ member.nickname }}</b
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
    <div class="contentPerson w-full overflow-auto scrollbar-hide">
      <Table
        ref="dataTable"
        :data="finalFilteredMembers"
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
import { ref, computed, onMounted } from "vue";
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
import { dataApi, type DataItem } from "../api/data";

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
const selectedMembers = ref<DataItem[]>([]);

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
  { field: "nickname", header: "姓名", sortable: true, frozen: true },
  { field: "sex", header: "性别" },
  { field: "age", header: "年龄" },
  { field: "id", header: "ID" },
  { field: "jlugroup", header: "组别" },
  { field: "identity", header: "身份" },
  { field: "subjects", header: "专业" },
  { field: "school", header: "校区" },
  { field: "study", header: "学习" },
  { field: "phone", header: "电话" },
  { field: "email", header: "邮箱" },
  { field: "qq", header: "QQ" },
  { field: "wechat", header: "微信" },
];

// 控制添加队员对话框的显示
const memberDialog = ref(false);
const deleteMemberDialog = ref(false);
const deleteMembersDialog = ref(false);
const member = ref<DataItem>({
  id: 0,
  nickname: "",
  sex: "",
  age: "",
  jlugroup: "",
  identity: "",
  study: "",
  school: "",
  subjects: "",
  phone: "",
  email: "",
  qq: "",
  wechat: "",
});
const submitted = ref(false);
const members = ref<DataItem[]>([]);

onMounted(async () => {
  try {
    members.value = await dataApi.getAllData();
  } catch (error) {
    showToast("获取数据失败");
  }
});

const exportCSV = async () => {
  try {
    // 获取所有数据并手动创建CSV内容
    const data = await dataApi.getAllData();
    // 这里可以添加将数据转换为CSV的逻辑
    // 例如使用第三方库或手动构建CSV字符串
    // 然后创建blob对象
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    // ...保持原有下载逻辑不变
  } catch (error) {
    showToast("导出失败，请重试");
  }
};

// 辅助函数：将数据转换为CSV格式
const convertToCSV = (data: DataItem[]) => {
  // 定义CSV的表头
  const header = [
    "ID",
    "姓名",
    "性别",
    "年龄",
    "组别",
    "身份",
    "学习",
    "学校",
    "专业",
    "电话",
    "邮箱",
    "QQ",
    "微信",
  ];
  // 将表头转换为CSV行
  const csvRows = [header.join(",")];

  // 将每条数据转换为CSV行
  for (const item of data) {
    const values = [
      item.id,
      item.nickname,
      item.sex,
      item.age,
      item.jlugroup,
      item.identity,
      item.study,
      item.school,
      item.subjects,
      item.phone,
      item.email,
      item.qq,
      item.wechat,
    ];
    // 处理可能包含逗号的值
    const escapedValues = values.map((value) =>
      typeof value === "string" && value.includes(",") ? `"${value}"` : value
    );
    csvRows.push(escapedValues.join(","));
  }

  return csvRows.join("\n");
};

// 搜索
const searchNames = async (event: { query: string }) => {
  try {
    // 获取所有数据并在前端进行过滤
    const allData = await dataApi.getAllData();
    const query = event.query.toLowerCase();
    filteredNames.value = allData
      .filter((item) => item.nickname.toLowerCase().includes(query))
      .map((item) => item.nickname);
  } catch (error) {
    filteredNames.value = [];
  }
};

const searchGroups = (event: { query: string }) => {
  const query = event.query.toLowerCase();
  // 只更新建议列表
  const uniqueGroups = [
    ...new Set(members.value.map((member) => member.jlugroup)),
  ];
  filteredGroups.value = uniqueGroups.filter((group) =>
    group.toLowerCase().includes(query)
  );
};

const searchBranches = (event: { query: string }) => {
  const query = event.query.toLowerCase();
  // 只更新建议列表
  const uniqueBranches = [
    ...new Set(members.value.map((member) => member.subjects)),
  ];
  filteredBranches.value = uniqueBranches.filter((branch) =>
    branch.toLowerCase().includes(query)
  );
};
const finalFilteredMembers = computed(() => {
  let result = [...members.value];

  // 按姓名过滤
  if (nameValue.value) {
    result = result.filter((member) =>
      member.nickname.toLowerCase().includes(nameValue.value.toLowerCase())
    );
  }

  // 按组别过滤
  if (groupValue.value) {
    result = result.filter((member) =>
      member.jlugroup.toLowerCase().includes(groupValue.value.toLowerCase())
    );
  }

  // 按兵种过滤
  if (branchValue.value) {
    result = result.filter((member) =>
      member.subjects.toLowerCase().includes(branchValue.value.toLowerCase())
    );
  }

  return result;
});

// 过滤值
const filters = computed(() => ({
  nickname: nameValue.value,
  jlugroup: groupValue.value,
  subjects: branchValue.value,
}));

// 显示添加队员
const openNew = () => {
  member.value = {
    id: 0,
    nickname: "",
    sex: "",
    age: "",
    jlugroup: "",
    identity: "",
    study: "",
    school: "",
    subjects: "",
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
const saveMember = async () => {
  submitted.value = true;

  if (validateMember()) {
    try {
      if (member.value.id) {
        await dataApi.updateData(member.value.id, member.value);
        // 更新本地数据
        const index = members.value.findIndex((m) => m.id === member.value.id);
        if (index !== -1) {
          members.value[index] = { ...member.value };
        }
        showToast("编辑成功！");
      } else {
        // 创建新成员时，需要排除id字段
        const { id, ...dataToCreate } = member.value;
        const newMember = await dataApi.createData(dataToCreate);
        members.value.push(newMember);
        showToast("添加成功！");
      }
      memberDialog.value = false;
    } catch (error) {
      showToast("操作失败，请重试");
    }
  }
};

// 取消添加、编辑队员
const hideDialog = () => {
  memberDialog.value = false;
  submitted.value = false;
};

// 删除队员
const deleteMember = async () => {
  try {
    if (member.value.id) {
      await dataApi.deleteData(member.value.id);
      members.value = members.value.filter((m) => m.id !== member.value.id);
      deleteMemberDialog.value = false;
      showToast("删除成功！");
    }
  } catch (error) {
    showToast("删除失败，请重试");
  }
};

// 批量删除队员
const deleteSelectedMembers = async () => {
  try {
    const ids = selectedMembers.value
      .map((m) => m.id)
      .filter(Boolean) as number[];

    // 由于dataApi没有批量删除方法，使用循环逐个删除
    for (const id of ids) {
      await dataApi.deleteData(id);
    }

    members.value = members.value.filter((m) => !ids.includes(m.id));
    deleteMembersDialog.value = false;
    showToast("批量删除成功！");
  } catch (error) {
    showToast("批量删除失败，请重试");
  }
};

// 验证队员信息
const validateMember = () => {
  return (
    member.value.nickname?.trim() &&
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
