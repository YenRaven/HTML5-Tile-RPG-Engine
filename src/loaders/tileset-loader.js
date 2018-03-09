//@Flow

export default function(tileset: String){
    return new Promise((res, rej) => {
        fetch("assets/tileset/"+tileset+".tileset").then((response) => {
            return response.json();
        }).then((tilesetsConf) => {
            let tilesetConf = tilesetsConf[tileset];
            let tilesets = {};
            tilesets[tileset] = {
                tileBaseSize:tilesetConf.tileBaseSize,
                tileKey:[],
                tile:[]
            };
            let imgPromises = [];
            Object.entries(tilesetConf.tiles).forEach((tileConf, id) => {
                tilesets[tileset].tileKey[id] = tileConf[0];
                const tileObj = {...tileConf[1]};
                Object.entries(tileObj.tiles).forEach((tile) => {
                    tileObj.tiles[tile[0]] = tileObj.tiles[tile[0]].map((tilePath)=>{
                        let img = new Image();
                        imgPromises.push(new Promise((res, rej) => {
                            img.onload = ()=>{
                                res();
                            }
                        }));
                        img.src = tilePath;
                        return img;
                    });
                });
                tilesets[tileset].tile[id] = tileObj;
            });

            return Promise.all(imgPromises).then((loaded) => {
                res(tilesets);
            });
        });
    });
}
