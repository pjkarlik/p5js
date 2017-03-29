import { aabbCircle } from './Intersections';
/**
* Basic Spatial Hashing Class Object
* adapted from
* https://github.com/kirbysayshi/broad-phase-bng/blob/master/lib/ro.coltech.spatial-grid.js
**/
export default class SpatialHash {
  constructor(config) {
    this.entities = [];
    this.min = {
      x: config.minX,
      y: config.minY,
    };
    this.max = {
      x: config.maxX,
      y: config.maxY,
    };
    this.cellSize = config.cellSize;
    this.grid = [[]];

    // these are purely for reporting purposes
    this.totalCells = 0;
    this.allocatedCells = 0;

    // Binding functions //
    this.addEntity = this.addEntity.bind(this);
    this.removeEntity = this.removeEntity.bind(this);
    this.updateHash = this.updateHash.bind(this);
  }

  addEntity(entity) {
    this.entities.push(entity);
  }

  removeEntity(entity) {
    this.entities.splice(this.entities.indexOf(entity), 1);
  }

  updateHash(surface) {
    const gridRows = ~~((this.max.x - this.min.x) / this.cellSize);
    const gridCols = ~~((this.max.y - this.min.y) / this.cellSize);

    // the total number of cells this grid will contain
    this.totalCells = gridRows * gridCols;
    this.allocatedCells = 0;

    // construct grid
    // NOTE: this is a purposeful use of the Array() constructor
    this.grid = Array(gridRows);

    // insert all entities into grid
    for (let i = 0; i < this.entities.length; i++) {
      const entity = this.entities[i];

      // if entity is outside the grid extents, then ignore it
      if (entity.vector.x < this.min.x || entity.vector.x > this.max.x ||
          entity.vector.y < this.min.y || entity.vector.y > this.max.y) {
        continue;
      }

      // find extremes of cells that entity overlaps
      // subtract min to shift grid to avoid negative numbers
      const cXEntityMin = ~~((entity.vector.x - this.min.x) / this.cellSize);
      const cXEntityMax = ~~((entity.vector.x + (entity.size / 2) - this.min.x) / this.cellSize);
      const cYEntityMin = ~~((entity.vector.y - this.min.y) / this.cellSize);
      const cYEntityMax = ~~((entity.vector.y + (entity.size / 2) - this.min.y) / this.cellSize);
      // insert entity into each cell it overlaps
      // we're looping to make sure that all cells between extremes are found
      for (let cX = cXEntityMin; cX <= cXEntityMax; cX++) {
          // make sure a column exists, initialize if not to grid height length
          // NOTE: again, a purposeful use of the Array constructor
        if (!this.grid[cX]) {
          this.grid[cX] = Array(gridCols);
        }

        const gridCol = this.grid[cX];

        // loop through each cell in this column
        for (let cY = cYEntityMin; cY <= cYEntityMax; cY++) {
          // ensure we have a bucket to put entities into for this cell
          if (!gridCol[cY]) {
            gridCol[cY] = [];
            // this is for stats purposes only
            this.allocatedCells += 1;
          }

          const gridCell = gridCol[cY];

          // add entity to cell
          gridCell.push(entity);

          // draw this grid cell since it has active entities
          const canvas = surface;
          canvas.fillStyle = 'rgba(175, 175, 175, 0.01)';
          canvas.fillRect(cX * this.cellSize, cY * this.cellSize, this.cellSize, this.cellSize);
        }
      }
    }
  }

  queryForCollisionPairs() {
    // store checked hash ids
    const checked = {};
    // store collision pairs
    const pairs = [];

    // for every column in the grid...
    for (let i = 0; i < this.grid.length; i++) {
      const gridCol = this.grid[i];

      // ignore columns that have no cells
      if (!gridCol) { continue; }

      // for every cell within a column of the grid...
      for (let j = 0; j < gridCol.length; j++) {
        const gridCell = gridCol[j];

        // ignore cells that have no objects
        if (!gridCell) { continue; }

        // for every object in a cell...
        for (let k = 0; k < gridCell.length; k++) {
          const entityA = gridCell[k];

          // for every other object in a cell...
          for (let l = k + 1; l < gridCell.length; l++) {
            const entityB = gridCell[l];

            // create a unique key to mark this pair.
            // use both combinations to ensure linear time
            const hashA = `${entityA.id}:${entityB.id}`;
            const hashB = `${entityB.id}:${entityA.id}`;

            entityA.hit = false;
            entityB.hit = false;

            if (!checked[hashA] && !checked[hashB]) {
              // mark this pair has checked
              checked[hashA] = true;
              checked[hashB] = true;

              if (aabbCircle(entityA, entityB)) {
                pairs.push([entityA, entityB]);
              }
            }
          }
        }
      }
    }
    /* eslint no-param-reassign: 0 */
    // return pairs.map(pair => {
    //   pair[0].hit = true;
    //   pair[1].hit = true;
    //   return pair;
    // });
  }
}
