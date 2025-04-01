import { defineAsyncComponent } from 'vue';
import { allComponents } from '@/data/componentLibrary';

// 根据组件ID返回对应的组件
export function getComponentType(componentId: string) {
  // 先查找组件定义
  const componentDef = allComponents.find(comp => comp.id === componentId);
  
  // 可以添加调试信息
  console.log('查找组件:', componentId, '找到:', componentDef);
  
  // 根据组件ID返回对应组件
  switch (componentId) {
    case 'text':
      return defineAsyncComponent(() => import('@/components/widgets/TextWidget.vue'));
    case 'button':
      return defineAsyncComponent(() => import('@/components/widgets/ButtonWidget.vue'));
    case 'image':
      return defineAsyncComponent(() => import('@/components/widgets/PlaceholderWidget.vue'));
    // 其他组件暂时使用占位符
    default:
      console.warn('未实现的组件类型:', componentId);
      return defineAsyncComponent(() => import('@/components/widgets/PlaceholderWidget.vue'));
  }
} 