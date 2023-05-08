<template>
    <el-tabs class="panel-reslist" v-model="activePanel" type="card" @tab-change="onSelPanel">
        <el-tab-pane v-if="gProp.autoFreshIndex"  v-for="list, name in assetList" :label="name" :name="name">
            <el-table v-if="activePanel == 'bundle'" :data="list" :border=true :stripe=true style="width: 100%" >
                <el-table-column prop="name" label="Name" width="180" />
                <el-table-column prop="deps" label="Deps" />
                <el-table-column prop="path" label="Path" />
            </el-table>

            <el-table v-else-if ="activePanel == 'texture'" :data="list" :border=true :stripe=true style="width: 100%" >
                <el-table-column prop="uuid" label="Uuid" width="180" />
                <el-table-column #default="props" lable="Size">{{ props.row.size }}</el-table-column>
                <el-table-column prop="path" label="Path" />
            </el-table>

            <el-empty v-else  description="Not found"></el-empty>
        </el-tab-pane>
        <el-empty v-else description="No Data" />
    </el-tabs>
</template>


<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { CHUNK_ASSETS } from '../../cmd/assets_ping';
import CdpDebugger from '../../inc/cdp';
import { CdpResultCocosAssets } from '../../model/asset_property';

const activePanel = ref("bundle")
const assetList = ref<CdpResultCocosAssets>({});

const gProp = defineProps({
    autoFreshIndex: {
        type: Boolean, 
    }
})
const onSelPanel = (selval: string) => {
    activePanel.value = selval
    console.log(CHUNK_ASSETS.replace(/#asset_type/g, activePanel.value), "-->.CHUNK_ASSETS.replace(/#asset_type/g, activePanel.value)")
    CdpDebugger.inc().evalute_js(CHUNK_ASSETS.replace(/#asset_type/g, selval))
}

onMounted(() => {
    CdpDebugger.inc().onResultAsset = (assets: CdpResultCocosAssets) => {
        console.log("update assetlist ", assets)
        assetList.value = assets
    }
})

watch (
    () => gProp.autoFreshIndex, 
    (is: boolean) => {
        console.log("fresh start list")
        if (is){
            console.log(CHUNK_ASSETS.replace(/#asset_type/g, activePanel.value), "-->.CHUNK_ASSETS.replace(/#asset_type/g, activePanel.value)")
            CdpDebugger.inc().evalute_js(CHUNK_ASSETS.replace(/#asset_type/g, activePanel.value))
        }
    }
)

</script>

<style scoped>
:deep(.el-table__inner-wrapper){
    display: block;
    height: 300px;
    overflow-y: scroll;
}
</style>