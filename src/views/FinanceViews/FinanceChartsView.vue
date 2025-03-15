<template>
  <div class="chartsGroup">
    <div class="date-selector">
      <label for="startDate">选择起始月份：</label>
      <input 
        type="month" 
        id="startDate" 
        v-model="startDateStr" 
        @change="handleDateChange" 
        class="date-input"
      />
    </div>
    <div ref="groupChartContainer" style="width: 50%; height: 100vh"></div>
    <div ref="branchChartContainer" style="width: 50%; height: 100vh"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import * as echarts from "echarts";
import { financeApi } from "../../api/finance.ts";
// import type { Item } from "../../api/finance.ts";

// 图表容器引用
const groupChartContainer = ref<HTMLDivElement | null>(null); // 组别财务图表容器
const branchChartContainer = ref<HTMLDivElement | null>(null); // 兵种财务图表容器

// 存储图表实例
const chartInstances = ref<{ [key: string]: echarts.ECharts }>({});

// 日期选择器
const startDateStr = ref(getDefaultStartDate());

// 获取默认起始日期（当前日期前6个月）
function getDefaultStartDate() {
  const date = new Date();
  date.setMonth(date.getMonth() - 5); 
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

// 处理日期变更
const handleDateChange = () => {
  // 重新初始化图表
  initCharts();
};

// 获取从指定日期开始的6个月的月份名称
const getLastSixMonths = () => {
  const months = [];
  const startDate = new Date(startDateStr.value);
  
  for (let i = 0; i < 6; i++) {
    const month = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
    const monthName = month.toLocaleDateString('zh-CN', { month: 'short', year: 'numeric' });
    months.push(monthName);
  }
  return months;
};

// 处理财务数据，按组别和兵种分类
const processFinanceData = (data: any[] = []) => {
  // 安全校验
  if (!Array.isArray(data)) return { groupChartData: [], branchChartData: [] };
  console.log('处理财务数据开始，原始数据:', JSON.stringify(data.slice(0, 2)));
  
  // 按组别和兵种分类的数据
  const groupData: { [key: string]: { [month: string]: number } } = {};
  const branchData: { [key: string]: { [month: string]: number } } = {};
  
  // 获取指定起始日期后的6个月的月份
  const months = getLastSixMonths();
  
  // 映射API返回的字段名称
  const mapItem = (item: any) => {
    const group = item.group || item.group_name || '';
    
    // 改进兵种字段的处理逻辑
    // 尝试从多个可能的字段中获取兵种信息
    let branch = '';
    if (item.branch && item.branch !== '') {
      branch = item.branch;
    } else if (item.troop_type_project && item.troop_type_project !== '') {
      branch = item.troop_type_project;
    } else if (item.troop_type && item.troop_type !== '') {
      branch = item.troop_type;
    } else if (item.project && item.project !== '') {
      // 如果有项目字段，可以作为兵种分类的备选
      branch = item.project;
    } else {
      // 如果没有任何兵种相关信息，根据组别分配默认兵种
      const groupToBranchMap: {[key: string]: string} = {
        '机械': '机械兵种',
        '电控': '电控兵种',
        '运营': '运营兵种',
        '软件': '软件兵种',
        'AI': 'AI兵种',
        '视觉': '视觉兵种'
      };
      branch = groupToBranchMap[item.group || item.group_name || ''] || '未分类';
    }
    
    const date = item.date || item.post_date || '';
    const unitPrice = item.unitPrice !== undefined ? Number(item.unitPrice) : Number(item.price || 0);
    const shippingCost = item.shippingCost !== undefined ? Number(item.shippingCost) : Number(item.extra_price || 0);
    const quantity = Number(item.quantity || 0);
    
    return {
      ...item,
      group,
      branch,
      date,
      unitPrice,
      shippingCost,
      quantity
    };
  };
  
  // 映射并过滤有效项
  const mappedItems = data.map(mapItem);
  const validItems = mappedItems.filter(item => {
    // 确保项目至少有组别信息，兵种可以使用默认值'未分类'
    return item && (item.group || item.group_name);
  });
  
  console.log('映射后有效数据条目数:', validItems.length);
  if (validItems.length > 0) {
    console.log('样本数据:', JSON.stringify(validItems[0]));
  }
  
  // 初始化数据结构
  validItems.forEach(item => {
    if (!groupData[item.group]) {
      groupData[item.group] = {};
      months.forEach(month => groupData[item.group][month] = 0);
    }
    
    if (!branchData[item.branch]) {
      branchData[item.branch] = {};
      months.forEach(month => branchData[item.branch][month] = 0);
    }
  });
  
  // 汇总数据
  validItems.forEach(item => {
    const itemDate = item?.date ? new Date(item.date) : new Date();
    const itemMonth = itemDate.toLocaleDateString('zh-CN', { month: 'short', year: 'numeric' });
    
    // 安全访问对象属性
    const safeNumber = (value: any) => Math.max(Number(value) || 0, 0);
    
    // 获取组别和兵种，确保使用映射后的值
    const group = item.group || '';
    const branch = item.branch || '';
    
    if (months.includes(itemMonth) && groupData[group] && branchData[branch]) {
      // 手动计算总价
      const unitPrice = safeNumber(item.unitPrice);
      const quantity = safeNumber(item.quantity);
      const shippingCost = safeNumber(item.shippingCost);
      const totalPrice = unitPrice * quantity + shippingCost;
      
      console.log(`项目[${item.name}] - 单价:${unitPrice}, 数量:${quantity}, 运费:${shippingCost}, 总价:${totalPrice}`);
      
      if (group && groupData[group] && groupData[group][itemMonth] !== undefined) {
        groupData[group][itemMonth] += totalPrice;
      }
      
      if (branch && branchData[branch] && branchData[branch][itemMonth] !== undefined) {
        branchData[branch][itemMonth] += totalPrice;
      }
    }
  });
  
  // 转换为ECharts数据格式
  const formatChartData = (data: { [key: string]: { [month: string]: number } }, months: string[]) => {
    const result = [
      ['product', ...months]
    ];
    
    console.log('格式化前的数据结构:', JSON.stringify(data));
    
    Object.keys(data).forEach(key => {
      const rowData = [key];
      months.forEach(month => {
        // 将数值转换为字符串类型以匹配ECharts期望的数据类型，并保留两位小数
        const value = data[key][month];
        console.log(`${key} - ${month}: 原始值=${value}, 类型=${typeof value}`);
        // 格式化为两位小数
        const formattedValue = Number(value).toFixed(2);
        rowData.push(String(formattedValue));
      });
      result.push(rowData);
      console.log(`${key}的行数据:`, rowData);
    });
    
    return result;
  };
  
  return {
    groupChartData: formatChartData(groupData, months),
    branchChartData: formatChartData(branchData, months)
  };
};

// 初始化图表
const initCharts = async () => {
  try {
    // 获取财务数据
    const response = await financeApi.getList();
    console.log('API响应数据结构:', JSON.parse(JSON.stringify(response)));
    
    // 修改数据获取逻辑，检查response的不同属性
    let financeData = [];
    if (response && response.data) {
      financeData = Array.isArray(response.data) ? response.data : [];
    } else if (response && Array.isArray(response)) {
      financeData = response;
    }
    console.log('原始数据条目数:', financeData.length);
    
    // 处理后的数据输出
    const { groupChartData, branchChartData } = processFinanceData(financeData);
    
    // 处理后数据输出
    console.log('处理后组别数据结构:', groupChartData);
    console.log('处理后兵种数据结构:', branchChartData);
    
    // 初始化组别财务图表
    if (groupChartContainer.value) {
      const groupChart = echarts.init(groupChartContainer.value, null, {
        renderer: 'canvas',
        useDirtyRect: false
      });
      chartInstances.value['group'] = groupChart;
      
      // 显示加载状态
      groupChart.showLoading({
        text: '数据加载中...',
        color: '#ee82ee',
        textColor: '#fff',
        maskColor: 'rgba(0, 0, 0, 0.2)'
      });
      
      // 设置图表配置
      const groupOption = getChartOption('组别财务数据', groupChartData);
      groupChart.hideLoading();
      groupChart.setOption(groupOption);
      
      // 绑定更新轴指针的事件 - 添加passive选项
      groupChart.on("updateAxisPointer", (event: any) => {
        const xAxisInfo = event.axesInfo[0];
        if (xAxisInfo) {
          const dimension = xAxisInfo.value + 1;
          groupChart.setOption({
            series: {
              id: "pie",
              label: {
                formatter: `{b}: {@[${dimension}]} ({d}%)`,
              },
              encode: {
                value: dimension,
                tooltip: dimension,
              },
            },
          });
        }
      }, { passive: true });
    }
    
    // 初始化兵种财务图表
    if (branchChartContainer.value) {
      const branchChart = echarts.init(branchChartContainer.value, null, {
        renderer: 'canvas',
        useDirtyRect: false
      });
      chartInstances.value['branch'] = branchChart;
      
      // 显示加载状态
      branchChart.showLoading({
        text: '数据加载中...',
        color: '#ee82ee',
        textColor: '#fff',
        maskColor: 'rgba(0, 0, 0, 0.2)'
      });
      
      // 设置图表配置
      const branchOption = getChartOption('兵种财务数据', branchChartData);
      branchChart.hideLoading();
      branchChart.setOption(branchOption);
      
      // 绑定更新轴指针的事件 - 添加passive选项
      branchChart.on("updateAxisPointer", (event: any) => {
        const xAxisInfo = event.axesInfo[0];
        if (xAxisInfo) {
          const dimension = xAxisInfo.value + 1;
          branchChart.setOption({
            series: {
              id: "pie",
              label: {
                formatter: `{b}: {@[${dimension}]} ({d}%)`,
              },
              encode: {
                value: dimension,
                tooltip: dimension,
              },
            },
          });
        }
      }, { passive: true });
    }
  } catch (error) {
    console.error('初始化图表失败:', error);
    // 显示错误信息在图表中
    showErrorInCharts('初始化图表失败: ' + (error instanceof Error ? error.message : '未知错误'));
  }
};

// 生成图表配置
const getChartOption = (title: string, data: any[]) => {
  console.log(`生成${title}图表配置，数据结构:`, JSON.stringify(data));
  return {
    title: {
      text: title,
      left: 'center',
      top: '2%',
      textStyle: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold'
      }
    },
    legend: {
      top: "8%", // 设置图例距顶部的距离
      left: "center", // 设置图例居中
      textStyle: {
        fontFamily: "Arial", // 设置字体
        fontSize: 14, // 设置字体大小
        fontWeight: "normal", // 设置字体粗细
        color: "#000", // 设置字体颜色
      },
    },
    tooltip: {
      trigger: "axis",
      showContent: false,
    },
    dataset: {
      source: data
    },
    xAxis: { type: "category" },
    yAxis: { gridIndex: 0 },
    // 设置曲线图的位置
    grid: {
      top: "45%",
      bottom: "15%",
    },
    series: [
      ...Array(data.length - 1).fill(0).map((_, index) => {
        console.log(`创建第${index+1}条线图系列，对应数据行:`, data[index+1]);
        return {
          type: "line",
          smooth: true,
          seriesLayoutBy: "row",
          emphasis: { focus: "series" },
        };
      }),
      {
        type: "pie",
        id: "pie",
        radius: "25%",
        // 设置饼图的位置
        center: ["50%", "25%"],
        emphasis: { focus: "self" },
        label: {
          formatter: "{b}: {@" + data[0][1] + "} ({d}%)",
          // 以下设置字体样式
          fontFamily: "Arial",
          fontSize: 15,
          fontWeight: "normal",
          color: "#000",
        },
        // 设置数据
        encode: {
          itemName: "product",
          value: data[0][1],
          tooltip: data[0][1],
        },
      },
    ],
  };
};

