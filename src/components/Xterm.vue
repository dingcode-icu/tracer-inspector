<template>
    <div>
        <el-row id="console-cont">
            <div id="xterm-cont"></div>
        </el-row>
    </div>
</template>


<script setup lang="ts">

import 'xterm/css/xterm.css'
import { onMounted, watch } from 'vue';
import { XtermCompoment } from '../inc/xterm';
import CdpDebugger, { EConnectStatu } from '../inc/cdp';

const xtermEmit = defineEmits(["on_connected"])
const globalProp = defineProps(["connectStatu"])


onMounted(() => {
    XtermCompoment.inc()
})


watch(
    () => globalProp.connectStatu,
    (val: EConnectStatu) => {
        console.log("xterm statu change")
        if (val == EConnectStatu.Connected) {
            XtermCompoment.inc().start_attach_event()
        }
    }
)

</script>

<style scoped>

#console-cont {
    padding-bottom: 2px;
}

#xterm-cont {
    background-color: aqua;
    width: 100%;
}
</style>