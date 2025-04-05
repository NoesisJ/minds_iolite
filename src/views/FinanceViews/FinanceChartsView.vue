<template>
  <div class="chartsGroup">
    <div ref="groupChartContainer" style="width: 50%; height: 100vh"></div>
    <div class="center-date-selector">
      <DatePicker
        v-model="startDate"
        dateFormat="yy-mm"
        placeholder="请选择起始月份"
        class="date-picker"
        @date-select="handleDateChange"
        view="month"
        :showIcon="true"
      />
    </div>
    <div ref="branchChartContainer" style="width: 50%; height: 100vh"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import * as echarts from "echarts";
import type { EChartsOption, PieSeriesOption, LineSeriesOption } from "echarts";
import { financeApi } from "../../api/finance.ts";
import DatePicker from "primevue/datepicker";
// import type { Item } from "../../api/finance.ts";

// 莫奈风格配色方案
const monetColors = [
  "#8CB4D2", // 淡蓝色
  "#A6C9E2", // 浅蓝色
  "#D4C1E0", // 淡紫色
  "#BBD7E7", // 天蓝色
  "#AED2CD", // 青色
  "#C7DDE8", // 浅灰蓝色
  "#E0C8D3", // 浅粉色
  "#D8E8F2", // 极淡的蓝色
  "#C5DCDB", // 浅绿蓝色
  "#DBDFEA", // 淡蓝灰色
];

// 基础配置
const baseChartConfig = {
  backgroundColor: "#f8f8fa", // 使用应用的背景色
  title: {
    fontFamily: "'Noto Serif', serif", // 更典雅的字体
    fontSize: 18,
    fontWeight: "normal",
    color: "#114b79", // 莫奈风格的深蓝色
    left: "center",
    top: "5%",
  },
  tooltip: {
    trigger: "item" as const,
    formatter: "{a} <br/>{b} : {c} ({d}%)",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderColor: "#b8d0df",
    borderWidth: 1,
    textStyle: {
      color: "#114b79",
    },
    shadowBlur: 15,
    shadowColor: "rgba(184, 208, 223, 0.2)",
  },
};

// 标签样式配置
const labelStyle = {
  show: true,
  fontFamily: "'Noto Sans', sans-serif",
  fontSize: 13,
  color: "#114b79", // 深蓝灰色
  formatter: "{b}: {d}%",
};

// 图表容器引用
const groupChartContainer = ref<HTMLDivElement | null>(null); // 组别财务图表容器
const branchChartContainer = ref<HTMLDivElement | null>(null); // 兵种财务图表容器

// 存储图表实例
const chartInstances = ref<{ [key: string]: echarts.ECharts }>({});

// 日期选择器
const startDate = ref(getDefaultStartDate());

// 获取默认起始日期（当前日期前6个月）
function getDefaultStartDate() {
  const date = new Date();
  date.setMonth(date.getMonth() - 5);
  return date;
}

// 处理日期变更
const handleDateChange = () => {
  // 重新初始化图表
  initCharts();
};

// 获取从指定日期开始的6个月的月份名称
const getLastSixMonths = () => {
  const months = [];
  const startDateValue = startDate.value;

  if (!startDateValue) return [];

  const startDateObj = new Date(startDateValue);

  for (let i = 0; i < 6; i++) {
    const month = new Date(
      startDateObj.getFullYear(),
      startDateObj.getMonth() + i,
      1
    );
    const monthName = month.toLocaleDateString("zh-CN", {
      month: "short",
      year: "numeric",
    });
    months.push(monthName);
  }
  return months;
};

