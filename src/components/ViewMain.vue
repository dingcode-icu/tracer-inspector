<template>
    <div class="container">
        <div id="panel-header">
            <el-row>
                <AvatarConnect @on-connected-statu="onStatuChange" />
            </el-row>
        </div>
        <div id="panel-functional">
            <el-row id="header-tree">
                <el-text class="mx-1">
                    <el-icon>
                        <ElementPlus />
                    </el-icon>
                    节点树
                </el-text>
            </el-row>
            <NodeTree :connectStatu="connectStatu"></NodeTree>
            <el-row id="console-menu">
                <el-text class="mx-1">
                    <el-icon>
                        <Bell />
                    </el-icon>
                    命令行
                </el-text>
            </el-row>
            <XTerm :connectStatu="connectStatu"></XTerm>
        </div>
    </div>
</template>


<script setup lang="ts">
import NodeTree from "./NodeTree.vue"
import XTerm from "./Xterm.vue"
import AvatarConnect from "./Menu/AvatarConnect.vue"
import { EConnectStatu } from "../inc/cdp";
import { onMounted, ref } from "vue";
import { Bell, ElementPlus } from '@element-plus/icons-vue'
import { InspService } from "../service/svr";
import { installUpdate, onUpdaterEvent } from "@tauri-apps/api/updater";

const connectStatu = ref<EConnectStatu>(EConnectStatu.Idle)

const onStatuChange = (statu: EConnectStatu) => {
    connectStatu.value = statu
}

const onCheckUpdate = async () => {
    console.log("check update...")
    let [is_need, data] = await InspService.api_update.get_latestver()
    if (is_need){
        console.log(`update reuqire! manifest is ${data}`)
        await installUpdate()
        //wait to install suc!
        const unlisten = await onUpdaterEvent(({error, status}) => {
            console.log('Updater event', error, status);
        })
        unlisten()
        return 
    }
    console.log("no need update!go on.")
}

onMounted(async () => {
    //check update
    await onCheckUpdate()
    //do next
    
})

</script>

<style scoped>
#panel-header {
    min-height: 4vh;
    background-color: aqua;
}

#header-tree,
#console-menu {
    padding-left: 20px;
    height: 4lvh;
    background: aqua;
    border: 1px solid black;
}
</style>