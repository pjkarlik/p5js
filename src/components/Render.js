
import p5 from 'p5';
import DemoCode from './p5demo';

/** Parent Render Class */
export default class Render {
  constructor(element, width, height) {
    // Screen Set Up //
    this.element = element;
    this.width = width || 480;
    this.height = height || 480;
    this.grid = 25;
    this.spacing = ~~(this.width / this.grid);
    this.radius = 10;
    // setting items for render                   //
    this.time = 0;
    this.iteration = 0.075;
    // setting items for movement                 //
    this.zOffset = 0;
    this.offsetX = 0;
    this.offsetY = 0;
    this.camX = this.width / 2;
    this.camY = this.height / 2;
    // building arrays                            //
    this.vertices = new Array(this.spacing);
    for (let i = 0; i < this.spacing; i++) {
      this.vertices[i] = new Array(this.spacing);
    }

    // run function //
    this.setup();
  }

  // p5.js setup function                       //
  setup = () => {
    p5(DemoCode, this.element);
  };
}
