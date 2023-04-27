
#[macro_use]
extern  crate lazy_static;

mod cdp;
mod cache;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let conf = app.config();
            //init local-recorder
            let cache_p = tauri::api::path::app_cache_dir(&conf);
            cache::CACHE_INC.lock()?.init(&cache_p.unwrap());     
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            //cache 
            cache::cache_get, 
            cache::cache_set,
            cdp::cdp::cdp_connect 
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


#[tokio::test]
async fn test() {
    use tokio::sync::mpsc;
    let (tx, mut rx) = mpsc::channel(100);
    tokio::spawn(async move {
        for i in 0..10 {
            if let Err(_) = tx.send(i).await {
                println!("receiver dropped");
                return;
            }
        }
    });

    while let Some(i) = rx.recv().await {
        println!("got = {}", i);
    }
}