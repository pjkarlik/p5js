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

  var grid = width > 800 ? 10 : 5;
  var xgrid = width / grid;

  var gridY = (height / xgrid) + 1;

  var multX = 1;
  var multY = 1;
  var mouseX = 0;
  var mouseY = 0;
  // setting items for render
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
  }
  p.setResolution = function(options) {
    grid = width > 800 ? options.resolution || grid : options.resolution / 2 || grid;
    xgrid = (width / grid);
    gridY = (height / xgrid);
  };

  p.windowResized = function() {
    // Reset Vars for rending //
    width = p.windowWidth;
    height = p.windowHeight;
    width_half = width / 2;
    height_half = height / 2;
    grid = width > 800 ? 10 : 5;
    xgrid = (width / grid);
    gridY = (height / xgrid);
    // Resize canvas element //
    p.resizeCanvas(width, height);
  }

  p.draw = function() {
    p.viewPort();
    p.drawGrid();
    tick++;
    if (tick > 2 ) {
      p.checkMouse();
      tick =0;
    }
  };

  p.drawGrid = function() {
    var startX = 0;
    var startY = 0;
    time += 0.05;
    for (var y = 0; y < gridY + 1; y++ ){
      for (var x = 0; x < grid + 1; x++ ){
        var tempX = 50 * Math.sin((x * 20) * Math.PI / 180 + time) * multX;
        var tempY = 50 * Math.cos((x * 20) * Math.PI / 180 + time) * multY;
        p.stroke(0, 0, 100 + p.random(5, 80));
        if(x < grid && y != 0) {
          p.line(startX + (x * xgrid) + tempX, startY + (y * xgrid) + tempY,
            startX + (x * xgrid) + xgrid - tempX, startY + (y * xgrid) + tempY);
          p.stroke(100 + p.random(5, 80), 0, 0);
          p.line(startX + (x * xgrid) + xgrid - tempX, startY + (y * xgrid) + tempY,
            startX + (x * xgrid) - tempX, startY + (y * xgrid) - tempY);
        }
        p.stroke(0, 0, 100 + p.random(5, 80));
        if(y < gridY + 1 && x != 0) {
          p.line(startX + (x * xgrid) + tempX, startY + (y * xgrid) - tempY,
            startX + (x * xgrid), startY + (y * xgrid) + xgrid + tempY);
        }
        if (x === mouseX && y === mouseX ) {
          p.stroke(180, 0, 0);
          p.fill(180, 0, 0, 0.8);
          p.rect((mouseX * xgrid), (mouseY * xgrid), xgrid, xgrid);
        }
      }
    }
  }

  p.checkMouse = function() {
    mouseX = ~~(p.mouseX / xgrid);
    mouseY = ~~(p.mouseY / xgrid);
  }

  p.viewPort = function() {
    // p.blendMode(p.DIFFERENCE);
    p.background(0,0,10);
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
      multX: 1,
      multY: 1,
    };
    this.gui = new dat.GUI();
    const folderRender = this.gui.addFolder('Render Options');

    folderRender.add(this.options, 'resolution', 5, 20).step(1)
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
    folderRender.open();

    // this.setOptions(this.options);
    this.setResolution(this.options);
  };
}
