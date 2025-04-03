import { ComponentInstance } from '@/types/designer';
import { ComponentGeneratorInterface } from '../ComponentGeneratorInterface';

export class ButtonComponentGenerator implements ComponentGeneratorInterface {
  supportsComponent(componentId: string): boolean {
    return componentId === 'button';
  }
  
  getComponentTypeName(): string {
    return 'ButtonComponent';
  }
  
  generateCode(component: ComponentInstance): string {
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
  
  renderInPage(component: ComponentInstance): string {
    const props = component.props || {};
    return `<ButtonComponent 
  label="${(props.label || '按钮').replace(/"/g, '\\"')}"
  status="${props.status || 'primary'}"
  size="${props.size || 'medium'}"
  shape="${props.shape || 'rectangle'}"
  ${props.hero ? 'hero' : ''}
  ${props.outline ? 'outline' : ''}
  ${props.ghost ? 'ghost' : ''}
  ${props.disabled ? 'disabled' : ''}
  ${props.icon ? `icon="${props.icon.replace(/"/g, '\\"')}"` : ''}
  :styles="${JSON.stringify(component.styles || {}).replace(/"/g, '\\"')}"
/>`;
  }
} 