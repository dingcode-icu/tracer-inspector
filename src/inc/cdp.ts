
import { http, invoke } from "@tauri-apps/api";
import WebSocketAsPromised from "websocket-as-promised";
import { CHUNK_ASSETS } from "../cmd/assets_ping";
import { CHUNK_GINFO } from "../cmd/ginfo_ping";
import { CdpResultCocosAssets } from "../model/asset_property";
import { NodeProperty } from "../model/node_property";

enum EConType {
    Rust,
    Js
}

interface CdpResponse {
    id: number,
    method: string,
    params: CdpConsoleParams,
    result: any
}


interface CdpConsoleParams {
    type: string,
    args: { type: string, value: string }[],
    executionContextId: number,
    timestamp: number,
    stackTrace: any
}

interface CdpReqExecute {
    id: number,
    method: string,
    params: {
        expression: string,
        objectGroup?: string,
        includeCommandLineAPI?: boolean,
        silent?: boolean,
        returnByValue?: boolean,
        generatePreview?: boolean,
        userGesture?: boolean,
        awaitPromise?: boolean,
        replMode?: boolean,
        allowUnsafeEvalBlockedByCSP?: boolean,
        contextId?: 1
    }
}

export interface CdpEventConsole {
    msg: string
}

export interface CdpEventTrace {
    trace: string[]
}

export interface CdpEvent<T> {
    event: string,
    out: T
}

export interface CdpResult<T> {
    tag: string,
    out: T[]
}

export interface CdpResultNodeTree {
    label: string,
    key: string,
    children: CdpResultNodeTree[]
}


export interface CdpResultGInfo {
    node_count: number,
    allasset_count: number,
    bundle_count: number,
    cacheasset_count: number
}

interface DebuggerTarget {
    description: string,
    devtoolsFrontendUrl: string,
    faviconUrl: string,
    id: string,
    title: string,
    type: string,
    url: string,
    webSocketDebuggerUrl: string
}

interface CdpRespon {
    data: DebuggerTarget[]
}

export enum EConnectStatu {
    Idle,
    Connecting,
    Connected,
    Close
}

export default class CdpDebugger {
    private _host: string;
    private DEFAULT_HOST: string = "ws://127.0.0.1:6089";
    private _status: EConnectStatu = EConnectStatu.Idle
    private static _con_type: EConType = EConType.Js
    private _ws: WebSocketAsPromised | null;
    private _cur_msgid: number = 1;
    private _timer: NodeJS.Timer | null = null;

    private static _inc: CdpDebugger;
    private constructor(host?: string) {
        this._host = host ? host : this.DEFAULT_HOST
        this._ws = null
    }

    public _onResultNodeProp: ((evt: NodeProperty) => void | undefined) | undefined;
    public set onResultNodeProp(method: (evt: NodeProperty) => void) {
        this._onResultNodeProp = method
    }

    public _onConsole: ((evt: CdpEvent<CdpEventConsole>) => void) | undefined;
    public set onConsole(method: (evt: CdpEvent<CdpEventConsole>) => void) {
        this._onConsole = method
    }
    public _onResultNodeTree: ((evt: CdpResultNodeTree[]) => void) | undefined;
    public set onResultNodeTree(method: (evt: CdpResultNodeTree[]) => void) {
        this._onResultNodeTree = method
    }

    public _onResultGInfo: ((analysis: CdpResultGInfo) => void) | undefined;
    public set onResultGInfo(method: (analysis: CdpResultGInfo) => void) {
        this._onResultGInfo = method
    }

    public _onResultAsset: ((assets: CdpResultCocosAssets) => void)|undefined;
    public set onResultAsset(method: (assets: CdpResultCocosAssets) => void) {
        this._onResultAsset = method
    }

    //js special 
    private async get_tabs(index: number, host: string, port: number = 6086) {
        // xhr 
        let resp: CdpRespon = await http.fetch(`http://${host}:${port}/json`, {
            method: "GET"
        })
        if (resp.data.length >= index + 1) {
            return resp.data[index]
        }
    }


    private async connect_rust(host: string, port: number = 6086): Promise<EConnectStatu> {
        console.log(`connect_rust to host:${host}`)
        this._status = EConnectStatu.Connecting
        let ret = await invoke("cdp_connect", { host: host, port: port })
            .then((res) => {
                this._status = EConnectStatu.Connected
                return this._status
            })
            .catch(() => {
                this._status = EConnectStatu.Idle
                return this._status
            })
        return ret
    }

    private get_console_out(payload: CdpConsoleParams) {
        //color
        let log_color = ["", ""]
        const type = payload.type
        switch (type) {
            case "log":
                log_color = ["", ""]
                break;

            default:
                break;
        }
        //msg 
        let log_msg = ""
        payload.args.forEach(val => {
            log_msg += `${val.value} `
        })
        const ret = `${log_color[0]}${log_msg}${log_color[1]}`
        return ret
    }


    private handle_method_resp(resp: CdpResponse) {
        switch (resp.method) {
            case "Runtime.consoleAPICalled":
                let evt: CdpEvent<CdpEventConsole> = {
                    event: "",
                    out: {
                        msg: ""
                    }
                }
                evt.event = "cdp-console"
                evt.out.msg = this.get_console_out(resp.params)
                if (this._onConsole) {
                    this._onConsole(evt)
                }
                break;

            default:
                console.warn(`no handler for ${resp.method}`)
                break;
        }
    }

