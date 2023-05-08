<template>
    <div>
        <el-row id="row-functional" justify="space-between"  >
            <el-col :span="8" id="panel-tree">
                <el-input v-if="treeDataHash.length > 0" v-model="treeFilterText" placeholder="Search..."
                    :suffix-icon="Search">
                    <template #prepend>Find</template>
                </el-input>
                <el-tree ref="treeElemenet" v-if="treeData.length > 0" :data="treeData" :props="defaultProps" node-key="key"
                    :default-expanded-keys="elTreeExpandlist" @node-click="onTreeSelect" @node-expand="onTreeExpand"
                    @node-collapse="onTreeCollapse" :filter-node-method="onTreeFilter" />
                <el-empty v-else :description="treeDataDesc">
                </el-empty>
            </el-col>
            <el-col :span="8" id="panel-dashboard" >
                <DashBoard>
                </DashBoard>
            </el-col>
            <el-col id="panel-nodeprop" :span="8">
                <el-row>Command</el-row>
                <CmdCollapse :nodeProps="treeSelNodeProperty"></CmdCollapse>
            </el-col>
        </el-row>
    </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
import DashBoard from "./DashBoard.vue";
import CdpDebugger, { CdpResultGInfo, CdpResultNodeTree, EConnectStatu } from "../inc/cdp";
import { NodeProperty } from "../model/node_property";
import { Search } from "@element-plus/icons-vue";
import CmdCollapse from "./Panel/CmdCollapse.vue";
import PopProperty from "./Panel/PopProperty.vue"

const globalProp = defineProps(["connectStatu"])

//node-tree
const treeData = ref<CdpResultNodeTree[]>([])

const treeElemenet = ref(null)
const treeElemenetCount = ref(0)
const treeDataDesc = ref("No Data")
const treeSelNodeProperty = ref<NodeProperty>()
const elTreeExpandlist = ref<string[]>([])
const defaultProps = {
    children: 'children',
    label: 'label',
}
const treeSelUuid = ref("")
//node-tree
//  -search 
const treeFilterText = ref('')
watch(treeFilterText, (val) => {
    let el = treeElemenet.value!;
    //@ts-ignore
    if (el.filter) {
        //@ts-ignore
        el.filter(val)
    }

})

const onTreeFilter = (value: string, data: any) => {
    if (!value) return true
    return data.label.includes(value)
}

//@ts-ignore
const onTreeExpand = (data: CdpResultNodeTree, el, root) => {
    elTreeExpandlist.value.push(data.key)
}

//@ts-ignore
const onTreeCollapse = (data: CdpResultNodeTree, el, root) => {
    let k = elTreeExpandlist.value.indexOf(data.key)
    if (k >= 0) {
        elTreeExpandlist.value.splice(k - 1, 1)
    }
}

const onTreeSelect = (data: any, el: HTMLElement) => {
    if (!data["key"]) return
    CdpDebugger.inc().evalute_js(chunk_nodeproperty.replace("#name", data.key.substr(1).replace(/\./g, "/")))
}

//tree hash tree-data
let treeDataHash = ""
watch(
    () => globalProp.connectStatu,
    (val: EConnectStatu) => {
        if (val == EConnectStatu.Connected) {
            treeDataDesc.value = "Requesting..."
            CdpDebugger.inc().start_ginfo_ping()
            CdpDebugger.inc().onResultNodeTree = (val: CdpResultNodeTree[]) => {
                const str_treehash = JSON.stringify(val)
                if (treeDataHash != str_treehash) {
                    treeData.value = val
                    treeDataHash = str_treehash
                    return
                }
            }
            CdpDebugger.inc().onResultNodeProp = (val: NodeProperty) => {
                console.log("===>>node property: ", val)
                treeSelNodeProperty.value = val
            }
        }
    }
)

const chunk_checkuuids = `
let cc = window.cc;
let cur_scene = cc.director.getScene();
let node_propty = cur_scene.getChildren();
node_propty
`

const chunk_nodeproperty = `
let node = cc.find('#name');
let watch_node = {
    "name": node.name,
    "position":node.position
}
let map_data = {
    tag: "NODE_PROPERTY", 
    val: watch_node
};
map_data
`



</script>

<style scoped>
#panel-nodeinfo {
    background-color: bisque;
}

#panel-tree,
#panel-nodeprop {
    border: 1px solid black;
    overflow-y: scroll;
    height: 400px;
    max-width: 400px;
}

#row-functional {
    overflow-y: hidden;
    height: 400px;
}
</style>