from flask import Blueprint, request, jsonify
import openai
import os

post_bp = Blueprint('post_ideas', __name__, url_prefix='/post_ideas')

# Configure sua API key
openai.api_key = os.getenv("AZURE_OPENAI_API_KEY")

@post_bp.route('/', methods=['GET'])
def generate_post_ideas():
    trend = request.args.get('trend')
    if not trend:
        return jsonify({'error': 'Missing trend'}), 400

    try:
        response = openai.ChatCompletion.create(
            model='gpt-4',
            messages=[
                {"role": "user", "content": f"Gere 5 posts de instagram baseando-se no que vem dando hype: {trend}. Include hashtags and emojis."}
            ],
            max_tokens=300
        )

        ideas = response.choices[0].message['content'].strip()
        return jsonify({'trend': trend, 'post_ideas': ideas})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
