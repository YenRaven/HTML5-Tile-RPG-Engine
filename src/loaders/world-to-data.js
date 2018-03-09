import Vec2d from 'vector2d';
import tilesetLoader from './tileset-loader.js';


export default function(filePath: String){
    const worldData = {
        tilesets:{},
        map:null,
        tileWidth:16,
        tileHeight:16
    };
    return fetch(filePath).then((res) => {
        return res.json();
    }).then((worldConf) => {

        worldData.tileWidth = worldConf.tileWidth;
        worldData.tileHeight = worldConf.tileHeight;
        worldData.map = {};

        worldConf.world.forEach((layer) => {
            //Construct map from world layers, each entry in worldData.map should hold all the information to render that tile from bottom to top.
            let layerV = new Vec2d.ObjectVector(layer.layerInfo.x, layer.layerInfo.y);
            layer.tileMap.forEach((tile, id)=>{
                //Deconstruct id into x, y
                let y = Math.floor(id / layer.layerInfo.row);
                let x = (id - y * layer.layerInfo.row) % layer.layerInfo.row;

                let v = new Vec2d.ObjectVector(x, y);

                //Reconstruct x, y into world map coords.
                v.add(layerV);

                worldData.map[v.getY()] = worldData.map[v.getY()] || {};
                worldData.map[v.getY()][v.getX()] = worldData.map[v.getY()][v.getX()] || [];
                worldData.map[v.getY()][v.getX()].push({
                    tile,
                    tileset: layer.tileset
                });
            });
        });

        return Promise.all(worldConf.requiredTilesets.map((tileset) => {
            return tilesetLoader(tileset);
        })).then((tilesets) => {
            tilesets.forEach((tileset) => {
                worldData.tilesets = {
                    ...worldData.tilesets,
                    ...tileset
                };
            });

            return worldData;
        });
    });
}
