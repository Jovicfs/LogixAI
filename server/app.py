from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import logging  
from routes.auth import login, signup, protected  
from routes.logo import generate_logo

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuração do logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Registrar rotas
app.add_url_rule('/login', methods=['POST'], view_func=login)
app.add_url_rule('/signup', methods=['POST'], view_func=signup)
app.add_url_rule('/protected', methods=['GET'], view_func=protected)
app.add_url_rule('/generate_logo', methods=['POST'], view_func=generate_logo) 

# Tratamento de erros
@app.errorhandler(404)
def not_found(error):
    logging.error(f"Not found error: {error}")
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_server_error(error):
    logging.error(f"Internal server error: {error}")
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
