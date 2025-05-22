from flask import Blueprint, request, jsonify
from data.db import verify_token, save_chat_message, get_chat_history
import logging
import os
import time
from openai import AzureOpenAI
from dotenv import load_dotenv
from werkzeug.utils import secure_filename

load_dotenv()
chat_bp = Blueprint('chat', __name__, url_prefix='/chat')
logger = logging.getLogger(__name__)

# Cliente Azure OpenAI 
client = AzureOpenAI(
    api_key=os.getenv('AZURE_OPENAI_API_KEY'),
    api_version="2024-12-01-preview",
    azure_endpoint=os.getenv('AZURE_OPENAI_API_ENDPOINT')
)

@chat_bp.route('/chat', methods=['POST'])
def chat():
    try:
        # Autenticação
        token = request.cookies.get('session')
        if not token:
            return jsonify({'error': 'No authentication cookie'}), 401
        user = verify_token(token)
        if not user:
            return jsonify({'error': 'Invalid session'}), 401
        
        user_id = user.id  # Acesso direto ao objeto User
        username = user.username

        # Handle multipart form data
        prompt = request.form.get('prompt', '').strip()
        image = request.files.get('image')
        
        if image:
            # Save image
            filename = secure_filename(image.filename)
            filepath = os.path.join('uploads', filename)
            image.save(filepath)
            # Add image context to prompt
            prompt = f"{prompt}\n[Image attached: {filename}]"

        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400
        if len(prompt) > 2000:
            return jsonify({'error': 'Prompt is too long'}), 400

        # Chamada Azure OpenAI
        start = time.time()
        response = client.chat.completions.create(
            model=os.getenv('AZURE_OPENAI_DEPLOYMENT'),
            messages=[
                {"role": "system", "content": "Você é um assistente útil."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=512
        )
        duration_ms = int((time.time() - start) * 1000)

        generated_text = response.choices[0].message.content

        # Salvar prompt e resposta no banco de dados
        save_chat_message(user_id, 'user', prompt)
        save_chat_message(user_id, 'assistant', generated_text)

        return jsonify({
            'model': os.getenv('AZURE_OPENAI_DEPLOYMENT'),
            'duration_ms': duration_ms,
            'response': generated_text
        }), 200

    except Exception as e:
        logger.exception("Error in Azure GPT chat endpoint")
        return jsonify({'error': str(e)}), 500

@chat_bp.route('/history', methods=['GET'])
def get_history():
    try:
        token = request.cookies.get('session')
        if not token:
            return jsonify({'error': 'No authentication cookie'}), 401
        
        user = verify_token(token)
        if not user:
            return jsonify({'error': 'Invalid session'}), 401

        history = get_chat_history(user.id)
        return jsonify({'history': history}), 200

    except Exception as e:
        logger.exception("Error fetching chat history")
        return jsonify({'error': str(e)}), 500
