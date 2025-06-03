/**
 * @fileoverview
 * This file contains the canvas settings for the visualization
 */

// Define the canvas width based on the width of the visualization
const windowHeight = window.innerHeight;
const visElement = document.getElementById('tree-visualization');
const visWidth = visElement.offsetWidth;

// Canvas dimensions
const CANVAS = {
  WIDTH: visWidth,
  HEIGHT: windowHeight / 5 * 3
};