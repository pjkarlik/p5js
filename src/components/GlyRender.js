
import p5 from 'p5';
import { Generator } from './simplexNoise';
import dat from 'dat-gui';

/*
 * Flyby Render - Illusion of motion and flying over a simplex landscape
 */

/* eslint-disable */
const sketch = function (p) {
  var generator;
  generator = new Generator(10);
  // setting screen vars
  var width = 640;
  var height = 640;
  var width_half = width / 2;
  var height_half = height / 2;
  var grid;
  var spacing = ~~(width / grid);
  var spacer = 0;
  // setting items for render
  var time = 0;
  var timeNoise = 0;
  var iteration = 0.5;
  var strength;
  var speed = 10;
  var shaderType;
  var objectType;
  var radius = 10;
  // setting color vars
  var r = 0;
  var g = 0;
  var b = 0;
  var op = 255;
  var colorset = [0, 0, 0];
  // setting items for movement
  var timeout = false;
  var waveSpeed = 0.0005;
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
  var lastHigh = 0;
  // building arrays
  var vertices = new Array(spacing);
  for (var i = 0; i < spacing; i++) {
    vertices[i] = new Array(spacing * 2);
  }

  // p5.js setup function
  p.setup = function() {
    p.createCanvas(640, 640, p.WEBGL);
    p.frameRate(60);

    var fov = 60 / 180 * p.PI;
    var cameraZ = height_half / p.tan(fov/2.0);
    p.perspective(60 / 180 * p.PI, width/height, cameraZ * 0.1, cameraZ * 10);
    p.lighting();
  // simplex noise function
  };

  p.setOptions = function(options) {
    speed = options.speed / 10;
    iteration = options.iteration / 100;
    waveSpeed = options.waveSpeed / 10000;
    objectType = options.objectType;
    shaderType = options.shaderType;
    strength = options.strength;
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
    // advance time and tick draw loop for time segment
    var size = ~~(width / spacing);
    var length = ~~(size * 1.25);
    spacer = spacer + speed;
    if (spacer > length) {
      // the time phase of the noise wave moves
      // once the cubes moved one space
      time += 1;
      spacer = 0;
    }

    p.generateMesh();
    p.viewPort();

    // move to center to start drawing grid
    p.translate(-width_half, -height, 200);

    for (var j = 0; j < spacing * 2; j++) {
      for (var i = 0; i < spacing; i++) {
        // generate noise values and shader colors
        var noiseValue = (vertices[i][j].n) * 0.3;
        var colorset = p.shader(vertices[i][j].n, i, j);
        if (j % 20 == 0 && i == spacing / 2) {
          lastHigh = vertices[i][j].n;
        }
        // push and move 3D object into place
        p.push();
        p.translate(i * size, j * length - spacer, -noiseValue * 2);
        p.ambientMaterial(colorset.r, colorset.g, colorset.b, colorset.op);
        switch (objectType) {
          case 'plane':
            p.plane(size,length);
            break;
          case 'box':
            p.box(size, length, length);
            break;
          case 'sphere':
            var sphereSize = 1 + ~~(noiseValue / 4);
            p.sphere(sphereSize, 10);
            break;
          default:
            p.plane(size,length);
            break;
        }
        p.pop();
      }
    }
  };

  p.generateMesh = function() {
    timeNoise += 1;
    const timeStop = time * iteration;
    for (var j = 0; j < spacing * 2; j++) {
      for (var i = 0; i < spacing; i++) {
        var nPoint = Math.abs(
          generator.simplex3(iteration * i,
            iteration * j + timeStop, timeNoise * waveSpeed)
          ) * strength;
        var zVector = nPoint * 10;
        vertices[i][j] = {
          n: zVector
        };
      }
    }
  };

  p.pauseChange = function() {
    timeout = true;
    setTimeout(() => {
      timeout = false;
    }, 6000);
  };

  p.viewPort = function() {
  // set viewport, background, and lighting
    p.background(30,30,30);
    // move into position to draw grid
    p.translate((width / 2) - (spacing * grid / 2), -100, zoom);
    p.checkForChange();
    p.moveVectors();
    p.rotateX(90 + camY);
    p.rotateZ(camX);
  };

  p.checkForChange = function() {
    if (p.random(1,255) > 252 && !timeout) {
      tempX = width_half - (width - p.random(1, width * 2)) * .8;
      p.pauseChange();
    }
    if (p.random(1,255) > 250 && !timeout) {
      tempY = height_half - (lastHigh / 8) - (55 - p.random(1, 120));
      p.pauseChange();
    }
  };

  p.moveVectors = function(){
    thisX = thisX - (thisX - tempX) * 0.006;
    thisY = thisY - (thisY - tempY) * 0.006;
    camX = (width_half - thisX) * 0.006;
    camY = (height_half - thisY) * 0.008;
  };

  p.mouseWheel = function(event) {
    //move the square according to the vertical scroll amount
    zoom += event.delta;
    //uncomment to block page scrolling
    return false;
  };

  p.lighting = function()  {
    p.directionalLight(250, 250, 250, 255, 1, 0, -1);
    p.directionalLight(160, 160, 160, 255, -1, 1, 0);
    p.directionalLight(160, 160, 160, 255, 0, -1, 1);
  };

  p.shader = function(noise, i, j){
    switch(shaderType) {
      case 'java':
        // java render color mode
        b = Math.cos(noise * Math.PI / 180 + (time * 0.2)) * 255;
        r = 255 - b;
        g = Math.cos(2 - noise * 2 * Math.PI / 180) * 255;
        op = 255;
        break;
      case 'larvel':
        // original render color mode
        r = Math.cos(noise * 1.5 * Math.PI / 180 - (time * 0.01)) * 255;
        b = Math.sin(r * 0.15 * Math.PI / 180 + (time * 0.05)) * 255;
        g = 255 - ~~(r * j * i) / 255;
        op = 255;
        break;
      case 'octal':
        // octal render color mode - red and cyan
        const m = Math.cos(noise * Math.PI / 180);
        const o = Math.sin(noise * 4 * Math.PI / 180);
        r = ~~(m * 230);
        b = ~~(o * 230);
        g = 0;
        op = 255;
  			break;
      case 'offset':
        // offset - three waves of render color
        b = Math.cos(noise * 3 * Math.PI / 180 + (j * 0.01)) * 255;
        g = Math.sin(i *  Math.PI / grid + (time * 0.01)) * 255;
        r = Math.cos(j * Math.PI / grid + (time * 0.009)) * 255;
        op = 255;
        break; v09
      case 'rainbow':
        // rainbow render color mode
        var mult = 0.004;
        r = ~~(255 - 255 * (1 - Math.sin((noise * mult) * j)) / 2);
        g = ~~(255 - 255 * (1 + Math.cos((noise * mult) * i)) / 2);
        b = Math.cos(noise * 5 * Math.PI / 180 - (time * 0.03)) * 255;
        op = Math.abs(((noise * 255) - 0) / (255 - 0)) / 2.5;
  			break;
      case 'hashing':
        // original render color mode
        r = Math.cos(noise * 2.5 * Math.PI / 180 - (time * 0.01)) * 255;
        b = r;
        g = b;
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
  // end of sketch
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
    this.createGUI();
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
      iteration: 3.5,
      strength: 23,
      resolution: viewSize < 640 ? 65 : 35,
      speed: 67,
      waveSpeed: 35,
      shaderType: 'java',
      objectType: 'box'
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
    folderRender.add(this.options, 'speed', 1, 1000).step(1)
      .onFinishChange((value) => {
        this.options.speed = value;
        this.setOptions(this.options);
      });
    folderRender.add(this.options, 'waveSpeed', 1, 100).step(1)
      .onFinishChange((value) => {
        this.options.waveSpeed = value;
        this.setOptions(this.options);
      });
    folderRender.add(this.options, 'resolution', 30, 150).step(5)
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
    folderRender.add(this.options, 'objectType',
      ['plane', 'box', 'sphere'])
      .onFinishChange((value) => {
        this.options.objectType = value;
        this.setOptions(this.options);
      });
    folderRender.open();

    this.setOptions(this.options);
    this.setResolution(this.options);
  };
}