// 处理财务数据，按组别和兵种分类
const processFinanceData = (data: any[] = []) => {
  // 安全校验
  if (!Array.isArray(data)) return { groupChartData: [], branchChartData: [] };

  // 定义有效的组别和兵种类别
  const validGroups = ["机械", "电控", "运营", "软件", "AI", "视觉"];
  const validBranches = [
    "英雄",
    "步兵",
    "工程",
    "场地",
    "哨兵",
    "无人机",
    "通用",
  ];

  // 按组别和兵种分类的数据
  const groupData: { [key: string]: { [month: string]: number } } = {};
  const branchData: { [key: string]: { [month: string]: number } } = {};

  // 获取指定起始日期后的6个月的月份
  const months = getLastSixMonths();

  // 映射API返回的字段名称
  const mapItem = (item: any) => {
    // 检查item是否为有效对象
    if (!item || typeof item !== "object") {
      return {
        group: "未分配",
        branch: "未分配",
        date: new Date().toISOString().split("T")[0],
        unitPrice: 0,
        shippingCost: 0,
        quantity: 0,
      };
    }

    // 获取组别值 - 只使用group字段
    const rawGroup = item.group_name;

    // 如果组别为空，尝试从troop_type字段获取
    let group = "";
    if (!rawGroup && item.troop_type) {
      // 根据troop_type推断组别
      const troopType = item.troop_type.trim().toLowerCase();
      if (
        ["机械", "电控", "运营", "软件", "AI", "视觉"].some((g) =>
          troopType.includes(g)
        )
      ) {
        group = troopType;
      }
    }

    // 如果仍然为空，使用validGroups中的值进行匹配
    if (!group) {
      group =
        validGroups.find(
          (g) => g.trim().toLowerCase() === rawGroup.trim().toLowerCase()
        ) || "未分配";
    }

    // 获取兵种值 - 优先使用troop_type字段，如果为空则尝试使用branch字段
    let rawBranch = item.troop_type || item.branch || "";

    const branch =
      validBranches.find(
        (b) => b.trim().toLowerCase() === rawBranch.trim().toLowerCase()
      ) || "未分配";

    const date = item.post_date || item.date || "";
    const unitPrice = Number(item.price || item.unitPrice || 0);
    const shippingCost = Number(item.extra_price || item.shippingCost || 0);
    const quantity = Number(item.quantity || 0);

    // 输出映射后的结果
    const result = {
      ...item,
      group,
      branch,
      date,
      unitPrice,
      shippingCost,
      quantity,
    };

    return result;
  };

  // 映射并过滤有效项
  const mappedItems = data.map(mapItem);
  const validItems = mappedItems.filter((item) => {
    // 确保项目至少有组别信息
    return item && item.group;
  });

  // 初始化数据结构
  validItems.forEach((item) => {
    if (!groupData[item.group]) {
      groupData[item.group] = {};
      months.forEach((month) => (groupData[item.group][month] = 0));
    }

    if (!branchData[item.branch]) {
      branchData[item.branch] = {};
      months.forEach((month) => (branchData[item.branch][month] = 0));
    }
  });

  // 汇总数据
  validItems.forEach((item) => {
    const itemDate = item?.date ? new Date(item.date) : new Date();
    const itemMonth = itemDate.toLocaleDateString("zh-CN", {
      month: "short",
      year: "numeric",
    });

    // 安全访问对象属性
    const safeNumber = (value: any) => Math.max(Number(value) || 0, 0);

    // 获取组别和兵种
    const group = item.group || "";
    const branch = item.branch || "";

    if (months.includes(itemMonth) && groupData[group] && branchData[branch]) {
      // 计算总价
      const unitPrice = safeNumber(item.unitPrice);
      const quantity = safeNumber(item.quantity);
      const shippingCost = safeNumber(item.shippingCost);
      const totalPrice = unitPrice * quantity + shippingCost;

      if (
        group &&
        groupData[group] &&
        groupData[group][itemMonth] !== undefined
      ) {
        groupData[group][itemMonth] += totalPrice;
      }

      if (
        branch &&
        branchData[branch] &&
        branchData[branch][itemMonth] !== undefined
      ) {
        branchData[branch][itemMonth] += totalPrice;
      }
    }
  });

  // 转换为ECharts数据格式
  const formatChartData = (
    data: { [key: string]: { [month: string]: number } },
    months: string[]
  ) => {
    const result = [["product", ...months]];

    Object.keys(data).forEach((key) => {
      const rowData = [key];
      months.forEach((month) => {
        // 将数值转换为字符串类型以匹配ECharts期望的数据类型，并保留两位小数
        const value = data[key][month];
        // 格式化为两位小数
        const formattedValue = Number(value).toFixed(2);
        rowData.push(String(formattedValue));
      });
      result.push(rowData);
    });

    return result;
  };

  return {
    groupChartData: formatChartData(groupData, months),
    branchChartData: formatChartData(branchData, months),
  };
};

