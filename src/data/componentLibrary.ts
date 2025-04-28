import { ComponentDefinition } from "@/types/designer";
import { v4 as uuidv4 } from "uuid";
import { ComponentInstance } from "@/types/designer";

// 基础组件库
export const baseComponents: ComponentDefinition[] = [
  {
    id: "text",
    type: "text",
    name: "文本",
    icon: "pi pi-align-left",
    category: "basic",
    defaultProps: {
      content: "文本内容",
      fontSize: "16px",
      textAlign: "left",
      color: "#333333",
    },
    defaultStyles: {
      padding: "8px",
      margin: "0px",
    },
  },
  {
    id: "textarea",
    type: "textarea",
    name: "文本域",
    icon: "pi pi-align-left",
    category: "basic",
    defaultProps: {
      placeholder: "请输入内容",
      rows: 4,
      shape: "rectangle",
      size: "medium",
      status: "",
      value: "",
    },
    defaultStyles: {
      width: "100%",
      margin: "8px 0",
    },
  },
  {
    id: "image",
    type: "image",
    name: "图片",
    icon: "pi pi-image",
    category: "basic",
    defaultProps: {
      src: "",
      alt: "图片",
      width: "100%",
      height: "auto",
    },
    defaultStyles: {
      margin: "8px 0",
    },
  },
  {
    id: "button",
    type: "button",
    name: "按钮",
    icon: "pi pi-check-square",
    category: "basic",
    defaultProps: {
      label: "按钮",
      type: "primary",
      size: "medium",
    },
    defaultStyles: {
      margin: "8px 0",
    },
  },
  {
    id: "calendar",
    type: "calendar",
    name: "日历",
    icon: "pi pi-calendar",
    category: "basic",
    defaultProps: {
      value: null,
      selectionMode: "single",
      inline: true,
      showWeek: false,
      showOtherMonths: true,
      selectOtherMonths: false,
      monthNavigator: true,
      yearNavigator: true,
      yearRange: "2020:2030",
    },
    defaultStyles: {
      width: "100%",
      margin: "8px 0",
      padding: "8px",
      backgroundColor: "#ffffff",
      borderRadius: "4px",
    },
  },
];

// 表单组件库
export const formComponents: ComponentDefinition[] = [
  {
    id: "input",
    type: "input",
    name: "输入框",
    icon: "pi pi-pencil",
    category: "form",
    defaultProps: {
      placeholder: "请输入",
      label: "输入框",
      required: false,
    },
    defaultStyles: {
      width: "100%",
      margin: "8px 0",
    },
  },
  {
    id: "select",
    type: "select",
    name: "下拉选择",
    icon: "pi pi-chevron-down",
    category: "form",
    defaultProps: {
      placeholder: "请选择",
      label: "下拉选择",
      options: [
        { label: "选项1", value: "1" },
        { label: "选项2", value: "2" },
      ],
      required: false,
    },
    defaultStyles: {
      width: "100%",
      margin: "8px 0",
    },
  },
  {
    id: "checkbox",
    type: "checkbox",
    name: "复选框",
    icon: "pi pi-check-square",
    category: "form",
    defaultProps: {
      label: "复选框选项",
      disabled: false,
      size: "medium",
      status: "",
      value: false,
    },
    defaultStyles: {
      margin: "8px 0",
    },
  },
  {
    id: "radio",
    type: "radio",
    name: "单选按钮",
    icon: "pi pi-circle-on",
    category: "form",
    defaultProps: {
      label: "单选按钮选项",
      radioValue: true,
      disabled: false,
      size: "medium",
      status: "",
      value: null,
    },
    defaultStyles: {
      margin: "8px 0",
    },
  },
  {
    id: "datepicker",
    type: "datepicker",
    name: "日期选择器",
    icon: "pi pi-calendar",
    category: "form",
    defaultProps: {
      placeholder: "选择日期",
      disabled: false,
      shape: "semi-round",
      size: "medium",
      status: "",
      value: null,
    },
    defaultStyles: {
      width: "100%",
      margin: "8px 0",
    },
  },
];

