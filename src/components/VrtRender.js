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
  var amountC;

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
    amountC = options.amountC || amountC;
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
    var rx = 255 * Math.cos(p.frameCount*0.7 * p.PI / 360);
    var tx = 255 * Math.sin(p.frameCount * p.PI / 360);
    var dx = 100 * Math.sin(p.frameCount*0.5 * p.PI / 360);
    var size1 = 50 * p.noise(0.01*p.frameCount + 50);
    // var size2 = 50 * p.noise(0.01*p.frameCount + 60);

    var size = size1;
    var color = Math.abs(100 * Math.sin(p.frameCount*0.2 * p.PI / 360));
    var color2 = Math.abs(100 * Math.cos(p.frameCount*0.1 * p.PI / 360));
    // tick++;
    // if (tick > 10){ tick=0; console.log(color,color2);}
    p.ellipseMode(p.CENTER);
    p.translate(width_half + rx, height_half + tx);
    p.rotate(ang3);
    for (var i = 0; i < amountA; i++) {
      p.fill(color,100,100);
      p.push();
      p.rotate(p.TWO_PI * i / amountA);
      p.translate(tx, -size/2);
      p.ellipse(0, 0, size, size);
      p.translate(size/2, size/2);
      p.rotate(ang3);
      for (var j = 0; j < amountB; j++) {
        p.push();
        p.rotate(p.TWO_PI * j / amountB);
        p.translate(rx, -size/4);
        p.fill(color2,100,100);
        p.ellipse(0, 0, size/2, size/2);
        p.translate(size/2, size/2);
        p.rotate(ang3 * 2);
        for (var c = 0; c < amountC; c++) {
          p.push();
          p.rotate(p.TWO_PI * c / amountC);
          p.translate(dx, -size/6);
          p.fill(color - c * 10 ,100,100);
          p.ellipse(0, 0, size/3, size/3);
          p.pop();
        }
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
    p.background(0,0,10,1);
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
      amountA: 5,
      amountB: 3,
      amountC: 2,
    };
    this.gui = new dat.GUI();
    const folderRender = this.gui.addFolder('Render Options');

    folderRender.add(this.options, 'amountA', 1, 10).step(1)
      .onFinishChange((value) => {
        this.options.amountA = value;
        this.setOptions(this.options);
      });
    folderRender.add(this.options, 'amountB', 1, 10).step(1)
      .onFinishChange((value) => {
        this.options.amountB = value;
        this.setOptions(this.options);
      });
    folderRender.add(this.options, 'amountC', 1, 10).step(1)
      .onFinishChange((value) => {
        this.options.amountC = value;
        this.setOptions(this.options);
      });
    folderRender.open();

    this.setOptions(this.options);
  };
}
