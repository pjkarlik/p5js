import p5 from 'p5';
// import { Generator } from './simplexNoise';
// import dat from 'dat-gui';

/*
 * Default render for p5 sketch - made a base to start with
 */

/* eslint-disable */
const sketch = function (p) {
  var width = (document.documentElement.clientWidth, window.innerWidth || 0);
  var height = (document.documentElement.clientHeight, window.innerHeight || 0);
  var width_half = width / 2;
  var height_half = height / 2;
  var grid = 10;
  var xrow = height / grid;
  var xcol = width / grid;
  var xrow_half = xrow / 2;
  var xcol_half = xcol / 2;
  // setting items for render

  // p5.js setup function
  p.setup = function() {
    p.createCanvas(width, height);
    p.stroke(255);
    p.frameRate(30);
  };

  p.setOptions = function(options) {
  };

  p.setResolution = function(options) {
  };

  p.draw = function() {
    p.viewPort();
    p.drawGrid();
  };

  p.drawGrid = function() {
  // set viewport, background, and lighting

  var startX = 0; // width_half - (grid * xcol / 2);
  var startY = 0; // height_half - (grid * xrow / 2);
    for (var y = 0; y < grid + 1; y++ ){
      for (var x = 0; x < grid + 1; x++ ){
        p.stroke(0,50 + p.random(5, 100), 0);
        if(x < grid && y != 0) {
          p.line(startX + (x * xcol), startY + (y * xrow),
            startX + (x * xcol) + xcol, startY + (y * xrow));
        }
        p.stroke(0,50 + p.random(5, 100), 0);
        if(y < grid && x != 0) {
          p.line(startX + (x * xcol), startY + (y * xrow),
            startX + (x * xcol), startY + (y * xrow) + xrow);
        }
      }
    }
  }

  p.viewPort = function() {
  // set viewport, background, and lighting
    p.background(20,20,20);
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
    // this.createGUI();
  };
  // setOptions = (options) => {
  //   this.myp5.setOptions(options);
  // };
  // setResolution = (options) => {
  //   this.myp5.setResolution(options);
  // };
  // createGUI = () => {
  //   const viewSize = window.innerWidth || document.documentElement.clientWidth;
  //   this.options = {
  //     iteration: 3.5,
  //     strength: 23,
  //     resolution: viewSize < 640 ? 65 : 20,
  //     speed: 67,
  //     waveSpeed: 35,
  //     shaderType: 'java',
  //     objectType: 'box',
  //   };
  //   this.gui = new dat.GUI();
  //   const folderRender = this.gui.addFolder('Render Options');
  //   folderRender.add(this.options, 'iteration', 0, 10).step(0.1)
  //     .onFinishChange((value) => {
  //       this.options.iteration = value;
  //       this.setOptions(this.options);
  //     });
  //   folderRender.add(this.options, 'strength', 1, 50).step(1)
  //     .onFinishChange((value) => {
  //       this.options.strength = value;
  //       this.setOptions(this.options);
  //     });
  //   folderRender.add(this.options, 'waveSpeed', 1, 100).step(1)
  //     .onFinishChange((value) => {
  //       this.options.waveSpeed = value;
  //       this.setOptions(this.options);
  //     });
  //   folderRender.add(this.options, 'resolution', 20, 150).step(5)
  //     .onFinishChange((value) => {
  //       this.options.resolution = value;
  //       this.setResolution(this.options);
  //     });
  //   folderRender.add(this.options, 'shaderType',
  //     ['java', 'larvel', 'octal', 'offset', 'rainbow', 'hashing', 'default'])
  //     .onFinishChange((value) => {
  //       this.options.shaderType = value;
  //       this.setOptions(this.options);
  //     });
  //   folderRender.add(this.options, 'objectType',
  //     ['plane', 'box', 'sphere'])
  //     .onFinishChange((value) => {
  //       this.options.objectType = value;
  //       this.setOptions(this.options);
  //     });
  //   folderRender.open();
  //
  //   this.setOptions(this.options);
  //   this.setResolution(this.options);
  // };
}
