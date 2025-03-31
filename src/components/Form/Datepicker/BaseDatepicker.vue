<template>
  <div class="relative datepicker-container" ref="pickerContainerRef">
    <input
      :value="displayValue"
      type="text"
      readonly
      :placeholder="placeholder"
      :disabled="disabled"
      @click="togglePicker"
      :class="[
        'w-full transition-colors outline-none cursor-pointer',
        'bg-white dark:bg-gray-700 border dark:border-gray-600',
        'text-gray-900 dark:text-gray-100',
        getShapeClasses(),
        getSizeClasses(),
        getStatusClasses(),
        disabled ? 'opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-800' : ''
      ]"
    />
    
    <div class="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>
    
    <!-- 日期选择面板 - 使用传送门 -->
    <teleport to="body">
      <div 
        v-if="showPicker" 
        class="fixed calendar-popup bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-4 w-64 z-50"
        :style="popupStyle"
        ref="calendarRef"
      >
        <div class="flex justify-between items-center mb-2">
          <button @click="prevMonth" class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span class="font-medium text-sm">{{ currentMonthName }} {{ currentYear }}</span>
          <button @click="nextMonth" class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <!-- 星期标题 -->
        <div class="grid grid-cols-7 gap-1 mb-1">
          <div v-for="day in weekdays" :key="day" class="text-center text-xs text-gray-500 font-medium">
            {{ day }}
          </div>
        </div>
        
        <!-- 日期 -->
        <div class="grid grid-cols-7 gap-1">
          <button
            v-for="(day, index) in days"
            :key="index"
            @click="selectDate(day)"
            :disabled="isDisabled(day)"
            :class="[
              'h-8 w-8 rounded-full flex items-center justify-center text-sm',
              day.currentMonth ? 'hover:bg-gray-100 dark:hover:bg-gray-700' : 'text-gray-400 dark:text-gray-600',
              isSelected(day) ? 'bg-blue-500 text-white hover:bg-blue-600' : '',
              isToday(day) && !isSelected(day) ? 'border border-blue-500 text-blue-500' : '',
              isDisabled(day) ? 'opacity-50 cursor-not-allowed' : ''
            ]"
          >
            {{ day.day }}
          </button>
        </div>
        
        <div class="mt-2 flex justify-between">
          <button @click="selectToday" class="text-sm px-2 py-1 text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
            今天
          </button>
          <div>
            <button @click="cancelPicker" class="text-sm px-2 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded mr-2">
              取消
            </button>
            <button @click="applyPicker" class="text-sm px-2 py-1 bg-blue-500 text-white hover:bg-blue-600 rounded">
              确定
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';

