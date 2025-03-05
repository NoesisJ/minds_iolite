// src/shared/app/window-manager.ts
import { Window } from "@tauri-apps/api/window";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";

export class WindowManager {
  private window: Window | null = null;
  private toggleTimeout: NodeJS.Timeout | null = null;

  async initialize() {
    this.window = getCurrentWebviewWindow();
  }

  public async handleClose(): Promise<void> {
    await this.window?.close();
  }

  public async handleMinimize(): Promise<void> {
    await this.window?.minimize();
  }

  public async toggleMaximizeWindow() {
    await this.window?.toggleMaximize();
  }

  public async listenMaximizeState(
    callback: (maximized: boolean) => void
  ): Promise<() => void> {
    if (!this.window) return () => {};

    callback(await this.window.isMaximized());
    return this.window.onResized(async () => {
      if (!this.window) return;
      callback(await this.window.isMaximized());
    });
  }

  async saveState(): Promise<void> {
    if (!this.window) return;

    try {
      const size = await this.window.innerSize();
      localStorage.setItem("window-state", JSON.stringify({ size }));
    } catch (error) {
      console.error("Failed to save window state:", error);
    }
  }

  async cleanup(): Promise<void> {
    if (this.toggleTimeout) {
      clearTimeout(this.toggleTimeout);
    }
    this.window = null;
  }
}

export const windowManager = new WindowManager();