// 初始化图表
const initCharts = async () => {
  try {
    // 获取财务数据
    const response = await financeApi.getList();

    // 修改数据获取逻辑，检查response的不同属性
    let financeData = [];
    if (response && response.data) {
      financeData = Array.isArray(response.data) ? response.data : [];
    } else if (response && Array.isArray(response)) {
      financeData = response;
    }

    // 处理后的数据输出
    const { groupChartData, branchChartData } = processFinanceData(financeData);

    // 初始化组别财务图表
    if (groupChartContainer.value) {
      const groupChart = echarts.init(groupChartContainer.value, null, {
        renderer: "canvas",
        useDirtyRect: false,
      });
      chartInstances.value["group"] = groupChart;

      // 显示加载状态
      groupChart.showLoading({
        text: "数据加载中...",
        color: "#ee82ee",
        textColor: "#fff",
        maskColor: "rgba(0, 0, 0, 0.2)",
      });

      // 设置图表配置
      const groupOption = getChartOption("组别财务数据", groupChartData);
      groupChart.hideLoading();
      groupChart.setOption(groupOption);

      // 绑定更新轴指针的事件 - 添加passive选项
      groupChart.on(
        "updateAxisPointer",
        (event: any) => {
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
        },
        { passive: true }
      );
    }

    // 初始化兵种财务图表
    if (branchChartContainer.value) {
      const branchChart = echarts.init(branchChartContainer.value, null, {
        renderer: "canvas",
        useDirtyRect: false,
      });
      chartInstances.value["branch"] = branchChart;

      // 显示加载状态
      branchChart.showLoading({
        text: "数据加载中...",
        color: "#ee82ee",
        textColor: "#fff",
        maskColor: "rgba(0, 0, 0, 0.2)",
      });

      // 设置图表配置
      const branchOption = getChartOption("兵种财务数据", branchChartData);
      branchChart.hideLoading();
      branchChart.setOption(branchOption);

      // 绑定更新轴指针的事件 - 添加passive选项
      branchChart.on(
        "updateAxisPointer",
        (event: any) => {
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
        },
        { passive: true }
      );
    }
  } catch (error) {
    console.error("初始化图表失败:", error);
    // 显示错误信息在图表中
    showErrorInCharts(
      "初始化图表失败: " + (error instanceof Error ? error.message : "未知错误")
    );
  }
};

// 生成图表配置
const getChartOption = (title: string, data: any[]): EChartsOption => {
  console.log(`生成${title}图表配置，数据结构:`, JSON.stringify(data));

  // 合并基础配置
  return {
    ...baseChartConfig,
    title: {
      ...baseChartConfig.title,
      text: title,
      top: "2%",
      textStyle: {
        color: "#000",
        fontSize: 18,
        fontWeight: "bold",
      },
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
      source: data,
    },
    xAxis: { type: "category" },
    yAxis: { gridIndex: 0 },
    // 设置曲线图的位置
    grid: {
      top: "45%",
      bottom: "15%",
    },
    series: [
      ...Array(data.length - 1)
        .fill(0)
        .map((_, index) => {
          return {
            type: "line" as const,
            smooth: true,
            seriesLayoutBy: "row" as const,
            emphasis: { focus: "series" as const },
            // 使用莫奈风格颜色
            color: monetColors[index % monetColors.length],
          } as LineSeriesOption;
        }),
      {
        type: "pie" as const,
        id: "pie",
        radius: "25%",
        // 设置饼图的位置
        center: ["50%", "25%"],
        emphasis: { focus: "self" as const },
        label: {
          ...labelStyle,
          formatter: "{b}: {@" + data[0][1] + "} ({d}%)",
        },
        // 使用莫奈风格颜色
        color: monetColors,
        // 设置数据
        encode: {
          itemName: "product",
          value: data[0][1],
          tooltip: data[0][1],
        },
      } as PieSeriesOption,
    ],
  };
};

// 在图表中显示错误信息
const showErrorInCharts = (errorMessage: string) => {
  // 创建或获取图表实例并显示错误
  const showErrorInChart = (
    container: HTMLDivElement | null,
    chartKey: string
  ) => {
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
          left: "center",
          top: "center",
          textStyle: {
            color: "#ee82ee",
            fontSize: 16,
          },
        },
        series: [],
      });
    }
  };

  showErrorInChart(groupChartContainer.value, "group");
  showErrorInChart(branchChartContainer.value, "branch");
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
  position: relative;
  width: 100%;
  height: 100vh;
}

.center-date-selector {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.date-picker {
  min-width: 200px;
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
