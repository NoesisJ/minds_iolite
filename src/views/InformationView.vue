<template>
  <div class="h-full w-full flex flex-col gap-2">
    <Toast ref="toast" />
    <!-- Header -->
    <HeaderComponent
      :members="members"
      :selectedMembers="selectedMembers"
      @openNew="openNew"
      @confirmDeleteSelected="confirmDeleteSelected"
    />

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
                :value="String(member.id)"
                :invalid="
                  submitted && !!member.id && !/^\d+$/.test(String(member.id))
                "
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

    <!-- 确认删除对话框 -->
    <DeleteDialog
      v-model:visible="deleteMemberDialog"
      :message="`您确定要删除 ${selectedMember?.nickname} 吗？`"
      @confirm="deleteMember"
    />
    <DeleteDialog
      v-model:visible="deleteMembersDialog"
      message="您确定要删除选中的项吗？"
      @confirm="deleteSelectedMembers"
    />

    <!-- 信息表格 -->
    <div
      class="contentPerson w-full h-[calc(100%-3rem)] overflow-auto scrollbar-hide"
    >
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
import Table from "@/components/Table.vue";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import Toast from "@/components/ui/Toast.vue";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import FileUpload from "primevue/fileupload";
import DeleteDialog from "@/components/information/DeleteDialog.vue";
import { dataApi } from "@/api/data";
import { DataItem } from "@/types/information";
import HeaderComponent from "@/components/information/HeaderComponent.vue";

const toast = ref<InstanceType<typeof Toast> | null>(null);

// Data
const members = ref<DataItem[]>([]);
const selectedMembers = ref<DataItem[]>([]);
const selectedMember = ref<DataItem | null>(null);

// Dialog visibility
const memberDialog = ref(false);
const deleteMemberDialog = ref(false);
const deleteMembersDialog = ref(false);

const dataTable = ref();

// 搜索值
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

onMounted(async () => {
  try {
    members.value = await dataApi.getAllData();
  } catch (error) {
    toast.value?.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to fetch members.",
    });
  }
});

// Filtered members based on search
const finalFilteredMembers = computed(() => {
  return members.value.filter((member) => {
    const nameMatch = member.nickname
      .toLowerCase()
      .includes(nameValue.value.toLowerCase());
    const groupMatch = member.jlugroup
      .toLowerCase()
      .includes(groupValue.value.toLowerCase());
    const branchMatch = member.subjects
      .toLowerCase()
      .includes(branchValue.value.toLowerCase());
    return nameMatch && groupMatch && branchMatch;
  });
});

// 过滤值
const filters = computed(() => ({
  nickname: nameValue.value,
  jlugroup: groupValue.value,
  subjects: branchValue.value,
}));

// 显示添加队员
const openNew = () => {
  selectedMember.value = {
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
  memberDialog.value = true;
};

// 显示编辑队员
const editMember = (member: DataItem) => {
  selectedMember.value = { ...member };
  memberDialog.value = true;
};

// Confirm delete member
const confirmDeleteMember = (member: DataItem) => {
  selectedMember.value = member;
  deleteMemberDialog.value = true;
};

// Confirm delete selected members
const confirmDeleteSelected = () => {
  if (selectedMembers.value.length > 0) {
    deleteMembersDialog.value = true;
  }
};

// 上传图片文件
const onAdvancedUpload = () => {
  toast.value?.add({
    severity: "success",
    summary: "Success",
    detail: "File Uploaded",
  });
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
        toast.value?.add({
          severity: "success",
          summary: "Success",
          detail: "Member updated.",
        });
      } else {
        // 创建新成员时，需要排除id字段
        const { id, ...dataToCreate } = member.value;
        const newMember = await dataApi.createData(dataToCreate);
        members.value.push(newMember);
        toast.value?.add({
          severity: "success",
          summary: "Success",
          detail: "Member created.",
        });
      }
      memberDialog.value = false;
    } catch (error) {
      toast.value?.add({
        severity: "error",
        summary: "Error",
        detail: "Failed to save member.",
      });
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
    if (selectedMember.value?.id) {
      await dataApi.deleteData(selectedMember.value.id);
      members.value = members.value.filter(
        (m) => m.id !== selectedMember.value?.id
      );
      deleteMemberDialog.value = false;
      toast.value?.add({
        severity: "success",
        summary: "Success",
        detail: "Member deleted.",
      });
    }
  } catch (error) {
    deleteMembersDialog.value = false;
    toast.value?.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to delete member.",
    });
  }
};

// 批量删除队员
const deleteSelectedMembers = async () => {
  try {
    const ids = selectedMembers.value
      .map((m) => m.id)
      .filter(Boolean) as number[];

    // 由于dataApi没有批量删除方法，使用循环逐个删除
    for (const id of ids) await dataApi.deleteData(id);

    members.value = members.value.filter((m) => !ids.includes(m.id));
    deleteMembersDialog.value = false;
    toast.value?.add({
      severity: "success",
      summary: "Success",
      detail: "Selected members deleted.",
    });
  } catch (error) {
    deleteMembersDialog.value = false;
    toast.value?.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to delete selected members.",
    });
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
</script>

<style scoped>
.p-fileupload {
  width: 30rem;
  overflow: hidden;
}
</style>
