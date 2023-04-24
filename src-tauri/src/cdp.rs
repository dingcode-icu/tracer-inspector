use cdp_rs::CdpClient;
use std::sync::Mutex;

pub mod cdp {

    use std::sync::{Arc, Mutex};

    use cdp_rs::{parms, CdpConnection};
    use tauri::Runtime;
    use tokio::sync::mpsc;

    use super::CDP_INC;

    #[tauri::command]
    pub async fn cdp_connect<R: Runtime>(
        _: tauri::AppHandle<R>,
        window: tauri::Window<R>,
        host: &str,
        port: u16,
    ) -> Result<(), String> {
        let (tx, mut rcv) = mpsc::channel(1);
        let host_ = host.to_owned();
        let c = tokio::task::spawn_blocking(move || -> Result<(), String> {
            let cli = CDP_INC
                .lock()
                .unwrap()
                .connect_to_addr(host_, port)
                .map_err(|_| "Cdp client connect failed!")?;
            let arc_cli = Arc::<Mutex<CdpConnection>>::new(cli.into());
            let inner_cli = arc_cli.clone();
            tokio::task::spawn_blocking(move || {
                let mut ready = false;
                loop {
                    if let Ok(msg) = arc_cli.lock().unwrap().wait_message() {
                        let _ = tx.blocking_send(msg);
                    };
                    if !ready {
                        inner_cli
                            .lock()
                            .unwrap()
                            .send("Runtime.enable", parms!())
                            .map_err(|_| "send message failed!")
                            .unwrap();
                        ready = true;
                    }
                }
            });
            Ok(())
        });
        while let Some(c) = rcv.recv().await {
            window
                .emit("cdp-console", serde_json::to_string(&c).unwrap())
                .map_err(|_| "serde cdp result to json failed!")?;
            println!("open  val is {:}", c.to_string());
        }
        Ok(())
    }
}

lazy_static! {
    pub static ref CDP_INC: Mutex<CdpClient> = Mutex::new(CdpClient::new());
}
