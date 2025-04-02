<template>
  <div v-if="show" class="publish-dialog-overlay" @click="onCloseRequest">
    <div class="publish-dialog-container" @click.stop>
      <!-- 对话框标题 -->
      <div class="dialog-header">
        <h2 class="text-xl font-medium text-gray-800 dark:text-white">发布项目</h2>
        <button @click="onCloseRequest" class="close-btn text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <i class="pi pi-times"></i>
        </button>
      </div>
      
      <!-- 步骤指示器 -->
      <div class="steps-indicator">
        <div 
          v-for="(step, index) in steps" 
          :key="index"
          :class="['step', { 'active': currentStep >= index, 'current': currentStep === index }]"
        >
          <div class="step-content">
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-name">{{ step }}</div>
          </div>
        </div>
      </div>
      
      <!-- 步骤内容 -->
      <div class="step-content">
        <!-- 步骤1: 选择页面 -->
        <div v-if="currentStep === STEPS.SELECT_PAGES" class="step-page-select">
          <div class="section-title mb-4 text-lg font-medium text-gray-800 dark:text-white">选择要发布的页面</div>
          
          <div v-if="pages.length === 0" class="empty-state">
            <i class="pi pi-exclamation-circle text-3xl mb-3 text-gray-400"></i>
            <div class="text-gray-500 dark:text-gray-400">没有可用的页面</div>
            <div class="text-sm text-gray-500 dark:text-gray-400 mt-2">请先在设计器中创建页面</div>
          </div>
          
          <div v-else class="pages-list">
            <div class="select-all-row mb-2">
              <label class="flex items-center cursor-pointer py-2 px-3 rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                <input 
                  type="checkbox" 
                  :checked="isAllSelected" 
                  @change="toggleSelectAll" 
                  class="mr-2 h-4 w-4"
                >
                <span class="text-gray-700 dark:text-gray-300">全选</span>
              </label>
            </div>
            
            <div 
              v-for="page in pages" 
              :key="page.id" 
              class="page-item"
              :class="{ 'selected': selectedPages.includes(page.id) }"
              @click="togglePageSelection(page.id)"
            >
              <div class="checkbox">
                <i v-if="selectedPages.includes(page.id)" class="pi pi-check"></i>
              </div>
              <div class="page-info">
                <div class="page-title">{{ page.title }}</div>
                <div class="page-type">{{ getLayoutName(page.layoutType) }}</div>
              </div>
              <div class="page-preview">
                <i class="pi pi-file"></i>
              </div>
            </div>
          </div>
          
          <div class="selection-summary mt-4 text-sm text-gray-500 dark:text-gray-400">
            已选择 {{ selectedPages.length }} / {{ pages.length }} 个页面
          </div>
        </div>
        
        <!-- 步骤2: 项目设置 -->
        <div v-if="currentStep === STEPS.PROJECT_SETTINGS" class="step-project-settings">
          <div class="section-title mb-4 text-lg font-medium text-gray-800 dark:text-white">配置项目信息</div>
          
          <div class="form-grid">
            <!-- 项目基本信息 -->
            <div class="form-section">
              <h3 class="form-section-title">基本信息</h3>
              
              <div class="form-group">
                <label for="project-name">项目名称</label>
                <input 
                  id="project-name"
                  v-model="projectSettings.name" 
                  type="text" 
                  placeholder="my-iolite-project"
                  class="form-input"
                >
                <div class="form-hint">项目名称将用作生成的文件夹名称</div>
              </div>
              
              <div class="form-group">
                <label for="project-version">版本号</label>
                <input 
                  id="project-version"
                  v-model="projectSettings.version" 
                  type="text" 
                  placeholder="1.0.0"
                  class="form-input"
                >
              </div>
              
              <div class="form-group">
                <label for="project-author">作者</label>
                <input 
                  id="project-author"
                  v-model="projectSettings.author" 
                  type="text" 
                  placeholder="Your Name"
                  class="form-input"
                >
              </div>
              
              <div class="form-group">
                <label for="project-description">项目描述</label>
                <textarea 
                  id="project-description"
                  v-model="projectSettings.description" 
                  placeholder="描述您的项目..."
                  class="form-textarea"
                  rows="3"
                ></textarea>
              </div>
            </div>
            
            <!-- 导航与路由设置 -->
            <div class="form-section">
              <h3 class="form-section-title">导航与路由</h3>
              
              <div class="form-group">
                <label for="route-mode">路由模式</label>
                <select 
                  id="route-mode"
                  v-model="projectSettings.routeMode" 
                  class="form-select"
                >
                  <option value="hash">Hash 模式 (#/)</option>
                  <option value="history">History 模式</option>
                </select>
                <div class="form-hint">History 模式需要服务器配置支持</div>
              </div>
              
              <div class="form-group">
                <label for="home-page">首页</label>
                <select 
                  id="home-page"
                  v-model="projectSettings.homePage" 
                  class="form-select"
                >
                  <option 
                    v-for="page in selectedPageObjects" 
                    :key="page.id" 
                    :value="page.id"
                  >
                    {{ page.title }}
                  </option>
                </select>
              </div>
              
              <div class="form-group">
                <label>导航菜单</label>
                <div class="checkbox-group">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      v-model="projectSettings.generateNav"
                      class="checkbox-input"
                    >
                    <span>自动生成导航菜单</span>
                  </label>
                </div>
              </div>
            </div>
            
            <!-- 主题与样式设置 -->
            <div class="form-section">
              <h3 class="form-section-title">主题与样式</h3>
              
              <div class="form-group">
                <label for="color-theme">颜色主题</label>
                <select 
                  id="color-theme"
                  v-model="projectSettings.theme" 
                  class="form-select"
                >
                  <option value="light">亮色主题</option>
                  <option value="dark">暗色主题</option>
                  <option value="auto">跟随系统</option>
                </select>
              </div>
              
              <div class="form-group">
                <label>暗色模式支持</label>
                <div class="checkbox-group">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      v-model="projectSettings.darkModeSupport"
                      class="checkbox-input"
                    >
                    <span>支持暗色模式切换</span>
                  </label>
                </div>
              </div>
              
              <div class="form-group">
                <label for="primary-color">主色调</label>
                <div class="color-picker-wrapper">
                  <input 
                    id="primary-color"
                    v-model="projectSettings.primaryColor" 
                    type="color"
                    class="color-picker"
                  >
                  <span class="color-value">{{ projectSettings.primaryColor }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 步骤3: 生成配置 -->
        <div v-if="currentStep === STEPS.BUILD_CONFIG" class="step-build-config">
          <div class="section-title mb-4 text-lg font-medium text-gray-800 dark:text-white">构建配置</div>
          
          <div class="form-grid">
            <!-- 构建选项 -->
            <div class="form-section">
              <h3 class="form-section-title">构建选项</h3>
              
              <div class="form-group">
                <label for="build-tool">构建工具</label>
                <select 
                  id="build-tool"
                  v-model="buildConfig.buildTool" 
                  class="form-select"
                >
                  <option value="vite">Vite</option>
                  <option value="webpack">Webpack</option>
                </select>
                <div class="form-hint">Vite 提供更快的开发体验</div>
              </div>
              
              <div class="form-group">
                <label>优化选项</label>
                <div class="checkbox-group">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      v-model="buildConfig.minify"
                      class="checkbox-input"
                    >
                    <span>压缩代码</span>
                  </label>
                </div>
                <div class="checkbox-group mt-2">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      v-model="buildConfig.treeshaking"
                      class="checkbox-input"
                    >
                    <span>启用 Tree-shaking</span>
                  </label>
                </div>
                <div class="checkbox-group mt-2">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      v-model="buildConfig.sourceMap"
                      class="checkbox-input"
                    >
                    <span>生成 Source Maps</span>
                  </label>
                </div>
              </div>
              
              <div class="form-group">
                <label for="output-dir">输出目录</label>
                <input 
                  id="output-dir"
                  v-model="buildConfig.outputDir" 
                  type="text" 
                  placeholder="dist"
                  class="form-input"
                >
              </div>
            </div>
            
            <!-- 依赖包配置 -->
            <div class="form-section">
              <h3 class="form-section-title">依赖包</h3>
              
              <div class="form-group">
                <label>UI 框架</label>
                <select 
                  v-model="buildConfig.uiFramework" 
                  class="form-select"
                >
                  <option value="none">不使用 UI 框架</option>
                  <option value="elementPlus">Element Plus</option>
                  <option value="naive">Naive UI</option>
                  <option value="vuetify">Vuetify</option>
                  <option value="primevue">PrimeVue</option>
                </select>
              </div>
              
              <div class="form-group">
                <label>工具库</label>
                <div class="checkbox-group">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      v-model="buildConfig.includeAxios"
                      class="checkbox-input"
                    >
                    <span>Axios (HTTP 请求)</span>
                  </label>
                </div>
                <div class="checkbox-group mt-2">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      v-model="buildConfig.includeVueUse"
                      class="checkbox-input"
                    >
                    <span>VueUse (实用工具集)</span>
                  </label>
                </div>
                <div class="checkbox-group mt-2">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      v-model="buildConfig.includeLodash"
                      class="checkbox-input"
                    >
                    <span>Lodash (工具函数)</span>
                  </label>
                </div>
              </div>
            </div>
            
            <!-- API和数据配置 -->
            <div class="form-section">
              <h3 class="form-section-title">API 和数据</h3>
              
              <div class="form-group">
                <label>API 模拟</label>
                <div class="checkbox-group">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      v-model="buildConfig.includeAPI"
                      class="checkbox-input"
                    >
                    <span>生成 API 模拟服务</span>
                  </label>
                </div>
              </div>
              
              <div class="form-group" v-if="buildConfig.includeAPI">
                <label for="api-delay">API 响应延迟 (毫秒)</label>
                <input 
                  id="api-delay"
                  v-model.number="buildConfig.apiDelay" 
                  type="number" 
                  min="0"
                  max="5000"
                  step="100"
                  class="form-input"
                >
                <div class="form-hint">模拟网络延迟，0 表示无延迟</div>
              </div>
              
              <div class="form-group">
                <label>状态管理</label>
                <select 
                  v-model="buildConfig.stateManagement" 
                  class="form-select"
                >
                  <option value="none">不使用</option>
                  <option value="pinia">Pinia</option>
                  <option value="vuex">Vuex</option>
                </select>
              </div>
            </div>
            
            <!-- 部署配置 -->
            <div class="form-section">
              <h3 class="form-section-title">部署配置</h3>
              
              <div class="form-group">
                <label>静态部署支持</label>
                <div class="checkbox-group">
                  <label class="checkbox-label">
                    <input 
                      type="checkbox" 
                      v-model="buildConfig.staticDeployment"
                      class="checkbox-input"
                    >
                    <span>配置静态部署</span>
                  </label>
                </div>
                <div class="form-hint">包含 netlify.toml 等配置文件</div>
              </div>
              
              <div class="form-group">
                <label for="base-path">基础路径</label>
                <input 
                  id="base-path"
                  v-model="buildConfig.basePath" 
                  type="text" 
                  placeholder="/"
                  class="form-input"
                >
                <div class="form-hint">部署在子目录时的路径前缀</div>
              </div>
              
              <div class="form-group">
                <label>CI/CD 配置</label>
                <select 
                  v-model="buildConfig.cicdConfig" 
                  class="form-select"
                >
                  <option value="none">不生成</option>
                  <option value="github">GitHub Actions</option>
                  <option value="gitlab">GitLab CI</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 步骤4: 下载项目 -->
        <div v-if="currentStep === STEPS.DOWNLOAD" class="step-download-project">
          <div class="section-title mb-4 text-lg font-medium text-gray-800 dark:text-white">下载项目</div>
          
          <div v-if="!generationStarted" class="generate-start-section mb-8">
            <div class="text-center mb-6">
              <div class="text-gray-700 dark:text-gray-300 mb-3">
                <i class="pi pi-check-circle text-green-500 text-2xl mr-2"></i>
                配置完成，准备好生成项目了
              </div>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                点击下方按钮开始生成项目文件
              </p>
            </div>
            
            <div class="text-center">
              <button @click="startGeneration" class="btn-primary flex items-center justify-center mx-auto">
                <i class="pi pi-cog mr-2"></i>
                开始生成
              </button>
            </div>
          </div>
          
          <div v-else class="generation-progress">
            <!-- 生成进度显示 -->
            <div class="progress-container mb-6">
              <div class="progress-bar" :style="{width: `${generationProgress}%`}"></div>
              <div class="progress-text">{{ generationProgress }}%</div>
            </div>
            
            <!-- 状态消息 -->
            <div class="status-message mb-6">
              <p class="text-gray-700 dark:text-gray-300">{{ generationStatus }}</p>
            </div>
            
            <!-- 日志输出 -->
            <div v-if="generationLogs.length > 0" class="log-container mb-6">
              <div class="log-header flex justify-between items-center mb-2">
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">生成日志</h4>
                <button @click="toggleLogExpand" class="text-xs text-blue-500 hover:text-blue-600">
                  {{ isLogExpanded ? '收起' : '展开' }}
                </button>
              </div>
              <div 
                class="log-content"
                :class="{ 'log-expanded': isLogExpanded }"
              >
                <div v-for="(log, index) in generationLogs" :key="index" class="log-entry">
                  <span class="log-time">{{ log.time }}</span>
                  <span :class="['log-message', `log-${log.type}`]">{{ log.message }}</span>
                </div>
              </div>
            </div>
            
            <!-- 在生成日志区域下方添加调试信息 -->
            <div class="mb-4 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs">
              <div>生成状态: {{ generationComplete ? '已完成' : '未完成' }}</div>
              <div>项目大小: {{ formattedProjectSize }}</div>
            </div>
            
            <!-- 项目可下载区域 -->
            <div class="download-area p-4 bg-gray-50 dark:bg-gray-800 rounded-md mt-4">
              <div class="text-center">
                <!-- 项目生成成功 -->
                <div v-if="projectSize > 0" class="mb-3">
                  <i class="pi pi-check-circle text-green-500 text-2xl"></i>
                  <div class="text-lg font-medium mt-1">项目生成成功!</div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    项目大小: {{ formattedProjectSize }}
                  </div>
                </div>
                
                <!-- 准备生成 -->
                <div v-else-if="currentStep === STEPS.BUILD_CONFIG && !isGenerating && !error" class="mb-3">
                  <i class="pi pi-cog text-blue-500 text-2xl animate-spin"></i>
                  <div class="mt-1">准备生成项目...</div>
                </div>
                
                <!-- 下载按钮 -->
                <button 
                  v-if="projectSize > 0"
                  @click="downloadProject"
                  class="download-button w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                  id="download-project-button"
                >
                  <i class="pi pi-download mr-2"></i>
                  <span>下载项目</span>
                </button>

                <!-- 强制下载按钮 - 添加调试模式显示 -->
                <button 
                  v-if="true || (projectSize === 0 && currentStep === STEPS.BUILD_CONFIG && !isGenerating)"
                  @click="forceDownload"
                  class="force-download-button w-full mt-2 py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors"
                >
                  <i class="pi pi-download mr-2"></i>
                  <span>强制下载</span>
                </button>
              </div>
            </div>

            <!-- 在下载区域添加调试信息 -->
            <div class="debug-info mt-4 p-2 bg-gray-100 dark:bg-gray-900 rounded text-xs font-mono">
              <div>projectSize: {{ projectSize }}</div>
              <div>currentStep: {{ currentStep }}</div>
              <div>isGenerating: {{ isGenerating }}</div>
              <div>error: {{ error || '无错误' }}</div>
              
              <!-- 测试生成按钮 -->
              <button 
                @click="testGenerator"
                class="w-full mt-2 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
              >
                <i class="pi pi-refresh mr-2"></i>
                <span>测试生成项目</span>
              </button>
              
              <!-- 通用下载按钮 -->
              <button 
                @click="forceDownload"
                class="w-full mt-2 py-2 px-4 bg-purple-500 hover:bg-purple-600 text-white rounded-md transition-colors"
              >
                <i class="pi pi-download mr-2"></i>
                <span>通用下载按钮</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 步骤控制按钮 -->
      <div class="dialog-actions">
        <button 
          v-if="currentStep > STEPS.SELECT_PAGES" 
          @click="prevStep" 
          class="btn-secondary"
        >
          上一步
        </button>
        
        <button 
          v-if="currentStep < steps.length - 1" 
          @click="nextStep" 
          :disabled="isNextDisabled"
          class="btn-primary"
        >
          下一步
        </button>
        
        <button 
          v-if="currentStep === steps.length - 1 && generationComplete" 
          @click="onCloseRequest" 
          class="btn-secondary ml-auto"
        >
          完成
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { useDesignerStore } from '@/stores/designerStore';
import { ProjectGenerator, ProjectSettings, BuildConfig, GenerationCallbacks } from '@/services/ProjectGenerator';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Page } from '@/types/designer';

const props = defineProps({
  show: Boolean
});

const emit = defineEmits(['close']);
const designerStore = useDesignerStore();

// 步骤定义
const steps = ['选择页面', '项目设置', '生成配置', '下载项目'];
const STEPS = {
  SELECT_PAGES: 0,
  PROJECT_SETTINGS: 1,
  BUILD_CONFIG: 2,
  DOWNLOAD: 3
};
const currentStep = ref<number>(STEPS.SELECT_PAGES);

// 页面选择状态 (第一步)
const pages = computed(() => designerStore.pages);
const selectedPages = ref<string[]>([]);

// 项目设置状态 (第二步)
const projectSettings = ref({
  name: 'iolite-project',
  version: '1.0.0',
  author: '',
  description: '使用Minds-Iolite低代码平台创建的项目',
  routeMode: 'hash',
  homePage: '',
  generateNav: true,
  theme: 'light',
  darkModeSupport: true,
  primaryColor: '#3b82f6'
});

// 计算属性：已选择的页面对象
const selectedPageObjects = computed(() => {
  return selectedPages.value.map(id => 
    designerStore.pages.find(p => p.id === id)
  ).filter(Boolean) as Page[];
});

// 计算属性：是否全选
const isAllSelected = computed(() => {
  return pages.value.length > 0 && selectedPages.value.length === pages.value.length;
});

// 方法：获取布局名称
const getLayoutName = (layoutType: string) => {
  const layout = designerStore.layoutTemplates.find(l => l.id === layoutType);
  return layout ? layout.name : '自定义布局';
};

// 方法：切换页面选择
const togglePageSelection = (pageId: string) => {
  const index = selectedPages.value.indexOf(pageId);
  if (index === -1) {
    selectedPages.value.push(pageId);
  } else {
    selectedPages.value.splice(index, 1);
  }
};

// 方法：切换全选
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedPages.value = [];
  } else {
    selectedPages.value = pages.value.map(page => page.id);
  }
};

