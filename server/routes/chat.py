from flask import Blueprint, request, jsonify, send_from_directory # Importe send_from_directory
from data.db import verify_token, save_chat_message, get_chat_history
import logging
import os
import time
from openai import AzureOpenAI
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
import uuid # Importa para gerar IDs de conversa

load_dotenv()
chat_bp = Blueprint('chat', __name__, url_prefix='/chat')
logger = logging.getLogger(__name__)

# Cliente Azure OpenAI
client = AzureOpenAI(
    api_key=os.getenv('AZURE_OPENAI_API_KEY'),
    api_version="2024-12-01-preview",
    azure_endpoint=os.getenv('AZURE_OPENAI_API_ENDPOINT')
)

# Rota para servir arquivos da pasta 'uploads'
@chat_bp.route('/uploads/<filename>')
def uploaded_file(filename):
    # Certifique-se de que a pasta 'uploads' existe e está na raiz do seu projeto Flask
    return send_from_directory(os.path.join(os.getcwd(), 'uploads'), filename)


@chat_bp.route('/chat', methods=['POST'])
def chat():
    try:
        # Log request details
        logger.info("Received chat request")
        
        # Authentication
        token = request.cookies.get('session')
        if not token:
            logger.warning("No authentication cookie found")
            return jsonify({'error': 'No authentication cookie'}), 401
            
        user = verify_token(token)
        if not user:
            logger.warning("Invalid session token")
            return jsonify({'error': 'Invalid session'}), 401
        
        # Log authenticated user
        logger.info(f"Authenticated user: {user.id}")
        
        # Get form data
        prompt = request.form.get('prompt', '').strip()
        image = request.files.get('image')
        conversation_id = request.form.get('conversation_id')
        
        # Log received data
        logger.debug(f"Prompt: {prompt}")
        logger.debug(f"Image: {True if image else False}")
        logger.debug(f"Conversation ID: {conversation_id}")

        # Validate input
        if not prompt and not image:
            return jsonify({'error': 'Prompt or image is required'}), 400
        if prompt and len(prompt) > 2000:
            return jsonify({'error': 'Prompt is too long'}), 400

        # Handle image and prepare prompt
        filename = None
        prompt_for_ai = prompt  # Define prompt_for_ai before use
        
        if image:
            try:
                filename = secure_filename(image.filename)
                upload_dir = os.path.join(os.getcwd(), 'uploads')
                os.makedirs(upload_dir, exist_ok=True)
                image.save(os.path.join(upload_dir, filename))
                # Update prompt_for_ai with image context
                prompt_for_ai = f"{prompt}\n[Imagem anexada: {filename}]"
            except Exception as e:
                logger.error(f"Error saving image: {e}")
                return jsonify({'error': 'Failed to save image'}), 500

        # Save user message with debug logging
        try:
            if conversation_id:
                logger.debug(f"Using existing conversation_id: {conversation_id}")
            else:
                conversation_id = str(uuid.uuid4())
                logger.debug(f"Generated new conversation_id: {conversation_id}")

            logger.debug(f"Attempting to save message with: user_id={user.id}, content_length={len(prompt)}")
            
            returned_message = save_chat_message(
                user_id=user.id,
                role='user',
                content=prompt,
                conversation_id=conversation_id,
                image_path=filename if image else None
            )
            
            if not returned_message:
                logger.error("save_chat_message returned None - database operation failed")
                raise Exception("Database operation failed")
                
            logger.info(f"Message saved successfully with conversation_id: {conversation_id}")
            
        except Exception as e:
            logger.exception(f"Failed to save message: {str(e)}")
            return jsonify({'error': f'Database error: {str(e)}'}), 500

        # Call Azure OpenAI
        try:
            # Chamada Azure OpenAI
            start = time.time()
            response = client.chat.completions.create(
                model=os.getenv('AZURE_OPENAI_DEPLOYMENT'),
                messages=[
                    {"role": "system", "content": "Você é um assistente útil."},
                    {"role": "user", "content": prompt_for_ai} # Usa o prompt com referência à imagem
                ],
                temperature=0.7,
                max_tokens=512
            )
            duration_ms = int((time.time() - start) * 1000)

            generated_text = response.choices[0].message.content

            # Save AI response with improved error handling
            assistant_message = save_chat_message(
                user_id=user.id,
                role='assistant',
                content=generated_text,
                conversation_id=conversation_id
            )

            if not assistant_message:
                logger.error(f"Failed to save assistant message. user_id={user.id}, conversation_id={conversation_id}")
                raise Exception("Database error: Could not save assistant response")

            return jsonify({
                'model': os.getenv('AZURE_OPENAI_DEPLOYMENT'),
                'duration_ms': duration_ms,
                'response': generated_text,
                'conversation_id': conversation_id,
                'image_path': filename if image else None
            }), 200

        except Exception as e:
            logger.error(f"Error in chat processing: {str(e)}")
            return jsonify({'error': 'Internal server error'}), 500

    except Exception as e:
        logger.exception("Unexpected error in chat endpoint")
        return jsonify({'error': str(e)}), 500

@chat_bp.route('/history', methods=['GET'])
def get_history_route(): # Renomeado para evitar conflito com a função get_chat_history do db.py
    try:
        token = request.cookies.get('session')
        if not token:
            return jsonify({'error': 'No authentication cookie'}), 401
        
        user = verify_token(token)
        if not user:
            return jsonify({'error': 'Invalid session'}), 401

        # get_chat_history agora retorna um array de objetos de conversa
        history = get_chat_history(user.id) 
        return jsonify({'history': history}), 200

    except Exception as e:
        logger.exception("Error fetching chat history")
        return jsonify({'error': str(e)}), 500