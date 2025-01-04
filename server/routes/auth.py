from flask import request, jsonify, Blueprint
import logging
from werkzeug.security import check_password_hash
from data.db import create_user, get_user_by_username, update_user_token, verify_token

# Blueprint de autenticação
auth_bp = Blueprint('auth', __name__)

# Configuração do logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    """Cadastro de um novo usuário."""
    try:
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        # Detailed validation
        errors = {}
        if not username:
            errors['username'] = 'Username is required'
        elif len(username) < 3:
            errors['username'] = 'Username must be at least 3 characters'
        
        if not email:
            errors['email'] = 'Email is required'
        elif '@' not in email:
            errors['email'] = 'Invalid email format'
            
        if not password:
            errors['password'] = 'Password is required'
        elif len(password) < 6:
            errors['password'] = 'Password must be at least 6 characters'

        if errors:
            return jsonify({'errors': errors}), 400

        if get_user_by_username(username):
            return jsonify({'errors': {'username': 'Username already exists'}}), 409

        user = create_user(username, email, password)  # Create user handles hashing
        if user is None: #verifica se o usuario foi criado
            return jsonify({'errors': {'general': 'Error creating user'}}), 500
        token = generate_token()
        if update_user_token(username, token) is None: #verifica se o token foi atualizado
            return jsonify({'errors': {'general': 'Error generating token'}}), 500

        logger.info(f"User {username} signed up successfully")
        return jsonify({
            'message': 'Signup successful',
            'token': token,
            'username': username  # Add username to response
        }), 201
    except Exception as e:
        logger.exception(f"Error during signup: {e}")
        return jsonify({'errors': {'general': 'Internal server error'}}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Realiza o login do usuário e retorna um token de autenticação."""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        errors = {}
        if not username:
            errors['username'] = 'Username is required'
        if not password:
            errors['password'] = 'Password is required'

        if errors:
            return jsonify({'errors': errors}), 400

        user = get_user_by_username(username)
        if user and check_password_hash(user.password_hash, password): # Corrected line
            token = generate_token()
            if update_user_token(username, token) is None: #verifica se o token foi atualizado
                return jsonify({'errors': {'general': 'Error generating token'}}), 500
            logger.info(f"User {username} logged in successfully")
            return jsonify({
                'message': 'Login successful',
                'token': token,
                'user': {
                    'username': username,
                    'email': user.email
                }
            }), 200
        else:
            logger.warning(f"Login failed for user {username}")
            return jsonify({'errors': {'general': 'Invalid username or password'}}), 401
    except Exception as e:
        logger.exception(f"Error during login: {e}")
        return jsonify({'errors': {'general': 'Internal server error'}}), 500

@auth_bp.route('/protected', methods=['GET'])
def protected():
    """Rota protegida que requer autenticação."""
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            logger.warning("Invalid or missing Authorization header")
            return jsonify({'error': 'Invalid or missing Authorization header'}), 401

        token = auth_header.split(" ")[1]
        user = verify_token(token)
        if user:
            logger.info(f"User {user.username} accessed protected route")
            return jsonify({'message': f'Welcome, {user.username}! Create your Logo with LogixAI.'}), 200
        else:
            logger.warning("Invalid token")
            return jsonify({'error': 'Invalid token'}), 403
    except Exception as e:
        logger.exception(f"Error accessing protected route: {e}")
        return jsonify({'error': 'Internal server error'}), 500

def generate_token():
    """Gera um token único e seguro para autenticação."""
    import secrets
    return secrets.token_hex(32)