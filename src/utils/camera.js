import Vec2d from 'vector2d';

export default class {
    constructor(x: Number, y: Number, width: Number, height: Number){
        this.pos = new Vec2d.ObjectVector(x, y);
        this.dim = new Vec2d.ObjectVector(width, height);
    }

    setPos(x: Number, y: Number){
        return this.pos.setAxes(x, y);
    }

    getPos(){
        return this.pos;
    }

    setDimensions(width: Number, height: Number){
        return this.dim.setAxes(width, height);
    }

    getDimensions(){
        return this.dim;
    }
}
