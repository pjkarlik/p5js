![travis ci build](https://travis-ci.org/pjkarlik/p5js.svg?branch=master)
![webpack2](https://img.shields.io/badge/webpack-2.0-brightgreen.svg) ![version](https://img.shields.io/badge/version-0.1.0-yellow.svg) ![processing](https://img.shields.io/badge/p5js-0.5.11-blue.svg)

-[travis-ci build](https://travis-ci.org/pjkarlik/p5js)


  Current Mapping --> ```index.js``` --> (render file) ```GlyRender.js``` (or just about any other file in src)


# p5js Demo
  My Experiments with p5js using simplex noise on 3d grids and matrix systems.
  You can change the render file called in index.js, each variation
  explores different features in rendering and shader functions. Using dat-gui
  to control display and render options.

  * NEW: http://p5js-flyby.surge.sh/ Flyby Demo - put a nice song on and just watch!


  * GlyRender - 3D Flyby demo - final render state.

  * CbeRender - 3D Cub system, improving rendering and optimizations.

  * ZrtRender - Grid system, block render method and opacity shaders.

  * AltRender - Grid system, defaults to boxes and offset color shader.


  Render - Original Render, initial framework with basic interaction.

## Change Log
  * Optimizations on display, and translation in p5js 3d space.
  * Mouse Down and Drag - to prevent constant movement.
  * AltRender.js - updated render functions.
  * Change Object sphere / box
  * Better Shader Formulas.
  * Mouse rotation and Wheel Zoom.
  * Running on p5js - needing to update render.
  * Initial Commit - Basic formula added for simplexNoise.

## Run the example
  Requires Node v7.0.0 or greater

```bash
$ yarn install
$ yarn run dev & open http://localhost:8080
```

## License

[MIT]
