<template>
    <div class="container">
        <div id="panel_header">
            <el-row>
                <AvatarConnect @on-connected-statu="onStatuChange" />
            </el-row>
        </div>
        <div id="panel_functional">
            <NodeTree :connectStatu="connectStatu"></NodeTree>
            <XTerm :connectStatu="connectStatu"></XTerm>
        </div>
    </div>
</template>


<script setup lang="ts">
import NodeTree from "./NodeTree.vue"
import XTerm from "./Xterm.vue"
import AvatarConnect from "./Menu/AvatarConnect.vue"
import { EConnectStatu } from "../inc/cdp";
import { ref } from "vue";


const connectStatu = ref<EConnectStatu>(EConnectStatu.Idle)

const onStatuChange = (statu: EConnectStatu) => {
    connectStatu.value = statu
}
</script>

<style scoped>
#panel_functional {
    height: 40svh;
}

#panel_header {
    min-height: 4vh;
    background-color: aqua;
}
</style>