
export default function(filePath: String){
    const worldData = {
        row: null,
        tilesets:{},
        map:[]
    };
    fetch(filePath).then((res) => {
        return res.json();
    }).then((worldConf) => {
        worldConf.requiredTilesets.forEach((tileset) => {
            fetch("assets/tileset/"+tileset+".tileset").then((res) => {
                return res.json();
            }).then((tilesetConf) => {
                worldData.tilesets[tileset] = {};
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

        worldConf.world.forEach((layer) => {
            //Construct map from world layers, each entry in worldData.map should hold all the information to render that tile from bottom to top.
            //Looks like theres a problem, the world data will need a row size as well, we cannot compute from layers x,y and row size while inside this loop and I don't want to loop twice.
            layer.tileMap.forEach((tile, id)=>{
                //Deconstruct id into x, y

                //Reconstruct x, y into world map coords.
            });
            //set max world row size.
            let layerMaxX = layer.layerInfo.x + layer.layerInfo.row;
            worldData.row = layerMaxX > worldData.row? layerMaxX : WorldData.row;
        });
    });
}
