import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Page } from '@/types/designer';
import { ComponentInstance } from '@/types/designer';

// 项目设置类型
export interface ProjectSettings {
  name: string;
  version: string;
  author: string;
  description: string;
  routeMode: 'hash' | 'history';
  homePage: string;
  generateNav: boolean;
  theme: 'light' | 'dark' | 'auto';
  darkModeSupport: boolean;
  primaryColor: string;
}

// 构建配置类型
export interface BuildConfig {
  buildTool: 'vite' | 'webpack';
  minify: boolean;
  treeshaking: boolean;
  sourceMap: boolean;
  outputDir: string;
  uiFramework: string;
  includeAxios: boolean;
  includeVueUse: boolean;
  includeLodash: boolean;
  includeAPI: boolean;
  apiDelay: number;
  stateManagement: string;
  staticDeployment: boolean;
  basePath: string;
  cicdConfig: string;
}

// 生成进度回调类型
export interface GenerationCallbacks {
  onProgress: (progress: number, status: string) => void;
  onLog: (message: string, type: 'info' | 'success' | 'error' | 'warning') => void;
  onComplete: (size: number) => void;
  onError: (error: string) => void;
  onStart: () => void;
}

export class ProjectGenerator {
  private pages: Page[];
  private settings: ProjectSettings;
  private config: BuildConfig;
  private callbacks: GenerationCallbacks;
  private zip = new JSZip();
  
  constructor(
    pages: Page[],
    settings: ProjectSettings,
    config: BuildConfig,
    callbacks: GenerationCallbacks
  ) {
    this.pages = pages;
    this.settings = settings;
    this.config = config;
    this.callbacks = callbacks;
  }
  
  // 开始生成项目
  public async generate(): Promise<void> {
    try {
      this.callbacks.onProgress(0, '初始化项目...');
      this.callbacks.onLog('开始生成项目', 'info');
      
      // 步骤1: 生成项目基础结构
      await this.createProjectStructure();
      
      // 步骤2: 生成页面组件
      await this.generatePageComponents();
      
      // 步骤3: 生成路由配置
      await this.generateRoutes();
      
      // 步骤4: 生成主题配置
      await this.generateTheme();
      
      // 步骤5: 生成状态管理
      if (this.config.stateManagement !== 'none') {
        await this.generateStateManagement();
      }
      
      // 步骤6: 生成API模拟服务
      if (this.config.includeAPI) {
        await this.generateApiMocks();
      }
      
      // 步骤7: 生成部署配置
      await this.generateDeploymentConfig();
      
      // 步骤8: 生成最终项目包
      await this.finalizeProject();
      
      this.callbacks.onProgress(100, '项目生成完成!');
      this.callbacks.onLog('项目生成完成!', 'success');
    } catch (error) {
      this.callbacks.onError(error instanceof Error ? error.message : String(error));
      this.callbacks.onLog(`生成失败: ${error}`, 'error');
    }
  }
  
