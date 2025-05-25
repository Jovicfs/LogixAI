from flask import Blueprint, request, jsonify
from data.db import verify_token
import os
from openai import AzureOpenAI
import logging

post_bp = Blueprint('post', __name__, url_prefix='/post')
logger = logging.getLogger(__name__)

client = AzureOpenAI(
    api_key=os.getenv('AZURE_OPENAI_API_KEY'),
    api_version=os.getenv('AZURE_OPENAI_API_VERSION'),
    azure_endpoint=os.getenv('AZURE_OPENAI_API_ENDPOINT')
)

@post_bp.route('/generate', methods=['POST'])
def generate_post():
    try:
        token = request.cookies.get('session')
        if not token:
            return jsonify({'error': 'No authentication cookie'}), 401
            
        user = verify_token(token)
        if not user:
            return jsonify({'error': 'Invalid session'}), 401

        data = request.json
        if not data or 'topic' not in data:
            return jsonify({'error': 'Topic is required'}), 400

        response = client.chat.completions.create(
            model=os.getenv('AZURE_OPENAI_DEPLOYMENT'),
            messages=[
                {"role": "system", "content": "You are a professional content writer."},
                {"role": "user", "content": f"Create a {data.get('format', 'blog post')} about {data['topic']} "
                                          f"in a {data.get('tone', 'professional')} tone, "
                                          f"with approximately {data.get('wordCount', 300)} words."}
            ],
            temperature=0.7,
            max_tokens=1000
        )

        return jsonify({
            'content': response.choices[0].message.content
        })

    except Exception as e:
        logger.exception("Error generating post")
        return jsonify({'error': str(e)}), 500
