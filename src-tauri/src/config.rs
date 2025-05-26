use serde::Deserialize;
use std::fs::{self, File};
use std::io::Write;
use std::path::PathBuf;

#[derive(Deserialize, Debug, Clone)]
pub struct Config {
    pub database_url: String,
    pub direct_url: String,
    pub vite_api_url: String,
    pub port: String
    pub google_client_id: String
    pub google_client_secret: String
    pub google_redirect_url: String
    pub youtube_api_key: String
    pub api_key: String
}

pub fn load_config(exe_dir: &PathBuf) -> Config {
    let config_path = exe_dir.join("config.json");

    // Check if the file exists
    if !config_path.exists() {
        // Create default config JSON as a string
        let default_config = r#"{
            "database_url": "sqlite://:memory:",
            "direct_url": "http://localhost",
            "vite_api_url": "http://localhost/api",
            "port": "3333",
            "google_client_id": "",
            "google_client_secret": "",
            "google_redirect_url": "",
            "youtube_api_key": "",
            "api_key": "",
        }"#;

        // Create the file and write default content
        let mut file = File::create(&config_path)
            .expect(&format!("Failed to create config file: {}", config_path.display()));
        file.write_all(default_config.as_bytes())
            .expect("Failed to write default config content");
    }

    // Now read and parse the config file
    let config_contents = fs::read_to_string(&config_path)
        .expect(&format!("Failed to read config file: {}", config_path.display()));
    serde_json::from_str(&config_contents)
        .expect("Failed to parse config.json")
}
