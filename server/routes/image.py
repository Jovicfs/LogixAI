from flask import request, jsonify, Blueprint, Response
import logging
import urllib.parse
from data.db import save_image, get_user_images, delete_image, verify_token
import requests

image_bp = Blueprint('image', __name__)
logger = logging.getLogger(__name__)

@image_bp.before_request
def before_request():
    if request.method == 'OPTIONS':
        return '', 204
    
    token = request.cookies.get('session')
    if not token and request.path not in ['/login', '/register']:
        return jsonify({'error': 'No authentication cookie'}), 401

    request.token = token

@image_bp.route('/generate_image', methods=['POST', 'OPTIONS'])
def generate_image():
    if request.method == 'OPTIONS':
        return '', 204
        
    try:
        token = request.cookies.get('session')
        if not token:
            return jsonify({'error': 'No authentication cookie'}), 401
            
        user = verify_token(token)
        if not user:
            return jsonify({'error': 'Invalid session'}), 401

        data = request.get_json()
        prompt = data.get('prompt')
        style = data.get('style')

        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400

        # Generate image using Pollinations.ai
        full_prompt = f"{prompt}, {style if style else ''}, high quality, detailed"
        encoded_prompt = urllib.parse.quote(full_prompt)
        image_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?nologo=true"

        # Save image data
        image_data = save_image(user.id, prompt, style, image_url)
        if not image_data:
            return jsonify({'error': 'Failed to save image'}), 500

        return jsonify({
            'image_url': image_url,
            'image_id': image_data['id']
        }), 200

    except Exception as e:
        logger.exception("Error generating image")
        return jsonify({'error': str(e)}), 500

@image_bp.route('/user_images', methods=['GET'])
def get_images():
    try:
        token = request.cookies.get('session')
        if not token:
            return jsonify({'error': 'No session cookie'}), 401
            
        user = verify_token(token)
        if not user:
            return jsonify({'error': 'Invalid session'}), 401

        images = get_user_images(user.id)
        
        return jsonify({
            'images': [{
                'id': image.id,
                'prompt': image.prompt,
                'style': image.style,
                'image_url': image.image_url,
                'created_at': image.created_at
            } for image in images]
        }), 200

    except Exception as e:
        logger.exception("Error fetching images")
        return jsonify({'error': str(e)}), 500

@image_bp.route('/delete_image/<int:image_id>', methods=['DELETE'])
def remove_image(image_id):
    try:
        token = request.cookies.get('session')
        if not token:
            return jsonify({'error': 'No session cookie'}), 401
            
        user = verify_token(token)
        if not user:
            return jsonify({'error': 'Invalid session'}), 401

        if delete_image(image_id, user.id):
            return jsonify({'message': 'Image deleted successfully'}), 200
        return jsonify({'error': 'Image not found'}), 404

    except Exception as e:
        logger.exception("Error deleting image")
        return jsonify({'error': str(e)}), 500
