from flask import Blueprint, request, jsonify
from data.db import verify_token
import logging
import openai
import os
from dotenv import load_dotenv

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
        model = data.get('model')  # Este é o nome do deployment no Azure
        api_key = data.get('api_key')

        if not all([message, model, api_key]):
            return jsonify({'error': 'Missing required fields'}), 400

        # Configuração da OpenAI (Azure)
        openai.api_key = os.getenv('AZURE_OPENAI_API_KEY') 
        openai.api_base = os.getenv('AZURE_OPENAI_API_ENDPOINT') 
        openai.api_type = "azure"

        # Chamada à API
        try:
            response = openai.ChatCompletion.create(
                engine=model, # Nome do deployment
                messages=[{"role": "user", "content": message}],
                max_tokens=100,
                temperature=0.7
            )
        except Exception as e:
            logger.exception("Error while calling OpenAI API")
            return jsonify({'error': 'Failed to generate response'}), 500

        return jsonify({
            'response': response['choices'][0]['message']['content'],
            'model': model,
        }), 200

    except Exception as e:
        logger.exception("Error in chat endpoint")
        return jsonify({'error': str(e)}), 500
