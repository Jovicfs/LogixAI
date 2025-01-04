from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import logging  
import os
from routes.auth import auth_bp
from routes.logo import logo_bp

load_dotenv()

app = Flask(__name__)
app.config.update(
    SECRET_KEY=os.getenv('SECRET_KEY', 'your-secret-key'),
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE='Lax'
)

# Simplified CORS configuration
CORS(app, supports_credentials=True, resources={
        r"/*": {
            "origins": ["http://localhost:5173"],  # Add your frontend URL
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],  # Added Authorization
            "expose_headers": ["Set-Cookie"],
            "supports_credentials": True
        }
    })

# Configuração do logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(logo_bp)

# Remove the @app.after_request decorator since CORS is handled by flask-cors
# @app.after_request
# def after_request(response):
#     origin = request.headers.get('Origin')
#     if origin in ["http://localhost:5173", "http://127.0.0.1:5173"]:
#         response.headers.add('Access-Control-Allow-Origin', origin)
#         response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
#         response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
#         response.headers.add('Access-Control-Allow-Credentials', 'true')
#     return response

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
