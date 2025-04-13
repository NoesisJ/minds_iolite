use std::os::windows::process::CommandExt;

const CREATE_NO_WINDOW: u32 = 0x08000000;

#[tauri::command]
pub fn open_exe(name: String) {
    std::process::Command::new("cmd")
        .args(["/C", format!("cd ./resources && {}.exe", name).as_str()])
        .creation_flags(CREATE_NO_WINDOW)
        .spawn()
        .expect(format!("Failed to start {}.exe", name).as_str());
}

#[tauri::command]
pub fn close_exe(name: String) {
    let _ = std::process::Command::new("cmd")
        .args(["/C", format!("taskkill /f /im {}.exe 2>nul", name).as_str()])
        .creation_flags(CREATE_NO_WINDOW)
        .spawn();
}
