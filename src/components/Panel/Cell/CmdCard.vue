<template>
    <el-card class="box-card" shadow=always>
        <template #header>
            <div class="card-header">
                <span>{{ccProp.card_info.short}}</span>
                <el-button class="button" text>Edit</el-button>
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
import { CmdProperty } from "../../../model/cmd_property";

const ccProp = defineProps<{
    card_info: CmdProperty<{}>
}>()

</script>

<style scoped></style>