use std::process::Command;
use std::thread;
use std::env;
use std::path::PathBuf;
use serde::Deserialize;
use std::fs;

#[derive(Deserialize, Debug, Clone)]
struct Config {
    database_url: String,
    direct_url: String,
    vite_api_url: String,
    port: String
}

fn load_config(exe_dir: &PathBuf) -> Config {
    let config_path = exe_dir.join("config.json");
    let config_contents = fs::read_to_string(&config_path)
        .expect(&format!("Failed to read config file: {}", config_path.display()));
    serde_json::from_str(&config_contents)
        .expect("Failed to parse config.json")
}

// #[tauri::command]
// fn get_api_url(config: State<'_, Config>) -> String {
//     config.vite_api_url.clone()
// }

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let exe_dir: PathBuf = env::current_exe()
        .ok()
        .and_then(|p| p.parent().map(|p| p.to_path_buf()))
        .expect("failed to get exe dir");

    // Load config.json once at startup
    let config = load_config(&exe_dir);
    println!("Loaded config: {:?}", config);

    thread::spawn({
        let exe_dir = exe_dir.clone();
        let config = config.clone();
        move || {
             if cfg!(windows) {
                    let api_dir = exe_dir.join("api");
                    let script_path = api_dir.join("start.bat");
                    println!("Starting Windows API script at: {}", script_path.display());

                    let status = Command::new("powershell")
                        .args([
                            "-WindowStyle", "Hidden",
                            "-Command",
                            &format!("Start-Process -FilePath '{}' -WorkingDirectory '{}' -WindowStyle Hidden", 
                                    script_path.to_str().unwrap(), 
                                    api_dir.to_str().unwrap())
                        ])
                        .env("DATABASE_URL", &config.database_url)
                        .env("DIRECT_URL", &config.direct_url)
                        .env("VITE_API_URL", &config.vite_api_url)
                        .env("PORT", &config.port)
                        .status()
                        .expect("Failed to execute start.bat silently");

                    if !status.success() {
                        eprintln!("Windows API start script failed with {:?}", status);
                    }
            } else {
                // Unix-like: run start.sh using bash, passing env vars
                let script_path = exe_dir.join("api/start.sh");
                println!("Starting Unix API script at: {}", script_path.display());

                let status = Command::new("bash")
                    .arg(script_path)
                    .env("DATABASE_URL", &config.database_url)
                    .env("DIRECT_URL", &config.direct_url)
                    .env("VITE_API_URL", &config.vite_api_url)
                    .env("PORT", &config.port)
                    .status()
                    .expect("Failed to execute start.sh");

                if !status.success() {
                    eprintln!("Unix API start script failed with {:?}", status);
                }
            }
        }
    });

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
