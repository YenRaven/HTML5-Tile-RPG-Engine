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
        const r = this.data.row;
        return this.data.map[r * y + x];
    }
}
