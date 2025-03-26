from flask import Blueprint, request, jsonify
from data.db import verify_token
import logging

chat_bp = Blueprint('chat', __name__)
logger = logging.getLogger(__name__)

@chat_bp.route('/chat', methods=['POST'])
def chat():
    try:
        token = request.cookies.get('session')
        if not token:
            return jsonify({'error': 'No session cookie'}), 401
            
        user = verify_token(token)
        if not user:
            return jsonify({'error': 'Invalid session'}), 401

        data = request.get_json()
        message = data.get('message')
        model = data.get('model')
        api_key = data.get('api_key')

        if not all([message, model, api_key]):
            return jsonify({'error': 'Missing required fields'}), 400

        # Here you would implement the actual AI chat logic
        # using the provided model and API key

        return jsonify({
            'response': 'AI response would go here',
            'model': model
        }), 200

    except Exception as e:
        logger.exception("Error in chat endpoint")
        return jsonify({'error': str(e)}), 500
