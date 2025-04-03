import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Page, ComponentInstance } from '@/types/designer';
import { componentGeneratorRegistry } from './index';

// 回调函数接口
export interface ProjectGeneratorCallbacks {
  onProgress: (progress: number, message: string) => void;
  onComplete: (zipBlob: Blob) => void;
  onError: (error: Error) => void;
  onLog: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
}

// 项目设置类型
export interface ProjectSettings {
  name: string;
  version: string;
  author: string;
  description: string;
}

export class ProjectGenerator {
  private zip: JSZip;
  private pages: Page[];
  private settings: ProjectSettings;
  private callbacks: ProjectGeneratorCallbacks;

  constructor(
    pages: Page[],
    settings: ProjectSettings,
    callbacks: ProjectGeneratorCallbacks
  ) {
    this.zip = new JSZip();
    this.pages = pages;
    this.settings = settings;
    this.callbacks = callbacks;
  }

  // 开始生成项目
  async generate(): Promise<void> {
    try {
      this.callbacks.onProgress(10, '初始化项目...');
      await this.initializeProject();

      this.callbacks.onProgress(20, '生成页面结构...');
      await this.generatePageStructure();

      await this.generatePageComponents();

      this.callbacks.onProgress(50, '生成路由配置...');
      await this.generateRoutes();

      this.callbacks.onProgress(70, '生成项目配置...');
      await this.generateConfig();

      this.callbacks.onProgress(90, '打包项目文件...');
      const zipBlob = await this.zip.generateAsync({ type: 'blob' });

      this.callbacks.onProgress(100, '项目生成完成');
      this.callbacks.onComplete(zipBlob);
    } catch (error) {
      this.callbacks.onError(error as Error);
    }
  }

  // 初始化项目
  private async initializeProject(): Promise<void> {
    // 创建项目结构
    this.zip.folder('src');
    this.zip.folder('src/components');
    this.zip.folder('src/components/generated');
    this.zip.folder('src/views');
    this.zip.folder('src/router');
    this.zip.folder('src/assets');
    this.zip.folder('public');

    // 创建基本文件
    this.generatePackageJson();
    this.generateMainJs();
    this.generateAppVue();
    this.generateIndexHtml();
  }

  // 生成页面结构
  private async generatePageStructure(): Promise<void> {
    // 遍历所有页面，生成视图文件
    for (const page of this.pages) {
      const pageCode = this.generatePage(page, []);
      this.zip.file(`src/views/${this.getPageFileName(page)}.vue`, pageCode);
    }
  }

  // 生成页面组件
  private async generatePageComponents(): Promise<void> {
    this.callbacks.onProgress(30, '生成页面组件...');
    
    // 用于记录生成的所有组件，避免重复生成
    const generatedComponents = new Set<string>();
    
    // 遍历所有页面
    for (const page of this.pages) {
      if (!page.regions || page.regions.length === 0) {
        this.callbacks.onLog(`警告: 页面 "${page.title}" 没有定义区域`, 'warning');
        continue;
      }
      
      // 遍历页面中的所有区域
      for (const region of page.regions) {
        if (!region.components || region.components.length === 0) {
          continue; // 跳过空区域
        }
        
        // 遍历区域中的所有组件
        for (const component of region.components) {
          // 如果已经生成过该组件，跳过
          if (generatedComponents.has(component.id)) {
            continue;
          }
          
          // 获取对应的组件生成器
          const generator = componentGeneratorRegistry.getGeneratorForComponent(component.componentId);
          
          if (generator) {
            const componentCode = generator.generateCode(component);
            
            // 将组件代码写入ZIP文件
            const typeName = generator.getComponentTypeName();
            const componentPath = `src/components/generated/${typeName}${component.id}.vue`;
            this.zip.file(componentPath, componentCode);
            
            // 标记该组件已生成
            generatedComponents.add(component.id);
            
            this.callbacks.onLog(`已生成组件: ${typeName}${component.id}`, 'info');
          } else {
            this.callbacks.onLog(`未找到组件 ${component.componentId} 的生成器`, 'warning');
          }
        }
      }
    }
    
    // 更新进度
    this.callbacks.onProgress(40, '组件生成完成');
  }

  // 生成路由配置
  private async generateRoutes(): Promise<void> {
    // 生成路由配置代码
    let routesCode = `
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
`;

    // 为每个页面添加路由
    for (const page of this.pages) {
      routesCode += `  {
    path: '/${page.path || this.getPagePath(page)}',
    name: '${page.name || page.title}',
    component: () => import('@/views/${this.getPageFileName(page)}.vue')
  },
`;
    }

    // 添加默认重定向
    if (this.pages.length > 0) {
      const firstPage = this.pages[0];
      routesCode += `  {
    path: '/',
    redirect: '/${firstPage.path || this.getPagePath(firstPage)}'
  },
`;
    }

    // 关闭路由数组和添加路由创建
    routesCode += `]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
`;

    // 保存路由文件
    this.zip.file('src/router/index.js', routesCode);
  }

  // 生成项目配置
  private async generateConfig(): Promise<void> {
    // TODO: 根据需要添加更多配置文件的生成
  }

