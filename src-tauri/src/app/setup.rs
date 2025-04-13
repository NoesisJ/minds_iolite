use crate::commands::process;
use tauri::Manager;
use tauri::WindowEvent;

pub fn setup_app(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    process::open_exe("agent".to_string()); // 启动子进程
    process::open_exe("backend".to_string());

    // 监听窗口事件
    let main_window = app
        .get_webview_window("main")
        .expect("Failed to get main window");
    main_window.on_window_event(move |event| {
        if let WindowEvent::CloseRequested { .. } = event {
            process::close_exe("agent".to_string()); // 关闭子进程
            process::close_exe("backend".to_string());
        }
    });

    Ok(())
}
