import WorldData from './utils/world-data.js';
import worldToData from './loaders/world-to-data.js';
import Camera from './utils/camera.js';
import FlatRenderer from './renderers/flat-renderer.js';

let worldData = new WorldData(worldToData, "./assets/world/example.world");
let camera = new Camera(300, 300, 400, 300);

worldData.promise.then((wd) => {
    console.log(wd);
    renderer.render();
})

const canvas = document.getElementById("main");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "#FF0000";
ctx.fillRect(200, 150, 400, 300);


let renderer = new FlatRenderer(ctx, camera, worldData);
