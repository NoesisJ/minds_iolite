<div v-if="isGenerating" class="my-6">
  <div class="flex justify-between mb-2">
    <span class="text-white font-medium">{{ status }}</span>
    <span class="text-white">{{ progress }}%</span>
  </div>
  <progress-bar :progress="progress" />
</div>

<div v-if="isComplete" class="my-6 text-center">
  <div class="text-2xl text-white mb-2">
    <i class="pi pi-check-circle text-green-500 mr-2"></i>项目生成完成
  </div>
  <div class="text-white mb-4">项目大小: {{ formatSize(projectSize) }}</div>
  
  <button
    @click="downloadProject"
    class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center justify-center"
  >
    <i class="pi pi-download mr-2"></i> 下载项目
  </button>
</div>

<div class="mt-4 border border-gray-700 rounded-md p-2 bg-gray-800 h-48 overflow-auto">
  <div v-for="(log, index) in logs" :key="index" class="mb-1 text-sm" :class="{
    'text-green-400': log.type === 'success',
    'text-white': log.type === 'info',
    'text-yellow-400': log.type === 'warning',
    'text-red-400': log.type === 'error'
  }">
    <i :class="{
      'pi pi-check': log.type === 'success',
      'pi pi-info-circle': log.type === 'info',
      'pi pi-exclamation-triangle': log.type === 'warning',
      'pi pi-times-circle': log.type === 'error'
    }" class="mr-1"></i>
    {{ log.message }}
  </div>
</div> 