<template>
  <div class="p-4">
    <div class="space-y-6">
      <!-- Hero Buttons -->
      <base-card>
        <template #header>突出按钮</template>
        <div class="p-4">
          <div class="flex flex-wrap gap-2">
            <base-button 
              v-for="status in statuses" 
              :key="status" 
              :status="status" 
              hero
            >
              {{ status }}
            </base-button>
            <base-button hero disabled>禁用</base-button>
          </div>
        </div>
      </base-card>

      <!-- Default Buttons -->
      <base-card>
        <template #header>默认按钮</template>
        <div class="p-4">
          <div class="flex flex-wrap gap-2">
            <base-button 
              v-for="status in statuses" 
              :key="status" 
              :status="status"
            >
              {{ status }}
            </base-button>
            <base-button disabled>禁用</base-button>
          </div>
        </div>
      </base-card>

      <!-- Outline Buttons -->
      <base-card>
        <template #header>轮廓按钮</template>
        <div class="p-4">
          <div class="flex flex-wrap gap-2">
            <base-button 
              v-for="status in statuses" 
              :key="status" 
              :status="status" 
              outline
            >
              {{ status }}
            </base-button>
            <base-button outline disabled>禁用</base-button>
          </div>
        </div>
      </base-card>

      <!-- Ghost Buttons -->
      <base-card>
        <template #header>幽灵按钮</template>
        <div class="p-4">
          <div class="flex flex-wrap gap-2">
            <base-button 
              v-for="status in statuses" 
              :key="status" 
              :status="status" 
              ghost
            >
              {{ status }}
            </base-button>
            <base-button ghost disabled>禁用</base-button>
          </div>
        </div>
      </base-card>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Button Shapes -->
        <base-card>
          <template #header>按钮形状</template>
          <div class="p-4">
            <div class="flex flex-wrap gap-2">
              <base-button 
                v-for="shape in shapes" 
                :key="shape" 
                :shape="shape"
              >
                {{ shape }}
              </base-button>
            </div>
          </div>
        </base-card>

        <!-- Button Sizes -->
        <base-card>
          <template #header>按钮大小</template>
          <div class="p-4">
            <div class="flex flex-wrap gap-2 items-center">
              <base-button 
                v-for="size in sizes" 
                :key="size" 
                :size="size"
              >
                {{ size }}
              </base-button>
            </div>
          </div>
        </base-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BaseButton from '@/components/Form/Buttons/BaseButton.vue';
import BaseCard from '@/components/Form/Inputs/BaseCard.vue';

// 按钮状态
const statuses = ['primary', 'success', 'info', 'warning', 'danger'];

// 按钮形状
const shapes = ['rectangle', 'semi-round', 'round'];

// 按钮大小
const sizes = ['small', 'medium', 'large'];
</script> 