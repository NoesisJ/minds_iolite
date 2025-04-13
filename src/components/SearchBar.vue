<template>
  <div class="search-bar">
    <div class="flex items-center gap-2">
      <div v-for="(field, index) in fields" :key="index" class="search-field">
        <AutoComplete
          v-model="values[index]"
          :suggestions="suggestions[index]"
          @complete="(e) => searchItems(e, index, field)"
          :placeholder="field.placeholder || `搜索${field.label}`"
          class="w-full"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch, computed } from "vue";
import AutoComplete from "primevue/autocomplete";

const props = defineProps({
  // 搜索字段配置
  fields: {
    type: Array,
    required: true,
    // 字段格式: [{ field: 'name', label: '姓名', placeholder: '请输入姓名' }]
  },
  // 数据源
  data: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["search", "update:filteredData"]);

// 搜索值和建议数据
const values = ref(Array(props.fields.length).fill(""));
const suggestions = ref(Array(props.fields.length).fill([]));

// 搜索处理函数
const searchItems = (event, index, fieldConfig) => {
  const query = event.query.toLowerCase();
  const field = fieldConfig.field;

  // 更新建议列表
  const uniqueValues = [...new Set(props.data.map((item) => item[field]))];
  suggestions.value[index] = uniqueValues.filter((value) =>
    value?.toString().toLowerCase().includes(query)
  );

  // 触发搜索事件
  emit("search", {
    field: field,
    value: query,
    index: index,
  });

  // 更新过滤后的数据
  updateFilteredData();
};

// 监听搜索值变化
watch(
  values,
  () => {
    updateFilteredData();
  },
  { deep: true }
);

// 更新过滤后的数据
const updateFilteredData = () => {
  let filteredData = [...props.data];

  // 应用每个搜索条件
  values.value.forEach((value, index) => {
    if (value) {
      const field = props.fields[index].field;
      filteredData = filteredData.filter((item) =>
        item[field]?.toString().toLowerCase().includes(value.toLowerCase())
      );
    }
  });

  // 发送过滤后的数据
  emit("update:filteredData", filteredData);
};

// 暴露重置方法
const reset = () => {
  values.value = Array(props.fields.length).fill("");
};

defineExpose({
  reset,
});
</script>

<style scoped>
.search-bar {
  margin-bottom: 1rem;
}

.search-field {
  min-width: 200px;
}

:deep(.p-autocomplete-input) {
  border-radius: 4px;
  border: 1px solid var(--material-item-border);
  padding: 0.5rem 0.75rem;
  background: var(--material-bg-dark);
  width: 100%;
  transition: all 0.3s ease;
}

:deep(.p-autocomplete-input:hover) {
  border-color: #a16eff;
}

:deep(.p-autocomplete-input:focus) {
  border-color: #a16eff;
  box-shadow: 0 0 0 2px rgba(161, 110, 255, 0.2);
}

:global(.dark) :deep(.p-autocomplete-input) {
  background: #1e1e2d;
  border-color: #36394a;
  color: #e5e7eb;
}
</style>
