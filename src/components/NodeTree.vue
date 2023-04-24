<template>
    <div>
        <el-row id="treenode_menu">
            <el-text class="mx-1">
                <el-icon>
                    <ElementPlus />
                </el-icon>
                节点树
            </el-text>
        </el-row>
        <el-row>
            <el-col :span="12" id="panel_tree">
                <el-tree v-if="treeData.length > 0" :data="treeData" :props="defaultProps" @node-click="onSelect" />
                <el-empty v-else description="No Data">
                    <el-button type="primary">Fresh</el-button>
                </el-empty>
            </el-col>
            <el-col :span="12" id="panel_nodeinfo">
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { invoke } from "@tauri-apps/api/tauri";
import { ElementPlus } from '@element-plus/icons-vue'
import CdpDebugger, { EConnectStatu } from "../inc/cdp";

const globalProp = defineProps(["connectStatu"])

const treeData = ref([
    // {
    //   label: 'parent 1',
    //   key: '0-0',
    //   children: [
    //     {
    //       label: 'parent 1-0',
    //       key: '0-0-0',
    //       children: [
    //         { label: 'leaf', key: '0-0-0-0' },
    //         {
    //           key: '0-0-0-1',
    //         },
    //         { label: 'leaf', key: '0-0-0-2' },
    //       ],
    //     },
    //     {
    //       label: 'parent 1-1',
    //       key: '0-0-1',
    //       children: [{ label: 'leaf', key: '0-0-1-0' }],
    //     },
    //     {
    //       label: 'parent 1-2',
    //       key: '0-0-2',
    //       children: [
    //         { label: 'leaf 1', key: '0-0-2-0' },
    //         {
    //           label: 'leaf 2',
    //           key: '0-0-2-1',
    //         },
    //       ],
    //     },
    //   ],
    // },
    // {
    //   label: 'parent 2',
    //   key: '0-1',
    //   children: [
    //     {
    //       label: 'parent 2-0',
    //       key: '0-1-0',
    //       children: [
    //         { label: 'leaf', key: '0-1-0-0' },
    //         { label: 'leaf', key: '0-1-0-1' },
    //       ],
    //     },
    //   ],
    // },
])
const defaultProps = {
    children: 'children',
    label: 'label',
}

const onSelect = () => {

}

watch(
    ()=>globalProp.connectStatu, 
    (val: EConnectStatu)=>{
        console.log("node tree->", val)
        if (val == EConnectStatu.Connected) {
            console.log("start update")
            setTimeout(() => {
                console.log("call once")
                // requestAnimationFrame(()=>{
                CdpDebugger.inc().evalute_js(chunk_nodetree)
                console.log("startr animation frame", Date())
            // })
            }, 100);

        }
        
    }
)

const chunk_nodetree = `
let cc = window.cc;
let cur_scene = cc.director.getScene();
let cur_children = cur_scene.getChildren();
console.log(cur_children, "-->cur_children");
let map_data = {};
let iter_func = (node, jsobj)=> {
    let cd = node.getChildren();
    let label = node.name;
    jsobj["label"] = label;
    jsobj["key"] = label;
    if (cd.length > 0){
        jsobj["children"] = [];
        for (let k in cd) {
            jsobj["children"][cd[k].name] = {}
            iter_func(cd[k], jsobj["children"][cd[k].name]);  
        }
        
    }
}
iter_func(cur_scene, map_data);
map_data
`

</script>

<style scoped>
#treenode_menu {
    padding-left: 20px;
    height: 4lvh;
    background: aqua;
    border: 1px solid black;
}

#panel_nodeinfo {
    background-color: bisque;
}

#panel_tree {
    border: 1px solid black;
}
</style>