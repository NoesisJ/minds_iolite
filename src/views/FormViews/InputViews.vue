<template>
  <div>
    <div class="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 默认输入框 -->
      <base-card>
        <template #header>默认输入框</template>
        <div class="space-y-4 pt-2">
          <base-input placeholder="项目名称" />

          <div class="grid grid-cols-2 gap-4">
            <base-input placeholder="姓" />
            <base-input placeholder="名" />
          </div>

          <base-input type="password" placeholder="密码" />
          <base-input shape="rectangle" placeholder="矩形边框" />
          <base-input shape="semi-round" placeholder="半圆角边框" />
          <base-input shape="round" placeholder="圆角边框" />
          <base-input placeholder="禁用输入框" disabled />
          <base-textarea shape="round" placeholder="文本区域" />
          <base-input size="small" placeholder="小尺寸输入框" />
          <base-input placeholder="中尺寸输入框" />
          <base-input size="large" placeholder="大尺寸输入框" />
        </div>
      </base-card>

      <div class="space-y-6">
        <!-- 选择框 -->
        <base-card>
          <template #header>选择框</template>
          <div class="pt-2">
            <base-select
              v-model="selectedOption"
              :options="[
                { value: '1', label: '选项 1' },
                { value: '2', label: '选项 2' },
              ]"
            />
          </div>
        </base-card>

        <!-- 验证状态 -->
        <base-card>
          <template #header>验证状态</template>
          <div class="space-y-4 pt-2">
            <base-input
              status="info"
              placeholder="信息输入框"
              value="带有信息状态的输入"
            />
            <base-input
              status="success"
              placeholder="成功输入框"
              value="带有成功状态的输入"
            />
            <base-input
              status="warning"
              placeholder="警告输入框"
              value="带有警告状态的输入"
            />
            <base-input
              status="danger"
              placeholder="错误输入框"
              value="带有错误状态的输入"
            />
            <base-input
              status="primary"
              placeholder="主色输入框"
              value="带有主色状态的输入"
            />

            <div class="flex flex-wrap gap-4 pt-2">
              <base-checkbox v-model="checkSuccess" status="success"
                >成功复选框</base-checkbox
              >
              <base-checkbox v-model="checkWarning" status="warning"
                >警告复选框</base-checkbox
              >
              <base-checkbox v-model="checkDanger" status="danger"
                >错误复选框</base-checkbox
              >
            </div>
          </div>
        </base-card>

        <!-- 复选框和单选框 -->
        <base-card>
          <template #header>复选框和单选框</template>
          <div class="p-4">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="space-y-2">
                <base-checkbox v-model="checkbox1">复选框 1</base-checkbox>
                <base-checkbox v-model="checkbox2">复选框 2</base-checkbox>
              </div>
              <div class="space-y-2">
                <base-radio
                  v-model="radioValue"
                  value="This is value 1"
                  name="radioGroup"
                  >单选框 1</base-radio
                >
                <base-radio
                  v-model="radioValue"
                  value="This is value 2"
                  name="radioGroup"
                  >单选框 2</base-radio
                >
                <base-radio
                  v-model="radioValue"
                  value="This is value 3"
                  name="radioGroup"
                  >单选框 3</base-radio
                >
              </div>
              <div class="space-y-2">
                <base-checkbox disabled>禁用复选框</base-checkbox>
                <base-radio
                  v-model="disabledRadio"
                  value="Disabled Value"
                  disabled
                  name="disabledRadio"
                >
                  禁用单选框
                </base-radio>
              </div>
            </div>
          </div>
        </base-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import BaseInput from "@/components/Form/Inputs/BaseInput.vue";
import BaseTextarea from "@/components/Form/Inputs/BaseTextarea.vue";
import BaseSelect from "@/components/Form/Inputs/BaseSelect.vue";
import BaseCheckbox from "@/components/Form/Inputs/BaseCheckbox.vue";
import BaseRadio from "@/components/Form/Inputs/BaseRadio.vue";
import BaseCard from "@/components/Form/Inputs/BaseCard.vue";

// 表单状态
const selectedOption = ref("1");
const checkSuccess = ref(true);
const checkWarning = ref(true);
const checkDanger = ref(true);
const checkbox1 = ref(false);
const checkbox2 = ref(true);
const radioValue = ref("This is value 2");
const disabledRadio = ref("");
</script>
