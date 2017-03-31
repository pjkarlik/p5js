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

  var amountA;
  var amountB;
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
    p.frameRate(60);

    p.noStroke();
    p.colorMode(p.HSB, 100);
  };

  p.setOptions = function(options) {
    amountA = options.amountA || amountA;
    amountB = options.amountB || amountB;
  }

  p.windowResized = function() {
    // Reset Vars for rending //
    width = p.windowWidth;
    height = p.windowHeight;
    width_half = width / 2;
    height_half = height / 2;
    // Resize canvas element //
    p.resizeCanvas(width, height);
  }

  p.draw = function() {
    p.viewPort();
    p.drawGrid();
  };

  p.drawGrid = function() {
    // var ang1 = p.TWO_PI * p.noise(0.01*p.frameCount + 10);
    // var ang2 = p.TWO_PI * p.noise(0.01*p.frameCount + 20);
    var ang3 = (0.01*p.frameCount + 30);
    var rx = 255 * Math.cos(p.frameCount*0.7 * p.PI / 180);
    var tx = 255 * Math.sin(p.frameCount * p.PI / 180);
    var size1 = 100 * p.noise(0.01*p.frameCount + 90);
    // var size2 = 50 * p.noise(0.01*p.frameCount + 60);

    var size = size1;

    p.translate(width_half, height_half);
    p.rotate(ang3);
    for (var i = 0; i < amountA; i++) {
      p.fill(i * 10,100,100);
      p.push();
      p.rotate(p.TWO_PI * i / amountA);
      p.translate(tx, -size/2);
      p.rect(0, 0, size, size);
      p.translate(size/2, size/2);
      p.rotate(ang3);
      for (var j = 0; j < amountB; j++) {
        p.push();
        p.rotate(p.TWO_PI * j / amountB);
        p.translate(rx, -size/4);
        p.fill(j * 10,100,100);
        p.rect(0, 0, size/2, size/2);
        p.pop();
      }
      p.pop();
    }
  }

  p.checkMouse = function() {
    mouseX = ~~(p.mouseX / xgrid);
    mouseY = ~~(p.mouseY / xgrid);
  }

  p.viewPort = function() {
    p.blendMode(p.DIFFERENCE);
    p.background(0,0,20,15);
  }

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
  createGUI = () => {
    this.options = {
      amountA: 14,
      amountB: 5,
    };
    this.gui = new dat.GUI();
    const folderRender = this.gui.addFolder('Render Options');

    folderRender.add(this.options, 'amountA', 1, 20).step(1)
      .onFinishChange((value) => {
        this.options.amountA = value;
        this.setOptions(this.options);
      });
    folderRender.add(this.options, 'amountB', 1, 20).step(1)
      .onFinishChange((value) => {
        this.options.amountB = value;
        this.setOptions(this.options);
      });
    folderRender.open();

    this.setOptions(this.options);
  };
}
