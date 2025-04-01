import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Page } from '@/types/designer';

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
    // 实现代码...
    this.callbacks.onProgress(30, '生成页面组件...');
    // 此处应该有实际的页面组件生成逻辑
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
  
  // 添加缺少的 generateEnvFile 方法
  private generateEnvFile(): string {
    return `# 项目环境配置
VITE_APP_TITLE=${this.settings.name}
VITE_APP_BASE_URL=${this.config.basePath}
${this.config.includeAPI ? 'VITE_APP_ENABLE_MOCK=true' : '# VITE_APP_ENABLE_MOCK=false'}
VITE_APP_API_DELAY=${this.config.apiDelay}
`;
  }
  
  // 添加缺少的 generateVueConfig 方法
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
  
  // 添加缺少的 generateTsConfig 方法
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
} 