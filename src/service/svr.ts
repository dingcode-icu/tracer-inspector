import SvrCheckUpdate from "./loc/chk_update";
import SvrConHistory from "./loc/con_history";

export interface ConnectHistory {
    device_name: string,
    host: string,
    port?: number
}


export abstract class BaseCheckUpdate {
    abstract get_latestver(): Promise<[boolean, string/**新包的下载地址 */]>
}

export abstract class BaseConHistory {

    public static CON_HISTORY: string = "CON_HISTORY"

    abstract get_conhistory():Promise<ConnectHistory[]>
    abstract post_record_conhistory(new_his: ConnectHistory, last_list: ConnectHistory[]):Promise<[boolean, string]>
}

export class InspService {
    private static IS_LOC: boolean = true


    private static _inc: InspService;
    private static  _api_conhistory: BaseConHistory = new SvrConHistory()
    private static  _api_update: BaseCheckUpdate = new SvrCheckUpdate()
    
    public static get api_conhis(): BaseConHistory{
        return this._api_conhistory
    }

    public static get api_update() : BaseCheckUpdate {
        return this._api_update
    }
    
    
}