import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';

// 定义页面模型接口
export interface Page {
  id: string;
  name: string;
  title: string;
  layoutType: string;
  regions: Region[];
  settings: any;
}

// 定义区域模型接口
export interface Region {
  id: string;
  name: string;
  components: any[];
}

// 定义布局模板接口
export interface LayoutTemplate {
  id: string;
  name: string;
  thumbnail: string;
  regions: { id: string; name: string; allowedComponents: string[] }[];
}

export const useDesignerStore = defineStore('designer', {
  state: () => ({
    // 页面列表
    pages: [] as Page[],
    // 当前页面ID
    currentPageId: '',
    // 选中的组件ID
    selectedComponentId: '',
    // 选中的区域ID
    selectedRegionId: '',
    // 布局模板
    layoutTemplates: [
      {
        id: 'table-layout',
        name: '数据表格布局',
        thumbnail: '/layouts/table-layout.png',
        regions: [
          { id: 'header', name: '头部', allowedComponents: ['title', 'search', 'filter'] },
          { id: 'content', name: '内容区', allowedComponents: ['table'] },
          { id: 'footer', name: '底部', allowedComponents: ['pagination'] }
        ]
      },
      {
        id: 'dashboard-layout',
        name: '仪表盘布局',
        thumbnail: '/layouts/dashboard-layout.png',
        regions: [
          { id: 'header', name: '头部', allowedComponents: ['title', 'filter'] },
          { id: 'left', name: '左侧', allowedComponents: ['chart', 'card'] },
          { id: 'right', name: '右侧', allowedComponents: ['chart', 'list', 'card'] }
        ]
      },
      {
        id: 'form-layout',
        name: '表单布局',
        thumbnail: '/layouts/form-layout.png',
        regions: [
          { id: 'header', name: '头部', allowedComponents: ['title'] },
          { id: 'form', name: '表单区', allowedComponents: ['form'] },
          { id: 'buttons', name: '操作区', allowedComponents: ['button'] }
        ]
      }
    ] as LayoutTemplate[]
  }),
  
  getters: {
    // 获取当前页面
    currentPage: (state) => {
      return state.pages.find(page => page.id === state.currentPageId) || null;
    },
    
    // 获取当前选中的组件
    selectedComponent: (state) => {
      if (!state.currentPageId || !state.selectedComponentId) return null;
      
      const page = state.pages.find(p => p.id === state.currentPageId);
      if (!page) return null;
      
      for (const region of page.regions) {
        const component = region.components.find(c => c.id === state.selectedComponentId);
        if (component) return component;
      }
      
      return null;
    }
  },
  
  actions: {
    // 创建新页面
    createPage(name: string, title: string) {
      const id = uuidv4();
      const newPage: Page = {
        id,
        name,
        title,
        layoutType: '',
        regions: [],
        settings: {}
      };
      
      this.pages.push(newPage);
      this.currentPageId = id;
      return id;
    },
    
    // 应用布局模板
    applyLayout(layoutId: string) {
      if (!this.currentPageId) return;
      
      const template = this.layoutTemplates.find(t => t.id === layoutId);
      if (!template) return;
      
      const pageIndex = this.pages.findIndex(p => p.id === this.currentPageId);
      if (pageIndex === -1) return;
      
      // 创建区域
      const regions: Region[] = template.regions.map(r => ({
        id: uuidv4(),
        name: r.name,
        components: []
      }));
      
      // 更新页面
      this.pages[pageIndex].layoutType = layoutId;
      this.pages[pageIndex].regions = regions;
    },
    
    // 选择组件
    selectComponent(componentId: string) {
      this.selectedComponentId = componentId;
      this.selectedRegionId = '';
    },
    
    // 选择区域
    selectRegion(regionId: string) {
      this.selectedRegionId = regionId;
      this.selectedComponentId = '';
    }
  }
}); 