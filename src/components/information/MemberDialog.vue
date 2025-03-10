<template>
  <Dialog
    v-model:visible="visible"
    :style="{ width: '800px' }"
    header="添加队员"
    :modal="true"
  >
    <div class="flex flex-row gap-4">
      <div class="min-w-[350px] flex flex-col gap-6">
        <!-- 表单内容 -->
      </div>
      <FileUpload
        name="demo[]"
        url="/api/upload"
        @upload="onAdvancedUpload"
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
</template>

<script setup lang="ts">
import { ref } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import FileUpload from "primevue/fileupload";

const visible = ref(false);
const member = ref({});

const emit = defineEmits(["saveMember", "hideDialog"]);

const saveMember = () => {
  emit("saveMember", member.value);
};

const hideDialog = () => {
  emit("hideDialog");
};

const onAdvancedUpload = () => {
  // 上传逻辑
};
</script>