// 关闭请求
const onCloseRequest = () => {
  emit('close');
  // 重置状态
  currentStep.value = STEPS.SELECT_PAGES;
  selectedPages.value = [];
};

// 步骤导航
const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > STEPS.SELECT_PAGES) {
    currentStep.value--;
  }
};

// 当选择的页面发生变化时，如果只有一个页面被选中，自动设置为首页
watch(selectedPages, (newSelected) => {
  if (newSelected.length === 1 && !projectSettings.value.homePage) {
    projectSettings.value.homePage = newSelected[0];
  } else if (newSelected.length === 0) {
    projectSettings.value.homePage = '';
  } else if (!newSelected.includes(projectSettings.value.homePage)) {
    projectSettings.value.homePage = newSelected[0] || '';
  }
});

// 新增构建配置状态
const buildConfig = ref({
  // 构建工具
  buildTool: 'vite',
  minify: true,
  treeshaking: true,
  sourceMap: false,
  outputDir: 'dist',
  
  // 依赖包
  uiFramework: 'none',
  includeAxios: true,
  includeVueUse: false,
  includeLodash: false,
  
  // API和数据
  includeAPI: false,
  apiDelay: 300,
  stateManagement: 'pinia',
  
  // 部署配置
  staticDeployment: false,
  basePath: '/',
  cicdConfig: 'none'
});

