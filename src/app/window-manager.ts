// src/shared/app/window-manager.ts
import { Window } from "@tauri-apps/api/window";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";

export class WindowManager {
  private window: Window | null = null;

  async initialize() {
    this.window = getCurrentWebviewWindow();
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

  public async handleClose(): Promise<void> {
    await this.window?.close();
  }

  public async handleMinimize(): Promise<void> {
    await this.window?.minimize();
  }

  public async toggleMaximizeWindow() {
    await this.window?.toggleMaximize();
  }
}

export const windowManager = new WindowManager();