  // 生成package.json
  private generatePackageJson(): void {
    const packageJson = {
      name: this.settings.name.toLowerCase().replace(/\s+/g, '-'),
      version: this.settings.version,
      private: true,
      author: this.settings.author,
      description: this.settings.description,
      scripts: {
        serve: 'vue-cli-service serve',
        build: 'vue-cli-service build',
        lint: 'vue-cli-service lint'
      },
      dependencies: {
        'core-js': '^3.8.3',
        'vue': '^3.2.13',
        'vue-router': '^4.0.3',
        'primevue': '^3.15.0',
        'primeicons': '^5.0.0'
      },
      devDependencies: {
        '@vue/cli-plugin-babel': '~5.0.0',
        '@vue/cli-plugin-router': '~5.0.0',
        '@vue/cli-plugin-typescript': '~5.0.0',
        '@vue/cli-service': '~5.0.0',
        'typescript': '~4.5.5'
      },
      browserslist: [
        '> 1%',
        'last 2 versions',
        'not dead',
        'not ie 11'
      ]
    };

    this.zip.file('package.json', JSON.stringify(packageJson, null, 2));
  }

  // 生成main.js
  private generateMainJs(): void {
    const mainJs = `import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import 'primevue/resources/themes/lara-light-indigo/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

const app = createApp(App)
app.use(router)
app.use(PrimeVue)
app.mount('#app')
`;

    this.zip.file('src/main.js', mainJs);
  }

  // 生成App.vue
  private generateAppVue(): void {
    const appVue = `<template>
  <router-view/>
</template>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
}
</style>
`;

    this.zip.file('src/App.vue', appVue);
  }

  // 生成index.html
  private generateIndexHtml(): void {
    const indexHtml = `<!DOCTYPE html>
<html lang="">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link rel="icon" href="<%= BASE_URL %>favicon.ico">
    <title>${this.settings.name}</title>
  </head>
  <body>
    <noscript>
      <strong>We're sorry but ${this.settings.name} doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
    </noscript>
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
</html>
`;

    this.zip.file('public/index.html', indexHtml);
  }

  // 导出组件
  async exportComponents(components: ComponentInstance[], appZip: JSZip) {
    const componentsDir = appZip.folder('src/components');
    if (!componentsDir) throw new Error('无法创建组件目录');

    // 导出使用的组件
    const usedComponents = new Set<string>();
    
    // 使用组件生成器找到使用的组件类型
    for (const component of components) {
      const generator = componentGeneratorRegistry.getGeneratorForComponent(component.componentId);
      if (generator) {
        usedComponents.add(generator.getComponentTypeName());
      }
    }

    // 生成每个组件类型的代码
    for (const generator of componentGeneratorRegistry.getAllGenerators()) {
      // 如果这种类型的组件被使用
      if (usedComponents.has(generator.getComponentTypeName())) {
        // 使用第一个该类型的组件作为模板
        const templateComponent = components.find(c => {
          const comp = componentGeneratorRegistry.getGeneratorForComponent(c.componentId);
          return comp === generator;
        });
        
        if (templateComponent) {
          const code = generator.generateCode(templateComponent);
          componentsDir.file(`${generator.getComponentTypeName()}.vue`, code);
        }
      }
    }

    return Array.from(usedComponents);
  }
  
  // 生成页面
  private generatePage(page: Page, usedComponents: string[]): string {
    // 导入部分
    let imports = `<script>
import { defineComponent } from 'vue'
`;
    
    // 添加组件导入
    for (const component of usedComponents) {
      imports += `import ${component} from '@/components/${component}.vue'\n`;
    }
    
    // 组件渲染函数
    const componentCode = (component: ComponentInstance): string => {
      const generator = componentGeneratorRegistry.getGeneratorForComponent(component.componentId);
      if (generator) {
        return generator.renderInPage(component);
      }
      return `<div>未知组件类型: ${component.componentId}</div>`;
    };
    
    // 完成脚本部分
    imports += `
export default defineComponent({
  name: '${page.name || page.title}Page',
  components: {
    ${usedComponents.join(',\n    ')}
  }
})
</script>
`;
    
    // 模板部分
    let template = `<template>
  <div class="page-container">
    <h1>${page.title}</h1>
    
    <!-- 页面内容 -->
`;
    
    // 添加区域内容
    if (page.regions && page.regions.length > 0) {
      for (const region of page.regions) {
        template += `    <div class="region ${region.id}">
`;
        
        // 添加区域中的组件
        if (region.components && region.components.length > 0) {
          for (const component of region.components) {
            template += `      ${componentCode(component)}
`;
          }
        } else {
          template += `      <div class="empty-region">空区域</div>
`;
        }
        
        template += `    </div>
`;
      }
    } else {
      template += `    <div class="empty-page">此页面没有内容</div>
`;
    }
    
    // 关闭模板
    template += `  </div>
</template>
`;
    
    // 样式部分
    const style = `
<style scoped>
.page-container {
  padding: 1rem;
}

.region {
  margin-bottom: 1rem;
}

.empty-region {
  padding: 1rem;
  border: 1px dashed #ccc;
  text-align: center;
  color: #999;
}

.empty-page {
  padding: 2rem;
  text-align: center;
  color: #999;
}
</style>
`;
    
    // 组合所有部分
    return template + imports + style;
  }
  
  // 获取页面文件名
  private getPageFileName(page: Page): string {
    return page.name || page.title.replace(/\s+/g, '');
  }
  
  // 获取页面路径
  private getPagePath(page: Page): string {
    return page.name?.toLowerCase() || page.title.toLowerCase().replace(/\s+/g, '-');
  }
} 