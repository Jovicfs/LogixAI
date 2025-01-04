from flask import request, jsonify, Blueprint, make_response, current_app
import logging
from werkzeug.security import check_password_hash
from data.db import create_user, get_user_by_username, update_user_token, verify_token
from datetime import datetime, timedelta
import secrets

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
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        user = get_user_by_username(username)
        if user and user.check_password(password):
            session_token = secrets.token_urlsafe(32)
            user = update_user_token(username, session_token)

            response = make_response(jsonify({
                'success': True,
                'username': username
            }))

            # Set secure cookie with proper configuration
            response.set_cookie(
                'session',
                session_token,
                httponly=True,
                secure=True,
                samesite='Lax',
                max_age=3600,
                path='/',
                domain=None  # This will use the current domain
            )
            return response

        return jsonify({'error': 'Invalid credentials'}), 401
    except Exception as e:
        logger.error(f"Login error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@auth_bp.route('/logout', methods=['POST'])
def logout():
    response = make_response(jsonify({'success': True}))
    response.delete_cookie('session', path='/', domain=None)
    return response

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')

    if get_user_by_username(username):
        return jsonify({'error': 'Username already exists'}), 400

    user = create_user(username, email, password)
    if user:
        return jsonify({'message': 'User created successfully'}), 201
    return jsonify({'error': 'Error creating user'}), 500

@auth_bp.route('/protected', methods=['GET'])
def protected():
    """Rota protegida que requer autenticação."""
    try:
        token = request.cookies.get('session')
        if not token:
            return jsonify({'error': 'No session cookie'}), 401

        user = verify_token(token)
        if user:
            return jsonify({
                'authenticated': True,
                'username': user.username,
                'message': f'Welcome, {user.username}! Create your Logo with LogixAI.'
            }), 200
        else:
            return jsonify({'error': 'Invalid session'}), 403
    except Exception as e:
        logger.exception(f"Error accessing protected route: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@auth_bp.route('/verify-session', methods=['GET'])
def verify_session():
    token = request.cookies.get('session')
    if not token:
        return jsonify({'authenticated': False}), 401
    
    user = verify_token(token)
    if user:
        return jsonify({
            'authenticated': True,
            'username': user.username
        })
    return jsonify({'authenticated': False}), 401

def generate_token():
    """Gera um token único e seguro para autenticação."""
    import secrets
    return secrets.token_hex(32)