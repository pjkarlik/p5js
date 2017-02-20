
import p5 from 'p5';
import { Generator } from './simplexNoise';
import dat from 'dat-gui';

/** Processing p5.js Sketch Definition          **/
/* eslint-disable */
const sketch = function (p) {
  var generator;
  generator = new Generator(10);
  var width = 640;
  var height = 640;
  var width_half = width / 2;
  var height_half = height / 2;
  var grid;
  var spacing = ~~(width / grid);
  // setting items for render
  var time = 0;
  var iteration = 0.075;
  var strength;
  var speed;
  var shaderType;
  var radius = 10;
  var autoSpin = false;
  var r = 0;
  var g = 0;
  var b = 0;
  var op = 255;
  var colorset = [0, 0, 0];
  // setting items for movement
  var timeout = false;
  var zOffset = 0;
  var offsetX = 0;
  var offsetY = 0;
  var zoom = -50;
  var camX = width_half;
  var camY = height_half;
  var tempX = width_half;
  var tempY = height_half;
  var thisX = width_half;
  var thisY = height_half;
  var isPressed = false;
  // building arrays
  var vertices = new Array(spacing);
  for (var i = 0; i < spacing; i++) {
    vertices[i] = new Array(spacing * 2);
  }

  // p5.js setup function
  p.setup = function() {
    p.createCanvas(640, 640, p.WEBGL)
      .mousePressed(() => {isPressed = true;})
      .mouseReleased(() => {isPressed = false;});
    // above prevents clicks from happening outside of the canvas.
    var fov = 60 / 180 * p.PI;
    var cameraZ = height_half / p.tan(fov/2.0);
    p.perspective(60 / 180 * p.PI, width/height, cameraZ * 0.1, cameraZ * 10);
    p.lighting();
  // simplex noise function
  };

  p.setOptions = function(options) {
    iteration = (options.iteration / 100);
    shaderType = options.shaderType;
    speed = (options.speed / 10000);
    strength = options.strength;
    autoSpin = options.autoSpin;
  };

  p.setResolution = function(options) {
    grid = options.resolution || grid;
    spacing = ~~(width / grid);
    vertices = new Array(spacing);
    for (var i = 0; i < spacing; i++) {
      vertices[i] = new Array(spacing);
    }
  };
  p.draw = function() {
    time += 1;
    p.generateMesh();
    p.viewPort();
    // move to center to start drawing grid
    p.translate(-width_half, -height, 200);
    var size = width / spacing;
    for (var j = 0; j < spacing * 2; j++) {
      for (var i = 0; i < spacing; i++) {
        // generate color values - I need I and J for iterations
        var noise = ~~(vertices[i][j].n);
        var noiseValue = 50 - (150 - noise) * 0.3;
        var colorset = p.shader(noise, i, j);
        var opacity = 255; //p.abs(((noise * 255) - 0.01) / (255 - 0.01));
        // push and move 3D object into place
        p.push();
        p.translate(i * size, j * size * 1.5, -noiseValue);
        p.ambientMaterial(colorset.r, colorset.g, colorset.b, colorset.op);
        p.box(size, size * 1.5, noiseValue * 2);
        p.pop();
      }
    }
  };

  p.generateMesh = function() {
    const timeStop = time * speed;
    for (var j = 0; j < spacing * 2; j++) {
      for (var i = 0; i < spacing; i++) {
        var nPoint = Math.abs(
          generator.simplex3(iteration * i,
            iteration * j + timeStop, timeStop * 0.1)
          ) * strength;

        var zVector = nPoint * 5;
        vertices[i][j] = {
          n: zVector
        };
      }
    }
  };

  p.shader = function(noise, i, j){
    switch(shaderType) {
      case 'octal':
        // octal render color mode - red and cyan
        const m = Math.cos(noise * Math.PI / 180);
        const o = Math.sin(noise * 4 * Math.PI / 180);
        g = ~~(m * 155);
        r = 255 - g;
        b = ~~(o * 255);
        op = g;
  			break;
      case 'rainbow':
        // rainbow render color mode
        var mult = 0.004;
        r = ~~(255 - 255 * (1 - Math.sin((noise * mult) * j)) / 2);
        g = ~~(255 - 255 * (1 + Math.cos((noise * mult) * i)) / 2);
        b = Math.cos(noise * 5 * Math.PI /180 - (time * 0.03)) * 255;
        op = Math.abs(((noise * 255) - 0.01) / (255 - 0.01));
  			break;
      case 'hashing':
        // original render color mode
        r = Math.cos(noise * 3 * Math.PI /180 - (time * 0.01)) * 255;
        g = r;
        b = g;
        op = 255;
        break;
      case 'offset':
        // offset - three waves of render color
        r = Math.cos(noise * Math.PI / 180 + (time * 0.001)) * 255;
        g = Math.cos(noise * Math.PI / 180 + (time * 0.005)) * 255;
        b = Math.sin(noise * Math.PI / 180 + (time * 0.01)) * 255;
        op = Math.abs(((noise * b) - 0.01) / (b - 0.01));
        break;
      case 'java':
        // java render color mode
        r = Math.cos(noise * Math.PI / 180 + (time * 0.005)) * 255;
        g = Math.sin(1 + noise * Math.PI / 180 - (time * 0.01)) * 255;
        b = Math.cos(1 - noise * 2 * Math.PI / 180) * 255;
        op = 255;
        break;
      case 'default':
        // original render color mode
        r = 255 - Math.cos(noise * Math.PI / 180) * 255;
        g = r;
        b = g;
        op = r;
        break;
      }
    return {
      r,
      g,
      b,
      op
    };
  };
  p.pauseChange = function() {
    timeout = true;
    setTimeout(() => {
      timeout = false;
    }, 3000);
  };
  p.viewPort = function() {
  // set viewport, background, and lighting
    p.background(0,0,0);
    // move into position to draw grid
    p.translate((width / 2) - (spacing * grid / 2), -200, zoom);
    p.checkForChange();
    p.moveVectors();
    p.rotateX(90 + camY);
    p.rotateZ(camX);
  };

  p.checkForChange = function() {
    // tempX = isPressed ? p.mouseX : tempX;
    // tempY = isPressed ? p.mouseY : tempY;
    if (p.random(1,255) > 254 && !timeout) {
      tempX = width_half - (width - p.random(1, width * 2));
      p.pauseChange();
      console.log('X:' + tempX);
    }
    if (p.random(1,255) > 253 && !timeout) {
      tempY = height_half - (50 - p.random(1,100));
      p.pauseChange();
      console.log('Y:' + tempY);
    }
  };

  p.moveVectors = function(){
    thisX = thisX - (thisX - tempX) * 0.01;
    thisY = thisY - (thisY - tempY) * 0.01;
    camX = (width_half - thisX) * 0.006;
    camY = (height_half - thisY) * 0.01;
  };

  p.mouseWheel = function(event) {
    //move the square according to the vertical scroll amount
    zoom += event.delta;
    //uncomment to block page scrolling
    return false;
  };

  p.lighting = function()  {
    // function incase I want to animate lights
    p.directionalLight(250, 250, 250, 1, 1, 0);
    p.directionalLight(160, 160, 160, 1, -1, 1);
    p.directionalLight(160, 160, 160, 0, 1, -1);
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
    this.createGUI();
  }
  /* eslint new-cap: 0 */
  setup = () => {
    this.myp5 = new p5(sketch, this.element);
  };
  setOptions = (options) => {
    this.myp5.setOptions(options);
  };
  setResolution = (options) => {
    this.myp5.setResolution(options);
  };
  createGUI = () => {
    this.options = {
      iteration: 5,
      strength: 50,
      resolution: 25,
      speed: 400,
      autoSpin: false,
      shaderType: 'java',
    };
    this.gui = new dat.GUI();
    const folderRender = this.gui.addFolder('Render Options');
    folderRender.add(this.options, 'iteration', 0, 10).step(0.1)
      .onFinishChange((value) => {
        this.options.iteration = value;
        this.setOptions(this.options);
      });
    folderRender.add(this.options, 'strength', 1, 100).step(1)
      .onFinishChange((value) => {
        this.options.strength = value;
        this.setOptions(this.options);
      });
    folderRender.add(this.options, 'speed', 1, 1000).step(1)
      .onFinishChange((value) => {
        this.options.speed = value;
        this.setOptions(this.options);
      });
    folderRender.add(this.options, 'resolution', 25, 125).step(5)
      .onFinishChange((value) => {
        this.options.resolution = value;
        this.setResolution(this.options);
      });
    folderRender.add(this.options, 'shaderType',
      ['default', 'java', 'octal', 'offset', 'rainbow', 'hashing'])
      .onFinishChange((value) => {
        this.options.shaderType = value;
        this.setOptions(this.options);
      });
    folderRender.open();

    this.setOptions(this.options);
    this.setResolution(this.options);
  };
}
