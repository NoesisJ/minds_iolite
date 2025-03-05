<!-- FormDialog.vue -->
<template>
  <Dialog
    v-model:visible="visible"
    :style="{ width: '800px' }"
    :header="header"
    :modal="true"
  >
    <div class="flex flex-row gap-4">
      <div class="min-w-[350px] flex flex-col gap-6">
        <!-- 固定的名称输入框 -->
        <div>
          <label for="name" class="block font-bold mb-3">姓名</label>
          <InputText
            id="name"
            v-model.trim="formData.name"
            required="true"
            autofocus
            :invalid="submitted && !formData.name"
          />
          <small v-if="submitted && !formData.name" class="text-red-500">
            Name is required.
          </small>
        </div>

        <!-- 动态生成的表单项 -->
        <div class="card grid grid-cols-1 md:grid-cols-2 gap-4">
          <template v-for="field in formFields" :key="field.key">
            <InputGroup>
              <InputGroupAddon>
                <i :class="field.icon"></i>
              </InputGroupAddon>
              <component
                :is="field.component"
                v-model="formData[field.key]"
                v-bind="field.props || {}"
                :invalid="getFieldValidation(field)"
              />
            </InputGroup>
          </template>
        </div>
      </div>

      <!-- 可选的文件上传区域 -->
      <FileUpload
        v-if="showUpload"
        name="demo[]"
        url="/api/upload"
        @upload="onUpload"
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

    <!-- 固定的底部按钮 -->
    <template #footer>
      <Button
        label="取消"
        icon="pi pi-times"
        severity="info"
        text
        @click="onCancel"
      />
      <Button
        label="确认"
        icon="pi pi-check"
        severity="help"
        :loading="isSubmitting"
        @click="onSubmit"
      />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
// import Select from "primevue/select";
import FileUpload from "primevue/fileupload";

// 字段配置接口
interface FieldConfig {
  key: string;
  icon: string;
  component: "InputText" | "Select";
  props?: Record<string, any>;
  validation?: (value: any, submitted: boolean) => boolean;
}

// Props 定义
interface Props {
  modelValue: boolean;
  header: string;
  formData: Record<string, any>;
  formFields: FieldConfig[];
  showUpload?: boolean;
  validate?: (data: Record<string, any>) => boolean | Promise<boolean>;
}

const props = withDefaults(defineProps<Props>(), {
  showUpload: false,
});

// Emits
const emit = defineEmits<{
  "update:modelValue": [value: boolean];
  "update:formData": [value: Record<string, any>];
  submit: [data: Record<string, any>];
  cancel: [];
  upload: [files: File[]];
}>();

// 计算属性
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

// 状态
const submitted = ref(false);
const isSubmitting = ref(false);
const formData = ref(props.formData);

// 字段验证
const getFieldValidation = (field: FieldConfig) => {
  if (!submitted.value) return false;
  if (!field.validation) return false;
  return !field.validation(formData.value[field.key], submitted.value);
};

// 方法
const onSubmit = async () => {
  submitted.value = true;
  isSubmitting.value = true;

  try {
    // 如果有传入验证函数则使用
    const isValid = props.validate
      ? await props.validate(formData.value)
      : true;

    if (isValid) {
      emit("submit", formData.value);
      onCancel();
    }
  } finally {
    isSubmitting.value = false;
  }
};

const onCancel = () => {
  submitted.value = false;
  emit("cancel");
  visible.value = false;
};

const onUpload = (event: any) => {
  emit("upload", event.files);
};

// 监听外部formData变化
watch(
  () => props.formData,
  (newValue) => {
    formData.value = { ...newValue };
  },
  { deep: true }
);

// 暴露方法给父组件
defineExpose({
  onSubmit,
  onCancel,
});
</script>

<style scoped>
.p-dialog {
  --p-dialog-background: #f8f8fa;
}
</style>
