import { storeToRefs } from "pinia";
import { useApp } from "@/hooks/useApp";
import { windowManager } from "@/app/window-manager";

export function initApp() {
  const appStore = useApp();
  const { isTauri } = storeToRefs(appStore);

  let cleanupWindowState: (() => void) | null = null;

  // 监听窗口最大化状态
  const setupWindowStateListener = async () => {
    if (isTauri.value) {
      cleanupWindowState = await windowManager.listenMaximizeState(
        (maximized) => {
          appStore.setMaximizedState(maximized);
        }
      );
    }
  };

  // 执行初始化逻辑
  setupWindowStateListener();

  // 返回清理函数
  return () => {
    cleanupWindowState?.();
  };
}
