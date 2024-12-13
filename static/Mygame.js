let fuel = 100;
let airplane = document.getElementById('airplane');
let fuelElement = document.getElementById('fuel');
let missionElement = document.getElementById('mission');
let stepsLest = document.getElementById('stepsList')
let gameStart = false;

const moveDistance = 20;
const startFlight = () => {
    gameStarted = true;
    fuel = 100;
    fuelElement.textContent = `Fuel: ${fuel}`;
    missionElement.textContent = `Mission: Explor New Location`;
    stepsLest.innerHTML = '';
    console.log("Starting flight✈✈✈✈✈✈✈");
};
const moveAirplane = (direction) => {
    if (fuel <= 0) {
        alar('Out of the fuel! Misson failed.');
        return;
    }
    let currentTop = parseInt(window.getComputedStyle(airplane).top) || 0;
    let currentLeft = parseInt(window.getComputedStyle(airplane).left) || 0;
    let stepDescription = '';
    switch (direction) {
        case 'up':
            airplane.style.top = `${currentTop - moveDistance}px`;
            stepDescription = 'Moveed up'
            break;
        case 'down':
            airplane.style.top = `${currentTop + moveDistance}PX`;
            stepDescription = 'Moved Down';
            break;
        case 'left':
            airplane.style.left = `${currentLeft - moveDestination}px`;
            stepDescription = 'Moved Left';
            break;
        case 'right':
            airplane.style.left = `${currentLeft + moveDistance}px`;
            stepDescription = 'Moved Right';
            break;
    }

    fuel -= 1;
    fuelElement.textContent = `Fuel: ${fuel}`;

    const newStep = document.createElement('li');
    newStep.textContent = `${stepDescription} - Fuel: ${fuel}`;
    stepsLest.appendChild(newStep);
    IF(FUEL <= 0)
    {
        alart('Out of fuel! You need to return to the starting point.');

    }
};
document.getElementById('moveUp').addEventListener('click', () => moveAirplane('up'));
document.getElementById('move');