// 在图表中显示错误信息
const showErrorInCharts = (errorMessage: string) => {
  // 创建或获取图表实例并显示错误
  const showErrorInChart = (container: HTMLDivElement | null, chartKey: string) => {
    if (container) {
      let chart = chartInstances.value[chartKey];
      if (!chart) {
        chart = echarts.init(container);
        chartInstances.value[chartKey] = chart;
      }
      
      chart.hideLoading();
      chart.setOption({
        title: {
          text: errorMessage,
          left: 'center',
          top: 'center',
          textStyle: {
            color: '#ee82ee',
            fontSize: 16
          }
        },
        series: []
      });
    }
  };
  
  showErrorInChart(groupChartContainer.value, 'group');
  showErrorInChart(branchChartContainer.value, 'branch');
};

// 处理窗口大小变化
const handleResize = () => {
  Object.values(chartInstances.value).forEach((chart) => {
    chart.resize();
  });
};

onMounted(() => {
  // 初始化图表
  initCharts();
  
  // 添加窗口大小变化监听
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  // 移除窗口大小变化监听
  window.removeEventListener("resize", handleResize);
  
  // 销毁图表实例
  Object.values(chartInstances.value).forEach((chart) => {
    chart.dispose();
  });
});
</script>

<style scoped>
.chartsGroup {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 100%;
  height: 100%;
  padding: 10px;
}

.date-selector {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
}

.date-input {
  margin-left: 10px;
  padding: 5px 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  background-color: #fff;
  color: #000;
}

label {
  font-size: 16px;
  font-weight: bold;
}
</style>
