import { ComponentGeneratorInterface } from './ComponentGeneratorInterface';
import { TextComponentGenerator } from './components/TextComponentGenerator';
import { ButtonComponentGenerator } from './components/ButtonComponentGenerator';
import { ChartComponentGenerator } from './components/ChartComponentGenerator';

// 图片组件生成器将在后续创建...
// import { ImageComponentGenerator } from './components/ImageComponentGenerator';

// 创建一个组件生成器注册表
class ComponentGeneratorRegistry {
  private generators: ComponentGeneratorInterface[] = [];
  
  constructor() {
    // 注册所有组件生成器
    this.register(new TextComponentGenerator());
    this.register(new ButtonComponentGenerator());
    this.register(new ChartComponentGenerator());
    // this.register(new ImageComponentGenerator());
  }
  
  register(generator: ComponentGeneratorInterface): void {
    this.generators.push(generator);
  }
  
  getGeneratorForComponent(componentId: string): ComponentGeneratorInterface | null {
    for (const generator of this.generators) {
      if (generator.supportsComponent(componentId)) {
        return generator;
      }
    }
    return null;
  }
  
  getAllGenerators(): ComponentGeneratorInterface[] {
    return this.generators;
  }
}

// 导出注册表实例
export const componentGeneratorRegistry = new ComponentGeneratorRegistry(); 