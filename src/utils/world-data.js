//@Flow

export default class {
    constructor(loader: (path: string) => promise, worldFile: string){
        this.ready = false;
        this.promise = loader(worldFile).then((data) => {
            this.ready = true;
            this.data = data;
            return this;
        });
    }

    getTileData(x, y){
        if(this.data.map[y]){
            return this.data.map[y][x];
        }
        return undefined;
    }

    getTileWidth(){
        return this.data.tileWidth;
    }

    getTileHeight(){
        return this.data.tileHeight;
    }

    getTileset(tileset: String){
        return this.data.tilesets[tileset];
    }
}
