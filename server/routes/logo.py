from flask import request, jsonify, Blueprint
import logging
import re

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
        color = data.get('color')

        # Verificação de parâmetros obrigatórios
        if not all([company_name, sector, style, color]):
            logger.error("Missing required parameters for logo generation")
            return jsonify({'error': 'Missing required parameters'}), 400

        # Validação de cor para evitar falhas na URL
       # if not re.match(r'^[a-fA-F0-9]{6}$', color):
            logger.error("Invalid color format")
            return jsonify({'error': 'Invalid color format'}), 400

        # Simulação de geração de imagem com IA
        image_url = generate_ai_image(company_name, sector, style, color)
        logger.info(f"Generated logo for {company_name}")
        return jsonify({'logo': image_url}), 200

    except Exception as e:
        logger.exception("Error generating logo")
        return jsonify({'error': 'Internal server error'}), 500

def generate_ai_image(company_name, sector, style, color):
    """
    Simula a geração de um logo utilizando IA.
    Retorna uma URL de imagem de placeholder.
    """
    # Substitui caracteres perigosos no nome da empresa
    safe_company_name = re.sub(r'[^a-zA-Z0-9+]', '+', company_name)
    placeholder_url = f"https://placehold.co/200x100/{color}/white?text={safe_company_name}"
    return placeholder_url
