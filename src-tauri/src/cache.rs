use serde_json::{json, Value};
use std::sync::Mutex;
use std::{
    collections::HashMap,
    fs::{self, File},
    path::PathBuf,
};

#[derive(Debug)]
enum StoreType {
    Json,
    Unknown,
}

impl Default for StoreType {
    fn default() -> Self {
        StoreType::Json
    }
}

const JSON_STOREFILE: &str = "__TAURI_JSON_CACHE";

#[derive(Default, Debug)]
pub struct CacheTauri {
    cache_f: PathBuf,
    cache_type: StoreType,
    val: Option<Value>,
}

impl CacheTauri {
    pub fn init(&mut self, cache_p: &PathBuf) {
        self.cache_f = cache_p.to_path_buf().join(JSON_STOREFILE);
    }

    pub fn check_cache(&mut self) -> Result<(), std::io::Error> {
        if !self.cache_f.is_file() {
            std::fs::create_dir_all(self.cache_f.parent().unwrap())?;
            let f = fs::write(&self.cache_f, "{}")?;
            drop(f);
        };
        match self.cache_type {
            StoreType::Json => {
                let f = File::open(&self.cache_f)?;
                let val = serde_json::from_reader(f)?;
                self.val = val;
            }
            StoreType::Unknown => {
            }
        };
        Ok(())
    }

    pub fn set(&mut self, key: String, val: String) -> bool {
        let _ = self.check_cache();
        let c = self.val.as_mut().unwrap();
        let mut cache_kv: HashMap<String, String> = serde_json::from_value(c.to_owned()).unwrap();
        // cache_kv.rmeo
        cache_kv.entry(key.clone()).and_modify(|v| *v = val.clone()).or_insert(val.clone());
        self.val = Some(json!(cache_kv));
        self.flush();
        return true;
    }

    pub fn get(&mut self, key: String, def: String) -> String {
        let f = File::open(&self.cache_f);
        if f.is_err() {
            return def.to_owned();
        };
        let c: HashMap<String, String> = serde_json::from_reader(f.unwrap()).unwrap();
        let b = c.get(&key).to_owned();
        return if b.is_none(){def}else {b.unwrap().to_owned()};
    }

    pub fn flush(&mut self) {
        let _ = fs::write(&self.cache_f, self.val.as_ref().unwrap().to_string());
    }
}

lazy_static! {
    pub static ref CACHE_INC: Mutex<CacheTauri> = Mutex::new(CacheTauri::default());
}

#[tauri::command]
pub fn cache_get(key: String, def: String) -> Result<String, String>{
    let ret = CACHE_INC.lock();
    if let Err(r) = ret {
        return Err(r.to_string());
    };    
    let c= ret.unwrap().get(key, def);
    Ok(c)
}

#[tauri::command]
pub fn cache_set(key: String, val: String) -> Result<(), String>{
    let ret = CACHE_INC.lock();
    if let Err(r) = ret {
        return Err(r.to_string());
    };    
    let c= ret.unwrap().set(key, val);
    Ok(())
}