export interface CmdProperty<T> {
    short: string,
    cmd: string, 
    tag: string, 
    desc: string, 
    resp: T
}