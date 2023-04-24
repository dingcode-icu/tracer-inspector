import { http, invoke } from "@tauri-apps/api";
import { W } from "@tauri-apps/api/event-2a9960e7";
import axios, { Axios } from "axios";

export enum EConnectStatu {
    Idle,
    Connecting,
    Conneected,
    Close
}
export default class CdpDebuggerJS {
    private _host: string;
    private DEFAULT_HOST: string = "ws://127.0.0.1:6089";
    private _status: EConnectStatu = EConnectStatu.Idle

    private static _inc: CdpDebuggerJS;
    private constructor(host?: string) {
        this._host = host ? host : this.DEFAULT_HOST
    }
    
    //js special 
    private async get_tabs(index: number, host: string, port: number = 6086) {
        // xhr 
        console.log("try get ")
        let resp = await http.fetch(`http://${host}:${port}/json`, {
            method:"GET"
        })
        
        console.log(resp)
    }

    public async connect(host: string, port: number = 6086) {
        console.log(`connect to host:${host}`)
        this._status = EConnectStatu.Connecting
        
        //get tabs[0]
        let tab_0 = await this.get_tabs(0, host, port)
        console.log(tab_0)


        // const con = new WebSocket("`ws://`")
        let ret = await invoke("cdp_connect", { host: host, port: port })
            .then((res) => {
                this._status = EConnectStatu.Conneected
                return this._status
            })
            .catch(() => {
                this._status = EConnectStatu.Idle
                return this._status
            })
        return ret
    }

    /**
     * 调试器的连接状态
     */
    public get statu(): EConnectStatu {
        return this._status
    }

    /**
     * 调试器单例
     * @param host 调试v8地址
     * @returns 
     */
    public static inc(host?: string): CdpDebuggerJS {
        if (!this._inc) {
            this._inc = new CdpDebuggerJS(host)
        }
        return this._inc
    }
}