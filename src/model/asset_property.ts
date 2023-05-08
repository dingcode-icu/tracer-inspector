
export interface CocosTexture {
    name: string, 
    uuid: string,
    size: {width: number, height: number}, 
    path: string
}

export interface CocosBundle {
    name: string, 
    path: string,
    deps: string[]
}

export interface CdpResultCocosAssets {
    texture?: CocosTexture[], 
    bundle?: CocosBundle[]
}