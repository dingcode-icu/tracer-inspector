<template>
    <div>
        <el-row justify="space-around">
            <el-statistic :value="statisticResCnt.node_count">
                <template #title>
                    <div style="display: inline-flex; align-items: center">
                        Node
                        <el-tooltip effect="dark" content="Node contain number in tree at current time." placement="top">
                            <el-icon style="margin-left: 4px" :size="12">
                                <Warning />
                            </el-icon>
                        </el-tooltip>
                    </div>
                </template>
            </el-statistic>
            <el-statistic :value="statisticResCnt.allasset_count">
                <template #title>
                    <div style="display: inline-flex; align-items: center">
                        All-Asset
                        <el-tooltip effect="dark" content="List all cc.assetManager.assets in memory." placement="top">
                            <el-icon style="margin-left: 4px" :size="12">
                                <Warning />
                            </el-icon>
                        </el-tooltip>
                    </div>
                </template>
            </el-statistic>
            <el-statistic :value="statisticResCnt.cacheasset_count">
                <template #title>
                    <div style="display: inline-flex; align-items: center">
                        AssetCached
                        <el-tooltip effect="dark" content="All cachedfiles in cache dir." placement="top">
                            <el-icon style="margin-left: 4px" :size="12">
                                <Warning />
                            </el-icon>
                        </el-tooltip>
                    </div>
                </template>
            </el-statistic>
        </el-row>
    </div>
    <div>
        <TableAssets :autoFreshIndex="autoFreshIndex"></TableAssets>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import {
    Warning,
} from '@element-plus/icons-vue'
import CdpDebugger, { CdpResultGInfo } from '../inc/cdp';
import TableAssets from './Panel/TableAssets.vue';

const autoFreshIndex = ref(false)
const statisticResCnt = ref<CdpResultGInfo>({
    node_count: 0,
    allasset_count: 0,
    bundle_count: 0,
    cacheasset_count: 0
})

let ginfoDataHash = ""
onMounted(async () => {
    CdpDebugger.inc().onResultGInfo = (info: CdpResultGInfo) => {
        const str_ginfohash = JSON.stringify(info)
       
        if (ginfoDataHash != str_ginfohash) {
            statisticResCnt.value = info
            ginfoDataHash = str_ginfohash
            autoFreshIndex.value = true
            return
        }
    }


})
</script>


<style scoped>
/* :deep(.el-tabs__content) {
    width: 400px;
    height: 20px;
    padding-bottom: 0px;
    border: 1px solid black;
} */

:deep(.el-dialog__header) {
    background-color: aqua;
    margin-right: 0px;
    border: 1px dotted black;
}

#panel-goldfinger {
    width: 200px;
    height: 200px;
    background-color: beige;
}
</style>