<template>
    <el-row id="row-functional">
        <el-descriptions class="margin-top" :column="2" border>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        Name:
                    </div>
                </template>
                {{ curProps?.name }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        Uuid:
                    </div>
                </template>
                {{ curProps?.uuid }}
            </el-descriptions-item>
            <el-descriptions-item>
                <template #label>
                    <div class="cell-item">
                        Position
                    </div>
                </template>
                x:{{ curProps.position.x }}  y:{{ curProps.position.y }} z:{{ curProps.position.z }}
            </el-descriptions-item>
        </el-descriptions>
    </el-row>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { NodeProperty } from '../model/node_property';
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
</script>


<style scoped></style>