const props = defineProps({
  modelValue: {
    type: Date,
    default: null
  },
  placeholder: {
    type: String,
    default: '选择日期'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  min: {
    type: Date,
    default: null
  },
  max: {
    type: Date,
    default: null
  },
  shape: {
    type: String,
    default: 'semi-round',
    validator: (val) => ['rectangle', 'semi-round', 'round'].includes(val)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (val) => ['small', 'medium', 'large'].includes(val)
  },
  status: {
    type: String,
    default: '',
    validator: (val) => ['', 'primary', 'info', 'success', 'warning', 'danger'].includes(val)
  }
});

const emit = defineEmits(['update:modelValue']);

// 状态变量
const showPicker = ref(false);
const selectedDate = ref(props.modelValue ? new Date(props.modelValue) : null);
const tempSelectedDate = ref(selectedDate.value ? new Date(selectedDate.value) : null);
const currentDate = ref(new Date());
const days = ref([]);
const popupStyle = ref({});
const pickerRef = ref(null);

// 星期几标题
const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

// 获取当前年月
const currentYear = computed(() => currentDate.value.getFullYear());
const currentMonth = computed(() => currentDate.value.getMonth());
const currentMonthName = computed(() => {
  const options = { month: 'long' };
  return new Intl.DateTimeFormat('zh-CN', options).format(currentDate.value);
});

// 添加一个ref引用当前容器
const pickerContainerRef = ref(null);
const calendarRef = ref(null);

// 切换日期选择器显示
const togglePicker = () => {
  if (props.disabled) return;
  
  if (!showPicker.value) {
    showPicker.value = true;
    
    // 确保日历首先显示当前月份的日期
    if (selectedDate.value) {
      currentDate.value = new Date(selectedDate.value);
      if (tempSelectedDate.value) {
        tempSelectedDate.value = new Date(selectedDate.value);
      }
    }
    
    // 重新生成日历
    generateCalendar();
    
    // 等待DOM更新后计算弹出层位置
    nextTick(() => {
      updatePopupPosition();
    });
  } else {
    showPicker.value = false;
  }
};

// 更新弹出层位置
const updatePopupPosition = () => {
  if (!pickerContainerRef.value) return;
  
  const rect = pickerContainerRef.value.getBoundingClientRect();
  
  // 基础位置
  popupStyle.value = {
    top: `${rect.bottom + window.scrollY + 5}px`,
    left: `${rect.left + window.scrollX}px`,
    width: `${Math.max(rect.width, 260)}px`, // 确保日历宽度合适
  };
  
  // 处理底部溢出
  const viewportHeight = window.innerHeight;
  const popupHeight = 340; // 估算的日历高度
  
  if (rect.bottom + popupHeight > viewportHeight) {
    // 如果底部溢出，显示在输入框上方
    popupStyle.value.top = `${rect.top + window.scrollY - popupHeight - 5}px`;
  }
  
  // 处理右侧溢出
  const viewportWidth = window.innerWidth;
  const popupWidth = 260; // 日历宽度
  
  if (rect.left + popupWidth > viewportWidth) {
    // 如果右侧溢出，调整水平对齐
    popupStyle.value.left = `${viewportWidth - popupWidth - 10}px`;
  }
};

// 生成日历数据
const generateCalendar = () => {
  const year = currentYear.value;
  const month = currentMonth.value;
  
  // 获取当月第一天
  const firstDayOfMonth = new Date(year, month, 1);
  // 当月第一天是星期几
  const dayOfWeek = firstDayOfMonth.getDay();
  
  // 获取上月最后一天
  const lastDayOfPrevMonth = new Date(year, month, 0);
  const daysInPrevMonth = lastDayOfPrevMonth.getDate();
  
  // 获取当月天数
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  
  // 日历数组
  const calendarDays = [];
  
  // 添加上月末尾的日期
  for (let i = dayOfWeek - 1; i >= 0; i--) {
    const prevMonthDay = daysInPrevMonth - i;
    calendarDays.push({
      day: prevMonthDay,
      month: month - 1 < 0 ? 11 : month - 1,
      year: month - 1 < 0 ? year - 1 : year,
      currentMonth: false
    });
  }
  
  // 添加当月日期
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i,
      month: month,
      year: year,
      currentMonth: true
    });
  }
  
  // 添加下月初的日期以填满日历网格
  const remainingDays = 42 - calendarDays.length;
  for (let i = 1; i <= remainingDays; i++) {
    calendarDays.push({
      day: i,
      month: month + 1 > 11 ? 0 : month + 1,
      year: month + 1 > 11 ? year + 1 : year,
      currentMonth: false
    });
  }
  
  days.value = calendarDays;
};

// 前一个月
const prevMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1, 1);
  generateCalendar();
};

// 后一个月
const nextMonth = () => {
  currentDate.value = new Date(currentYear.value, currentMonth.value + 1, 1);
  generateCalendar();
};

// 选择今天
const selectToday = () => {
  const today = new Date();
  tempSelectedDate.value = today;
  currentDate.value = new Date(today);
  generateCalendar();
};

// 选择日期
const selectDate = (day) => {
  if (!day.currentMonth || isDisabled(day)) return;
  
  tempSelectedDate.value = new Date(day.year, day.month, day.day);
};

