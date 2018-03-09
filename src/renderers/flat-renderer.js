import Camera from "../utils/camera.js";
import WorldData from "../utils/world-data.js";
import seedRandom from 'seedrandom';

import Vec2d from "vector2d";

export default class {
    constructor(context: CanvasRenderingContext2D, camera: Camera, worldData: WorldData, options:Object){

        this.context = context;
        this.camera = camera;
        this.worldData = worldData;

    }

    render(){

        let tileSize = new Vec2d.ObjectVector(
            this.worldData.getTileWidth(),
            this.worldData.getTileHeight()
        );
        //Get the top-left viewable point from Camera
        let camPos = this.camera.getPos().clone().subtract(tileSize);
        let camDim = this.camera.getDimensions().clone().add(tileSize.clone().mulS(2));
        let camTopLeft = camPos.clone()
            .subtract(camDim.clone().divS(2));
        //Find world data rectangle that point falls in
        let worldCoord = camTopLeft.clone().divV(tileSize);
        let tilesInCamera = camDim.clone().divV(tileSize);
        let startTile = new Vec2d.ObjectVector(
            Math.floor(worldCoord.getX()),
            Math.floor(worldCoord.getY())
        );
        console.log(startTile);
        let endTile = startTile.clone().add(tilesInCamera);
        //Transform world coords for tiles into camera coords

        for(let y = startTile.getY(); y < endTile.getY(); y++){

            //Lets store chunks with tiles to the right here to delay their render so we dont get things like tree overlap.
            let delayTiles = [];

            for(let x = startTile.getX(); x < endTile.getX(); x++){

                let currTile = new Vec2d.ObjectVector(x, y);
                currTile.subtract(startTile);

                let tileStack = this.worldData.getTileData(x, y);

                if(tileStack){

                    let drawVec =  currTile.clone().mulV(tileSize).subtract(
                            worldCoord.clone().subtract(startTile).mulV(tileSize)
                        );

                    tileStack.forEach((tileObj) => {
                        let tileset = this.worldData.getTileset(tileObj.tileset);
                        let id = tileset.tileKey.indexOf(tileObj.tile);
                        if(id >= 0){
                            let tileData = tileset.tile[id];

                            let xOffset = tileData.base? -tileData.base.x : 0;
                            let yOffset = tileData.base? -tileData.base.y : 0;

                            for(let cy = tileData.chunkHeight - 1; cy >= 0; cy --){
                                for(let cx = 0; cx < tileData.chunkWidth; cx ++){

                                    let xCurr = cx + xOffset;
                                    let yCurr = cy + yOffset;

                                    let drawOffset = new Vec2d.ObjectVector(xCurr * tileSize.getX(), yCurr * tileSize.getY());
                                    let tileName = tileData.chunk[cy][cx];
                                    if(tileName){
                                        let tileImg = tileData.tiles[tileName];

                                        let drawAt = drawVec.clone().add(drawOffset);
                                        //Need this to be seeded random else will flicker on each frame.
                                        let drawImg = {
                                            img: tileImg[Math.floor((
                                                Math.abs((x * 31663 + y * 34513) % 51257) / 51257
                                            ) * tileImg.length)],
                                            drawAt
                                        };
                                        let delayRender = tileData.chunkWidth + xOffset - 1;
                                        if(delayRender > 0){
                                            delayTiles.push({
                                                drawImg,
                                                delayRender
                                            });
                                        }else{
                                            this.context.drawImage(drawImg.img, drawImg.drawAt.getX(), drawImg.drawAt.getY());
                                        }
                                    }
                                }
                            }
                        }
                    })
                }

                delayTiles = delayTiles.filter((delayTile) => {
                    if(delayTile.delayRender === 0 || x === tilesInCamera.getX()-1){
                        this.context.drawImage(delayTile.drawImg.img, delayTile.drawImg.drawAt.getX(), delayTile.drawImg.drawAt.getY());
                        return false;
                    }
                    return true;
                });

                delayTiles = delayTiles.map((delayTile) => {
                    delayTile.delayRender --;
                    return delayTile;
                })
            }
        }

        //draw world data to context top to bottom, left to right.

    }
}
