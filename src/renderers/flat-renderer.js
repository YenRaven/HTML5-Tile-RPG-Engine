import Camera from "../utils/camera.js";
import WorldData from "../utils/world-data.js";

export default class {
    constructor(context: CanvasRenderingContext2D, camera: Camera, worldData: WorldData){
        super();

        this.context = context;
        this.camera = camera;
        this.worldData = worldData;
    }

    render(){
        //get subset of world data inside viewable area of camera.
        let renderBuffer = [];

        //draw world data to context top to bottom, left to right.

    }
}
