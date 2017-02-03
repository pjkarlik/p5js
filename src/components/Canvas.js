// Canvas Helper Class //
export default class Canvas {
  constructor(element) {
    this.element = element || document.body;
    this.canvas = this.createCanvas('canvas');
  }

  setViewport = (element) => {
    const canvasElement = element;
    const width = ~~(document.documentElement.clientWidth, window.innerWidth || 0);
    const height = ~~(document.documentElement.clientHeight, window.innerHeight || 0);
    this.width = width;
    this.height = height;
    canvasElement.width = this.width;
    canvasElement.height = this.height;
    const canvasObject = {
      surface: this.surface,
      canvas: canvasElement,
      width: this.width,
      height: this.height,
    };
    return canvasObject;
  };

  createCanvas = (name) => {
    let canvasElement;
    if (document.getElementById(name)) {
      canvasElement = document.getElementById(name);
    } else {
      canvasElement = document.createElement('canvas');
      canvasElement.id = name;
    }
    this.setViewport(canvasElement);
    if (!document.getElementById(name)) {
      this.element.appendChild(canvasElement);
    }
    this.surface = canvasElement.getContext('2d');
    this.surface.scale(1, 1);
    const canvasObject = {
      surface: this.surface,
      canvas: canvasElement,
      width: this.width,
      height: this.height,
    };
    return canvasObject;
  };

}
