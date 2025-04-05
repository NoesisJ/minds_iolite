import { ComponentInstance } from "@/types/designer";
import { ComponentGeneratorInterface } from "../ComponentGeneratorInterface";

export class ChartComponentGenerator implements ComponentGeneratorInterface {
  supportsComponent(componentId: string): boolean {
    return (
      componentId.startsWith("echarts-") ||
      componentId.startsWith("highcharts-")
    );
  }

  getComponentTypeName(): string {
    return "ChartComponent";
  }

  generateCode(component: ComponentInstance): string {
    const chartType = component.props.chartType || "basic-pie";
    const title = component.props.title || "图表";
    const height = component.props.height || "400px";
    const customClass = component.props.customClass || "";

    // 简化的图表组件代码生成，实际中可能需要更复杂的逻辑
    return `<template>
  <div class="chart-container ${customClass}" style="height: ${height}">
    <h3 class="chart-title">${title}</h3>
    <div class="chart-content" ref="chartRef"></div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts/core';
// 导入必要的echarts组件...

export default {
  name: 'ChartComponent',
  setup() {
    const chartRef = ref(null);
    let chartInstance = null;
    
    onMounted(() => {
      if (chartRef.value) {
        chartInstance = echarts.init(chartRef.value);
        // 设置图表配置...
        chartInstance.setOption({
          // 根据chartType设置不同的配置
          title: { text: '${title}' },
          // 其他配置...
        });
      }
    });
    
    onUnmounted(() => {
      if (chartInstance) {
        chartInstance.dispose();
      }
    });
    
    return { chartRef };
  }
}
</script>

<style scoped>
.chart-container {
  width: 100%;
  display: flex;
  flex-direction: column;
}

.chart-title {
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.chart-content {
  flex-grow: 1;
}
</style>`;
  }

  renderInPage(component: ComponentInstance): string {
    return `<ChartComponent 
  chartType="${component.props.chartType || "basic-pie"}"
  title="${(component.props.title || "图表").replace(/"/g, '\\"')}"
  height="${component.props.height || "400px"}"
  customClass="${component.props.customClass || ""}"
  :styles="${JSON.stringify(component.styles || {}).replace(/"/g, '\\"')}"
/>`;
  }
}
