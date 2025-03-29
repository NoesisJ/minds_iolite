// 组件定义接口
export interface ComponentDefinition {
  id: string;          // 组件类型唯一标识
  type: string;        // 组件类型，如input、button等
  name: string;        // 组件显示名称
  icon: string;        // 组件图标
  category: string;    // 组件分类，如基础、表单、数据等
  defaultProps: any;   // 组件默认属性
  defaultStyles: any;  // 组件默认样式
  allowedContainers?: string[]; // 允许放置的容器类型
}

// 页面上的实际组件实例接口
export interface ComponentInstance {
  id: string;          // 实例唯一ID
  componentId: string; // 对应的组件定义ID
  props: any;          // 组件实例属性
  styles: any;         // 组件实例样式
  events: any[];       // 组件事件处理
}

// 布局区域类型
export interface Region {
  id: string;          // 区域ID
  name: string;        // 区域名称
  components: ComponentInstance[]; // 区域内的组件
}

// 页面类型
export interface Page {
  id: string;          // 页面ID
  name: string;        // 页面技术名称
  title: string;       // 页面显示标题
  layoutType: string;  // 页面布局类型
  regions: Region[];   // 页面区域
  settings: any;       // 页面设置
}

// 布局模板类型
export interface LayoutTemplate {
  id: string;          // 布局ID 
  name: string;        // 布局名称
  thumbnail: string;   // 布局缩略图
  regions: {
    id: string;
    name: string;
    allowedComponents: string[];
  }[];                 // 布局包含的区域定义
} 