// 数据组件库
export const dataComponents: ComponentDefinition[] = [
  {
    id: "finance-table",
    type: "table",
    name: "可选表格",
    icon: "pi pi-money-bill",
    category: "data",
    defaultProps: {
      tableType: "finance",
      title: "财务数据表",
      subtitle: "财务收支明细",
      showTitle: true,
      rows: 5,
      showSelection: true,
      primaryField: "account",
      dataSource: "default",
      databaseConfig: {
        sessionId: "",
        collection: "",
        filter: {},
        sort: {},
        fields: [],
      },
      columns: [
        { field: "account", header: "账户", sortable: true },
        { field: "type", header: "类型", sortable: true },
        { field: "amount", header: "金额", sortable: true },
        { field: "date", header: "日期", sortable: true },
        { field: "status", header: "状态", sortable: true },
      ],
      data: [
        {
          id: 1,
          account: "收入账户A",
          type: "收入",
          amount: 25000,
          date: "2023-01-15",
          status: "已结算",
        },
        {
          id: 2,
          account: "支出账户B",
          type: "支出",
          amount: 12500,
          date: "2023-01-18",
          status: "已结算",
        },
        {
          id: 3,
          account: "收入账户C",
          type: "收入",
          amount: 18000,
          date: "2023-01-20",
          status: "待结算",
        },
        {
          id: 4,
          account: "支出账户D",
          type: "支出",
          amount: 9800,
          date: "2023-01-25",
          status: "已结算",
        },
        {
          id: 5,
          account: "收入账户E",
          type: "收入",
          amount: 30000,
          date: "2023-01-28",
          status: "待结算",
        },
        {
          id: 6,
          account: "收入账户F",
          type: "收入",
          amount: 30000,
          date: "2023-01-28",
          status: "待结算",
        },
        {
          id: 6,
          account: "收入账户F",
          type: "收入",
          amount: 30000,
          date: "2023-01-28",
          status: "待结算",
        },
        {
          id: 6,
          account: "收入账户F",
          type: "收入",
          amount: 30000,
          date: "2023-01-28",
          status: "待结算",
        },
        {
          id: 6,
          account: "收入账户F",
          type: "收入",
          amount: 30000,
          date: "2023-01-28",
          status: "待结算",
        },
        {
          id: 6,
          account: "收入账户F",
          type: "收入",
          amount: 30000,
          date: "2023-01-28",
          status: "待结算",
        },
        {
          id: 6,
          account: "收入账户F",
          type: "收入",
          amount: 30000,
          date: "2023-01-28",
          status: "待结算",
        },
        {
          id: 6,
          account: "收入账户F",
          type: "收入",
          amount: 30000,
          date: "2023-01-28",
          status: "待结算",
        },
        {
          id: 6,
          account: "收入账户F",
          type: "收入",
          amount: 30000,
          date: "2023-01-28",
          status: "待结算",
        },
        {
          id: 6,
          account: "收入账户F",
          type: "收入",
          amount: 30000,
          date: "2023-01-28",
          status: "待结算",
        },
      ],
      numberFields: ["amount"],
      currencyFields: ["amount"],
      optionFields: ["type", "status"],
      fieldOptions: {
        type: ["收入", "支出"],
        status: ["已结算", "待结算"],
      },
    },
    defaultStyles: {
      width: "100%",
      margin: "12px 0",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    },
  },
  {
    id: "basic-table",
    type: "table",
    name: "基础表格",
    icon: "pi pi-table",
    category: "data",
    defaultProps: {
      tableType: "basic",
      title: "基础数据表",
      subtitle: "基础数据展示",
      showTitle: true,
      rows: 5,
      showSelection: false,
      primaryField: "name",
      dataSource: "default",
      columns: [
        { field: "id", header: "ID", sortable: true },
        { field: "name", header: "名称", sortable: true },
        { field: "category", header: "分类", sortable: true },
        { field: "value", header: "数值", sortable: true },
      ],
      data: [],
    },
    defaultStyles: {
      width: "100%",
      margin: "12px 0",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    },
  },
  {
    id: "search-table",
    type: "table",
    name: "检索表格",
    icon: "pi pi-search",
    category: "data",
    defaultProps: {
      tableType: "search",
      title: "检索数据表",
      subtitle: "带检索功能的数据表",
      showTitle: true,
      rows: 10,
      showSelection: true,
      primaryField: "name",
      searchFields: ["name", "category", "description"],
      filters: {},
      dataSource: "default",
      columns: [
        { field: "id", header: "ID", sortable: true },
        { field: "name", header: "名称", sortable: true },
        { field: "category", header: "分类", sortable: true },
        { field: "description", header: "描述", sortable: true },
        { field: "status", header: "状态", sortable: true },
      ],
      data: [],
    },
    defaultStyles: {
      width: "100%",
      margin: "12px 0",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    },
  },
  {
    id: "column-transform-table",
    type: "table",
    name: "列转换表格",
    icon: "pi pi-sync",
    category: "data",
    defaultProps: {
      tableType: "columnTransform",
      title: "列转换数据表",
      subtitle: "支持列数据转换的表格",
      showTitle: true,
      rows: 8,
      showSelection: false,
      primaryField: "name",
      transformRules: {
        status: {
          type: "tag",
          options: {
            "进行中": { color: "blue" },
            "已完成": { color: "green" },
            "已取消": { color: "red" },
          }
        },
        progress: {
          type: "progress",
        },
        price: {
          type: "currency",
          options: {
            symbol: "¥",
            decimals: 2,
          }
        }
      },
      columns: [
        { field: "id", header: "ID", sortable: true },
        { field: "name", header: "名称", sortable: true },
        { field: "status", header: "状态", sortable: true, transform: true },
        { field: "progress", header: "进度", sortable: true, transform: true },
        { field: "price", header: "价格", sortable: true, transform: true },
      ],
      data: [],
    },
    defaultStyles: {
      width: "100%",
      margin: "12px 0",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    },
  },
];

