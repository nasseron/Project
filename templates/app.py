from multiprocessing.pool import job_counter

from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)


# Database connection
conn = mysql.connector.connect(
    host="localhost",
    port=3306,
    user="root",
    passwd="Leunelsntext35!",
    database="flight_game",
    autocommit=True
    )
@app.route('/')
def index():
    return render_template("Mygame2.html")

@app.route('/start_game', methods=['GET'])
def start_flight():
    player_id = request.json['player_id']
    mission = get_mission(player_id)
    initial_fuel = 100
    initial_position = {'top': 0, 'left': 0}
    conn = mysql.connector.connect()
    cursor = conn.cursor()
    cursor.execute( """
     INSERT INTO flight_game (player_id, mission, initial_fuel, initial_position)
     VALUES (%S,%S,%S,%S)
     ON DUPLICATE KEY UPDATE position_top=%S, position_left=%s, fuel=%s """,
    (player_id, initial_position['top'], initial_position['left'], initial_fuel, initial_position['position_top'], initial_position['position_left'], initial_fuel))
    conn.commit()
    cursor.close()
    return jsonify({"fuel": initial_fuel, "position": initial_position, "mission": mission, "position": initial_position})
@app.route('/move_airplane', methods=['POST'])
def move_airplane():
    player_id = request.json['player_id']
    direction = request.json['direction']
    conn = mysql.connector.connect()
    cursor = conn.cursor()
    cursor.execute("SELECT positio_top, position_left, fuel FROM flight_game WHERE player_id = %s", (player_id,))
    player_data = cursor.fetchone()
    conn.close()
    if not player_data:
        return jsonify({"error": "Player not found"})
    position_top, position_left, fuel = player_data
    step_description = ''
    if direction == 'up':
         position_top -= 20
         step_description = "Moved Up"
    elif direction == "down":
         position_top += 20
         step_description = "Moved Down"
    elif direction == "left":
        position_left -= 20
        step_description = "Moved Left"
    elif direction == "right":
        position_left += 20
        step_description = "Moved Right"
    fuel -= 1
    if fuel <= 0:
        return jsonify({"error": "Fuel must be greater than zero"})
    conn.commit()
    conn.close()
    return jsonify({
        "fuel": fuel,
        "position": {"top": position_top, "left": position_left},
        "step_description": step_description

})
def get_mission(player_id):
    conn = mysql.connector.connect()
    cursor = conn.cursor()
    cursor.execute("SELECT mission FROM flight_game WHERE player_id = %s", (player_id,))
    mission = cursor.fetchone()
    conn.close()
    return mission
    if mission is None:
        return jsonify({"error": "Player not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)