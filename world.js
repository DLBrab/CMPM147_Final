"use strict";

/* global XXH */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/

function p3_preload() {}

function p3_setup() {
  angleMode(DEGREES);
}

let worldSeed;


function p3_worldKeyChanged(key) {
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 16;
}
function p3_tileHeight() {
  return 16;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];
let windowRatio = 2 / 5;

let clicks = {};

function p3_tileClicked(i, j) {}

function p3_drawBefore() {}

function p3_drawTile(i, j, type, conccolor, windowColor, windowOffColor) {
  stroke(conccolor);
  fill(conccolor);
  
  push();
  translate(i, j)
  switch (type) {
    case 1:
      draw_air(i, j)
      break;
    case 2: 
      draw_ground_level_tile(i, j)
      break;
    case 3: 
      draw_window(i, j, windowOffColor) 
      break;
    case 4: 
      draw_window(i, j, windowColor)
      break;
  }

  pop();
}

function draw_air(i, j) {
  noFill();
  noStroke();
  beginShape();
  vertex(0, 0);
  vertex(0, tw + 1);
  vertex(th + 1, tw + 1);
  vertex(th + 1, 0);
  endShape(CLOSE);
}

function draw_ground_level_tile(i, j, conccolor) {
  let groundConcrete = color(conccolor * 0.9);

  fill(groundConcrete);
  beginShape();
  vertex(0, 0);
  vertex(0, tw + 1);
  vertex(th + 1, tw + 1);
  vertex(th + 1, 0);
  endShape(CLOSE);
}

function draw_window(i, j, window_color) {
  draw_ground_level_tile(i, j);
  fill(window_color)
  translate(1 / windowRatio, 1/ windowRatio);
  beginShape();
  vertex(0, 0);
  vertex(0, tw * windowRatio);
  vertex(th * windowRatio, tw * windowRatio);
  vertex(th * windowRatio, 0);
  endShape();
}

function p3_drawAfter() {}
