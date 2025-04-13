mod app;
mod commands;

use app::setup;
use commands::process;

// 应用程序初始化

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
        .setup(setup::setup_app)
        .invoke_handler(tauri::generate_handler![
            process::open_exe,
            process::close_exe
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
