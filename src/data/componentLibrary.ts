import { ComponentDefinition } from '@/types/designer';
import { v4 as uuidv4 } from 'uuid';

// 基础组件库
export const baseComponents: ComponentDefinition[] = [
  {
    id: 'text',
    type: 'text',
    name: '文本',
    icon: 'pi pi-pencil',
    category: 'basic',
    defaultProps: {
      content: '文本内容',
      fontSize: '16px',
      textAlign: 'left',
      color: '#333333',
    },
    defaultStyles: {
      padding: '8px',
      margin: '0px',
    }
  },
  {
    id: 'image',
    type: 'image',
    name: '图片',
    icon: 'pi pi-image',
    category: 'basic',
    defaultProps: {
      src: '',
      alt: '图片',
      width: '100%',
      height: 'auto',
    },
    defaultStyles: {
      margin: '8px 0',
    }
  },
  {
    id: 'button',
    type: 'button',
    name: '按钮',
    icon: 'pi pi-check-square',
    category: 'basic',
    defaultProps: {
      label: '按钮',
      type: 'primary',
      size: 'medium',
    },
    defaultStyles: {
      margin: '8px 0',
    }
  }
];

// 表单组件库
export const formComponents: ComponentDefinition[] = [
  {
    id: 'input',
    type: 'input',
    name: '输入框',
    icon: 'pi pi-pencil',
    category: 'form',
    defaultProps: {
      placeholder: '请输入',
      label: '输入框',
      required: false,
    },
    defaultStyles: {
      width: '100%',
      margin: '8px 0',
    }
  },
  {
    id: 'select',
    type: 'select',
    name: '下拉选择',
    icon: 'pi pi-chevron-down',
    category: 'form',
    defaultProps: {
      placeholder: '请选择',
      label: '下拉选择',
      options: [
        { label: '选项1', value: '1' },
        { label: '选项2', value: '2' },
      ],
      required: false,
    },
    defaultStyles: {
      width: '100%',
      margin: '8px 0',
    }
  }
];

// 数据组件库
export const dataComponents: ComponentDefinition[] = [
  {
    id: 'table',
    type: 'table',
    name: '表格',
    icon: 'pi pi-table',
    category: 'data',
    defaultProps: {
      columns: [
        { field: 'id', header: 'ID' },
        { field: 'name', header: '名称' },
      ],
      data: [],
      pagination: true,
    },
    defaultStyles: {
      width: '100%',
      margin: '12px 0',
    }
  },
  {
    id: 'chart',
    type: 'chart',
    name: '图表',
    icon: 'pi pi-chart-bar',
    category: 'data',
    defaultProps: {
      type: 'bar',
      title: '图表标题',
      data: [],
    },
    defaultStyles: {
      width: '100%',
      height: '300px',
      margin: '12px 0',
    }
  }
];

// 合并所有组件
export const allComponents = [
  ...baseComponents,
  ...formComponents,
  ...dataComponents
];

// 根据类型获取组件定义
export function getComponentDefinition(id: string): ComponentDefinition | undefined {
  return allComponents.find(comp => comp.id === id);
}

// 创建组件实例
export function createComponentInstance(componentId: string) {
  const definition = getComponentDefinition(componentId);
  if (!definition) return null;
  
  return {
    id: uuidv4(),
    componentId,
    props: { ...definition.defaultProps },
    styles: { ...definition.defaultStyles },
    events: []
  };
}

// 组件分类
export const componentCategories = [
  { id: 'basic', name: '基础组件' },
  { id: 'form', name: '表单组件' },
  { id: 'data', name: '数据组件' },
]; 