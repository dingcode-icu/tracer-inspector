import { register } from '@tauri-apps/api/globalShortcut';


const GLOBAL_SHORTCUT = [
    ["Enter"]
]

export default class GlobalShortcut {

    public async on() {
        await register("Enter", () => {
            console.log("onEnter")
        })
    }
}