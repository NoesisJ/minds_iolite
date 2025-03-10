import { defineStore } from "pinia";
import { windowManager } from "@/app/window-manager";

export const useApp = defineStore("app", {
  state: () => ({
    isTauri:
      import.meta.env.VITE_TAURI === "true" ||
      Boolean((window as any).__TAURI__),
    isInitialized: false,
    isMaximized: false,
  }),
  actions: {
    async initializeApp() {
      setTimeout(() => {
        console.log("wait for init");
      }, 500); // If there are truly some async tasks...
      this.isInitialized = true;
    },
    async initialize() {
      if (this.isTauri) await windowManager.initialize();
    },

    // Window
    toggleMaximizeWindow() {
      windowManager.toggleMaximizeWindow();
    },
    setMaximizedState(maximized: boolean) {
      this.isMaximized = maximized;
    },
    minimizeWindow() {
      windowManager.handleMinimize();
    },
    closeWindow() {
      windowManager.handleClose();
    },
  },
});
