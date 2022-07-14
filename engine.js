"use strict";

/* global p5 */
/* exported preload, setup, draw, mouseClicked */

let tile_height;
let tile_width;
let tile_columns;
let tile_rows;
let camera_velocity;
let camera_offset;

let concrete;
let concrete_Midnight;
let concrete_Noon;
let sky;
let sky_Midnight;
let sky_Day;
let window_color;
let window_Midnight;
let window_day;
let window_off_color;
let window_off_day;
let window_off_Midnight;

let gradiantRatio

function setup() {
  window_color = color(0);
  window_off_color = color(0);
  sky = color(0);
  concrete = color(0);

  sky_Day = color(145, 213, 255);
  sky_Midnight = color(16, 3, 28);
  concrete_Midnight = color(18, 14, 30);
  concrete_Noon = color(100, 100, 100);
  window_Midnight = color(255, 255, 0);
  window_day = color(253, 253, 150);
  window_off_Midnight = color(12, 8, 24);
  window_off_day = color(80, 80, 100);

  camera_offset = new p5.Vector(0, 0);
  camera_velocity = new p5.Vector(0, 0);

  let canvas = createCanvas(800, 400);
  canvas.parent("container");

  if (window.p3_setup) {
    window.p3_setup();
  }

  let label = createP();
  label.html("World key: ");
  label.parent("container");

  let input = createInput("cm147");
  input.parent(label);
  input.input(() => {
    rebuildWorld(input.value());
  });

  createP("Left and right keys scroll.").parent("container");

  rebuildWorld(input.value());
}

function rebuildWorld(key) {
  if (window.p3_worldKeyChanged) {
    window.p3_worldKeyChanged(key);
  }
  tile_width = window.p3_tileWidth ? window.p3_tileWidth() : 32;
  tile_height = window.p3_tileHeight ? window.p3_tileHeight() : 32;
  tile_columns = Math.ceil(width / tile_width);
  tile_rows = Math.ceil(height / tile_height);
}

function cameraToWorldOffset([camera_x, camera_y]) {
  let world_x = camera_x / (tile_width);
  let world_y = camera_y / (tile_height);
  return { x: Math.round(world_x), y: Math.round(world_y) };
}

function drawTime(time) {
  // Afternoon handler
  if (time[0] >= 12) {
    time[0] -= 12
    gradiantRatio = (time[0] * 60 + time[1]) / 719 // 719 is the maximum value the numerator can produce
    concrete = lerpColor(concrete_Noon, concrete_Midnight, gradiantRatio);
    sky = lerpColor(sky_Day, sky_Midnight, gradiantRatio);
    window_color = lerpColor(window_day, window_Midnight, gradiantRatio);
    window_off_color = lerpColor(window_off_day, window_off_Midnight, gradiantRatio);
  }
  // Morning handler
  else{
    gradiantRatio = (time[0] * 60 + time[1]) / 719 // 719 is the maximum value the numerator can produce
    concrete = lerpColor(concrete_Midnight, concrete_Noon, gradiantRatio);
    sky = lerpColor(sky_Midnight, sky_Day, gradiantRatio);
    window_color = lerpColor(window_Midnight, window_day, gradiantRatio);
    window_off_color = lerpColor(window_off_Midnight, window_off_day, gradiantRatio);
  }

  return sky;
}

function draw() {
  // Keyboard controls!
  if (keyIsDown(LEFT_ARROW)) {
    camera_velocity.x -= 1;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    camera_velocity.x += 1;
  }

  let camera_delta = new p5.Vector(0, 0);
  camera_velocity.add(camera_delta);
  camera_offset.add(camera_velocity);
  camera_velocity.mult(0.95); // cheap easing
  if (camera_velocity.mag() < 0.01) {
    camera_velocity.setMag(0);
  }

  let world_pos = screenToWorld(
    [mouseX, mouseY],
    [camera_offset.x, camera_offset.y]
  );

  let world_offset_foreground = cameraToWorldOffset([camera_offset.x/3, camera_offset.y/3]);
  let world_offset_midground = cameraToWorldOffset([camera_offset.x/2, camera_offset.y/2]);
  let world_offset_background = cameraToWorldOffset([2*camera_offset.x/3, 2*camera_offset.y/3]);

  

  if (window.p3_drawBefore) {
    window.p3_drawBefore();
  }

  let height;
  let tiletype;
  let time = [hour(), minute()]
  drawTime(time)
  background(sky); // Draws the background with the color of the sky set by the drawTime function

  for (let y = 0; y < tile_rows; y++) {
    for (let x = 0; x < tile_columns; x++) {
      let windowchance = 100 * gradiantRatio
      if (windowchance > 80) windowchance = 80;
      if (windowchance < 5) windowchance = 5;
      if (x % 7 == 0) {
        // Set new height
        // TODO: Use the xxhash to actually stash the values for this generation
        height = random([21, 20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10])
      }
      if (y <= height) {
        tiletype = 1;
      }
      else if (y >= 22) {
        tiletype = 2
      }
      else if (windowchance > random(1, 100)) {
        tiletype = 3 // Draw light off window
      }
      else {
        // draw light on window
        tiletype = 4
      }

      //drawTile([x + world_offset_background.x, y], [camera_offset.x, camera_offset.y], tiletype, concrete, window_color, window_off_color);
      //drawTile([x + world_offset_midground.x, y], [camera_offset.x, camera_offset.y], tiletype, concrete, window_color, window_off_color);
      drawTile([x + world_offset_foreground.x, y], [camera_offset.x, camera_offset.y], tiletype, concrete, window_color, window_off_color);
    }
  }

  if (window.p3_drawAfter) {
    window.p3_drawAfter();
  }
}

function screenToWorld([screen_x, screen_y], [camera_x, camera_y]) {
  screen_x += camera_x;
  screen_y += camera_y;
  screen_x /= tile_width;
  screen_y /= tile_height;
  return [Math.round(screen_x), Math.round(screen_y)];
}

function drawTileDescription([world_x, world_y], [screen_x, screen_y]) {
  push();
  translate(screen_x, screen_y);
  if (window.p3_drawSelectedTile) {
    window.p3_drawSelectedTile(world_x, world_y, screen_x, screen_y);
  }
  pop();
}

// Draw a tile, mostly by calling the user's drawing code.
function drawTile([world_x, world_y], [camera_x, camera_y], tiletype, color, windowColor, window_no_color) {
  push();
  translate(world_x * tile_width - camera_x, world_y * tile_height - camera_y);
  if (window.p3_drawTile) {
    window.p3_drawTile(world_x, world_y, tiletype, color, windowColor, window_no_color);
  }
  pop();
}

function mouseClicked() {
  let world_pos = screenToWorld(
    [mouseX, mouseY],
    [camera_offset.x, camera_offset.y]
  );

  if (window.p3_tileClicked) {
    window.p3_tileClicked(world_pos[0], world_pos[1]);
  }
  return false;
}
