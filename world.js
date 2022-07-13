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

function p3_setup() {}

let worldSeed;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
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

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  clicks[key] = 1 + (clicks[key] | 0);
  console.log(i, j);
}

function p3_drawBefore() {}
//fill(noise(i, j) * 255)
function p3_drawTile(i, j) {
  noStroke();
  let noi = noise(i, j)
  if (noi < 0.4) noi = 0.4
  let n = clicks[[i, j]] | 0;
  let nIP = clicks[[i + 1, j]] | 0;
  let nIM = clicks[[i - 1, j]] | 0;
  let nJP = clicks[[i, j + 1]] | 0;
  let nJM = clicks[[i, j - 1]] | 0;

  if (nIP % 2 == 1 || nIM % 2 == 1 || nJP % 2 == 1 || nJM % 2 == 1) {
    fill(255, noi * 255, 0, noi * 180);
  }
  else{
    fill(0, noi * 255, 0)
  }
  if (n % 2 == 1 ) {
    fill(0, noi * 40, noi * 255)
  }
  

  push();

  beginShape();
  vertex(0, 0);
  vertex(0, tw);
  vertex(th, tw);
  vertex(th, 0);
  endShape(CLOSE);

  pop();
}

function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);

  beginShape();
  vertex(0, 0);
  vertex(0, tw);
  vertex(th, tw);
  vertex(th, 0);
  endShape(CLOSE);

  noStroke();
  fill(0);
  text("(" + [i, j] + ")", 0, 0);
}

function p3_drawAfter() {}