// 应用选择
const applyPicker = () => {
  if (tempSelectedDate.value) {
    selectedDate.value = new Date(tempSelectedDate.value);
    emit('update:modelValue', new Date(tempSelectedDate.value));
  }
  showPicker.value = false;
};

// 取消选择
const cancelPicker = () => {
  showPicker.value = false;
};

// 判断日期是否被选中
const isSelected = (day) => {
  if (!tempSelectedDate.value) return false;
  
  return tempSelectedDate.value.getDate() === day.day && 
         tempSelectedDate.value.getMonth() === day.month && 
         tempSelectedDate.value.getFullYear() === day.year;
};

// 判断是否是今天
const isToday = (day) => {
  const today = new Date();
  return today.getDate() === day.day && 
         today.getMonth() === day.month && 
         today.getFullYear() === day.year;
};

// 判断日期是否禁用
const isDisabled = (day) => {
  if (!day.currentMonth) return true;
  
  const date = new Date(day.year, day.month, day.day);
  
  if (props.min && date < props.min) return true;
  if (props.max && date > props.max) return true;
  
  return false;
};

// 日期格式化显示
const displayValue = computed(() => {
  if (!selectedDate.value) return '';
  
  const year = selectedDate.value.getFullYear();
  const month = (selectedDate.value.getMonth() + 1).toString().padStart(2, '0');
  const day = selectedDate.value.getDate().toString().padStart(2, '0');
  
  return `${year}-${month}-${day}`;
});

// 样式处理函数
function getShapeClasses() {
  switch (props.shape) {
    case 'round': return 'rounded-full';
    case 'semi-round': return 'rounded-lg';
    default: return 'rounded';
  }
}

function getSizeClasses() {
  switch (props.size) {
    case 'small': return 'px-2 py-1 text-xs';
    case 'large': return 'px-4 py-3 text-base';
    default: return 'px-3 py-2 text-sm';
  }
}

function getStatusClasses() {
  switch (props.status) {
    case 'info':
      return 'border-2 border-blue-500 focus:ring-2 focus:ring-blue-500';
    case 'success':
      return 'border-2 border-green-500 focus:ring-2 focus:ring-green-500';
    case 'warning':
      return 'border-2 border-yellow-500 focus:ring-2 focus:ring-yellow-500';
    case 'danger':
      return 'border-2 border-red-500 focus:ring-2 focus:ring-red-500';
    case 'primary':
      return 'border-2 border-purple-500 focus:ring-2 focus:ring-purple-500';
    default:
      return 'border border-gray-300 dark:border-gray-600 focus:border-blue-400 focus:ring-2 focus:ring-blue-400';
  }
}

// 同步外部值
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    selectedDate.value = new Date(newValue);
    tempSelectedDate.value = new Date(newValue);
  } else {
    selectedDate.value = null;
    tempSelectedDate.value = null;
  }
});

// 点击外部关闭选择器 - 使用更精确的检测
const handleClickOutside = (event) => {
  // 如果日历未显示，不需要处理
  if (!showPicker.value) return;
  
  // 检查点击是否在当前日期选择器组件内
  const isClickInside = pickerContainerRef.value?.contains(event.target) || 
                        calendarRef.value?.contains(event.target);
  
  if (!isClickInside) {
    showPicker.value = false;
  }
};

// 窗口大小改变时更新位置
const handleResize = () => {
  if (showPicker.value) {
    updatePopupPosition();
  }
};

// 生命周期钩子
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('resize', handleResize);
  // 初始化日历
  generateCalendar();
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('resize', handleResize);
});
</script>

<style>
/* 确保日历弹出层有最高的z-index */
.calendar-popup {
  z-index: 9999 !important;
}

/* 当前选中日期的样式 */
.current-day {
  background-color: rgba(59, 130, 246, 0.1);
  font-weight: 500;
}
</style> 