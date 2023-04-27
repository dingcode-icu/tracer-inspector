import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { AttachAddon } from "xterm-addon-attach";
import CdpDebugger from "./cdp";
import { ISearchOptions, SearchAddon } from "xterm-addon-search";

const AdventureTime = {
    foreground: '#d2d2d2',
    background: '#2b2b2b',
    cursor: '#adadad',
    black: '#000000',
    red: '#d81e00',
    green: '#5ea702',
    yellow: '#cfae00',
    blue: '#427ab3',
    magenta: '#89658e',
    cyan: '#00a7aa',
    white: '#dbded8',
    brightBlack: '#686a66',
    brightRed: '#f54235',
    brightGreen: '#99e343',
    brightYellow: '#fdeb61',
    brightBlue: '#84b0d8',
    brightMagenta: '#bc94b7',
    brightCyan: '#37e6e8',
    brightWhite: '#f1f1f0'
}


export class XtermCompoment {
    private static _comp: XtermCompoment;
    private _xterm: Terminal | undefined;

    private _search_addon: SearchAddon | null = null;

    private constructor() {
        const el = document.getElementById('xterm-cont') as HTMLElement
        if (!el) { console.log("not found element named xterm_container"); return; }
        const term = new Terminal({
            fontSize: 14,
            fontFamily: '"Menlo for Powerline", Menlo, Consolas, "Liberation Mono", Courier, monospace',
            disableStdin: false,
            wordSeparator: "",
            cursorStyle: "block",
            cursorBlink: true,
            theme: AdventureTime
        });
        this._xterm = term
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

    private async reg_addone() {
        //fit
        const fitAddon = new FitAddon()
        this._xterm!.loadAddon(fitAddon)
        window.addEventListener('resize', () => {
            fitAddon.fit()
        })
        fitAddon.fit()

        //search 
        const searchAddon = new SearchAddon()
        this._xterm!.loadAddon(searchAddon)
        this._search_addon = searchAddon
    }

    public findNext(f_txt: string, option?: ISearchOptions): boolean {
        if (!this._search_addon) return false;
        return this._search_addon!.findNext(f_txt, option)
    }

    public findPre(f_txt: string, option?: ISearchOptions): boolean {
        if (!this._search_addon) return false;
        return this._search_addon!.findPrevious(f_txt, option)
    }

    public get xterm() {
        return this._xterm
    }

    public static inc(): XtermCompoment {
        if (!this._comp) {
            this._comp = new XtermCompoment()
        }
        return this._comp
    }
}