// Define the canvas width based on the window width
const windowWidth = window.innerWidth
let cw = 760;
if(windowWidth < 900){
  cw = 640;
}
if(windowWidth < 730) {
  cw = 500;
}

// Canvas dimensions
const CANVAS = {
  WIDTH: cw,
  HEIGHT: 420
};