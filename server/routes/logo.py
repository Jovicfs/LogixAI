from flask import request, jsonify, Blueprint, send_file, Response, current_app
import logging
import re
import urllib.parse
from math import sqrt
import requests
from io import BytesIO
from data.db import save_logo, get_user_logos, delete_logo, verify_token

logo_bp = Blueprint('logo', __name__)

# Configuração do logger
logger = logging.getLogger(__name__)

@logo_bp.before_request
def before_request():
    if request.method == 'OPTIONS':
        return '', 204
    
    # Get token from secure cookie instead of headers
    token = request.cookies.get('session')
    if not token and request.path not in ['/login', '/register']:
        return jsonify({'error': 'No authentication cookie'}), 401

    request.token = token
    logger.info(f"Incoming request: {request.method} {request.path}")

@logo_bp.route('/generate_logo', methods=['POST', 'OPTIONS'])
def generate_logo():
    if request.method == 'OPTIONS':
        return '', 204
    """
    Gera um logo com base nas informações fornecidas pelo usuário.
    """
    try:
        # Verify user authentication from cookie
        token = request.cookies.get('session')
        if not token:
            return jsonify({'error': 'No authentication cookie'}), 401
            
        user = verify_token(token)
        if not user:
            return jsonify({'error': 'Invalid session'}), 401

        data = request.get_json()
        company_name = data.get('companyName')
        sector = data.get('sector')
        style = data.get('style')
        color = data.get('color').lstrip('#')  # Remove the # from the hex color

        # Verificação de parâmetros obrigatórios
        if not all([company_name, sector, style, color]):
            logger.error("Missing required parameters for logo generation")
            return jsonify({'error': 'Missing required parameters'}), 400

        # Validação de cor (agora aceita cores com ou sem #)
        if not re.match(r'^[a-fA-F0-9]{6}$', color):
            logger.error("Invalid color format")
            return jsonify({'error': 'Invalid color format'}), 400

        # Convert hex color to word description
        color_description = f"color hex {color}"

        # Simulação de geração de imagem com IA
        image_url = generate_ai_image(company_name, sector, style, color)
        
        # Save logo to database and get data
        logo_data = save_logo(
            user_id=user.id,
            company_name=company_name,
            sector=sector,
            style=style,
            color=color,
            image_url=image_url
        )
        
        if not logo_data:
            return jsonify({'error': 'Failed to save logo'}), 500

        logger.info(f"Generated logo for {company_name}")
        return jsonify({
            'logo': image_url,
            'logo_id': logo_data['id']
        }), 200

    except Exception as e:
        logger.exception("Error generating logo")
        return jsonify({'error': 'Internal server error'}), 500

@logo_bp.route('/download_logo', methods=['POST'])
def download_logo():
    """Download the generated logo"""
    try:
        data = request.get_json()
        image_url = data.get('imageUrl')
        
        if not image_url:
            return jsonify({'error': 'No image URL provided'}), 400
            
        # Download the image from the URL
        response = requests.get(image_url, stream=True)
        if response.status_code != 200:
            return jsonify({'error': 'Failed to download image'}), 400
            
        # Stream the file directly to the client
        return Response(
            response.iter_content(chunk_size=8192),
            content_type=response.headers['Content-Type'],
            headers={
                'Content-Disposition': 'attachment; filename=logo.png',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Access-Control-Allow-Methods': '*'
            }
        )
        
    except Exception as e:
        logger.exception("Error downloading logo")
        return jsonify({'error': str(e)}), 500

@logo_bp.route('/user_logos', methods=['GET', 'OPTIONS'])
def get_logos():
    """Get user logos"""
    if request.method == 'OPTIONS':
        return '', 204
    try:
        token = request.cookies.get('session')
        if not token:
            return jsonify({'error': 'No session cookie'}), 401
            
        user = verify_token(token)
        if not user:
            return jsonify({'error': 'Invalid session'}), 401

        logos = get_user_logos(user.id)
        logger.info(f"Found {len(logos)} logos for user {user.id}")
        
        return jsonify({
            'logos': [{
                'id': logo.id,
                'company_name': logo.company_name,
                'sector': logo.sector,
                'style': logo.style,
                'color': logo.color,
                'image_url': logo.image_url,
                'created_at': logo.created_at
            } for logo in logos]
        }), 200

    except Exception as e:
        logger.exception("Error fetching logos")
        return jsonify({'error': str(e)}), 500

@logo_bp.route('/delete_logo/<int:logo_id>', methods=['DELETE', 'OPTIONS'])
def remove_logo(logo_id):
    if request.method == 'OPTIONS':
        return '', 204
    try:
        token = request.cookies.get('session')
        if not token:
            return jsonify({'error': 'No session cookie'}), 401
            
        user = verify_token(token)
        if not user:
            return jsonify({'error': 'Invalid session'}), 401

        if delete_logo(logo_id, user.id):
            return jsonify({'message': 'Logo deleted successfully'}), 200
        return jsonify({'error': 'Logo not found'}), 404

    except Exception as e:
        logger.exception("Error deleting logo")
        return jsonify({'error': 'Internal server error'}), 500

def hex_to_rgb(hex_color):
    """Convert hex color to RGB tuple."""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def color_distance(rgb1, rgb2):
    """Calculate simple color distance using Euclidean distance."""
    r1, g1, b1 = rgb1
    r2, g2, b2 = rgb2
    return sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2)

def hex_to_hsv(hex_color):
    """Convert hex color to HSV (Hue, Saturation, Value)"""
    r, g, b = hex_to_rgb(hex_color)
    r, g, b = r/255.0, g/255.0, b/255.0
    cmax = max(r, g, b)
    cmin = min(r, g, b)
    diff = cmax - cmin

    if cmax == cmin:
        h = 0
    elif cmax == r:
        h = (60 * ((g-b)/diff) + 360) % 360
    elif cmax == g:
        h = (60 * ((b-r)/diff) + 120) % 360
    else:
        h = (60 * ((r-g)/diff) + 240) % 360

    s = 0 if cmax == 0 else (diff / cmax) * 100
    v = cmax * 100
    return h, s, v

def get_color_name(hex_color):
    """Get color name based on HSV values"""
    h, s, v = hex_to_hsv(hex_color)
    logger.info(f"HSV values - H: {h:.2f}, S: {s:.2f}, V: {v:.2f}")

    # Color detection based on hue, saturation, and value
    if v < 20:
        return 'black'
    elif v > 95 and s < 5:
        return 'white'
    elif s < 10:
        return 'gray'
    
    # Hue-based color detection
    if 0 <= h <= 30:
        return 'red' if s > 80 else 'brown'
    elif 31 <= h <= 60:
        return 'orange'
    elif 61 <= h <= 120:
        return 'green'
    elif 121 <= h <= 180:
        return 'turquoise'
    elif 181 <= h <= 240:
        return 'blue'
    elif 241 <= h <= 300:
        return 'purple'
    elif 301 <= h <= 360:
        return 'pink' if v > 75 else 'magenta'
    
    return 'blue'  # fallback color

def generate_ai_image(company_name, sector, style, color):
    """
    Generates a logo using the pollinations.ai API.
    """
    color_name = get_color_name(color)
    logger.info(f"Color detected: {color_name} from hex: {color}")
    
    prompt = f"{company_name} logo, {sector} company, {style} style, {color_name} colored, professional logo design, high quality, minimal, clean"
    logger.info(f"Generated prompt: {prompt}")
    
    encoded_prompt = urllib.parse.quote(prompt)
    image_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?nologo=true"
    
    return image_url