// ECharts 图表组件
export const echartsComponents: ComponentDefinition[] = [
  {
    id: "echarts-line",
    type: "chart",
    name: "折线图",
    icon: "pi pi-chart-line",
    category: "echarts",
    defaultProps: {
      chartType: "line",
      title: "折线图示例",
      subtitle: "数据分析趋势",
      height: "350px",
      xAxisType: "category",
      yAxisTitle: "数值",
      smooth: true,
      showLegend: true,
      data: [
        { name: "系列1", data: [150, 230, 224, 218, 135, 147, 260] },
        { name: "系列2", data: [80, 122, 150, 180, 199, 210, 165] },
      ],
      xAxisData: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    },
    defaultStyles: {
      margin: "10px 0",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      borderRadius: "4px",
    },
  },
  {
    id: "echarts-bar",
    type: "chart",
    name: "柱状图",
    icon: "pi pi-chart-bar",
    category: "echarts",
    defaultProps: {
      chartType: "bar",
      title: "柱状图示例",
      subtitle: "数据对比分析",
      height: "350px",
      xAxisType: "category",
      yAxisTitle: "数值",
      showLegend: true,
      data: [
        { name: "系列1", data: [120, 200, 150, 80, 70, 110, 130] },
        { name: "系列2", data: [60, 70, 80, 120, 75, 100, 50] },
      ],
      xAxisData: ["一月", "二月", "三月", "四月", "五月", "六月", "七月"],
    },
    defaultStyles: {
      margin: "10px 0",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      borderRadius: "4px",
    },
  },
  {
    id: "echarts-pie",
    type: "chart",
    name: "饼图",
    icon: "pi pi-chart-pie",
    category: "echarts",
    defaultProps: {
      chartType: "pie",
      title: "饼图示例",
      subtitle: "数据占比分析",
      height: "350px",
      showLegend: true,
      radius: ["50%", "70%"],
      roseType: false,
      data: [
        { name: "类别1", value: 335 },
        { name: "类别2", value: 310 },
        { name: "类别3", value: 234 },
        { name: "类别4", value: 135 },
        { name: "类别5", value: 154 },
      ],
    },
    defaultStyles: {
      margin: "10px 0",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      borderRadius: "4px",
    },
  },
  {
    id: "echarts-radar",
    type: "chart",
    name: "雷达图",
    icon: "pi pi-chart-pie",
    category: "echarts",
    defaultProps: {
      chartType: "radar",
      title: "雷达图示例",
      subtitle: "多维数据分析",
      height: "350px",
      showLegend: true,
      indicator: [
        { name: "销售", max: 6500 },
        { name: "管理", max: 16000 },
        { name: "信息技术", max: 30000 },
        { name: "客服", max: 38000 },
        { name: "研发", max: 52000 },
        { name: "市场", max: 25000 },
      ],
      data: [
        {
          value: [4300, 10000, 28000, 35000, 50000, 19000],
          name: "预算分配",
        },
        {
          value: [5000, 14000, 28000, 31000, 42000, 21000],
          name: "实际开销",
        },
      ],
    },
    defaultStyles: {
      margin: "10px 0",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      borderRadius: "4px",
    },
  },
  {
    id: "echarts-smooth-line",
    type: "chart",
    name: "平滑折线图",
    icon: "pi pi-chart-line",
    category: "echarts",
    defaultProps: {
      chartType: "smoothLine",
      title: "平滑折线图示例",
      subtitle: "趋势分析",
      height: "350px",
      xAxisType: "category",
      yAxisTitle: "数值",
      showLegend: true,
      smooth: true,
      data: [
        { name: "系列1", data: [220, 182, 191, 234, 290, 330, 310] },
        { name: "系列2", data: [120, 132, 101, 134, 90, 230, 210] },
      ],
      xAxisData: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    },
    defaultStyles: {
      margin: "10px 0",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      borderRadius: "4px",
    },
  },
  {
    id: "echarts-mix-bar-line",
    type: "chart",
    name: "柱状折线混合图",
    icon: "pi pi-chart-bar",
    category: "echarts",
    defaultProps: {
      chartType: "mixBarLine",
      title: "混合图示例",
      subtitle: "对比与趋势分析",
      height: "350px",
      xAxisType: "category",
      yAxisTitle: "数值",
      showLegend: true,
      data: [
        {
          name: "蒸发量",
          type: "bar",
          data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6],
        },
        {
          name: "降水量",
          type: "bar",
          data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6],
        },
        {
          name: "平均温度",
          type: "line",
          yAxisIndex: 1,
          data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3],
        },
      ],
      xAxisData: ["1月", "2月", "3月", "4月", "5月", "6月", "7月"],
    },
    defaultStyles: {
      margin: "10px 0",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      borderRadius: "4px",
    },
  },
  {
    id: "echarts-interactive-pie-line",
    type: "chart",
    name: "交互式饼图折线图",
    icon: "pi pi-chart-pie",
    category: "echarts",
    defaultProps: {
      chartType: "interactivePieLine",
      title: "交互式图表示例",
      subtitle: "关联数据分析",
      height: "350px",
      showLegend: true,
      pieConfig: {
        radius: ["40%", "55%"],
        center: ["25%", "50%"],
      },
      data: [
        {
          name: "类别A",
          value: 200,
          details: [150, 120, 90, 180, 240, 220, 190],
        },
        {
          name: "类别B",
          value: 180,
          details: [90, 120, 160, 150, 180, 165, 210],
        },
        {
          name: "类别C",
          value: 150,
          details: [120, 140, 130, 160, 170, 190, 220],
        },
        {
          name: "类别D",
          value: 120,
          details: [80, 100, 120, 140, 90, 110, 130],
        },
      ],
      xAxisData: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
    },
    defaultStyles: {
      margin: "10px 0",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      borderRadius: "4px",
    },
  },
  {
    id: "echarts-calendar",
    type: "chart",
    name: "日历图",
    icon: "pi pi-calendar",
    category: "echarts",
    defaultProps: {
      chartType: "calendar",
      title: "日历图示例",
      subtitle: "日期数据分布",
      height: "350px",
      year: new Date().getFullYear(),
      showLegend: true,
      visualMap: {
        min: 0,
        max: 10000,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        top: 'top'
      },
      data: [
        ['2023-01-01', 1234],
        ['2023-01-02', 2345],
        ['2023-01-03', 3456],
        ['2023-01-04', 4567],
        ['2023-01-05', 5678],
        ['2023-01-06', 6789],
        ['2023-01-07', 7890],
        ['2023-01-08', 8901],
        ['2023-01-09', 9012],
        ['2023-01-10', 1023],
      ],
    },
    defaultStyles: {
      margin: "10px 0",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      borderRadius: "4px",
    },
  },
  {
    id: "echarts-scatter",
    type: "chart",
    name: "散点图",
    icon: "pi pi-chart-scatter",
    category: "echarts",
    defaultProps: {
      chartType: "scatter",
      title: "散点图示例",
      subtitle: "数据分布分析",
      height: "350px",
      showLegend: true,
      xAxisName: "X轴",
      yAxisName: "Y轴",
      data: [
        {
          name: "系列1",
          data: [
            [10.0, 8.04],
            [8.07, 6.95],
            [13.0, 7.58],
            [9.05, 8.81],
            [11.0, 8.33],
            [14.0, 7.66],
            [13.4, 6.81],
            [10.0, 6.33],
          ],
        },
        {
          name: "系列2",
          data: [
            [8.0, 5.04],
            [6.95, 3.99],
            [11.0, 8.01],
            [9.05, 8.10],
            [10.8, 6.33],
            [13.0, 7.26],
            [12.5, 5.73],
            [7.08, 4.33],
          ],
        },
      ],
      symbolSize: 10,
    },
    defaultStyles: {
      margin: "10px 0",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      borderRadius: "4px",
    },
  },
  {
    id: "echarts-gauge",
    type: "chart",
    name: "仪表盘",
    icon: "pi pi-compass",
    category: "echarts",
    defaultProps: {
      chartType: "gauge",
      title: "仪表盘示例",
      subtitle: "指标完成情况",
      height: "350px",
      min: 0,
      max: 100,
      progress: true,
      axisLine: {
        lineStyle: {
          width: 30,
          color: [
            [0.3, '#67e0e3'],
            [0.7, '#37a2da'],
            [1, '#fd666d']
          ]
        }
      },
      pointer: {
        itemStyle: {
          color: 'auto'
        }
      },
      data: [
        {
          value: 75.6,
          name: '完成率',
        }
      ],
    },
    defaultStyles: {
      margin: "10px 0",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      borderRadius: "4px",
    },
  },
];

