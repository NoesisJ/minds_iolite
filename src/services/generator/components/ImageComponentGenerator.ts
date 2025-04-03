import { ComponentInstance } from '@/types/designer';
import { ComponentGeneratorInterface } from '../ComponentGeneratorInterface';

export class ImageComponentGenerator implements ComponentGeneratorInterface {
  supportsComponent(componentId: string): boolean {
    return componentId === 'image';
  }
  
  getComponentTypeName(): string {
    return 'ImageComponent';
  }
  
  generateCode(component: ComponentInstance): string {
    // 实现图片组件的代码生成逻辑
    // ...
  }
  
  renderInPage(component: ComponentInstance): string {
    // 实现图片组件在页面中的渲染代码
    // ...
  }
} 