  // 下载项目
  public async downloadProject(filename: string): Promise<void> {
    try {
      this.callbacks.onLog('正在准备下载...', 'info');
      
      try {
        // 生成ZIP文件内容
        const content = await this.zip.generateAsync({ 
          type: 'blob',
          compression: 'DEFLATE',
          compressionOptions: {
            level: 5 // 中等压缩级别，平衡速度和大小
          }
        });
        
        // 获取文件大小
        const size = content.size;
        console.log(`ZIP生成完成，大小: ${this.formatSize(size)}`);
        
        // 方法1: 尝试使用file-saver
        try {
          console.log('使用file-saver尝试下载...');
          saveAs(content, filename);
          console.log('file-saver下载请求已发送');
        } catch (fsError) {
          console.error('file-saver下载失败，使用备用方法:', fsError);
          
          // 方法2: 使用URL.createObjectURL和a标签
          const url = URL.createObjectURL(content);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          
          // 清理
          setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          }, 100);
        }
        
        this.callbacks.onComplete(size);
        this.callbacks.onLog('项目下载完成', 'success');
      } catch (zipError) {
        console.error('生成ZIP出错:', zipError);
        const errorMessage = zipError instanceof Error 
          ? zipError.message 
          : String(zipError);
        throw new Error('生成ZIP文件失败: ' + errorMessage);
      }
    } catch (error) {
      console.error('下载错误:', error);
      this.callbacks.onError(error instanceof Error ? error.message : String(error));
      this.callbacks.onLog(`下载失败: ${error}`, 'error');
    }
  }
  
  // 创建项目基本结构
  private async createProjectStructure(): Promise<void> {
    this.callbacks.onProgress(5, '创建项目结构...');
    this.callbacks.onLog('创建项目基本结构', 'info');
    
    // 1. 添加package.json
    this.zip.file('package.json', this.generatePackageJson());
    
    // 2. 添加README.md
    this.zip.file('README.md', this.generateReadme());
    
    // 3. 添加构建配置文件
    if (this.config.buildTool === 'vite') {
      this.zip.file('vite.config.js', this.generateViteConfig());
      this.zip.file('.env', this.generateEnvFile());
    } else {
      this.zip.file('vue.config.js', this.generateVueConfig());
    }
    
    // 4. 添加tsconfig.json
    this.zip.file('tsconfig.json', this.generateTsConfig());
    
    // 5. 创建项目目录结构
    this.zip.folder('src');
    this.zip.folder('src/assets');
    this.zip.folder('src/components');
    this.zip.folder('src/views');
    this.zip.folder('src/router');
    
    if (this.config.stateManagement !== 'none') {
      this.zip.folder('src/stores');
    }
    
    this.zip.folder('src/utils');
    
    if (this.config.includeAPI) {
      this.zip.folder('src/api');
      this.zip.folder('mock');
    }
    
    // 6. 添加默认的public文件
    const publicFolder = this.zip.folder('public');
    if (publicFolder) {
      publicFolder.file('favicon.ico', '', { base64: true });
      publicFolder.file('index.html', this.generateIndexHtml());
    }
    
    this.callbacks.onLog('项目基本结构创建完成', 'success');
  }
  
  // 生成主要的package.json文件
  private generatePackageJson(): string {
    const dependencies: Record<string, string> = {
      'vue': '^3.2.47',
      'vue-router': '^4.1.6'
    };
    
    // 添加状态管理依赖
    if (this.config.stateManagement === 'pinia') {
      dependencies['pinia'] = '^2.0.33';
    } else if (this.config.stateManagement === 'vuex') {
      dependencies['vuex'] = '^4.1.0';
    }
    
    // 添加UI框架依赖
    if (this.config.uiFramework === 'elementPlus') {
      dependencies['element-plus'] = '^2.3.1';
    } else if (this.config.uiFramework === 'naive') {
      dependencies['naive-ui'] = '^2.34.3';
    } else if (this.config.uiFramework === 'vuetify') {
      dependencies['vuetify'] = '^3.1.12';
    } else if (this.config.uiFramework === 'primevue') {
      dependencies['primevue'] = '^3.26.1';
      dependencies['primeicons'] = '^6.0.1';
    }
    
    // 添加工具库依赖
    if (this.config.includeAxios) {
      dependencies['axios'] = '^1.3.4';
    }
    
    if (this.config.includeVueUse) {
      dependencies['@vueuse/core'] = '^9.13.0';
    }
    
    if (this.config.includeLodash) {
      dependencies['lodash-es'] = '^4.17.21';
    }
    
    // 添加API模拟依赖
    let devDependencies: Record<string, string> = {
      'typescript': '^4.9.5',
      'vue-tsc': '^1.2.0'
    };
    
    if (this.config.includeAPI) {
      devDependencies['msw'] = '^1.2.1';
    }
    
    // 添加构建工具相关依赖
    if (this.config.buildTool === 'vite') {
      devDependencies = {
        ...devDependencies,
        'vite': '^4.2.1',
        '@vitejs/plugin-vue': '^4.1.0'
      };
    } else {
      devDependencies = {
        ...devDependencies,
        '@vue/cli-service': '^5.0.8',
        '@vue/cli-plugin-typescript': '^5.0.8'
      };
    }
    
    const packageJson = {
      name: this.settings.name,
      version: this.settings.version,
      private: true,
      author: this.settings.author,
      description: this.settings.description,
      scripts: {
        dev: this.config.buildTool === 'vite' ? 'vite' : 'vue-cli-service serve',
        build: this.config.buildTool === 'vite' ? 'vue-tsc && vite build' : 'vue-cli-service build',
        preview: this.config.buildTool === 'vite' ? 'vite preview' : 'vue-cli-service serve --mode production'
      },
      dependencies,
      devDependencies
    };
    
    return JSON.stringify(packageJson, null, 2);
  }
  
  // 其他生成方法只列出关键部分
  
  // 生成README.md
  private generateReadme(): string {
    return `# ${this.settings.name}

${this.settings.description}

## 项目设置

\`\`\`
npm install
\`\`\`

### 开发模式运行

\`\`\`
npm run dev
\`\`\`

### 生产环境构建

\`\`\`
npm run build
\`\`\`

## 项目信息

- 作者: ${this.settings.author}
- 版本: ${this.settings.version}
- 由Minds-Iolite低代码平台生成
`;
  }
  
  // 省略其他工具方法...
  
  // 生成页面组件
  private async generatePageComponents(): Promise<void> {
    this.callbacks.onProgress(30, '生成页面组件...');
    
    // 用于记录生成的所有组件，避免重复生成
    const generatedComponents = new Set<string>();
    
    // 遍历所有页面
    for (const page of this.pages) {
      // 检查页面是否有区域
      if (!page.regions || page.regions.length === 0) {
        this.callbacks.onLog(`警告: 页面 "${page.title}" 没有定义区域`, 'warning');
        continue;
      }
      
      // 遍历页面中的所有区域
      for (const region of page.regions) {
        // 检查区域是否有组件
        if (!region.components || region.components.length === 0) {
          continue; // 跳过空区域
        }
        
        // 遍历区域中的所有组件
        for (const component of region.components) {
          // 如果已经生成过该组件，跳过
          if (generatedComponents.has(component.id)) {
            continue;
          }
          
          let componentCode = '';
          // 根据组件类型生成相应的代码
          if (component.componentId === 'text') {
            componentCode = this.generateTextComponentCode(component);
            
            // 将组件代码写入ZIP文件
            const componentPath = `src/components/generated/TextComponent${component.id}.vue`;
            this.zip.file(componentPath, componentCode);
            
            // 标记该组件已生成
            generatedComponents.add(component.id);
            
            this.callbacks.onLog(`已生成文本组件: TextComponent${component.id}`, 'info');
          } else if (component.componentId === 'button') {
            componentCode = this.generateButtonComponentCode(component);
            
            // 将组件代码写入ZIP文件
            const componentPath = `src/components/generated/ButtonComponent${component.id}.vue`;
            this.zip.file(componentPath, componentCode);
            
            // 标记该组件已生成
            generatedComponents.add(component.id);
            
            this.callbacks.onLog(`已生成按钮组件: ButtonComponent${component.id}`, 'info');
          }
          // 其他组件类型将在后续实现...
        }
      }
    }
    
    // 更新进度
    this.callbacks.onProgress(40, '组件生成完成');
  }
  
  // 生成路由配置
  private async generateRoutes(): Promise<void> {
    // 实现代码...
    this.callbacks.onProgress(50, '生成路由配置...');
    // 此处应该有实际的路由生成逻辑
  }
  
  // 生成主题配置
  private async generateTheme(): Promise<void> {
    // 实现代码...
    this.callbacks.onProgress(65, '生成主题配置...');
    // 此处应该有实际的主题生成逻辑
  }
  
  // 生成状态管理
  private async generateStateManagement(): Promise<void> {
    // 实现代码...
    this.callbacks.onProgress(75, '生成状态管理...');
    // 此处应该有实际的状态管理生成逻辑
  }
  
  // 生成API模拟服务
  private async generateApiMocks(): Promise<void> {
    // 实现代码...
    this.callbacks.onProgress(85, '生成API模拟服务...');
    // 此处应该有实际的API模拟生成逻辑
  }
  
  // 生成部署配置
  private async generateDeploymentConfig(): Promise<void> {
    // 实现代码...
    this.callbacks.onProgress(90, '生成部署配置...');
    // 此处应该有实际的部署配置生成逻辑
  }
  
  // 最终处理和打包
  private async finalizeProject(): Promise<void> {
    // 实现代码...
    this.callbacks.onProgress(95, '打包项目...');
    // 此处应该有实际的打包逻辑
  }
  
  // 生成HTML模板
  private generateIndexHtml(): string {
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${this.settings.name}</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>`;
  }
  
  // 生成Vite配置
  private generateViteConfig(): string {
    return `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '${this.config.basePath}',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: '${this.config.outputDir}',
    minify: ${this.config.minify ? "'esbuild'" : "false"},
    sourcemap: ${this.config.sourceMap},
  }
})
`;
  }
  
  private generateEnvFile(): string {
    return `# 项目环境配置
