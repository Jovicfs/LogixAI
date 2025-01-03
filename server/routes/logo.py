from flask import request, jsonify, Blueprint
import logging
import re
import urllib.parse
from math import sqrt

logo_bp = Blueprint('logo', __name__)

# Configuração do logger
logger = logging.getLogger(__name__)

@logo_bp.route('/generate_logo', methods=['POST'])
def generate_logo():
    """
    Gera um logo com base nas informações fornecidas pelo usuário.
    """
    try:
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
        logger.info(f"Generated logo for {company_name}")
        return jsonify({'logo': image_url}), 200

    except Exception as e:
        logger.exception("Error generating logo")
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
