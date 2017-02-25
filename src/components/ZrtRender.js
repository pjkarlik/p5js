import p5 from 'p5';
import { Generator } from './simplexNoise';
import dat from 'dat-gui';

/*
 * Grid Render - Playing with opacity and render/generation
 */

/* eslint-disable */
const sketch = function (p) {
  var generator;
  generator = new Generator(10);
  var width = 640;
  var height = 640;
  var width_half = width / 2;
  var height_half = height / 2;
  var grid = 20;
  var spacing = ~~(width / grid);
  // setting items for render
  var time = 0;
  var timeNoise = 0;
  var iteration = 0.075;
  var strength = 25;
  var shaderType = 'octal';
  var waveSpeed = 20;
  var autoSpin = false;
  var r = 0;
  var g = 0;
  var b = 0;
  var colorset = [0, 0, 0];
  // setting items for movement
  var offsetX = 0;
  var offsetY = 0;
  var zoom = -250;
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
    vertices[i] = new Array(spacing);
  }

  // p5.js setup function
  p.setup = function() {
    p.createCanvas(640, 640, p.WEBGL)
      .mousePressed(() => {isPressed = true;})
      .mouseReleased(() => {isPressed = false;});
    // above prevents clicks from happening outside of the canvas.
    var fov = 60 / 180 * Math.PI;
    var cameraZ = height_half / p.tan(fov/2.0);
    p.perspective(60 / 180 * Math.PI, width/height, cameraZ * 0.1, cameraZ * 10);
    p.lighting();
  // simplex noise function
  };

  p.setOptions = function(options) {
    iteration = options.iteration / 100;
    waveSpeed = options.waveSpeed / 10000;
    shaderType = options.shaderType;
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
    var size = ~~(width / spacing);

    p.generateMesh();
    p.viewPort();

    // move to center to start drawing grid
    p.translate(-width_half, -height_half, 0);

    for (var j = 0; j < spacing; j++) {
      for (var i = 0; i < spacing; i++) {
        var noiseValue = (vertices[i][j].n) * 0.3;
        var colorset = p.shader(vertices[i][j].n, i, j);
        var opacity = p.abs(((vertices[i][j].n * 255) - 0) / (255 - 0));

        p.push();
        p.translate(i * size, j * size, -noiseValue * 2);
        p.ambientMaterial(colorset.r, colorset.g, colorset.b, opacity);
        p.box(size, size, size);
        p.pop();

      }
    }
  };

  p.generateMesh = function() {
    var step = time * waveSpeed;
    const timeStop = step * iteration;
    for (var j = 0; j < spacing; j++) {
      for (var i = 0; i < spacing; i++) {
        var nPoint = p.abs(
          generator.simplex3(iteration * i + step,
            iteration * j, timeStop)
          ) * strength;
        var zVector = nPoint * 10;
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
      const m = Math.cos(noise * .055);
      const o = Math.sin(noise * .055);
      r = ~~(m * 255);
      b = ~~(o * 355);
      g = b;
			break;
    case 'rainbow':
      // rainbow render color mode
      var mult = 0.004;
      r = ~~(255 - 255 * (1 - Math.sin((noise * mult) * j)) / 2);
      g = ~~(255 - 255 * (1 + Math.cos((noise * mult) * i)) / 2);
      b = ~~(255 - 255 * (1 - Math.sin((noise * mult) * i)) / 2);
			break;
    case 'hashing':
      // original render color mode
      r = Math.cos(noise * 5 * Math.PI /180 - (time * 0.03)) * 255;
      g = r;
      b = g;
      break;
    case 'offset':
      // offset - three waves of render color
      var mult = 0.001;
      r = Math.cos(noise * 0.05 + (time * 0.01)) * 255;
      g = Math.cos(noise * 0.05 + (time * 0.02)) * 255;
      b = Math.sin(noise * 0.05 + (time * 0.03)) * 255;
      break;
    case 'java':
      // java render color mode
      b = Math.cos(noise * Math.PI / 180 + (time * 0.2)) * 255;
      r = 255 - b;
      // Math.sin(1 + noise * Math.PI / 180 - (time * 0.01)) * 255;
      g = Math.cos(2 - noise * 2 * Math.PI / 180) * 255;
      break;
    case 'larvel':
      // original render color mode
      r = Math.cos(noise * 1.5 * Math.PI / 180 - (time * 0.01)) * 255;
      b = Math.sin(r * 0.15 * Math.PI / 180 + (time * 0.05)) * 255;
      g = 255 - ~~(r * j * i) / 255;
      break;
    case 'default':
      // original render color mode
      r = 195;
      g = r;
      b = g;
      break;
    }
    return {
      r,
      g,
      b
    };
  };

  p.viewPort = function() {
  // set viewport, background, and lighting
    p.background(20,20,20);
    // move into position to draw grid
    p.translate((width / 2) - (spacing * grid / 2), 0, zoom);
    // If mouse is inactive pick the center of the screen
    tempX = isPressed ? p.mouseX : autoSpin ? tempX + 0.15 : tempX;
    tempY = isPressed ? p.mouseY : tempY;
    thisX = thisX - (thisX - tempX) * 0.01;
    thisY = thisY - (thisY - tempY) * 0.01;
    camX = (width_half - thisX) * 0.006;
    camY = (height_half - thisY) * 0.01;
    p.rotateX(90 + camY);
    p.rotateZ(45 + camX);
  }

  p.mouseWheel = function(event) {
    //move the square according to the vertical scroll amount
    zoom += event.delta;
    //uncomment to block page scrolling
    return false;
  }

  p.lighting = function()  {
    p.directionalLight(250, 250, 250, 255, 1, 0, -1);
    p.directionalLight(160, 160, 160, 255, -1, 1, 0);
    p.directionalLight(160, 160, 160, 255, 0, -1, 1);
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
    const viewSize = window.innerWidth || document.documentElement.clientWidth;
    this.options = {
      iteration: 3,
      strength: 30,
      resolution: viewSize < 640 ? 65 : 25,
      waveSpeed: 20,
      shaderType: 'larvel',
    };
    this.gui = new dat.GUI();
    const folderRender = this.gui.addFolder('Render Options');
    folderRender.add(this.options, 'iteration', 0, 10).step(0.1)
      .onFinishChange((value) => {
        this.options.iteration = value;
        this.setOptions(this.options);
      });
    folderRender.add(this.options, 'strength', 1, 50).step(1)
      .onFinishChange((value) => {
        this.options.strength = value;
        this.setOptions(this.options);
      });
    folderRender.add(this.options, 'waveSpeed', 1, 100).step(1)
      .onFinishChange((value) => {
        this.options.waveSpeed = value;
        this.setOptions(this.options);
      });
    folderRender.add(this.options, 'resolution', 15, 150).step(5)
      .onFinishChange((value) => {
        this.options.resolution = value;
        this.setResolution(this.options);
      });
    folderRender.add(this.options, 'shaderType',
      ['java', 'larvel', 'octal', 'offset', 'rainbow', 'hashing', 'default'])
      .onFinishChange((value) => {
        this.options.shaderType = value;
        this.setOptions(this.options);
      });
    folderRender.open();

    this.setOptions(this.options);
    this.setResolution(this.options);
  };
}