    private handle_result_resp(resp: CdpResponse) {
        const data = resp.result.result
        if (!data) return
        if (data.type == "object") {
            let root = data.value;
            if (!root || !root["tag"]) return
            let func_tag = root["tag"]
            switch (func_tag) {
                case "GINFO_INTERVAL":
                    console.log("INTERVAL_GINFO")
                    this._onResultNodeTree!([
                        root["tree_map"]
                    ])
                    this._onResultGInfo!(
                        root["global"]
                    )
                    break;
                case "ASSETS_INTERVAL": 
                    console.log("ASSETS_INTERVAL")
                    this._onResultAsset!(root["assets"])
                    break;
                case "NODE_PROPERTY":
                    this._onResultNodeProp!(root["val"])
                    break;
                default:
                    console.warn(`no handler for tag ${func_tag}`)
                    break;
            }
            return
        }
        console.warn(`no handler for type: ${data.type}`)
    }

    public async filter_handle_resp(msg: string) {
        const origin_map: CdpResponse = JSON.parse(msg)
        if (origin_map.method) {
            this.handle_method_resp(origin_map)
            return
        }
        this.handle_result_resp(origin_map)
    }

    private async connect_js(host: string, port: number = 6086): Promise<EConnectStatu> {
        console.log(`conncet_js get debugger address:${host}...`)
        let tab_0 = await this.get_tabs(0, host, port)
            .catch((err) => {
                return undefined
            })
        if (!tab_0) {
            return EConnectStatu.Idle
        }
        let addr = tab_0?.webSocketDebuggerUrl
        if (!addr) {
            console.warn("not found debugger-url!Close!")
            return EConnectStatu.Close
        }
        console.log(`addr is:${addr}...`)
        let ws = new WebSocketAsPromised(addr!)
        this._ws = ws
        ws.onMessage.addListener(data => {
            this.filter_handle_resp(data)
        })
        ws.onResponse.addListener(data => console.log(data, "-->>>onResponse"))
        ws.onClose.addListener(_ => {
            this._status = EConnectStatu.Close
            this._ws = null
        })
        this._status = EConnectStatu.Connecting
        await ws.open()
            .then(() => {
                this._status = EConnectStatu.Connected
                this.req_debugger("Runtime.enable", {})
                // this.req_debugger("Debugger.enable", {"maxScriptsCacheSize":10000000})
                // this.req_debugger("Debugger.setPauseOnExceptions", {"state":"none"})
                // this.req_debugger("Debugger.setAsyncCallStackDepth", {"maxDepth":32})
                console.log("connect suc!")
            }
            )
            .catch((err) => {
                console.log(`connect error:${err}`)
                this._status = EConnectStatu.Close
            })
        return this._status
    }

    public async connect(host: string, port: number = 6086): Promise<EConnectStatu> {
        let ret = CdpDebugger._con_type == EConType.Js ? await this.connect_js(host, port) : await this.connect_rust(host, port)
        return ret
    }

    private req_debugger(method: string, params: object) {
        if (this._status != EConnectStatu.Connected) return;
        this._cur_msgid += 1
        this._ws?.send(JSON.stringify({ "id": this._cur_msgid, "method": method, "params": params }))
    }

    public evalute_js(js_chunk: string, group: string = "console") {
        this.req_debugger("Runtime.evaluate", {
            expression: js_chunk,
            objectGroup: group,
            includeCommandLineAPI: true,
            silent: false,
            returnByValue: true,
            generatePreview: true,
            userGesture: true,
            awaitPromise: false,
            replMode: true,
            allowUnsafeEvalBlockedByCSP: false
        }
        )
    }

    public evalute_cmd_js(js_chunk: string, cmd_name: string) {
        const try_chunk = `
            try {
                ${js_chunk}
                console.log("run cmd ${cmd_name} suc!")
            }
            catch {
                console.error("run cmd ${cmd_name} failed!")
            }
        `
        this.req_debugger("Runtime.evaluate", {
            expression: try_chunk,
            objectGroup: "user_cmd",
            includeCommandLineAPI: true,
            silent: false,
            returnByValue: true,
            generatePreview: true,
            userGesture: true,
            awaitPromise: false,
            replMode: true,
            allowUnsafeEvalBlockedByCSP: false
        }
        )
    }

    public start_ginfo_ping() {
        this._timer = setInterval(() => {
            this.evalute_js(CHUNK_GINFO)
            // this.evalute_js(CHUNK_ASSETS)
        }, 1000)

    }

    public stop_ping() {
        this._timer!.unref()
    }

    /**
     * 调试器单例
     * @param host 调试v8地址
     * @returns 
     */
    public static inc(host?: string): CdpDebugger {
        if (!this._inc) {
            this._inc = new CdpDebugger(host)
        }
        return this._inc
    }

    /**
     * 调试器的连接状态
     */
    public get statu(): EConnectStatu {
        return this._status
    }

    public get ws(): WebSocket {
        return this._ws!.ws
    }
}