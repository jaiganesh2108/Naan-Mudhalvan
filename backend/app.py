from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io
import base64
from injury_detection import analyze_injury
from symptom_analyzer import analyze_symptoms
from telemedicine import initiate_session
from emr_viewer import get_emr
from chatbot import get_chatbot_response
import sqlite3
from datetime import datetime

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# Initialize SQLite database
def init_db():
    conn = sqlite3.connect('healthapp.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS injury_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            image TEXT NOT NULL,
            injury_type TEXT NOT NULL,
            medicine TEXT NOT NULL,
            timestamp TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

# Call init_db when the app starts
init_db()

@app.route('/injury/analyze', methods=['POST'])
def analyze():
    try:
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({'error': 'No image provided'}), 400

        image_data = data['image'].split(',')[1]  # Remove "data:image/jpeg;base64," prefix
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        
        result = analyze_injury(image)
        if not isinstance(result, dict) or 'type' not in result or 'medicine' not in result:
            return jsonify({'type': 'Error', 'medicine': 'Invalid result from analysis'}), 500
        
        # Save result to database
        conn = sqlite3.connect('healthapp.db')
        c = conn.cursor()
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        c.execute('''
            INSERT INTO injury_results (image, injury_type, medicine, timestamp)
            VALUES (?, ?, ?, ?)
        ''', (data['image'], result['type'], result['medicine'], timestamp))
        conn.commit()
        conn.close()
        
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'type': 'Error', 'medicine': f'Analysis failed: {str(e)}'}), 500

@app.route('/injury/results', methods=['GET'])
def get_injury_results():
    try:
        conn = sqlite3.connect('healthapp.db')
        c = conn.cursor()
        c.execute('SELECT id, image, injury_type, medicine, timestamp FROM injury_results ORDER BY timestamp DESC')
        results = c.fetchall()
        conn.close()
        
        # Format results as a list of dictionaries
        formatted_results = [
            {
                'id': row[0],
                'image': row[1],
                'type': row[2],
                'medicine': row[3],
                'timestamp': row[4]
            }
            for row in results
        ]
        
        return jsonify(formatted_results), 200
        
    except Exception as e:
        return jsonify({'error': f'Failed to fetch results: {str(e)}'}), 500

@app.route('/injury/results/<int:id>', methods=['DELETE'])
def delete_injury_result(id):
    try:
        conn = sqlite3.connect('healthapp.db')
        c = conn.cursor()
        c.execute('DELETE FROM injury_results WHERE id = ?', (id,))
        if c.rowcount == 0:
            conn.close()
            return jsonify({'error': 'Result not found'}), 404
        conn.commit()
        conn.close()
        return jsonify({'message': 'Result deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': f'Failed to delete result: {str(e)}'}), 500

@app.route('/symptom/analyze', methods=['POST'])
def symptom_analyze():
    try:
        data = request.get_json()
        if not data or 'symptoms' not in data:
            return jsonify({'error': 'No symptoms provided'}), 400

        symptoms = data['symptoms']
        result = analyze_symptoms(symptoms)
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'diagnosis': 'Error', 'recommendation': f'Analysis failed: {str(e)}'}), 500

@app.route('/telemedicine/initiate', methods=['POST'])
def telemedicine_initiate():
    try:
        data = request.get_json()
        if not data or 'userId' not in data or 'preferredTime' not in data:
            return jsonify({'error': 'User ID and preferred time required'}), 400

        result = initiate_session(data['userId'], data['preferredTime'])
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': f'Session initiation failed: {str(e)}'}), 500

@app.route('/emr/get', methods=['POST'])
def emr_get():
    try:
        data = request.get_json()
        if not data or 'userId' not in data:
            return jsonify({'error': 'User ID required'}), 400

        result = get_emr(data['userId'])
        return jsonify(result), 200
        
    except Exception as e:
        return jsonify({'error': f'EMR retrieval failed: {str(e)}'}), 500

@app.route('/chatbot', methods=['POST'])
def chatbot():
    try:
        data = request.get_json()
        if not data or 'message' not in data:
            return jsonify({'error': 'No message provided'}), 400

        message = data['message']
        response = get_chatbot_response(message)
        return jsonify({'response': response}), 200
        
    except Exception as e:
        return jsonify({'response': f'Error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)