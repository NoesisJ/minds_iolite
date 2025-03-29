// 使用import.meta.glob自动导入所有图片
const images = import.meta.glob('./imgs/*.{jpg,jpeg,png,svg,gif}', { eager: true });

// 创建图片名称到URL的映射
const imageMap: Record<string, string> = {};

// 填充映射
for (const path in images) {
  // 从路径中提取文件名
  const filename = path.split('/').pop() || '';
  // 设置映射关系
  imageMap[filename] = (images[path] as any).default;
}

// 示例图片列表
export const availableImages = Object.keys(imageMap);

// 获取图片URL的函数
export function getImageUrl(imageName: string): string {
  return imageMap[imageName] || '';
} 