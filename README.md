# Overview

Based on [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [Vue3](https://vuejs.org/)

Another ide of `Cocos-Inspector plugin`.\
We call it `Tracer-Inspector` because tracer name is more powerfull  :3

* **Single Exectable File** mini-size installer file for donwload and install.

* **Fastest** 0 GC for framework api call.

* **Cross-GamerEngine support[cocos creator, unity(todo), godot(todo)]** support every popular game engine `two thousand years later`. 


# Dev-Require 

* rust 1.6+
* yarn || npm 
* Operation system[windows10, macos, macos-m1]

# Dev-Debug 

```shell
cd $repo-root 
yarn install
yarn tauri dev
```
General you will see the GUI for make `Tracer-Inspector`

Document and tutorial live in the homepage [Tracer-Inspector-Homepage(Comming)](https://picboo.ink/)


#### Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

#### Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's Take Over mode by following these steps:

1. Run `Extensions: Show Built-in Extensions` from VS Code's command palette, look for `TypeScript and JavaScript Language Features`, then right click and select `Disable (Workspace)`. By default, Take Over mode will enable itself if the default TypeScript extension is disabled.
2. Reload the VS Code window by running `Developer: Reload Window` from the command palette.

You can learn more about Take Over mode [here](https://github.com/johnsoncodehk/volar/discussions/471).

# Publish
<mark> only support github  repo

* Step1 

make sure UPDATE_LOG.md with new version's change log

the change-txt fmt must in right like before versions.

* Step2
```shell
cd $repo-root 
yarn releas
```

# RoadMap 
## ~~v0.1.0~~
[x]base nodetree watch\
[x]base node-property watch\
[x]asset in memory watch\
[x]cmd execute from remote

## v0.2.0(doing)

[]nodetree with icon+active\
[]node-property with more info and editable\
[]cmd add dialog\
[]log with color by loglevel\
[]log keywords with color