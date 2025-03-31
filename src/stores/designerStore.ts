import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { ComponentInstance, Page, Region, LayoutTemplate } from '../types/designer';
import { createComponentInstance } from '@/data/componentLibrary';
import { nextTick } from 'vue';
import { baseComponents } from '@/data/componentLibrary';

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
    createPage() {
      // 生成页面序号，如 1, 2, 3...
      const pageNumber = this.pages.length + 1;
      
      const pageId = uuidv4();
      const newPage: Page = {
        id: pageId,
        name: `page_${pageNumber}`,
        title: `新页面 ${pageNumber}`,
        layoutType: '',
        regions: [],
        settings: {}
      };
      
      this.pages.push(newPage);
      this.currentPageId = pageId;
      this.selectedComponentId = '';
      this.selectedRegionId = '';
      
      console.log('新页面已创建:', pageId);
      return pageId;
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
      console.log('选择页面:', pageId);
      this.currentPageId = pageId;
      // 确保清除选中的组件和区域
      this.selectedComponentId = '';
      this.selectedRegionId = '';
    },
    
    // 处理页面选择 - 从工具栏调用
    handlePageSelection(pageId: string) {
      console.log('工具栏选择页面:', pageId);
      this.selectPage(pageId);
    },
    
    // 应用布局模板
    applyLayout(layoutId: string) {
      if (!this.currentPageId) return;
      
      this.setPageLayout(this.currentPageId, layoutId);
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
    addComponentToRegion(componentId: string, regionId: string) {
      const pageIndex = this.pages.findIndex(p => p.id === this.currentPageId);
      if (pageIndex === -1) {
        console.warn('无法添加组件：当前页面不存在');
        return;
      }
      
      const regionIndex = this.pages[pageIndex].regions.findIndex(r => r.id === regionId);
      if (regionIndex === -1) {
        console.warn('无法添加组件：目标区域不存在', regionId);
        return;
      }
      
      // 获取组件定义
      const componentDef = baseComponents.find(c => c.id === componentId);
      if (!componentDef) {
        console.warn('无法添加组件：组件不存在', componentId);
        return;
      }
      
      // 创建组件实例
      const componentInstance = createComponentInstance(componentDef);
      
      // 添加到区域
      this.pages[pageIndex].regions[regionIndex].components.push(componentInstance);
      
      // 选中新添加的组件
      this.selectedComponentId = componentInstance.id;
      this.selectedRegionId = '';
      
      console.log('组件已添加到区域', componentInstance);
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
    },
    
    // 更新页面属性
    updatePageProperty(pageId: string, property: string, value: any) {
      const pageIndex = this.pages.findIndex(p => p.id === pageId);
      if (pageIndex === -1) {
        console.warn('无法更新页面属性: 页面不存在', pageId, property);
        return;
      }
      
      console.log('更新页面属性:', pageId, property, value);
      // 使用解构和对象传播创建新对象以保持响应式
      this.pages[pageIndex] = {
        ...this.pages[pageIndex],
        [property]: value
      };
    },
    
    // 设置页面布局
    setPageLayout(pageId: string, layoutId: string) {
      const pageIndex = this.pages.findIndex(p => p.id === pageId);
      if (pageIndex === -1) return;
      
      const layout = this.layoutTemplates.find(l => l.id === layoutId);
      if (!layout) return;
      
      // 更新布局类型
      this.pages[pageIndex].layoutType = layoutId;
      
      // 创建区域
      const regions: Region[] = layout.regions.map(regionDef => ({
        id: uuidv4(),
        name: regionDef.name,
        components: []
      }));
      
      // 更新区域
      this.pages[pageIndex].regions = regions;
    },
    
    // 如果 updatePageTitle 方法不存在，添加它
    updatePageTitle(pageId: string, title: string) {
      this.updatePageProperty(pageId, 'title', title);
    },
    
    // 创建组件实例
    createComponent(type: string, props = {}) {
      return {
        id: uuidv4(),
        type,
        props,
        styles: {}
      };
    }
  }
}); 