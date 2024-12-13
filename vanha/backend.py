from http.client import responses
from pydoc import describe
from flask import request
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import mysql.connector


app = Flask(__name__)
CORS(app)


# Database connection
mydb = mysql.connector.connect(
    host="localhost",
    port=3306,
    user="root",
    passwd="Leunelsntext35!",
    database="flight_game",
    autocommit=True
)

@app.route('/')
def index():
    return render_template("vanha")

@app.route('/start_game', methods=['GET'])
def start_game():
    try:
        cursor = mydb.cursor(buffered=True)  # Initialize the cursor once here
        cursor.execute("SELECT * FROM mission WHERE id = 1")
        mission = cursor.fetchone()

        if mission:
            game = {
                'budget': 100,
                'mission': mission[1],  # mission description
                'destination': mission[2],  # destination name
                'current_location': mission[3],  # current location
            }
            return jsonify(game)
        else:
            return jsonify({'error': 'No mission found!'}), 404

    except Exception as e:
        app.logger.error(f"Error in /start_game route: {e}")
        return jsonify({"error": "Internal Server Error"}), 500


@app.route('/choose_destination', methods=['POST'])
def choose_destination():
    data = request.get_json()
    destination = data.get("destination")

    if not destination:
        return jsonify({"error": "No destination given!"}), 400
    try:
        response = request.get(f"https://nominatim.openstreetmap.org/search?q={destination}")
        if response.status_code == 200:
            result = response.json()
            if result:
                lat = result[0]['lat']
                lon = result[0]['lon']
                return jsonify({"destination": destination, "lat": lat, "lon": lon})
            else:
                return jsonify({"error": "No destination found!"}), 400
        else:
            return jsonify({"error": 'error fetching destination!'}), 500
    except request.RequestException as e:
        return jsonify({"error": f"Error fetching destination: {e}"}), 500
@app.route('/complete_mission', methods=['POST'])
def complete_mission():
    data = request.get_json()
    mission = data.get("mission")
    destination = data.get("destination")
    current_location = data.get("current_location")
    budget = data.get('budget', 0)

    try:
        cursor = mydb.cursor(buffered=True)
        cursor.execute("UPDATE mission SET mission_status = %s WHERE id = 1", ('Completed',))
        mydb.commit()

        response_data = {
            'status': 'Mission Completed',
            'budget': request.json[budget],
            'mission': request.json['mission'],
            'destination': request.json['destination'],
            'current_location': request.json['current_location'],
            'exploration_data' : 'The land is suitable for human life.'


        }
        return jsonify({"budget": budget, "status": "Mission Completed", "exploration_data": exploration_data})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
@app.route('/return_to_start', methods=['POST'])
def return_to_start():
    data = request.get_json()
    budget = data.get['budget']
    start_location = 'Helsinki, Finland'
    try:
        cursor = mydb.connection.cursor(buffered=True)
        cursor.execute("UPDATE mission SET mission_status = %s WHERE id = 1", ('Return_to_Start',))
        mydb.commit()
        response_data = {
            'status': 'Mission Return to Start',
            'budget': budget,
            'current_location': start_location,
        }
        return jsonify(response_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/explore_island', methods=['POST'])
def explore_island():
    # Function that simulates exploring an island
    exploration_data = {
        "temperature": 22,
        "vegetation": "Sparse",
        "life_found": True
    }
    return jsonify(exploration_data)

if __name__ == '__main__':
    app.run(debug=True)
