<template>
    <div>
        <el-row class="hidden-sm-and-down">
            <el-checkbox-group v-model="xtermFindOption">
                <el-checkbox v-for="op in findInterfaceParma" :label="op">
                    {{ op }}
                </el-checkbox>
            </el-checkbox-group>
            <el-input id="input-findtxt" ref="elFindTxt" placeholder="Find..." :suffix-icon="Search" v-model="xtermFindText"
                style="width: 200px;" @change="onFindInput" @blur="onFindBlur" @focuse="onFindFocus">
                <template #prepend>
                    Find
                </template>
            </el-input>
            <el-input placeholder="Filter..." :suffix-icon="Filter" v-model="xtermFileterText" style="width: 200px;"
                class="hidden-md-and-down">
                <template #prepend>
                    Filter
                </template>
            </el-input>

        </el-row>
        <div id="xterm-cont"></div>
    </div>
</template>


<script setup lang="ts">

import 'xterm/css/xterm.css'
import 'element-plus/theme-chalk/display.css'
import { onMounted, ref, watch } from 'vue';
import { XtermCompoment } from '../inc/xterm';
import { Filter, Search } from "@element-plus/icons-vue";
import CdpDebugger, { CdpEvent, CdpEventConsole, EConnectStatu } from '../inc/cdp';
import { ISearchOptions } from 'xterm-addon-search';
import { ElMessage } from 'element-plus';

const globalProp = defineProps(["connectStatu"])

const findInterfaceParma = ["regex", "wholeWorld", "caseSensitive", "incremental"]
const elFindTxt = ref<any>(null)
const xtermFindText = ref("")
const xtermFileterText = ref("")
const xtermFindOption = ref<[]>([])
const xtermFindOptionRec = ref<ISearchOptions>({})

const onFindFocus = (evt: FocusEvent) => {
    console.log(evt, '-->>onFindFocus')
}

const onFindBlur = (evt: FocusEvent) => {
    console.log(evt, ":-->>onFindBlur")
    let el = document.getElementById("input-findtxt")
    el?.addEventListener("keydown", (evt: KeyboardEvent) => {
        if (evt.code == "Enter"){
           doFindNext()
        }
    })
}

const doFindNext = () => {
    let is_find = XtermCompoment.inc().findNext(xtermFindText.value, xtermFindOptionRec.value)
    if (!is_find){
        ElMessage({
            message: 'Not found!',
            type: 'warning',
        })
        return
    }
}

//@ts-ignore
const onFindInput = (evt) => {
    let js_obj: any = {}
    xtermFindOption.value.forEach((val: string) => {
        js_obj[val] = true
    })
    xtermFindOptionRec.value = js_obj
    let el = document.getElementById("input-findtxt")
    el?.addEventListener("keydown", (evt: KeyboardEvent) => {
        if (evt.code == "Enter"){
           doFindNext()
        }
    })
}

onMounted(() => {
    XtermCompoment.inc()
})


watch(
    () => globalProp.connectStatu,
    (val: EConnectStatu) => {
        if (val == EConnectStatu.Connected) {
            CdpDebugger.inc().onConsole = (evt: CdpEvent<CdpEventConsole>) => {
                XtermCompoment.inc().xterm!.writeln(evt.out.msg)
            }
        }
    }
)

</script>

<style scoped>
#console-cont {
    padding-bottom: 0px;
}

#xterm-cont {
    background-color: aqua;
    width: 100%;
}
</style>