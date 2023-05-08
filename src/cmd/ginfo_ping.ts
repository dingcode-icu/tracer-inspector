export const CHUNK_GINFO = `
let cur_scene = cc.director.getScene();
let cur_children = cur_scene.getChildren();
let root = {
    tag: "GINFO_INTERVAL", 
    global: {
        node_count: 1, 
        allasset_count: 0, 
        bundle_count: 0, 
        cacheasset_count:0
    },
    tree_map: {}
};

let tree_data = root["tree_map"];
let analyse_data = root["global"];

//tree_data
let label = cur_scene.name;
tree_data["label"] = label;
tree_data["key"] = label;
tree_data["children"] = [];
let iter_func = (node, child_arr, keyname) => {
    let cd = node.getChildren();
    let cd_s;
    for (let k in cd) {
        cd_s = cd[k];
        let cds_info = {
            label: cd_s.name, 
            key: keyname + "." + cd_s.name, 
            disabled: cd_s.active
        };
        child_arr.push(cds_info);
        analyse_data["node_count"] += 1;
        if (cd_s.getChildren().length > 0){
            cds_info["children"] = []
            iter_func(cd_s, cds_info["children"], cds_info["key"]);  
        }
    }
}
iter_func(cur_scene, tree_data["children"], "");


//global
analyse_data["bundle_count"] = cc.assetManager.bundles.count;
analyse_data["allasset_count"] = cc.assetManager.assets.count;
analyse_data["cacheasset_count"] = cc.assetManager.cacheManager.cachedFiles.count;

root
`