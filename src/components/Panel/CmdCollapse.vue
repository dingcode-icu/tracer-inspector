<template>
    <el-collapse v-model="activeCollapse" @change="onCollapseChange">
        <el-collapse-item title="Property" name="1">
            <NodeProp :nodeProps="curProps"></NodeProp>
        </el-collapse-item>
        <el-collapse-item title="Cmd" name="2">
            <el-row  :gutter="40">
                <el-col id="grid-content" v-for="cmd in debugCmdList" :span=12>
                    <CmdCard :card_info="cmd"></CmdCard>
                </el-col>
            </el-row>
        </el-collapse-item>

    </el-collapse>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { CmdProperty } from '../../model/cmd_property';
import { NodeProperty } from '../../model/node_property';
import CmdCard from './Cell/CmdCard.vue';
import NodeProp from "../NodeProp.vue"

const nodeProps = defineProps(["nodeProps"])
const curProps = ref<NodeProperty>({
    name: "unknown",
    uuid: "unknown",
    position: { x: 0, y: 0, z: 0 }
})

watch(
    () => nodeProps.nodeProps,
    (val: NodeProperty) => {
        curProps.value = val
    }
)


const activeCollapse = ref(["1"])


const displayState: CmdProperty<{}> = {
    short: 'display-state',
    cmd: `
        cc.debug.setDisplayStats(! cc.debug.isDisplayStats());
    `,
    tag: 'sf',
    desc: 'switch display state',
    resp: {}
}

const debugCmdList: CmdProperty<{}>[] = [
    displayState    
]



const onCollapseChange = () => {

}
</script>



<style scoped>
:deep(.el-card__header) {
    padding: 4px;
}

:deep(.el-collapse) {
    --el-collapse-header-height: 20px
}

#grid-content{
    margin-bottom: 20px;
}

#grid-contnet:last-child {
    margin-bottom: 0px;
}
</style>