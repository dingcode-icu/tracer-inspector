<template>
    <el-collapse v-model="activeCollapse" @change="onCollapseChange">
        <el-collapse-item title="Core" name="1">
            <el-row :gutter="40">
                <el-col v-for="cmd in debugCmdList" :span=12>
                    <CmdCard  :card_info="cmd"></CmdCard>    
                </el-col>
            </el-row>
            
        </el-collapse-item>
        <el-collapse-item title="Logic" name="2">
            <div>
                Operation feedback: enable the users to clearly perceive their
                operations by style updates and interactive effects;
            </div>
            <div>
                Visual feedback: reflect current state by updating or rearranging
                elements of the page.
            </div>
        </el-collapse-item>
    </el-collapse>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { CmdProperty } from '../../model/cmd_property';
import CmdCard from './Cell/CmdCard.vue';


const activeCollapse = ref(["1", "2"])

const debugCmd: CmdProperty<{}> = {
    short: 'Switch framecall',
    cmd: 'test',
    tag: '111',
    desc: '123123asdfasdfasdfasdf',
    resp: {}
}

const debugCmdList:CmdProperty<{}>[] = [
    debugCmd,
    debugCmd,
    debugCmd,
    debugCmd,
    debugCmd,
    debugCmd,
    debugCmd,
]



const onCollapseChange = () => {

}
</script>



<style scoped>
:deep(.el-card__header){
    padding: 4px;
}

:deep(.el-collapse){
    --el-collapse-header-height: 20px
}
</style>