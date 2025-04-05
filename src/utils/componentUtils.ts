import { defineAsyncComponent } from "vue";

// 根据组件类型返回对应的组件
export function getComponentType(type: string) {
  // 只保留已经创建的组件
  switch (type) {
    case "text":
      return defineAsyncComponent(
        () => import("@/components/widgets/TextWidget.vue")
      );
    case "button":
      return defineAsyncComponent(
        () => import("@/components/widgets/ButtonWidget.vue")
      );
    case "image":
      return defineAsyncComponent(
        () => import("@/components/widgets/ImageWidget.vue")
      );
    case "chart":
      return defineAsyncComponent(
        () => import("@/components/widgets/ChartWidget.vue")
      );
    // 其他组件暂时使用占位符
    default:
      console.warn("未知或未实现的组件类型:", type);
      return defineAsyncComponent(
        () => import("@/components/widgets/PlaceholderWidget.vue")
      );
  }
}
