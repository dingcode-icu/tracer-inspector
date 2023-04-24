<template>
    <div>
        <el-row id="console-menu">
            <el-text class="mx-1">
                <el-icon>
                    <Bell />
                </el-icon>
                命令行
            </el-text>
        </el-row>
        <el-row id="console-cont">
            <div id="xterm_container"></div>
        </el-row>

    </div>
</template>


<script setup lang="ts">
import { Bell } from '@element-plus/icons-vue'
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
#console-menu {
    padding-left: 20px;
    height: 4lvh;
    background: aqua;
    border: 1px solid black;
}

#console-cont {
    padding-bottom: 2px;
}

#xterm_container {
    background-color: aqua;
    width: 100%;
}
</style>