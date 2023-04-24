import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { listen } from "@tauri-apps/api/event"
import { WebglAddon } from "xterm-addon-webgl";
import { AttachAddon } from "xterm-addon-attach";
import CdpDebugger, { CdpEvent, CdpEventConsole, CdpEventTrace } from "./cdp";


const defaultTheme = {
    foreground: '#ffffff', // 字体
    background: '#1b212f', // 背景色
    cursor: '#ffffff', // 设置光标
    selection: 'rgba(255, 255, 255, )',
    black: '#000000',
    brightBlack: '#808080',
    red: '#ce2f2b',
    brightRed: '#f44a47',
    green: '#00b976',
    brightGreen: '#05d289',
    yellow: '#e0d500',
    brightYellow: '#f4f628',
    magenta: '#bd37bc',
    brightMagenta: '#d86cd8',
    blue: '#1d6fca',
    brightBlue: '#358bed',
    cyan: '#00a8cf',
    brightCyan: '#19b8dd',
    white: '#e5e5e5',
    brightWhite: '#ffffff'
}

export class XtermCompoment {
    private static _comp: XtermCompoment;
    private _xterm: Terminal | undefined;

    private constructor() {
        const el = document.getElementById('xterm_container') as HTMLElement
        if (!el) { console.log("not found element named xterm_container"); return; }
        const term = new Terminal({
            disableStdin: false,
            wordSeparator: "",
            cursorStyle: "block",
            cursorBlink: true,
            theme: defaultTheme
        });
        this._xterm = term
        term.onData((a1, a2) => {
            console.log("ondata")
        })
        term.onBinary(() => {
            console.log("on onBinary")
        })
        term.onWriteParsed(() => {
            console.log("onn onWriteParsed")
        })
        term.open(el)
        term.writeln('============================')
        term.writeln('Welcome Tracer-inspector :3')
        term.writeln('============================')
        this.reg_addone()
    }

    public start_attach() {
        //attach by addone
        const attachAddon = new AttachAddon(CdpDebugger.inc().ws);
        this._xterm!.loadAddon(attachAddon);
    }

    public async start_attach_event() {
        CdpDebugger.inc().onConsole = (evt: CdpEvent<CdpEventConsole>) => {
            // console.log(evt, "-->>evt ")
            this._xterm!.writeln(evt.out.msg)
        }
    }

    private async reg_addone() {
        //fit
        const fitAddon = new FitAddon()
        this._xterm!.loadAddon(fitAddon)
        window.addEventListener('resize', () => {
            fitAddon.fit()
        })
        fitAddon.fit()
    }

    public static inc(): XtermCompoment {
        if (!this._comp) {
            this._comp = new XtermCompoment()
        }
        return this._comp
    }
}