VITE_APP_TITLE=${this.settings.name}
VITE_APP_BASE_URL=${this.config.basePath}
${this.config.includeAPI ? 'VITE_APP_ENABLE_MOCK=true' : '# VITE_APP_ENABLE_MOCK=false'}
VITE_APP_API_DELAY=${this.config.apiDelay}
`;
  }
  

  private generateVueConfig(): string {
    return `const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '${this.config.basePath}',
  outputDir: '${this.config.outputDir}',
  productionSourceMap: ${this.config.sourceMap},
})
`;
  }
  
  private generateTsConfig(): string {
    return `{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "strict": true,
    "jsx": "preserve",
    "moduleResolution": "node",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "useDefineForClassFields": true,
    "sourceMap": true,
    "baseUrl": ".",
    "types": [
      "webpack-env"
    ],
    "paths": {
      "@/*": [
        "src/*"
      ]
    },
    "lib": [
      "esnext",
      "dom",
      "dom.iterable",
      "scripthost"
    ]
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "tests/**/*.ts",
    "tests/**/*.tsx"
  ],
  "exclude": [
    "node_modules"
  ]
}`;
  }
  
  // 格式化文件大小
  private formatSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private addBaseProjectFiles(): void {
    try {
      // 添加根目录文件
      this.zip.file('package.json', this.generatePackageJson());
      this.zip.file('tsconfig.json', this.generateTsConfig());
      this.zip.file('vite.config.js', this.generateViteConfig());
      this.zip.file('README.md', this.generateReadme());
      this.zip.file('.env', `# 项目环境配置\nVITE_APP_TITLE=${this.settings.name}\nVITE_APP_BASE_URL=${this.config.basePath}\n`);
      
      // 创建基本目录结构
      this.zip.folder('public');
      this.zip.folder('src');
      this.zip.folder('src/assets');
      this.zip.folder('src/components');
      this.zip.folder('src/views');
      this.zip.folder('src/router');
      this.zip.folder('src/store');
      
      // 添加空的favicon
      this.zip.file('public/favicon.ico', '', {binary: true});
      
      // 添加index.html
      this.zip.file('public/index.html', this.generateIndexHtml());
      
      // 添加主要入口文件
      this.zip.file('src/main.ts', this.generateMainTs());
      this.zip.file('src/App.vue', this.generateAppVue());
      
      // 添加router
      this.zip.file('src/router/index.ts', this.generateRouterIndex());
      
      console.log('成功添加基础项目文件');
    } catch (error) {
      console.error('添加基础文件失败:', error);
      throw new Error('添加基础项目文件失败: ' + error);
    }
  }

  private generateMainTs(): string {
    return `import { createApp } from 'vue'
    import App from './App.vue'
    import router from './router'

    createApp(App).use(router).mount('#app')
  `;
  }

  private generateAppVue(): string {
    return `<template>
    <router-view/>
  </template>

  <style>
  body {
    margin: 0;
    font-family: Arial, sans-serif;
  }
  </style>
  `;
  }

  private generateRouterIndex(): string {
    return `import { createRouter } from 'vue-router'
    import Home from '../views/Home.vue'

    const routes = [
      { path: '/', component: Home },
      { path: '/about', component: () => import('../views/About.vue') },
    ]

    const router = createRouter({
      history: createWebHistory(),
      routes,
    })

    return router
  `;
  }

  // 主要导出方法
  public async generateProject(): Promise<Blob> {
    try {
      this.callbacks.onStart();
      this.callbacks.onLog('开始生成项目', 'info');
      
      // 初始化一个新的zip对象
      this.zip = new JSZip();
      
      // 添加基础项目文件
      this.callbacks.onLog('创建项目基本结构...', 'info');
      this.addBaseProjectFiles();
      
      // 添加这一行 - 调用组件生成方法
      await this.generatePageComponents();
      
      // 生成ZIP文件并获取大小
      const content = await this.zip.generateAsync({ type: 'blob' });
      const sizeInKB = Math.round((content.size / 1024) * 100) / 100;
      
      // 输出调试信息
      console.log(`ZIP实际大小: ${content.size} 字节 (${sizeInKB} KB)`);
      this.callbacks.onLog(`ZIP生成完成，大小: ${sizeInKB} KB`, 'success');
      this.callbacks.onLog('项目生成完成!', 'success');
      
      // 确保调用onComplete回调，并传递实际大小
      this.callbacks.onComplete(content.size);
      
      return content;
    } catch (error) {
      this.callbacks.onError(error instanceof Error ? error.message : String(error));
      this.callbacks.onLog(`生成失败: ${error}`, 'error');
      throw error;
    }
  }

  /**
   * 生成文本组件的代码
   * @param component 组件实例
   * @returns 生成的Vue组件代码
   */
  private generateTextComponentCode(component: ComponentInstance): string {
    // 从组件属性中提取文本内容
    const content = component.props.content || '文本内容';
    
    // 从组件样式中提取样式信息
    const fontSize = component.styles.fontSize || '16px';
    const color = component.styles.color || '#333333';
    const textAlign = component.styles.textAlign || 'left';
    const fontWeight = component.styles.fontWeight || 'normal';
    const margin = component.styles.margin || '0';
    const padding = component.styles.padding || '0';
    
    // 生成Vue组件代码
    return `<template>
    <div class="text-component" :style="computedStyles">
      {{ content }}
    </div>
  </template>

  <script>
  export default {
    name: 'TextComponent${component.id}',
    props: {
      content: {
        type: String,
        default: '${content.replace(/'/g, "\\'")}'
      },
      styles: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      computedStyles() {
        return {
          fontSize: '${fontSize}',
          color: '${color}',
          textAlign: '${textAlign}',
          fontWeight: '${fontWeight}',
          margin: '${margin}',
          padding: '${padding}',
          ...this.styles // 允许通过props覆盖默认样式
        };
      }
    }
  }
  </script>

  <style scoped>
  .text-component {
    display: block;
    max-width: 100%;
  }
  </style>`;
  }

  // 生成按钮组件代码
  private generateButtonComponentCode(component: ComponentInstance): string {
    const { label = '按钮', status = 'primary', size = 'medium', shape = 'rectangle', 
            hero = false, outline = false, ghost = false, disabled = false, icon = '' } = component.props;
    
    return `<template>
    <button
      :class="[
        'transition-colors focus:outline-none',
        getStatusClasses(),
        getSizeClasses(),
        getShapeClasses(),
        disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
      ]"
      :disabled="disabled"
    >
      <i v-if="icon" :class="icon + ' mr-1.5'"></i>
      {{ label }}
    </button>
  </template>

  <script>
  export default {
    name: 'ButtonComponent',
    props: {
      label: {
        type: String,
        default: '${label.replace(/'/g, "\\'")}'
      },
      status: {
        type: String,
        default: '${status}'
      },
      size: {
        type: String,
        default: '${size}'
      },
      shape: {
        type: String,
        default: '${shape}'
      },
      hero: {
        type: Boolean,
        default: ${hero}
      },
      outline: {
        type: Boolean,
        default: ${outline}
      },
      ghost: {
        type: Boolean,
        default: ${ghost}
      },
      disabled: {
        type: Boolean,
        default: ${disabled}
      },
      icon: {
        type: String,
        default: '${icon.replace(/'/g, "\\'")}'
      },
      styles: {
        type: Object,
        default: () => ({})
      }
    },
    methods: {
      getStatusClasses() {
        // Hero 按钮
        if (this.hero) {
          switch (this.status) {
            case 'primary': return 'bg-purple-600 hover:bg-purple-700 text-white';
            case 'info': return 'bg-blue-600 hover:bg-blue-700 text-white';
            case 'success': return 'bg-green-600 hover:bg-green-700 text-white';
            case 'warning': return 'bg-yellow-600 hover:bg-yellow-700 text-white';
            case 'danger': return 'bg-red-600 hover:bg-red-700 text-white';
            default: return 'bg-gray-600 hover:bg-gray-700 text-white dark:bg-gray-700 dark:hover:bg-gray-600';
          }
        }
        
        // 轮廓按钮
        if (this.outline) {
          switch (this.status) {
            case 'primary': return 'border-2 border-purple-500 text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20';
            case 'info': return 'border-2 border-blue-500 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20';
            case 'success': return 'border-2 border-green-500 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20';
            case 'warning': return 'border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20';
            case 'danger': return 'border-2 border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20';
            default: return 'border-2 border-gray-500 text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:border-gray-400 dark:hover:bg-gray-800';
          }
        }
        
        // 幽灵按钮
        if (this.ghost) {
          switch (this.status) {
            case 'primary': return 'text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20';
            case 'info': return 'text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20';
            case 'success': return 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20';
            case 'warning': return 'text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20';
            case 'danger': return 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20';
            default: return 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800';
          }
        }
        
        // 默认按钮
        switch (this.status) {
          case 'primary': return 'bg-purple-500 hover:bg-purple-600 text-white';
          case 'info': return 'bg-blue-500 hover:bg-blue-600 text-white';
          case 'success': return 'bg-green-500 hover:bg-green-600 text-white';
          case 'warning': return 'bg-yellow-500 hover:bg-yellow-600 text-white';
          case 'danger': return 'bg-red-500 hover:bg-red-600 text-white';
          default: return 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white';
        }
      },
      getSizeClasses() {
        switch (this.size) {
          case 'small': return 'px-3 py-1 text-xs';
          case 'large': return 'px-5 py-3 text-base';
          default: return 'px-4 py-2 text-sm';
        }
      },
      getShapeClasses() {
        switch (this.shape) {
          case 'round': return 'rounded-full';
          case 'semi-round': return 'rounded-lg';
          default: return 'rounded';
        }
      }
    }
  }
  </script>

  <style scoped>
  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    transition: all 0.2s;
    ${Object.entries(component.styles || {}).map(([key, value]) => `${key}: ${value};`).join('\n  ')}
  }
  </style>`;
  }

  // 导出组件
  async exportComponents(components: ComponentInstance[], appZip: JSZip) {
    const componentsDir = appZip.folder('src/components');
    if (!componentsDir) throw new Error('无法创建组件目录');

    // 导出使用的组件
    const usedComponents = new Set<string>();
    
    components.forEach(component => {
      if (component.componentId === 'text') {
        usedComponents.add('TextComponent');
      } else if (component.componentId === 'button') {
        usedComponents.add('ButtonComponent');
      } else if (component.componentId === 'image') {
        usedComponents.add('ImageComponent');
      }
      // 其他组件类型...
    });

    // 生成每个组件的代码
    for (const component of components) {
      if (component.componentId === 'text') {
        const code = this.generateTextComponentCode(component);
        componentsDir.file('TextComponent.vue', code);
      } else if (component.componentId === 'button') {
        const code = this.generateButtonComponentCode(component);
        componentsDir.file('ButtonComponent.vue', code);
      } else if (component.componentId === 'image') {
        const code = this.generateImageComponentCode(component);
        componentsDir.file('ImageComponent.vue', code);
      }
      // 其他组件类型...
    }

    return Array.from(usedComponents);
  }

  // Add this method to the ProjectGenerator class
  generateImageComponentCode(component: ComponentInstance): string {
    // Get image properties with defaults
    const src = component.props.src || '';
    const alt = component.props.alt || 'Image';
    const width = component.props.width || '100%';
    const height = component.props.height || 'auto';
    
    return `<template>
    <div class="image-component">
      <img 
        v-if="src" 
        :src="src" 
        :alt="alt" 
        :style="computedStyles"
        @error="handleImageError"
      />
      <div v-else class="placeholder-image">
        <i class="pi pi-image text-gray-400 text-4xl"></i>
        <p class="text-gray-400 mt-2">图片未设置</p>
      </div>
    </div>
  </template>

  <script>
  export default {
    name: 'ImageComponent',
    props: {
      src: {
        type: String,
        default: '${src}'
      },
      alt: {
        type: String,
        default: '${alt}'
      },
      styles: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      computedStyles() {
        return {
          width: '${width}',
          height: '${height}',
          ...this.styles
        };
      }
    },
    methods: {
      handleImageError(e) {
        console.warn('图片加载失败:', this.src);
        e.target.alt = '图片加载失败';
      }
    }
  }
  </script>

  <style scoped>
  .image-component {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 50px;
  }

  .placeholder-image {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    border: 1px dashed #ccc;
    border-radius: 4px;
    padding: 20px;
    width: 100%;
    min-height: 120px;
  }
  </style>`;
  }
} 