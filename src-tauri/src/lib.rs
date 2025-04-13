use std::os::windows::process::CommandExt;
use tauri::Manager;
use tauri::WindowEvent;

const CREATE_NO_WINDOW: u32 = 0x08000000;

// 进程控制命令
mod process {
    use super::*;

    #[tauri::command]
    pub fn open_agent() {
        std::process::Command::new("cmd")
            .args(["/C", "cd ./resources && main.exe"])
            .creation_flags(CREATE_NO_WINDOW)
            .spawn()
            .expect("Failed to start ginApp");
    }

    #[tauri::command]
    pub fn close_agent() {
        std::process::Command::new("cmd")
            .args(["/C", "taskkill /f /im main.exe"])
            .spawn()
            .expect("Failed to close ginApp");
    }
}

// 应用程序初始化
fn setup_app(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    process::open_agent(); // 启动子进程

    // 监听窗口事件
    let main_window = app
        .get_webview_window("main")
        .expect("Failed to get main window");
    main_window.on_window_event(move |event| {
        if let WindowEvent::CloseRequested { .. } = event {
            process::close_agent(); // 关闭子进程
        }
    });

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(
            tauri_plugin_window_state::Builder::default()
                .with_state_flags(tauri_plugin_window_state::StateFlags::all())
                .build(),
        )
        .plugin(tauri_plugin_shell::init())
        .setup(setup_app)
        .invoke_handler(tauri::generate_handler![
            process::open_agent,
            process::close_agent
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
