export const CHUNK_ASSETS = `
let cur_scene = cc.director.getScene();
let cur_children = cur_scene.getChildren();
let root = {
    tag: "ASSETS_INTERVAL", 
    assets: {}, 
};
//assets 
let s_asset = {
    bundle:[], 
    texture:[], 
    audio: [], 
    spine: [],
    font: [],
    text: [], 
    material:[],
    unknown: []
};


let check_and_getval = function(asset, target) {
    let cls_name = asset.__classname__;
    let c
    switch (cls_name){
        case "cc.Texture2D":
            c = {
                uuid: asset._uuid, 
                size: {"width": asset.width, "height": asset.height}, 
                path: asset.nativeUrl
            };
            break;
        /*
        case "sp.SkeletonData":
            s_asset["texture"].push({
                name:k.name
            });
            break;
        case "cc.SpriteFrame": 
        break;
        case "cc.TTFFont":
            break;
        case "cc.TextAsset":
            break;
        case "cc.Material":
            break;
            */
        default: 
            break;
        }
    return c
}

if ("#asset_type" == "bundle"){
    let bundles = cc.assetManager.bundles._map;
    let bundle_names = Object.getOwnPropertyNames(bundles);
    let name
    for(let i = 0; i < bundle_names.length; i++ ) {
        name = bundle_names[i]
        let k = cc.assetManager.bundles.get(name);
        s_asset["bundle"].push({
            name:name, 
            path:k.base, 
            deps:k.deps
        })
    }
}
else {
    let asset_map  = cc.assetManager.assets;
    let asset_uuids = Object.getOwnPropertyNames(asset_map._map);
    let uuid;
    let asset_obj;
    for(let i = 0; i < asset_uuids.length; i++ ) {
        uuid = asset_uuids[i]
        let k = cc.assetManager.assets.get(uuid);
        asset_obj = check_and_getval(k, "#asset_type");
        if (asset_obj){
            s_asset["#asset_type"].push(asset_obj)    
        }
    }   
}
root["assets"] = s_asset

root
`