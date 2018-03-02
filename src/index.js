import WorldData from './utils/world-data.js';
import worldToData from './loaders/world-to-data.js';

let worldData = new WorldData(worldToData, "./assets/world/example.world");
console.log("Trying!")
console.log(worldData);

const canvas = document.getElementById("main");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "#FF0000";
ctx.fillRect(200, 150, 400, 300);
