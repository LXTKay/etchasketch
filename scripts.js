"use strict"

function initialize(){
  createGrid(16);
  document.querySelector(".newGridButton").addEventListener("click", askForGrid);
  document.querySelector("#container").addEventListener("mouseover", colorTile);
};

function colorTile(e){
  if(e.target.style.backgroundColor != "white"){

    e.target.style.backgroundColor = darkenColor(e.target.style.backgroundColor);

    return;
  };
  e.target.style.backgroundColor = randomColor();

};

function darkenColor(color) { //Shoutouts to chatGPT
  let hexColor = color;
  const percentagePoints = 10;

  // Check if the input is in RGB format
  if (color.startsWith("rgb")) {
    // Extract the RGB values
    const match = color.match(/\((\d+), (\d+), (\d+)\)/);
    if (match) {
      const r = parseInt(match[1]);
      const g = parseInt(match[2]);
      const b = parseInt(match[3]);

      // Convert RGB to hex
      hexColor = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
    } else {
      // Invalid RGB format, return the original color
      return color;
    }
  }

  // Remove the "#" symbol if present
  hexColor = hexColor.replace("#", "");

  // Convert the hex color to HSL
  const rValue = parseInt(hexColor.slice(0, 2), 16) / 255;
  const gValue = parseInt(hexColor.slice(2, 4), 16) / 255;
  const bValue = parseInt(hexColor.slice(4, 6), 16) / 255;

  const maxValue = Math.max(rValue, gValue, bValue);
  const minValue = Math.min(rValue, gValue, bValue);

  let h, s, l = (maxValue + minValue) / 2;

  if (maxValue === minValue) {
    h = s = 0; // achromatic
  } else {
    const delta = maxValue - minValue;
    s = l > 0.5 ? delta / (2 - maxValue - minValue) : delta / (maxValue + minValue);

    if (maxValue === rValue) {
      h = (gValue - bValue) / delta + (gValue < bValue ? 6 : 0);
    } else if (maxValue === gValue) {
      h = (bValue - rValue) / delta + 2;
    } else if (maxValue === bValue) {
      h = (rValue - gValue) / delta + 4;
    }

    h /= 6;
  }

  // Reduce the lightness by the specified percentage points
  l = Math.max(0, l - percentagePoints / 100);

  // Convert HSL back to RGB
  let rResult, gResult, bResult;

  if (s === 0) {
    rResult = gResult = bResult = l; // achromatic
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const qValue = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const pValue = 2 * l - qValue;
    rResult = hue2rgb(pValue, qValue, h + 1 / 3);
    gResult = hue2rgb(pValue, qValue, h);
    bResult = hue2rgb(pValue, qValue, h - 1 / 3);
  }

  // Convert RGB to hex
  rResult = Math.round(rResult * 255);
  gResult = Math.round(gResult * 255);
  bResult = Math.round(bResult * 255);
  const darkerHexColor = `#${rResult.toString(16).padStart(2, "0")}${gResult.toString(16).padStart(2, "0")}${bResult.toString(16).padStart(2, "0")}`;

  return darkerHexColor;
}




function askForGrid(){
  let gridSize = prompt("Create a new grid with how many squares?", "1");
  if(Number.isInteger(+gridSize)
  && +gridSize >= 1
  && +gridSize <= 100){
    createGrid(+gridSize);
    return;
  };
  alert("Try an integer between 1 and 100!");
};

function createGrid(gridSize) {
  const container = document.querySelector("#container");

  container.innerHTML = "";
  container.style.display = "grid";
  container.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  container.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

  for (let i = 0; i < gridSize * gridSize; i++) {
    let div = document.createElement("div");
    div.style.backgroundColor = "white";
    container.appendChild(div);
  };
};

function randomColor(){
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}




initialize();