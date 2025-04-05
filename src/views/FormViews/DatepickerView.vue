<template>
  <div class="p-4">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 普通日期选择器 -->
      <base-card>
        <template #header>普通日期选择器</template>
        <div class="p-4">
          <base-datepicker v-model="selectedDate" placeholder="选择日期" />
        </div>
      </base-card>

      <!-- 范围日期选择器 -->
      <base-card>
        <template #header>日期范围选择器</template>
        <div class="p-4">
          <div class="flex gap-2">
            <base-datepicker
              v-model="startDate"
              placeholder="开始日期"
              :max="endDate"
            />
            <base-datepicker
              v-model="endDate"
              placeholder="结束日期"
              :min="startDate"
            />
          </div>
        </div>
      </base-card>

      <!-- 有最小和最大值的日期选择器 -->
      <base-card>
        <template #header>限制选择范围</template>
        <div class="p-4">
          <base-datepicker
            v-model="limitedDate"
            placeholder="限制范围"
            :min="minDate"
            :max="maxDate"
          />
          <div class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            只能选择前后5天以内的日期
          </div>
        </div>
      </base-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import BaseDatepicker from "@/components/Form/Datepicker/BaseDatepicker.vue";
import BaseCard from "@/components/Form/Inputs/BaseCard.vue";

// 普通选择器
const selectedDate = ref(new Date());

// 范围选择器
const startDate = ref(new Date());
const endDate = ref(null);

// 限制范围选择器
const today = new Date();
const minDate = new Date(today);
minDate.setDate(today.getDate() - 5);
const maxDate = new Date(today);
maxDate.setDate(today.getDate() + 5);
const limitedDate = ref(new Date());
</script>
