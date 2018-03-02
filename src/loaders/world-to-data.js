import Vec2d from 'vector2d';


export default function(filePath: String){
    const worldData = {
        tilesets:{},
        map:null,
        row:null,
        tileWidth:16,
        tileHeight:16
    };
    return fetch(filePath).then((res) => {
        return res.json();
    }).then((worldConf) => {
        worldConf.requiredTilesets.forEach((tileset) => {
            fetch("assets/tileset/"+tileset+".tileset").then((res) => {
                return res.json();
            }).then((tilesetConf) => {
                worldData.tilesets[tileset] = {
                    tileBaseSize
                } = tilesetConf;
                Object.entries(tilesetConf.tiles).forEach((tileConf, id) => {
                    worldData.tilesets[tileset].tileKey[id] = tileConf[0];
                    const tileObj = {...tileConf[1]};
                    Object.entries(tileObj.tiles).forEach((tile) => {
                        tileObj.tiles[tile] = tileObj.tiles[tile].map((tilePath)=>{
                            let img = new Image();
                            img.onload = ()=>{
                                URL.revokeObjectURL(img.src);
                            }
                            img.src = URL.createObjectURL(tilePath);
                            return img;
                        });
                    });
                    worldData.tilesets[tileset].tile[id] = tileObj;

                });
            });
        });

        worldData.tileWidth = worldConf.tileWidth;
        worldData.tileHeight = worldConf.tileHeight;
        worldData.row = worldConf.width;
        worldData.map = new Array(
            worldConf.width * worldConf.height
        );
        worldData.map.fill(null);

        worldConf.world.forEach((layer) => {
            //Construct map from world layers, each entry in worldData.map should hold all the information to render that tile from bottom to top.
            layer.tileMap.forEach((tile, id)=>{
                //Deconstruct id into x, y
                let y = Math.floor(id / layer.layerInfo.row);
                let x = (id - y) % layer.layerInfo.row;

                let v = new Vec2d.ObjectVector(x, y);

                //Reconstruct x, y into world map coords.
                let layerV = new Vec2d.ObjectVector(layer.layerInfo.x, layer.layerInfo.y);
                v.add(layerV);

                worldData.map[v.getY() * worldConf.width + v.getX()].push({
                    tile,
                    tileSet: layer.tileSet
                });
            });
        });

        return worldData;
    });
}