// 生成和下载相关的状态
const generationStarted = ref(false);
const generationProgress = ref(0);
const generationStatus = ref('准备生成项目...');
const generationComplete = ref(false);
const generationFailed = ref(false);
const projectSize = ref(0); // 以字节为单位
const generationLogs = ref<Array<{time: string, message: string, type: string}>>([]);
const isLogExpanded = ref(false);

// 格式化项目大小
const formattedProjectSize = computed(() => {
  const size = projectSize.value;
  if (size < 1024) {
    return `${size} 字节`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  } else {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }
});

// 格式化日期为字符串 (YYYYMMDD_HHMMSS)
const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}_${hours}${minutes}${seconds}`;
};

// 开始生成项目
const startGeneration = async () => {
  generationStarted.value = true;
  generationProgress.value = 0;
  generationStatus.value = '初始化项目...';
  generationComplete.value = false;
  generationFailed.value = false;
  generationLogs.value = [];
  
  // 添加初始日志
  addLog('开始生成项目', 'info');
  
  // 使用真实的项目生成器
  const selectedPageObjects = designerStore.pages.filter(page => 
    selectedPages.value.includes(page.id)
  );
  
  try {
    // 使用我们的ProjectGenerator类
    const projectGen = new ProjectGenerator(
      selectedPageObjects,
      projectSettings.value as unknown as ProjectSettings,
      buildConfig.value as unknown as BuildConfig,
      {
        onProgress: (progress, status) => {
          generationProgress.value = progress;
          generationStatus.value = status;
        },
        onLog: (message, type) => {
          addLog(message, type);
        },
        onComplete: (size) => {
          projectSize.value = size;
          generationComplete.value = true;
        },
        onError: (error) => {
          generationFailed.value = true;
          addLog(`生成失败: ${error}`, 'error');
        },
        onStart: () => {
          // 初始化生成过程
          generationProgress.value = 0;
          generationStatus.value = '初始化...';
          generationComplete.value = false;
          generationFailed.value = false;
        }
      }
    );
    
    // 开始生成过程
    await projectGen.generate();
    
    // 存储生成器实例以供下载使用
    currentGenerator.value = projectGen;
  } catch (error) {
    generationFailed.value = true;
    addLog(`生成失败: ${error}`, 'error');
  }
};

// 添加一个引用来存储生成器实例
const currentGenerator = ref<ProjectGenerator | null>(null);

// 生成项目方法
const generateProject = async () => {
  if (isGenerating.value) return;
  
  isGenerating.value = true;
  error.value = '';
  projectSize.value = 0;
  
  try {
    // 创建项目生成器
    const generator = new ProjectGenerator(
      selectedPages.value.map(id => 
        designerStore.pages.find(p => p.id === id)
      ).filter(Boolean) as Page[],
      projectSettings.value as unknown as ProjectSettings,
      buildConfig.value as unknown as BuildConfig,
      {
        onStart: () => {
          generationLogs.value.push({
            time: new Date().toLocaleString(),
            message: '开始生成项目',
            type: 'info'
          });
        },
        onProgress: (progress, status) => {
          generationProgress.value = progress;
          generationStatus.value = status;
        },
        onLog: (message, type) => {
          addLog(message, type);
        },
        onComplete: (size) => {
          projectSize.value = size;
          generationComplete.value = true;
        },
        onError: (error) => {
          generationFailed.value = true;
          addLog(`生成失败: ${error}`, 'error');
        }
      }
    );
    
    // 生成项目
    await generator.generateProject();
    
  } catch (e) {
    console.error('项目生成失败:', e);
    error.value = e instanceof Error ? e.message : String(e);
  } finally {
    isGenerating.value = false;
  }
};

// 下载项目方法
const downloadProject = () => {
  console.log('点击下载按钮');
  if (projectSize.value === 0) {
    console.warn('项目未生成完成，无法下载');
    return;
  }
  
  const filename = `iolite-project_${new Date().toISOString().replace(/[:.]/g, '_')}.zip`;
  console.log(`准备下载文件: ${filename}`);
  
  // 使用之前已生成的项目进行下载
  generateAndDownload(filename);
};

// 查找并点击下载按钮
const findAndClickDownloadButton = () => {
  // 等待DOM更新
  nextTick(() => {
    console.log('查找下载按钮...');
    
    // 使用更通用的查询方式
    const downloadButton = 
      document.querySelector('.download-button') ||
      document.querySelector('.force-download-button') ||
      document.getElementById('download-project-button');
    
    console.log('找到下载按钮数量:', downloadButton ? 1 : 0);
    console.log('可见的按钮元素:', document.querySelectorAll('button').length);
    
    // 检查所有可能的原因
    console.log('projectSize =', projectSize.value);
    console.log('currentStep =', currentStep.value);
    console.log('STEPS.BUILD_CONFIG =', STEPS.BUILD_CONFIG);
    console.log('isGenerating =', isGenerating.value);
    
    if (downloadButton) {
      console.log('自动点击下载按钮');
      (downloadButton as HTMLElement).click();
    } else {
      console.warn('未找到下载按钮，使用强制下载');
      forceDownload();
    }
  });
};

// 重试生成
const retryGeneration = () => {
  startGeneration();
};

// 切换日志展开/收起状态
const toggleLogExpand = () => {
  isLogExpanded.value = !isLogExpanded.value;
};

// 修改isNextDisabled计算属性
const isNextDisabled = computed(() => {
  if (currentStep.value === STEPS.SELECT_PAGES) {
    return selectedPages.value.length === 0;
  }
  // 其他步骤保持不变
  return false;
});

// 初始化时预选当前页面
onMounted(() => {
  if (designerStore.currentPageId && pages.value.some(p => p.id === designerStore.currentPageId)) {
    selectedPages.value = [designerStore.currentPageId];
  }
  
  // 尝试从 localStorage 中获取用户信息作为默认作者
  const savedAuthor = localStorage.getItem('userName');
  if (savedAuthor) {
    projectSettings.value.author = savedAuthor;
  }
});

// Add log entry to logs
const addLog = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
  const now = new Date();
  const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
  
  generationLogs.value.push({
    time: timeString,
    message,
    type
  });
};

// 添加测试下载功能
const testDownload = () => {
  try {
    console.log('测试简单文件下载');
    const testContent = `# ${projectSettings.value.name} 测试文件\n\n这是一个测试下载文件。如果您看到此文件，说明下载功能正常工作。`;
    const blob = new Blob([testContent], { type: 'text/plain' });
    const filename = `${projectSettings.value.name}_test.txt`;
    
    console.log('开始下载测试文件', filename);
    saveAs(blob, filename);
    console.log('测试文件下载请求已发送');
  } catch (error) {
    console.error('测试下载出错:', error);
    alert('测试下载失败: ' + error);
  }
};

