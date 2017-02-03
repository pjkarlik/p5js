
import p5 from 'p5';
// import DemoCode from './p5demo';
import { Generator } from './simplexNoise';
/** Processing p5.js Sketch Definition          **/

/* eslint-disable */
const sketch = function (p) {
  var generator;
  generator = new Generator(10);
  var width = 640;
  var height = 640;
  var width_half = width / 2;
  var height_half = height / 2;
  var grid = 30;
  var spacing = ~~(width / grid);
  var radius = 10;
  // setting items for render                   //
  var time = 0;
  var iteration = 0.075;
  var r = 0;
  var g = 0;
  var b = 0;
  var colorset = [0, 0, 0];
  // setting items for movement                 //
  var zOffset = 0;
  var offsetX = 0;
  var offsetY = 0;
  var zoom = -150;
  var camX = width_half;
  var camY = height_half;
  // building arrays                            //
  var vertices = new Array(spacing);
  for (var i = 0; i < spacing; i++) {
    vertices[i] = new Array(spacing);
  }

  // p5.js setup function                       //
  p.setup = function() {
    p.createCanvas(640, 640, p.WEBGL);
    var fov = 60 / 180 * p.PI;
    var cameraZ = height_half / p.tan(fov/2.0);
    p.perspective(60 / 180 * p.PI, width/height, cameraZ * 0.1, cameraZ * 10);
    p.lighting();
  // simplex noise function                     //
  };

  p.draw = function() {
    time += 1;
    p.generateMesh();
    p.viewPort();
    // move to center to start drawing grid     //
    p.translate(-width_half, -height_half, -100);
    for (var j = 0; j < spacing; j++) {
      for (var i = 0; i < spacing; i++) {
        // generate color values                //
        var vertZ = p.shader(vertices[i][j].z);
        colorset = [vertZ.r, vertZ.g, vertZ.b];
        // push and move 3D object into place   //
        p.push();
        p.translate(vertices[i][j].x, vertices[i][j].y, vertices[i][j].z);
        p.specularMaterial(colorset);
        zOffset = ~~(vertices[i][j].z) * 0.3;
        p.sphere(50 - zOffset);
        p.pop();
      }
    }
  };
  p.shader = function(noise){
    // octal render color mode              //
    // const m = Math.cos(noise * .055);
    // const o = Math.sin(noise * .055);
    // r = ~~(m * 255);
    // b = ~~(o * 355);
    // g = b;

    // rainbow render color mode            //
    // var mult = 0.004;
    // r = ~~(255 - 255 * (1 - p.sin((noise * mult) * j)) / 2);
    // g = ~~(255 - 255 * (1 + p.cos((noise * mult) * i)) / 2);
    // b = ~~(255 - 255 * (1 - p.sin((noise * mult) * i)) / 2);

    // original render color mode           //
    r = p.sin(noise * 0.01) * 255;
    g = p.cos(noise * 0.05 + (time * 0.01)) * 255;
    b = 255 - r;
    return {
      r,
      g,
      b
    };
  };

  p.viewPort = function() {
  // set viewport, background, and lighting     //
    p.background(0,0,0);
    // move into position to draw grid //
    p.translate((width / 2) - (spacing * grid / 2), 0, zoom);
    // If mouse is inactive pick the center of the screen //
    var tempX = p.mouseX || 0; // width/2; alt version but this looks better
    var tempY = p.mouseY || height_half;
    camX = (width_half - tempX) * 0.003; // (p.frameCount * 0.001); //
    camY = (height_half - tempY)* 0.005; // (height / 2);//
    p.rotateX(90 - camY);
    p.rotateZ(camX);
  }
  p.mouseWheel = function(event) {
    //move the square according to the vertical scroll amount
    zoom += event.delta;
    //uncomment to block page scrolling
    return false;
  }
  p.generateMesh = function() {
    const timeStop = time * 0.002;
    for (var j = 0; j < spacing; j++) {
      for (var i = 0; i < spacing; i++) {
        var nPoint = p.abs(
          generator.simplex3(iteration * i + timeStop, iteration * j, timeStop * 0.75)
        ) * 25;
        // can directly place nPoint for smoother effects //
         var zVector = nPoint * 6;
        vertices[i][j] = p.createVector(i * grid, j * grid, 150 - zVector);
      }
    }
  };

  p.lighting = function()  {
    var pos1 = 1;
    var pos2 = 2;
    p.directionalLight(250, 250, 250, pos1, 0.5, 0);
    p.directionalLight(120, 160, 190, 1 - pos2, 0, -1);
  };
};
/** Processing p5.js Sketch Definition          **/

/* eslint-enable */
/** Parent Render Class */
export default class Render {
  constructor(element) {
    // Screen Set Up //
    this.element = element;
    this.myp5 = undefined;
    // run function //
    this.setup();
  }
  /* eslint new-cap: 0 */
  setup = () => {
    this.myp5 = new p5(sketch, this.element);
  };
}
