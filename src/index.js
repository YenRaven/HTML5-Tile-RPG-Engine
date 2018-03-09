import WorldData from './utils/world-data.js';
import worldToData from './loaders/world-to-data.js';
import DynamicWorldData from './utils/dynamic-world-data.js';
import Camera from './utils/camera.js';
import FlatRenderer from './renderers/flat-renderer.js';
import Vec2d from 'vector2d';


const canvas = document.getElementById("main");
const ctx = canvas.getContext("2d");

//let worldData = new WorldData(worldToData, "./assets/world/example.world");
let worldData = new DynamicWorldData("example");
let camera = new Camera(0, 0, canvas.width, canvas.height);

let c = new Vec2d.ObjectVector(0, 0);
let v = new Vec2d.ObjectVector(0, 0);
let keys = [];
window.addEventListener("keydown",
    function(e){
        keys[e.keyCode] = e.keyCode;
    },
    false
);

window.addEventListener('keyup',
    function(e){
        keys[e.keyCode] = false;
    },
    false
);

worldData.promise.then((wd) => {
    console.log(wd);
    setInterval(() => {
        v.mulS(0.9);
        if(keys['W'.charCodeAt(0)]){
            v.setY(-4);
        }
        if(keys['S'.charCodeAt(0)]){
            v.setY(4);
        }
        if(keys['A'.charCodeAt(0)]){
            v.setX(-4);
        }
        if(keys['D'.charCodeAt(0)]){
            v.setX(4);
        }
        c.add(v);
        camera.setPos(c.getX(), c.getY());
        //console.log(x, y);
        renderer.render();
    }, 1000/80)
})

ctx.fillStyle = "#FF0000";
ctx.fillRect(200, 150, 400, 300);


let renderer = new FlatRenderer(ctx, camera, worldData);