// Highcharts 图表组件
export const highchartsComponents: ComponentDefinition[] = [
  {
    id: "highcharts-pie",
    type: "chart",
    name: "饼图",
    icon: "pi pi-chart-pie",
    category: "highcharts",
    defaultProps: {
      chartType: "highchartsPie",
      title: "饼图示例",
      subtitle: "数据占比分析",
      height: "350px",
      showLegend: true,
      enableDataLabels: true,
      data: [
        { name: "类别A", y: 61.41 },
        { name: "类别B", y: 11.84 },
        { name: "类别C", y: 10.85 },
        { name: "类别D", y: 4.67 },
        { name: "类别E", y: 4.18 },
      ],
    },
    defaultStyles: {
      margin: "10px 0",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      borderRadius: "4px",
    },
  },
  {
    id: "highcharts-area",
    type: "chart",
    name: "面积图",
    icon: "pi pi-chart-line",
    category: "highcharts",
    defaultProps: {
      chartType: "area",
      title: "面积图示例",
      subtitle: "累积数据分析",
      height: "350px",
      fillOpacity: 0.5,
      showLegend: true,
      data: [
        { name: "亚洲", data: [502, 635, 809, 947, 1402, 3634, 5268] },
        { name: "非洲", data: [106, 107, 111, 133, 221, 767, 1766] },
        { name: "欧洲", data: [163, 203, 276, 408, 547, 729, 628] },
      ],
      xAxisData: ["1995", "2000", "2005", "2010", "2015", "2020", "2025"],
    },
    defaultStyles: {
      margin: "10px 0",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      borderRadius: "4px",
    },
  },
  {
    id: "highcharts-line",
    type: "chart",
    name: "聚点折线图",
    icon: "pi pi-chart-line",
    category: "highcharts",
    defaultProps: {
      chartType: "highchartsLine",
      title: "聚点折线图示例",
      subtitle: "趋势变化分析",
      height: "350px",
      showLegend: true,
      yAxisTitle: "数值",
      pointStart: 2015,
      data: [
        {
          name: "安装与开发",
          data: [43934, 48656, 65165, 81827, 112143, 142383, 171533],
        },
        {
          name: "制造业",
          data: [24916, 37941, 29742, 29851, 32490, 30282, 38121],
        },
      ],
    },
    defaultStyles: {
      margin: "10px 0",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      borderRadius: "4px",
    },
  },
  {
    id: "highcharts-column",
    type: "chart",
    name: "条形图",
    icon: "pi pi-chart-bar",
    category: "highcharts",
    defaultProps: {
      chartType: "highchartsColumn",
      title: "条形图示例",
      subtitle: "分类数据对比",
      height: "350px",
      showLegend: false,
      yAxisTitle: "数值",
      seriesName: "数据",
      colorByPoint: true,
      dataLabelsEnabled: true,
      dataLabelsRotation: -90,
      tooltipFormat: "数值: <b>{point.y:.1f}</b>",
      labelsSuffix: "",
      data: [
        ["东京", 37.33],
        ["德里", 31.18],
        ["上海", 27.79],
        ["圣保罗", 22.23],
        ["墨西哥城", 21.91],
      ],
    },
    defaultStyles: {
      margin: "10px 0",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      borderRadius: "4px",
    },
  },
  {
    id: "highcharts-3d-pie",
    type: "chart",
    name: "3D饼图",
    icon: "pi pi-chart-pie",
    category: "highcharts",
    defaultProps: {
      chartType: "highcharts3DPie",
      title: "3D饼图示例",
      subtitle: "立体数据占比分析",
      height: "350px",
      showLegend: true,
      enableDataLabels: true,
      options3d: {
        enabled: true,
        alpha: 45,
        beta: 0
      },
      depth: 35,
      data: [
        { name: "类别A", y: 41.41 },
        { name: "类别B", y: 21.84 },
        { name: "类别C", y: 15.85 },
        { name: "类别D", y: 12.67 },
        { name: "类别E", y: 8.18 },
      ],
    },
    defaultStyles: {
      margin: "10px 0",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      borderRadius: "4px",
    },
  },
  {
    id: "highcharts-3d-column",
    type: "chart",
    name: "3D柱状图",
    icon: "pi pi-chart-bar",
    category: "highcharts",
    defaultProps: {
      chartType: "highcharts3DColumn",
      title: "3D柱状图示例",
      subtitle: "立体数据对比",
      height: "350px",
      showLegend: true,
      yAxisTitle: "数值",
      options3d: {
        enabled: true,
        alpha: 15,
        beta: 15,
        depth: 50,
        viewDistance: 25
      },
      data: [
        { name: "系列1", data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6] },
        { name: "系列2", data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0] },
      ],
      xAxisData: ["一月", "二月", "三月", "四月", "五月", "六月", "七月"],
    },
    defaultStyles: {
      margin: "10px 0",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      borderRadius: "4px",
    },
  },
  {
    id: "highcharts-gauge",
    type: "chart",
    name: "仪表盘",
    icon: "pi pi-compass",
    category: "highcharts",
    defaultProps: {
      chartType: "highchartsGauge",
      title: "仪表盘示例",
      subtitle: "指标完成情况",
      height: "350px",
      minValue: 0,
      maxValue: 100,
      tooltipEnabled: true,
      seriesName: "当前值",
      dial: {
        radius: "80%",
        backgroundColor: "gray",
        borderColor: "silver",
        borderWidth: 0,
        baseWidth: 5,
        baseLength: "90%",
        rearLength: "10%"
      },
      data: [76.5],
      plotBands: [
        {
          from: 0,
          to: 50,
          color: "#DF5353" // red
        },
        {
          from: 50,
          to: 75,
          color: "#DDDF0D" // yellow
        },
        {
          from: 75,
          to: 100,
          color: "#55BF3B" // green
        }
      ],
    },
    defaultStyles: {
      margin: "10px 0",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      borderRadius: "4px",
    },
  },
];

// 合并所有组件
export const allComponents = [
  ...baseComponents,
  ...formComponents,
  ...dataComponents,
  ...echartsComponents,
  ...highchartsComponents,
];

// 根据类型获取组件定义
export function getComponentDefinition(
  id: string
): ComponentDefinition | undefined {
  return allComponents.find((comp) => comp.id === id);
}

// 创建组件实例
export function createComponentInstance(componentDef: any): ComponentInstance {
  return {
    id: uuidv4(),
    componentId: componentDef.id,
    type: componentDef.type,
    props: { ...(componentDef.defaultProps || {}) },
    styles: { ...(componentDef.defaultStyles || {}) },
    events: [],
  };
}

// 组件分类
export const componentCategories = [
  { id: "basic", name: "基础组件" },
  { id: "form", name: "表单组件" },
  { id: "data", name: "数据组件" },
  { id: "echarts", name: "ECharts图表" },
  { id: "highcharts", name: "Highcharts图表" },
];
