// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
use tauri_plugin_window_state::{Builder, StateFlags};

use std::os::windows::process::CommandExt;
use std::process::Command;

const CREATE_NO_WINDOW: u32 = 0x08000000;

#[tauri::command]
fn start_main_app() -> Result<(), String> {
    Command::new("cmd")
        .args(["/C", "cd ./resources && main.exe"])
        .creation_flags(CREATE_NO_WINDOW)
        .spawn()
        .map_err(|e| format!("Failed to start main.exe: {}", e))?;

    Ok(())
}

#[tauri::command]
fn stop_main_app() -> Result<(), String> {
    Command::new("cmd")
        .args(["/C", "taskkill /f /im main.exe"])
        .creation_flags(CREATE_NO_WINDOW)
        .spawn()
        .map_err(|e| format!("Failed to stop main.exe: {}", e))?;

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(
            Builder::default()
                .with_state_flags(StateFlags::all())
                .build(),
        ) // Add window state plugin
        .plugin(tauri_plugin_shell::init())
        .setup(|_app| {
            // Removed unnecessary comment
            start_main_app()?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![start_main_app, stop_main_app])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
