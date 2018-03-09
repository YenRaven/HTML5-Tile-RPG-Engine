import WorldData from './utils/world-data.js';
import worldToData from './loaders/world-to-data.js';
import DynamicWorldData from './utils/dynamic-world-data.js';
import Camera from './utils/camera.js';
import FlatRenderer from './renderers/flat-renderer.js';

//let worldData = new WorldData(worldToData, "./assets/world/example.world");
let worldData = new DynamicWorldData("example");
let camera = new Camera(0, 0, 1024, 768);

let x = 0, y = 0;
worldData.promise.then((wd) => {
    console.log(wd);
    setInterval(() => {
        camera.setPos(x++, y+=2);
        //console.log(x, y);
        renderer.render();
    }, 10)
})

const canvas = document.getElementById("main");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "#FF0000";
ctx.fillRect(200, 150, 400, 300);


let renderer = new FlatRenderer(ctx, camera, worldData);