// 监听生成完成状态自动触发下载
watch(() => generationComplete.value, (newValue) => {
  if (newValue) {
    console.log('项目生成完成，准备自动下载');
    // 延迟一点时间，确保界面已更新
    setTimeout(() => {
      downloadProject();
    }, 800);
  }
});

// 添加手动下载方法
const manualDownload = () => {
  if (!currentGenerator.value) {
    addLog('项目生成器不可用', 'error');
    return;
  }
  
  try {
    // 创建时间戳防止缓存
    const timestamp = new Date().getTime();
    const filename = `${projectSettings.value.name}_${formatDate(new Date())}_${timestamp}.zip`;
    
    addLog('尝试手动下载方法...', 'info');
    currentGenerator.value.downloadProject(filename);
  } catch (error) {
    console.error('手动下载失败:', error);
    addLog(`手动下载失败: ${error}`, 'error');
  }
};

// 添加一个直接测试生成项目大小的函数
const testGenerator = async () => {
  console.log('测试生成器启动...');
  isGenerating.value = true;
  projectSize.value = 0; // 重置项目大小
  
  try {
    // 创建新的生成器实例
    const generator = new ProjectGenerator(
      selectedPages.value.map(id => 
        designerStore.pages.find(p => p.id === id)
      ).filter(Boolean) as Page[],
      projectSettings.value as unknown as ProjectSettings,
      buildConfig.value as unknown as BuildConfig,
      {
        onStart: () => console.log('测试生成器开始...'),
        onProgress: () => {},
        onLog: (msg) => console.log('测试生成器日志:', msg),
        onComplete: (size) => {
          console.log(`测试生成器完成，大小: ${size} 字节`);
          // 直接在UI中更新项目大小
          projectSize.value = size;
        },
        onError: (e) => console.error('测试生成器错误:', e)
      }
    );
    
    // 生成项目
    const blob = await generator.generateProject();
    console.log(`测试生成成功，获取到blob大小: ${blob.size} 字节`);
    
    // 确保UI状态更新
    if (projectSize.value === 0 && blob.size > 0) {
      console.log('强制更新项目大小');
      projectSize.value = blob.size;
    }
  } catch (error) {
    console.error('测试生成失败:', error);
  } finally {
    isGenerating.value = false;
  }
};

