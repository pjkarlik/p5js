import { Generator } from './simplexNoise';
// setting basic items                        //
/* eslint-disable */
var sketch = function (p) {
  var generator;
  generator = new Generator(10);
  var width = 480;
  var height = 480;
  var grid = 25;
  var spacing = ~~(width / grid);
  var radius = 10;
  // setting items for render                   //
  var time = 0;
  var iteration = 0.075;
  var r = 0;
  var g = 0;
  var b = 0;
  var colorset = [0, 0, 0];
  // setting items for movement                 //
  var zOffset = 0;
  var offsetX = 0;
  var offsetY = 0;
  var camX = width / 2;
  var camY = height / 2;
  // building arrays                            //
  var vertices = new Array(spacing);
  for (var i = 0; i < spacing; i++) {
    vertices[i] = new Array(spacing);
  }

  // p5.js setup function                       //
  p.setup = function() {
    p.createCanvas(480, 480, p.WEBGL);
  // simplex noise function                     //
  };

  p.draw = function() {
    time += 1;
    p.generateMesh();
    p.viewPort();
    // move to center to start drawing grid     //
    p.translate(-width / 2, -height / 2, -100);
    for (var j = 0; j < spacing; j++) {
      for (var i = 0; i < spacing; i++) {
        // generate color values                //
        r = vertices[i][j].z * 5.75;
        g = vertices[i][j].z * 1.75;
        b = p.sin(g * i) * 55;
        colorset = [r , 150 - g , 150 + b];
        // push and move 3D object into place   //
        p.push();
        p.translate(vertices[i][j].x, vertices[i][j].y, vertices[i][j].z);
        p.specularMaterial(colorset);
        zOffset = ~~(vertices[i][j].z) * 0.1;
        p.sphere(radius + zOffset);
        p.pop();
      }
    }
  };

  p.viewPort = function() {
  // set viewport, background, and lighting     //
    p.background(0);
    p.lighting();

    p.translate((width / 2) - (spacing * grid / 2), -150, -150);

    camX = (width / 2) - p.mouseX * 0.1;
    camY = (height / 2) - p.mouseY * 0.1;

    p.rotateX(90 - camY);
    p.rotateZ(camX);
  }

  p.generateMesh = function() {
    for (var j = 0; j < spacing; j++) {
      for (var i = 0; i < spacing; i++) {
        var nPoint = p.abs(generator.simplex3(iteration * i, iteration * j, time * 0.003)) * 20;
        // can directly place nPoint for smoother effects //
        var zVector = p.sin(25 * p.PI * nPoint / 360) * 35;
        vertices[i][j] = p.createVector(i * grid, j * grid, zVector);
      }
    }
  };

  p.lighting = function()  {
    var pos = 1 * p.sin(2.23123 * 2 / 180 + time * 0.01);
    var posX = 2 * p.cos(2.23123 * 2 / 180 + time * 0.009);
    p.directionalLight(250, 250, 250, pos, 0.5, 0);
    p.directionalLight(120, 160, 190, 1 - posX, 0, -1);
  };
};

new p5(sketch);
