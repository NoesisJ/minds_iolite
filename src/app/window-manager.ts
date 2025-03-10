// src/shared/app/window-manager.ts
import { Window } from "@tauri-apps/api/window";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";

export class WindowManager {
  private window: Window | null = null;

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
}

export const windowManager = new WindowManager();
