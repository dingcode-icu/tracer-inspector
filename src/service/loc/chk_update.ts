import { BaseCheckUpdate } from "../svr";
import { checkUpdate, UpdateResult } from '@tauri-apps/api/updater';

export default class SvrCheckUpdate implements BaseCheckUpdate {
    async get_latestver(): Promise<[boolean, string]> {
        const [should_update, url] = await checkUpdate()
        .then((res)=>{
            // should_update = updater.shouldUpdate
            // url = updater.manifest?.body!
            return [res.shouldUpdate, ""]
        })
        .catch((err)=>{
            return [false,  err]
        })
        return [should_update, url]
    }
    
}