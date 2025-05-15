// Define the canvas width based on the window width
const windowWidth = window.innerWidth
let cw = 520;
if(windowWidth < 980){
  cw = 400;
}
if(windowWidth < 730) {
  cw = 300;
}

// Canvas dimensions
const CANVAS = {
  WIDTH: cw,
  HEIGHT: 360
};