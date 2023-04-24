<template>
    <el-row id="console_menu">
        <el-text class="mx-1">
            <el-icon>
                <Bell />
            </el-icon>
            命令行
        </el-text>
    </el-row>
    <Console :data="console.value" />
</template>

<script setup lang="ts">
import { Console, DataAPI } from "vue-console-feed"
import { Bell } from '@element-plus/icons-vue'
import "vue-console-feed/style.css"
const console = new DataAPI(false, 0) // if you use API set option to true, argument 2 offset deep location

console.log("hello world")
console.count()
console.group()
console.count()
console.table([1, 234, 1])
console.warn("Warning!!")
console.count()
console.groupEnd()
</script>

<style scoped>
#console_menu {
    padding-left: 20px;
    height: 4lvh;
    background: aqua;
    border: 1px solid black;
}
</style>