// 修改强制下载函数
const forceDownload = async () => {
  console.log('开始强制下载...');
  isGenerating.value = true;
  
  try {
    const filename = `iolite-project_${new Date().toISOString().replace(/[:.]/g, '_')}.zip`;
    console.log(`准备强制下载文件: ${filename}`);
    
    // 使用新的测试生成器方法获取blob
    const generator = new ProjectGenerator(
      selectedPages.value.map(id => 
        designerStore.pages.find(p => p.id === id)
      ).filter(Boolean) as Page[],
      projectSettings.value as unknown as ProjectSettings,
      buildConfig.value as unknown as BuildConfig,
      {
        onStart: () => console.log('开始生成...'),
        onProgress: () => {},
        onLog: (msg) => console.log(msg),
        onComplete: (size) => {
          console.log(`设置项目大小为: ${size} 字节`);
          projectSize.value = size; // 这里是关键 - 确保更新状态
        },
        onError: (e) => console.error(e)
      }
    );
    
    // 生成项目并直接下载
    const blob = await generator.generateProject();
    console.log(`项目生成完成，大小: ${blob.size} 字节`);
    
    // 更新UI状态
    projectSize.value = blob.size;
    
    // 直接下载
    saveAs(blob, filename);
    console.log('文件下载请求已发送');
  } catch (error) {
    console.error('强制下载失败:', error);
  } finally {
    isGenerating.value = false;
  }
};

