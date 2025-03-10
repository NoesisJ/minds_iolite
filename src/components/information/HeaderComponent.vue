<template>
  <div class="header w-full h-[3rem] px-1 flex justify-between items-center">
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
        @click="exportCSV"
      />
      <Button
        icon="pi pi-plus"
        label="添加"
        severity="help"
        class="header-button"
        raised
        @click="$emit('openNew')"
      />
      <Button
        icon="pi pi-trash"
        label="删除"
        severity="danger"
        class="header-button"
        outlined
        raised
        @click="$emit('confirmDeleteSelected')"
        :disabled="!selectedMembers || !selectedMembers.length"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import AutoComplete from "primevue/autocomplete";
import Button from "primevue/button";
import { DataItem } from "@/types/information";
import Toast from "@/components/ui/Toast.vue";

const toast = ref<InstanceType<typeof Toast> | null>(null);

const props = defineProps<{
  members: DataItem[];
  selectedMembers: DataItem[];
}>();

const nameValue = ref("");
const groupValue = ref("");
const branchValue = ref("");
const filteredNames = ref<string[]>([]);
const filteredGroups = ref<string[]>([]);
const filteredBranches = ref<string[]>([]);

const members = ref(props.members);

watch(
  () => props.members,
  (newVal) => {
    members.value = newVal;
  }
);

const searchNames = async (event: { query: string }) => {
  try {
    const query = event.query.toLowerCase();
    // 只更新建议列表
    filteredNames.value = members.value
      .map((member) => member.nickname)
      .filter((name) => name.toLowerCase().includes(query));
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

const exportCSV = async () => {
  try {
    const csvContent = convertToCSV(members.value);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "members.csv";
    link.click();
    toast.value?.add({
      severity: "success",
      summary: "Success",
      detail: "Data exported successfully.",
      life: 3000,
    });
  } catch (error) {
    toast.value?.add({
      severity: "error",
      summary: "Error",
      detail: "Failed to export data.",
      life: 3000,
    });
  }
};

// 将数据转换为 CSV 格式
const convertToCSV = (data: DataItem[]) => {
  const header = Object.keys(data[0]).join(",");
  const rows = data.map((item) => Object.values(item).join(","));
  return [header, ...rows].join("\n");
};
</script>

<style scoped>
:root {
  --p-inputtext-background: #f3f4f6;
}

.header-button {
  height: 2.2rem;
  width: 6rem;
  font-size: 1rem;
  font-weight: 900;
  margin-right: 0.5rem;
}

.p-inputtext {
  background: var(--p-inputtext-background);
}
</style>
