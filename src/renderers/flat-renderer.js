import Camera from "../utils/camera.js";
import WorldData from "../utils/world-data.js";

import Vec2d from "vector2d"

export default class {
    constructor(context: CanvasRenderingContext2D, camera: Camera, worldData: WorldData, options:Object){

        this.context = context;
        this.camera = camera;
        this.worldData = worldData;

    }

    render(){
        //get subset of world data inside viewable area of camera.
        let renderBuffer = [];

        let camPos = this.camera.getPos();
        let camDim = this.camera.getDimensions();

        let wd = this.worldData.data;

        let startVec = camPos.clone().mulS(-1).add(camDim.divS(2));

        let tilesX = Math.min( (camDim.getX() + wd.tileWidth) / wd.tileWidth, wd.row );
        let tilesY = Math.min( (camDim.getY() + wd.tileHeight) / wd.tileHeight, Math.ceil(wd.map.length / wd.row) );

        for(let y = 0; y < tilesY; y++){
            for(let x = 0; x < tilesX; x++){

                let mapId = y * wd.row + x;
                let tileStack = wd.map[mapId];

                let a = startVec.getX() + ( x * wd.tileWidth );
                let drawX = a - (a % wd.tileWidth);

                let b = startVec.getY() + ( y * wd.tileHeight );
                let drawY = b - (b % wd.tileHeight);

                let drawVec = new Vec2d.ObjectVector(drawX, drawY);

                tileStack.forEach((tileObj) => {
                    let id = wd.tilesets[tileObj.tileSet].tileKey.indexOf(tileObj.tile);
                    let tileData = wd.tilesets[tileObj.tileSet].tile[id];

                    let xOffset = tileData.base? -tileData.base.x : 0;
                    let yOffset = tileData.base? -tileData.base.y : 0;

                    for(let cy = tileData.chunkHeight - 1; cy >= 0; cy --){
                        for(let cx = 0; cx < tileData.chunkWidth; cx ++){

                            let xCurr = cx + xOffset;
                            let yCurr = cy + yOffset;

                            let drawOffset = new Vec2d.ObjectVector(xCurr * wd.tileWidth, yCurr * wd.tileHeight);
                            let tileName = tileData.chunk[cy][cx];
                            if(tileName){
                                let tileImg = tileData.tiles[tileName];

                                let drawAt = drawVec.clone().add(drawOffset);
                                //Need this to be seeded random else will flicker on each frame.
                                this.context.drawImage(tileImg[Math.floor(Math.random() * tileImg.length)], drawAt.getX(), drawAt.getY());
                            }
                        }
                    }


                })
            }
        }

        //draw world data to context top to bottom, left to right.

    }
}