// 生成并下载项目
const generateAndDownload = async (filename: string) => {
  try {
    const zip = new JSZip();
    
    // 创建项目生成器
    const generator = new ProjectGenerator(
      selectedPages.value.map(id => 
        designerStore.pages.find(p => p.id === id)
      ).filter(Boolean) as Page[],
      projectSettings.value as unknown as ProjectSettings,
      buildConfig.value as unknown as BuildConfig,
      {
        onProgress: (progress) => {
          // 不更新UI避免状态混乱
        },
        onLog: (message, type) => {
          console.log(`下载日志: ${message} [${type}]`);
        },
        onStart: () => {
          console.log('开始生成下载文件...');
        },
        onComplete: () => {
          console.log('ZIP生成完成');
        },
        onError: (msg) => {
          console.error(`下载错误: ${msg}`);
        }
      }
    );
    
    // 获取ZIP内容
    const content = await generator.generateProject();
    
    console.log('ZIP生成完成，大小:', Math.round((content.size / 1024) * 100) / 100, 'KB');
    console.log('使用file-saver尝试下载...');
    
    // 使用file-saver下载
    saveAs(content, filename);
    
    console.log('file-saver下载请求已发送');
    generationLogs.value.push({
      time: new Date().toLocaleString(),
      message: '下载请求已发送',
      type: 'success'
    });
  } catch (error) {
    console.error('下载生成失败:', error);
    generationLogs.value.push({
      time: new Date().toLocaleString(),
      message: `下载生成失败: ${error}`,
      type: 'error'
    });
  }
};

