<template>
    <el-card class="box-card" shadow=always>
        <template #header>
            <div class="card-header">
                <el-row justify="space-around">
                    <el-text truncated style="width: 80px;">{{ccProp.card_info.short}}</el-text>
                    <el-button class="button" text @click="()=> onExec(ccProp.card_info)">Exec</el-button>
                </el-row>
                
            </div>
        </template>
        <div>
            <span>
                {{ ccProp.card_info.desc }}
            </span>
        </div>
    </el-card>
</template>

<script setup lang="ts">
import CdpDebugger from "../../../inc/cdp";
import { CmdProperty } from "../../../model/cmd_property";

const ccProp = defineProps<{
    card_info: CmdProperty<{}>
}>()


const onExec = (cmd_prop: CmdProperty<{}>) => {
    CdpDebugger.inc().evalute_cmd_js(cmd_prop.cmd, cmd_prop.short)
}


</script>

<style scoped></style>