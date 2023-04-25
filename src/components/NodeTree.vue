<template>
    <div>
        <el-row id="row-functional">
            <el-col :span="6" id="panel-tree">
                <el-input v-if="treeDataHash.length > 0" v-model="treeFilterText" placeholder="Search..." :suffix-icon="Search"/>
                <el-tree ref="treeElemenet" v-if="treeData.length > 0" :data="treeData" :props="defaultProps" node-key="key"
                    :default-expanded-keys="elTreeExpandlist" @node-click="onTreeSelect" @node-expand="onTreeExpand"
                    @node-collapse="onTreeCollapse" 
                    :filter-node-method="onTreeFilter"
                    />
                <el-empty v-else :description="treeDataDesc">
                </el-empty>
            </el-col>
            <el-col :span="6" id="panel-nodeprop">
                <NodeProp :nodeProps="treeSelNodeProperty"></NodeProp>
            </el-col>
            <el-col :span="12" id="panel-debugeval">
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import NodeProp from "./NodeProp.vue"
import CdpDebugger, { CdpResultNodeTree, EConnectStatu } from "../inc/cdp";
import { NodeProperty } from "../model/node_property";
import { Search } from "@element-plus/icons-vue";

const globalProp = defineProps(["connectStatu"])

//node-tree
const treeData = ref<CdpResultNodeTree[]>([])
const treeDataHash = ref("")
const treeElemenet = ref(null)
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
    console.log(elTreeExpandlist.value, "---expand")
}

//@ts-ignore
const onTreeCollapse = (data: CdpResultNodeTree, el, root) => {
    let k = elTreeExpandlist.value.indexOf(data.key)
    console.log(`collapse the node:${k}`)
    if (k >= 0) {
        elTreeExpandlist.value.splice(k - 1, 1)
    }
    console.log(elTreeExpandlist.value, "---collapse after")
}

const onTreeSelect = (data: any) => {
    console.log("onsel key:", data)
    if (!data["key"]) return 
    console.log(chunk_nodeproperty.replace("#name", data.key.substr(1).replace(/\./g, "/")), "-->>>chunk_nodeproperty")
    CdpDebugger.inc().evalute_js(chunk_nodeproperty.replace("#name", data.key.substr(1).replace(/\./g, "/")))
}

watch(
    () => globalProp.connectStatu,
    (val: EConnectStatu) => {
        console.log("node tree->", val)
        if (val == EConnectStatu.Connected) {
            treeDataDesc.value = "Requesting..."
            CdpDebugger.inc().onResultNodeTree = (val: CdpResultNodeTree[]) => {
                const str_treehash = JSON.stringify(val)
                if (treeDataHash.value != str_treehash) {
                    console.log("refresh nodetree")
                    treeData.value = val
                    treeDataHash.value = str_treehash
                    return
                }
            }
            CdpDebugger.inc().onResultNodeProp = (val: NodeProperty) => {
                console.log("===>>node property: ")
                console.log(val)
                treeSelNodeProperty.value = val
            }
            setInterval(() => {
                CdpDebugger.inc().evalute_js(chunk_nodetree)
            }, 1000)

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

const chunk_nodetree = `
let cc = window.cc;
let cur_scene = cc.director.getScene();
let cur_children = cur_scene.getChildren();
let map_data = {
    tag: "NOTE_TREE"
};
let label = cur_scene.name;
map_data["label"] = label;
map_data["key"] = label;
map_data["uuid"] = cur_scene.uuid;
map_data["children"] = []
let iter_func = (node, child_arr, keyname) => {
    let cd = node.getChildren();
    let cd_s;
    for (let k in cd) {
        cd_s = cd[k];
        let cds_info = {
            label: cd_s.name, 
            key: keyname + "." + cd_s.name
        };
        child_arr.push(cds_info);
        if (cd_s.getChildren().length > 0){
            cds_info["children"] = []
            iter_func(cd_s, cds_info["children"], cds_info["key"]);  
        }
    }
}
iter_func(cur_scene, map_data["children"], "");
map_data
`

</script>

<style scoped>

#panel-nodeinfo {
    background-color: bisque;
}

#panel-tree,#panel-debugeval {
    border: 1px solid black;
    overflow-y: auto;
    height: 400px;
}

#row-functional {
    overflow-y: auto;
    height: 400px;
}
</style>