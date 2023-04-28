import { invoke } from "@tauri-apps/api";
import { SearchAddon } from "xterm-addon-search";
import { BaseConHistory, ConnectHistory } from "../svr";

export default class SvrConHistory implements BaseConHistory {
    async get_conhistory(): Promise<ConnectHistory[]> {
        let r: ConnectHistory[] = await invoke("cache_get", { key: BaseConHistory.CON_HISTORY, def: "[]" })
            .then((res) => {
                let re: ConnectHistory[] = JSON.parse(res as string)
                return re
            })
            .catch((err) => {
                console.error(`[get history raise error]:${err}`)
                return []
            })
        return r
    }

    async post_record_conhistory(new_his: ConnectHistory, last_list: ConnectHistory[]): Promise<[boolean, string]> {

        //check exists
        for (let i = 0; i < last_list.length; i++) {
            const his = last_list[i];
            if (new_his.device_name == his.device_name) {
                return [false, `device_name <${his.device_name}> already exists`]
            }
            if (new_his.host == his.host) {
                return [false, `host <${his.host}> already exists!`]
            }
        }
        last_list.push(new_his)
        let [issuc, err] = await invoke("cache_set", { key: BaseConHistory.CON_HISTORY, val: JSON.stringify(last_list) })
            .then((res) => {
                return [true, ""]
            })
            .catch((err) => {
                console.error(`[get history raise error]:${err}`)
                return [false, err]
            })
        return [issuc, err]
    }
}