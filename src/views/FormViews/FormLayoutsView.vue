<template>
  <div class="p-4">
    <!-- 内联表单 -->
    <div class="mb-6">
      <base-card>
        <template #header>内联表单</template>
        <div class="p-4">
          <form class="flex flex-wrap gap-4 items-center">
            <base-input placeholder="姓名" class="flex-1 min-w-[200px]" />
            <base-input placeholder="邮箱" class="flex-1 min-w-[200px]" />
            <base-checkbox v-model="rememberMe">记住我</base-checkbox>
            <base-button status="primary">提交</base-button>
          </form>
        </div>
      </base-card>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 网格表单 -->
      <base-card>
        <template #header>使用网格</template>
        <div class="p-4">
          <form>
            <div class="mb-4 grid grid-cols-12 items-center">
              <label for="inputEmail1" class="col-span-3 text-sm font-medium"
                >邮箱</label
              >
              <div class="col-span-9">
                <base-input id="inputEmail1" placeholder="邮箱" />
              </div>
            </div>
            <div class="mb-4 grid grid-cols-12 items-center">
              <label for="inputPassword2" class="col-span-3 text-sm font-medium"
                >密码</label
              >
              <div class="col-span-9">
                <base-input
                  id="inputPassword2"
                  type="password"
                  placeholder="密码"
                />
              </div>
            </div>
            <div class="mb-4 grid grid-cols-12 items-center">
              <label class="col-span-3 text-sm font-medium">单选框</label>
              <div class="col-span-9 space-y-2">
                <base-radio
                  v-model="radioOption"
                  value="option1"
                  name="gridRadios"
                  >选项 1</base-radio
                >
                <base-radio
                  v-model="radioOption"
                  value="option2"
                  name="gridRadios"
                  >选项 2</base-radio
                >
                <base-radio
                  v-model="radioOption"
                  value="option3"
                  name="gridRadios"
                  disabled
                  >禁用选项</base-radio
                >
              </div>
            </div>
            <div class="grid grid-cols-12">
              <div class="col-start-4 col-span-9">
                <base-button status="primary">登录</base-button>
              </div>
            </div>
          </form>
        </div>
      </base-card>

      <!-- 无标签表单 -->
      <base-card>
        <template #header>无标签表单</template>
        <div class="p-4">
          <form>
            <div class="mb-4">
              <base-input placeholder="收件人" />
            </div>
            <div class="mb-4">
              <base-input placeholder="主题" />
            </div>
            <div class="mb-4">
              <base-textarea placeholder="消息内容" rows="5" />
            </div>
            <div>
              <base-button status="success">发送</base-button>
            </div>
          </form>
        </div>
      </base-card>
    </div>

    <!-- 水平表单 -->
    <div class="mt-6">
      <base-card>
        <template #header>水平表单</template>
        <div class="p-4">
          <form>
            <div class="mb-4 grid grid-cols-12 items-center">
              <label for="inputEmail3" class="col-span-2 text-sm font-medium"
                >邮箱</label
              >
              <div class="col-span-10">
                <base-input id="inputEmail3" placeholder="邮箱" />
              </div>
            </div>
            <div class="mb-4 grid grid-cols-12 items-center">
              <label for="inputPassword3" class="col-span-2 text-sm font-medium"
                >密码</label
              >
              <div class="col-span-10">
                <base-input
                  id="inputPassword3"
                  type="password"
                  placeholder="密码"
                />
              </div>
            </div>
            <div class="mb-4 grid grid-cols-12">
              <div class="col-start-3 col-span-10">
                <base-checkbox v-model="rememberMe2">记住我</base-checkbox>
              </div>
            </div>
            <div class="grid grid-cols-12">
              <div class="col-start-3 col-span-10">
                <base-button status="warning">登录</base-button>
              </div>
            </div>
          </form>
        </div>
      </base-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import BaseInput from "@/components/Form/Inputs/BaseInput.vue";
import BaseTextarea from "@/components/Form/Inputs/BaseTextarea.vue";
import BaseCheckbox from "@/components/Form/Inputs/BaseCheckbox.vue";
import BaseRadio from "@/components/Form/Inputs/BaseRadio.vue";
import BaseButton from "@/components/Form/Buttons/BaseButton.vue";
import BaseCard from "@/components/Form/Inputs/BaseCard.vue";

const rememberMe = ref(false);
const rememberMe2 = ref(false);
const radioOption = ref("option1");
</script>
