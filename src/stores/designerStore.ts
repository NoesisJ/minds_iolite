import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { ComponentInstance, Page, Region, LayoutTemplate } from '../types/designer';
import { createComponentInstance } from '@/data/componentLibrary';
import { nextTick } from 'vue';

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
    ] as LayoutTemplate[],
    
    // 拖拽相关
    draggedComponentId: '',
    isDragging: false
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
    },
    
    // 选中的区域
    selectedRegion: (state) => {
      const page = state.pages.find(p => p.id === state.currentPageId);
      if (!page || !state.selectedRegionId) return null;
      
      return page.regions.find(r => r.id === state.selectedRegionId);
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
      this.selectedComponentId = '';
      this.selectedRegionId = '';
      return id;
    },
    
    // 删除页面
    deletePage(pageId: string) {
      this.pages = this.pages.filter(p => p.id !== pageId);
      if (this.currentPageId === pageId) {
        this.currentPageId = this.pages.length > 0 ? this.pages[0].id : '';
      }
    },
    
    // 选择页面
    selectPage(pageId: string) {
      this.currentPageId = pageId;
      this.selectedComponentId = '';
      this.selectedRegionId = '';
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
    },
    
    // 开始拖拽组件
    startDrag(componentTypeId: string) {
      this.draggedComponentId = componentTypeId;
      this.isDragging = true;
    },
    
    // 结束拖拽
    endDrag() {
      this.draggedComponentId = '';
      this.isDragging = false;
    },
    
    // 添加组件到区域
    addComponentToRegion(componentTypeId: string, regionId: string) {
      const pageIndex = this.pages.findIndex(p => p.id === this.currentPageId);
      if (pageIndex === -1) return;
      
      const regionIndex = this.pages[pageIndex].regions.findIndex(r => r.id === regionId);
      if (regionIndex === -1) return;
      
      const componentInstance = createComponentInstance(componentTypeId);
      if (!componentInstance) return;
      
      // 添加组件实例到区域
      this.pages[pageIndex].regions[regionIndex].components.push(componentInstance);
      
      // 自动选择新添加的组件
      this.selectedComponentId = componentInstance.id;
      this.selectedRegionId = '';
    },
    
    // 移动组件
    moveComponent(componentId: string, sourceRegionId: string, targetRegionId: string, targetIndex: number) {
      const pageIndex = this.pages.findIndex(p => p.id === this.currentPageId);
      if (pageIndex === -1) return;
      
      // 查找源区域和目标区域
      const sourceRegion = this.pages[pageIndex].regions.find(r => r.id === sourceRegionId);
      const targetRegion = this.pages[pageIndex].regions.find(r => r.id === targetRegionId);
      if (!sourceRegion || !targetRegion) return;
      
      // 查找组件
      const componentIndex = sourceRegion.components.findIndex(c => c.id === componentId);
      if (componentIndex === -1) return;
      
      // 移除组件
      const [component] = sourceRegion.components.splice(componentIndex, 1);
      
      // 添加到目标位置
      targetRegion.components.splice(targetIndex, 0, component);
    },
    
    // 删除组件
    deleteComponent(componentId: string) {
      const pageIndex = this.pages.findIndex(p => p.id === this.currentPageId);
      if (pageIndex === -1) return;
      
      // 在所有区域中查找并删除组件
      for (const region of this.pages[pageIndex].regions) {
        const componentIndex = region.components.findIndex(c => c.id === componentId);
        if (componentIndex !== -1) {
          region.components.splice(componentIndex, 1);
          break;
        }
      }
      
      // 清除选择
      if (this.selectedComponentId === componentId) {
        this.selectedComponentId = '';
      }
    },
    
    // 更新组件属性
    updateComponentProps(componentId: string, props: any) {
      const pageIndex = this.pages.findIndex(p => p.id === this.currentPageId);
      if (pageIndex === -1) return;
      
      // 在所有区域中查找组件
      for (const region of this.pages[pageIndex].regions) {
        const component = region.components.find(c => c.id === componentId);
        if (component) {
          component.props = { ...component.props, ...props };
          break;
        }
      }
    },
    
    // 更新组件样式
    updateComponentStyles(componentId: string, styles: any) {
      const pageIndex = this.pages.findIndex(p => p.id === this.currentPageId);
      if (pageIndex === -1) return;
      
      // 在所有区域中查找组件
      for (const region of this.pages[pageIndex].regions) {
        const component = region.components.find(c => c.id === componentId);
        if (component) {
          // 确保使用新对象触发响应式更新
          component.styles = { 
            ...component.styles, 
            ...styles 
          };
          
          // 使用Vue的next tick确保DOM更新
          nextTick(() => {
            // DOM 更新完成
            console.log('Style updated:', styles);
          });
          
          break;
        }
      }
    }
  }
}); 