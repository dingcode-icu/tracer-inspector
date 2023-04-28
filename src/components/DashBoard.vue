<template>
    <div>
        <el-row justify="center" :span="24">
            <el-statistic :value="statisticResCnt">
                <template #title>
                    <div style="display: inline-flex; align-items: center">
                        Resource loaded count
                        <el-tooltip effect="dark" content="List come from eval cc.assetManager" placement="top">
                            <el-icon style="margin-left: 4px" :size="12">
                                <Warning />
                            </el-icon>
                        </el-tooltip>
                    </div>
                </template>
            </el-statistic>
            <el-statistic :value="statisticResCnt">
                <template #title>
                    <div style="display: inline-flex; align-items: center">
                        Resource loaded count
                        <el-tooltip effect="dark" content="List come from eval cc.assetManager" placement="top">
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
        <el-tabs class="panel-reslist" v-model="activePanel" type="card" @tab-click="onSelPanel">
            <el-tab-pane label="Textures" name="texture" class="panel-reslist">
            </el-tab-pane>
            <el-tab-pane label="Audios" name="audio">
            </el-tab-pane>
        </el-tabs>
        <div id="panel-goldfinger">
            <h2>
                tes
            </h2>
        </div>
    </div>
</template>


<script setup lang="ts">
import { ref } from 'vue';
import {
    Warning,
} from '@element-plus/icons-vue'

const activePanel = ref("")

const statisticResCnt = ref(0)

const onSelPanel = () => {

}
</script>


<style scoped>
:deep(.el-tabs__content) {
    width: 400px;
    height: 20px;
    padding-bottom: 0px;
    border: 1px solid black;
}

:deep(.el-tabs__header) {
}

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