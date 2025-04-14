import { Database, ServerCog, Sheet } from "lucide-vue-next";

// 数据库类型定义
export interface DatabaseType {
  value: string;
  label: string;
  icon: any;
  isConnection: boolean;
  fileExtensions?: string[];
  defaultPort?: number;
}

export const databaseTypes: DatabaseType[] = [
  {
    value: "mongodb",
    label: "MongoDB",
    icon: ServerCog,
    isConnection: true,
    defaultPort: 27017,
  },
  {
    value: "mysql",
    label: "MySQL",
    icon: ServerCog,
    isConnection: true,
    defaultPort: 3306,
  },
  {
    value: "sqlite",
    label: "SQLite",
    icon: Database,
    isConnection: false,
    fileExtensions: [".db", ".sqlite", ".sqlite3"],
  },
  {
    value: "csv",
    label: "CSV",
    icon: Sheet,
    isConnection: false,
    fileExtensions: [".csv", ".txt"],
  },
  {
    value: "excel",
    label: "Excel",
    icon: Sheet,
    isConnection: false,
    fileExtensions: [".xlsx", ".xls"],
  },
];

// 连接配置类型
export interface ConnectionConfig {
  type: string;
  host: string;
  port: number | string;
  username: string;
  password: string;
  database: string;
}

// 文件处理配置类型
export interface FileProcessConfig {
  type: string;
  filePath: string;
  options?: any;
}

// MongoDB导入配置类型
export interface MongoImportConfig {
  sourceType: string; // csv或sqlite
  filePath: string;
  options?: any;
  dbName?: string;
  collName?: string;
}

// 添加新的类型定义
export interface DatabaseConnectionResult {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  collections?: Record<string, CollectionInfo>; // MongoDB
  tables?: Record<string, TableInfo>; // MySQL
}

export interface CollectionInfo {
  fields: Record<string, string>;
  sample_data: string;
}

export interface TableInfo {
  fields: Record<string, string>;
  sample_data: string;
}

export interface PreviewData {
  fields: Record<string, string>;
  sampleData: any[];
}
