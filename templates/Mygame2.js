let fuel = 100;
let airplane = document.getElementById('airplane');
let fuelElement = document.getElementById('fuel');
let missionElement = document.getElementById('mission');
let stepsList = document.getElementById('stepsList'); // Corrected variable name
let gameStarted = false; // Corrected variable name

function startGame() {
    // Add your game start logic here
}

function startFlight() {
    console.log("Starting flight✈✈✈✈✈✈✈");
}

function moveUp() {
    console.log("Moving up🛰🛰🛰🛰🛰🛰🛰");
}

function moveDown() {
    console.log("Moving down🎿🎿🎿🎿");
}

function moveLeft() {
    console.log("Moving left");
}

function moveRight() {
    console.log("Moving right");
}

function completeMission() {
    console.log("Mission completed!");
}

function returnToStart() {
    console.log("Returning to starting point");
}

const map = L.map('map', {tap: false});
L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
}).addTo(map);
map.setView([60, 24], 7);

const moveDistance = 20;
const set_the_game = () => {
    gameStarted = true;
    fuel = 100;
    fuelElement.textContent = `Fuel: ${fuel}`;
    missionElement.textContent = `Mission: Explore New Location`; // Corrected text
    stepsList.innerHTML = ''; // Corrected variable name
};

const moveAirplane = (direction) => {
    if (fuel <= 0) {
        alert('Out of fuel! Mission failed.'); // Corrected function name
        return;
    }
    let currentTop = parseInt(window.getComputedStyle(airplane).top) || 0;
    let currentLeft = parseInt(window.getComputedStyle(airplane).left) || 0;
    console.log(airplane);
    let style = window.getComputedStyle(airplane);
    let stepDescription = '';
    switch (direction) {
        case 'up':
            airplane.style.top = `${currentTop - moveDistance}px`;
            stepDescription = 'Moved up'; // Corrected text
            break;
        case 'down':
            airplane.style.top = `${currentTop + moveDistance}px`;
            stepDescription = 'Moved down'; // Corrected text
            break;
        case 'left':
            airplane.style.left = `${currentLeft - moveDistance}px`; // Corrected variable name
            stepDescription = 'Moved left'; // Corrected text
            break;
        case 'right':
            airplane.style.left = `${currentLeft + moveDistance}px`;
            stepDescription = 'Moved right'; // Corrected text
            break;
    }

    fuel -= 1;
    fuelElement.textContent = `Fuel: ${fuel}`;

    const newStep = document.createElement('li');
    newStep.textContent = `${stepDescription} - Fuel: ${fuel}`;
    stepsList.appendChild(newStep); // Corrected variable name
    if (fuel <= 0) { // Corrected syntax
        alert('Out of fuel! You need to return to the starting point.'); // Corrected function name
    }
};

document.getElementById('moveUp').addEventListener('click', () => moveAirplane('up'));
document.getElementById('moveDown').addEventListener('click', () => moveAirplane('down')); // Added event listener
document.getElementById('moveLeft').addEventListener('click', () => moveAirplane('left')); // Added event listener
document.getElementById('moveRight').addEventListener('click', () => moveAirplane('right')); // Added event listener

document.addEventListener("DOMContentLoaded", function () {
    let element = document.getElementById('airplane');
    let style = window.getComputedStyle(element); // Corrected variable name
});
