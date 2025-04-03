import { ComponentInstance } from '@/types/designer';
import { ComponentGeneratorInterface } from '../ComponentGeneratorInterface';

export class TextComponentGenerator implements ComponentGeneratorInterface {
  supportsComponent(componentId: string): boolean {
    return componentId === 'text';
  }
  
  getComponentTypeName(): string {
    return 'TextComponent';
  }
  
  generateCode(component: ComponentInstance): string {
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
  name: 'TextComponent',
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
  
  renderInPage(component: ComponentInstance): string {
    return `<TextComponent 
  content="${(component.props.content || '').replace(/"/g, '\\"')}" 
  :styles="${JSON.stringify(component.styles || {}).replace(/"/g, '\\"')}" 
/>`;
  }
} 