// 在script setup区域，添加以下状态变量
const isGenerating = ref(false);
const error = ref('');
const currentStatus = ref('');
</script>

<style scoped>
.publish-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.publish-dialog-container {
  width: 90%;
  max-width: 800px;
  background-color: white;
  border-radius: 0.5rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.dark .publish-dialog-container {
  background-color: #1f2937;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.dark .dialog-header {
  border-color: #4b5563;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
}

.steps-indicator {
  display: flex;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb;
  position: relative;
}

.dark .steps-indicator {
  border-color: #4b5563;
}

.step {
  display: flex;
  flex: 1;
  position: relative;
  justify-content: center;
}

.step-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
}

.step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 1rem;
  left: 50%;
  right: auto;
  width: 100%;
  height: 2px;
  background-color: #e5e7eb;
  z-index: 1;
  transform: translateY(1.25rem);
}

.dark .step:not(:last-child)::after {
  background-color: #4b5563;
}

.step.active:not(:last-child)::after {
  background-color: #3b82f6;
}

.step-number {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: #e5e7eb;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 2;
}

.dark .step-number {
  background-color: #4b5563;
  color: #e5e7eb;
}

.step.active .step-number {
  background-color: #3b82f6;
  color: white;
}

.step-name {
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
  white-space: nowrap;
}

.dark .step-name {
  color: #9ca3af;
}

.step.current .step-name {
  color: #111827;
  font-weight: 500;
}

.dark .step.current .step-name {
  color: #f9fafb;
}

.step-content {
  padding: 1.5rem;
  flex: 1;
  overflow-y: auto;
}

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 250px;
  border: 2px dashed #e5e7eb;
  border-radius: 0.5rem;
}

.dark .placeholder {
  border-color: #4b5563;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
}

.dark .dialog-actions {
  border-color: #4b5563;
}

.btn-primary,
.btn-secondary {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: white;
  color: #4b5563;
  border: 1px solid #d1d5db;
  margin-right: 0.5rem;
}

.btn-secondary:hover {
  background-color: #f9fafb;
}

.dark .btn-secondary {
  background-color: #374151;
  color: #e5e7eb;
  border-color: #4b5563;
}

.dark .btn-secondary:hover {
  background-color: #4b5563;
}

/* 添加页面选择相关样式 */
.section-title {
  margin-bottom: 1rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
}

