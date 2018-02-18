
export default class {
    constructor(x: Number, y: Number, width: Number, height: Number){
        this.pos = {
            x: x,
            y: y
        }
        this.width = width;
        this.height = height;
    }

    setPos(x: Number, y: Number){
        this.pos = {
            x: x,
            y: y
        }
    }

    setDimensions(width: Number, height: Number){
        this.width = width;
        this.height = height;
    }
}
