import { ComponentInstance } from "@/types/designer";

export interface ComponentGeneratorInterface {
  /**
   * 检查生成器是否支持特定组件类型
   * @param componentId 组件类型ID
   * @returns 是否支持该组件类型
   */
  supportsComponent(componentId: string): boolean;

  /**
   * 生成组件代码
   * @param component 组件实例
   * @returns 生成的Vue组件代码
   */
  generateCode(component: ComponentInstance): string;

  /**
   * 获取组件类型名称
   * @returns 组件类型名称
   */
  getComponentTypeName(): string;

  /**
   * 在页面中渲染组件的代码片段
   * @param component 组件实例
   * @returns 页面中使用的组件代码
   */
  renderInPage(component: ComponentInstance): string;
}
