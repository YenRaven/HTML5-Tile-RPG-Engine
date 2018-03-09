import tilesetLoader from '../loaders/tileset-loader.js';
import simplex from 'fast-simplex-noise';

export default class {
    constructor(tileset){
        let opts = {min: 0, max: 1}
        this.terrainNoise = new simplex({
            ...opts,
            frequency: 0.04
        });
        this.treeNoise = new simplex({
            opts,
            frequency: 0.1
        });

        this.ready=false;
        this.promise = tilesetLoader(tileset).then((tilesetData) => {
            this.tileset = tilesetData;
        });

    }

    getTileData(x, y){
        let terrainVal = this.terrainNoise.scaled2D(x, y);
        let treeVal = this.treeNoise.scaled2D(x, y);

        let tilesetName = Object.keys(this.tileset)[0];

        if(terrainVal > 0.3){
            if(treeVal > 0.5){
                let oddRow = y % 2;
                let placeTree = (x + oddRow) % 2;
                if(placeTree === 1){
                    return [{
                        tile:"T",
                        tileset:tilesetName
                    }];
                }else{
                    return [{
                        tile:"░",
                        tileset:tilesetName
                    }]
                }
            }else{
                return [{
                    tile:"░",
                    tileset:tilesetName
                }]
            }
        }else{
            return [{
                tile:"≈",
                tileset:tilesetName
            }]
        }

    }

    getTileWidth(){
        return 16;
    }

    getTileHeight(){
        return 16;
    }

    getTileset(tileset: String){
        return this.tileset[tileset];
    }
}
