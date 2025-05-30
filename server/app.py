from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import logging  
import os
from routes.auth import auth_bp
from routes.logo import logo_bp
from routes.image import image_bp
from routes.payment import payment_bp
from routes.trends import trends_bp
from routes.post import post_bp
from routes.chat import chat_bp
from routes.mercado_pago_integration import create_preference
from routes.post_history import post_history_bp
from routes.enhance import enhance_bp
from data.db import init_db

load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Configure database
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_ECHO'] = True  # For debugging

    # Initialize database
    init_db()  # <-- Remove app argument

    app.config.update(
        SECRET_KEY=os.getenv('SECRET_KEY', 'your-secret-key'),
        SESSION_COOKIE_SECURE=True,
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE='Lax'
    ) 

    # Simplified CORS configuration
    CORS(app, supports_credentials=True, resources={
            r"/*": {
                "origins": ["http://localhost:5173"], # FRONT END URL
                "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                "allow_headers": ["Content-Type", "Authorization", "Access-Control-Allow-Credentials"],  # AUTHORIZATION
                "expose_headers": ["Content-Range", "X-Content-Range"],
                "supports_credentials": True
            }
        })

    # Configuração do logging
    logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

    # Register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(logo_bp)
    app.register_blueprint(image_bp)
    app.register_blueprint(payment_bp)
    app.register_blueprint(trends_bp)
    app.register_blueprint(post_bp)
    app.register_blueprint(chat_bp)
    app.register_blueprint(post_history_bp)
    app.register_blueprint(enhance_bp)


    # Tratamento de erros
    @app.errorhandler(404)
    def not_found(error):
        logging.error(f"Not found error: {error}")
        return jsonify({'error': 'Not found'}), 404

    @app.errorhandler(500)
    def internal_server_error(error):
        logging.error(f"Internal server error: {error}")
        return jsonify({'error': 'Internal server error'}), 500

    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