.pages-list {
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
}

.dark .pages-list {
  border-color: #4b5563;
}

.select-all-row {
  border-bottom: 1px solid #e5e7eb;
}

.dark .select-all-row {
  border-color: #4b5563;
}

.page-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dark .page-item {
  border-color: #4b5563;
}

.page-item:last-child {
  border-bottom: none;
}

.page-item:hover {
  background-color: #f9fafb;
}

.dark .page-item:hover {
  background-color: #374151;
}

.page-item.selected {
  background-color: #eff6ff;
}

.dark .page-item.selected {
  background-color: #1e3a8a;
}

.checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dark .checkbox {
  border-color: #6b7280;
}

.page-item.selected .checkbox {
  background-color: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.page-info {
  flex: 1;
}

.page-title {
  font-weight: 500;
  color: #111827;
}

.dark .page-title {
  color: #f9fafb;
}

.page-type {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.dark .page-type {
  color: #9ca3af;
}

.page-preview {
  color: #6b7280;
  font-size: 1.25rem;
}

.dark .page-preview {
  color: #9ca3af;
}

.selection-summary {
  text-align: right;
}

.btn-primary:disabled {
  background-color: #93c5fd;
  cursor: not-allowed;
}

.dark .btn-primary:disabled {
  background-color: #1e40af;
  opacity: 0.5;
}

/* 添加项目设置相关样式 */
.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .form-section:first-child {
    grid-column: 1 / -1;
  }
}

.form-section {
  background-color: #f9fafb;
  border-radius: 0.5rem;
  padding: 1.25rem;
  border: 1px solid #e5e7eb;
}

.dark .form-section {
  background-color: #1f2937;
  border-color: #4b5563;
}

.form-section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.dark .form-section-title {
  color: #e5e7eb;
  border-color: #4b5563;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.dark .form-group label {
  color: #e5e7eb;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  color: #111827;
  font-size: 0.875rem;
}

.dark .form-input,
.dark .form-select,
.dark .form-textarea {
  background-color: #374151;
  border-color: #4b5563;
  color: #f9fafb;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  ring: 1px #3b82f6;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.form-hint {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.dark .form-hint {
  color: #9ca3af;
}

.checkbox-group {
  margin-top: 0.25rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
}

.dark .checkbox-label {
  color: #e5e7eb;
}

.checkbox-input {
  margin-right: 0.5rem;
}

.color-picker-wrapper {
  display: flex;
  align-items: center;
}

.color-picker {
  height: 2rem;
  width: 3rem;
  border: none;
  padding: 0;
  background: none;
  cursor: pointer;
}

.color-value {
  margin-left: 0.75rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.dark .color-value {
  color: #9ca3af;
}

/* 添加下载项目相关样式 */
.progress-container {
  background-color: #f3f4f6;
  height: 1.5rem;
  border-radius: 0.75rem;
  overflow: hidden;
  position: relative;
}

.dark .progress-container {
  background-color: #374151;
}

.progress-bar {
  height: 100%;
  background-color: #3b82f6;
  border-radius: 0.75rem;
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 500;
  color: white;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
}

.log-container {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  font-family: monospace;
  font-size: 0.75rem;
}

.dark .log-container {
  background-color: #1f2937;
  border-color: #4b5563;
}

.log-header {
  padding: 0.5rem 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.dark .log-header {
  border-color: #4b5563;
}

.log-content {
  max-height: 8rem;
  overflow-y: auto;
  padding: 0.5rem 0.75rem;
}

.log-expanded {
  max-height: 16rem;
}

.log-entry {
  padding: 0.125rem 0;
  line-height: 1.5;
}

.log-time {
  color: #6b7280;
  margin-right: 0.5rem;
}

.dark .log-time {
  color: #9ca3af;
}

.log-message {
  color: #111827;
}

.dark .log-message {
  color: #f9fafb;
}

.log-info {
  color: #4b5563;
}

.dark .log-info {
  color: #d1d5db;
}

.log-success {
  color: #10b981;
}

.log-warning {
  color: #f59e0b;
}

.log-error {
  color: #ef4444;
}

.download-area {
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #f9fafb;
}

.dark .download-area {
  background-color: #1f2937;
}

.download-button {
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dark .download-button {
  background-color: #2563eb;
}

.download-button:hover {
  background-color: #2563eb;
}

.force-download-button {
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  background-color: #ef4444;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dark .force-download-button {
  background-color: #b91c1c;
}

.force-download-button:hover {
  background-color: #b91c1c;
}

/* 添加调试信息相关样式 */
.debug-info {
  margin-top: 1rem;
  padding: 0.5rem;
  border-radius: 0.375rem;
  background-color: #f9fafb;
}

.dark .debug-info {
  background-color: #1f2937;
}

.debug-info div {
  margin-bottom: 0.25rem;
}

.debug-info button {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dark .debug-info button {
  background-color: #2563eb;
}

.debug-info button:hover {
  background-color: #2563eb;
}
</style> 