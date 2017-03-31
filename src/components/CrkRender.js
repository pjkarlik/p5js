import p5 from 'p5';
// import { Generator } from './simplexNoise';
import dat from 'dat-gui';

/*
 * Grid Render
 */

/* eslint-disable */
const sketch = function (p) {
  var width = p.windowWidth;
  var height = p.windowHeight;
  var width_half = width / 2;
  var height_half = height / 2;

  var grid;
  var xgrid;
  var gridY;
  var multX;
  var multY;
  var speed;
  var gameTime = .05;

  var mouseX = 0;
  var mouseY = 0;

  var tick = 0;
  var time = 0;

  // p5.js setup function
  p.setup = function() {
    p.createCanvas(width, height);
    p.stroke(255);
    p.frameRate(30);
  };

  p.setOptions = function(options) {
    multX = options.multX || multX;
    multY = options.multY || multY;
    speed = (options.speed) * .001 || speed;
  }

  p.setResolution = function(options) {
    grid = options.resolution || grid;
    xgrid = ~~(width / grid);
    gridY = ~~(height / xgrid);
  };

  p.windowResized = function() {
    // Reset Vars for rending //
    width = p.windowWidth;
    height = p.windowHeight;
    width_half = width / 2;
    height_half = height / 2;
    xgrid = ~~(width / grid);
    gridY = ~~(height / xgrid);
    // Resize canvas element //
    p.resizeCanvas(width, height);
  }

  p.draw = function() {
    p.viewPort();
    p.drawGrid();
  };

  p.drawGrid = function() {
    var startX = 0;
    var startY = 0;
    time += 1;
    gameTime = time * speed;
    for (var y = 0; y < gridY + 1; y++ ){
      for (var x = 0; x < grid + 1 ; x++ ){
        var tempX = 50 * Math.sin((x * 20) * Math.PI / 180 + gameTime) * multX;
        var tempY = 50 * Math.cos((y * 20) * Math.PI / 180 + gameTime) * multY;
        var boxColor = 1 + Math.cos(255 * Math.PI / 180 + gameTime) * 255;
        const xoffset = (x * xgrid);
        const yoffset = (y * xgrid);
        p.stroke(x * 40, y * 40, 255 );
        if ((x % 2 === 0) && (y % 2 === 0)) {
          p.line(
            (startX + xoffset) + tempX, (startY + yoffset) + tempY,
            (startX + xoffset) + xgrid - tempX, (startY + yoffset) + tempY
          );

          p.line(
            (startX + xoffset) + xgrid - tempX, (startY + yoffset) + tempY,
            (startX + xoffset) + xgrid - tempX, (startY + yoffset) + xgrid + tempY
          );
          p.line(
            (startX + xoffset) + xgrid - tempX, (startY + yoffset) + xgrid + tempY,
            (startX + xoffset) + tempX, (startY + yoffset) + xgrid + tempY
          );

          p.line(
            (startX + xoffset) + tempX, (startY + yoffset) + xgrid + tempY,
            (startX + xoffset) + tempX, (startY + yoffset) + tempY
          );
        }
        p.translate(width_half, height_half);
        p.rotate(tempY * 0.0001);
        p.translate(-width_half, -height_half);

      }
    }
  }

  p.checkMouse = function() {
    mouseX = ~~(p.mouseX / xgrid);
    mouseY = ~~(p.mouseY / xgrid);
  }

  p.viewPort = function() {
    p.background(0,0,20);
  }

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
      resolution: viewSize > 800 ? 10 : 5,
      multX: 2,
      multY: 1.5,
      speed: 50,
    };
    this.gui = new dat.GUI();
    const folderRender = this.gui.addFolder('Render Options');

    folderRender.add(this.options, 'resolution', 2, 30).step(1)
      .onFinishChange((value) => {
        this.options.resolution = value;
        this.setResolution(this.options);
      });
    folderRender.add(this.options, 'multX', 0, 5).step(0.1)
      .onFinishChange((value) => {
        this.options.multX = value;
        this.setOptions(this.options);
      });
    folderRender.add(this.options, 'multY', 0, 5).step(0.1)
      .onFinishChange((value) => {
        this.options.multY = value;
        this.setOptions(this.options);
      });
    folderRender.add(this.options, 'speed', 0, 100).step(1)
      .onFinishChange((value) => {
        this.options.speed = value;
        this.setOptions(this.options);
      });
    folderRender.open();

    // this.setOptions(this.options);
    this.setOptions(this.options);
    this.setResolution(this.options);
  };
}
