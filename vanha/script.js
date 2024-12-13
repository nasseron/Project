document.addEventListener('DOMContentLoaded', function (event) {
    window.startGame = function (){
        console.log("Game started!")
    };

    let direction = '';
    let fuelLevel = 100;
    let marker;
    let currentLatLng = L.latLng(60.1699, 24.9384);  // Starting at Helsinki, Finland
    let moveStep = 0.01; // Movement step in degrees

    window.startGame = function () {
        fetch('http://127.0.0.1:5000/start_game', {
            method: 'GET'
        })
            .then(response => response.json())
            .then(data => {
                try {
                    console.log(data);  // Log the actual data
                    document.getElementById('intro').style.display = 'none';
                    document.getElementById('game').style.display = 'block';
                    document.getElementById('fuel').innerText = 'Fuel: ' + data.budget + '%';
                    document.getElementById('mission').innerText = data.mission;
                    document.getElementById('destination').innerText = data.destination;
                    document.getElementById('current_location').innerText = data.current_location;

                } catch (error) {
                    console.log('Error:', error);
                    alert('Failed to start the game. Please try again.');
                }
            })
            .catch(error => {
                alert('Failed to start the game. Please try again.');
            });
    }
    function initializeMap() {
        map.setView(currentLatLng, 13);

        let airplaneIcon = L.icon({
            iconUrl: 'airplane.png',
            iconSize: [38, 38],
            iconAnchor: [22, 22],
            popupAnchor: [-3, -76]
        });


    const map = L.map('map', {tap: false}).setView([60, 24], 7);
    L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }).addTo(map);



        marker = L.marker(currentLatLng, {icon: airplaneIcon}).addTo(map);
    }

    window.setDirection = function (newDirection) {
        direction = newDirection;
        console.log('Direction set to:', direction)
    }
    const map = L.map('map', {tap: false});
    L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    }).addTo(map);
    map.setView([60, 24], 7);






    window.startFlight = function () {
        if (fuelLevel > 0) {
            console.log('Starting flight to the', direction);
            fuelLevel -= 10; // Deduct fuel for the flight

            // Move the marker based on the selected direction
            if (direction === 'Up') {
                currentLatLng.lat += moveStep;
            } else if (direction === 'Down') {
                currentLatLng.lat -= moveStep;
            } else if (direction === 'Left') {
                currentLatLng.lng -= moveStep;
            } else if (direction === 'Right') {
                currentLatLng.lng += moveStep;
            }

            // Update the marker position
            marker.setLatLng(currentLatLng);

            // Optionally, smoothly pan the map to the new position
            map.panTo(currentLatLng);

            // Update the fuel display
            document.getElementById('fuel').innerText = 'Fuel: ' + fuelLevel + '%';

            // Check if the fuel has run out
            if (fuelLevel <= 0) {
                alert('Not enough fuel to continue the flight.');
            }
        } else {
            alert('Not enough fuel to start the flight.');
        }
    }

    window.searchDestination = function () {
        const destination = document.getElementById('destination').value;
        if (destination) {
            fetch('http://127.0.0.1:5000/choose_destination', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({destination: destination})
            })
                .then(response => response.text())
                .then(text => {
                    try {
                        const data = JSON.parse(text);
                        console.log('Destination set to:', data.destination);
                        moveAirplaneToDestination(data.destination);
                    } catch (error) {
                        console.error('Error parsing JSON:', error);
                        console.log('Response text:', text);
                        alert('Failed to set the destination. Please try again.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Failed to set the destination. Please try again.');
                });
        } else {
            console.log('Please enter a destination.');
        }
    }

    function moveAirplaneToDestination(destination) {
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${destination}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const lat = data[0].lat;
                    const lon = data[0].lon;
                    const destinationLatLng = L.latLng(lat, lon);
                    marker.setLatLng(destinationLatLng);
                    map.setView(destinationLatLng, 13);
                    document.getElementById('current_location').innerText = destination;
                } else {
                    console.log('Destination not found.');
                }
            })
            .catch(error => console.error('Error:', error));
    }

    window.completeMission = function () {
        fetch('http://127.0.0.1:5000/complete_mission', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({budget: fuelLevel})
        })
            .then(response => response.text())
            .then(text => {
                try {
                    const data = JSON.parse(text);
                    console.log(data.status);
                    document.getElementById('fuel').innerText = data.budget + '%';
                    document.getElementById('exploration_data').innerText = data.exploration_data;
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    console.log('Response text:', text);
                    alert('Failed to complete the mission. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to complete the mission. Please try again.');
            });
    }
    window.returnToStart = function () {
        fetch('http://127.0.0.1:5000/return_to_start', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({budget: fuelLevel})
        })
            .then(response => response.text()) // .then needs a function here
            .then(text => {
                try {
                    const data = JSON.parse(text); // Parsing the response text into JSON
                    console.log(data.status); // You can use this in your logic
                    document.getElementById('fuel').innerText = data.budget + '%'; // Update fuel display
                    document.getElementById('current_location').innerText = data.current_location; // Update current location
                    map.setView([51.505, -0.09], 13); // Move the map view to Helsinki (or your starting point)
                    marker.setLatLng([51.505, -0.09]); // Set the marker's location to the start (Helsinki)
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    console.log('Response text:', text); // Log the response text for debugging
                    alert('Failed to return to the starting point. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to return to the starting point. Please try again.');
            });

    };

});


