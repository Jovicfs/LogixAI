import os
import sys
from flask import Blueprint, request, jsonify, send_file
from PIL import Image
import numpy as np
import logging
import urllib.request

# Configurar logging
logger = logging.getLogger(__name__)

# Adicionar Real-ESRGAN ao path
realesrgan_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'models', 'Real-ESRGAN')
sys.path.append(realesrgan_path)

try:
    from realesrgan import RealESRGANer
    from basicsr.archs.rrdbnet_arch import RRDBNet
except ImportError as e:
    logger.error(f"Error importing Real-ESRGAN: {e}")
    raise

enhance_bp = Blueprint('enhance', __name__, url_prefix='/enhance')
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def download_model():
    model_url = "https://github.com/xinntao/Real-ESRGAN/releases/download/v0.1.0/RealESRGAN_x4plus.pth"
    models_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'models')
    model_path = os.path.join(models_dir, 'RealESRGAN_x4plus.pth')
    
    if not os.path.exists(models_dir):
        os.makedirs(models_dir)
    
    if not os.path.exists(model_path):
        logger.info(f"Downloading model from {model_url}")
        urllib.request.urlretrieve(model_url, model_path)
        logger.info("Model downloaded successfully")
    
    return model_path

# Inicializar o modelo
try:
    model = RRDBNet(num_in_ch=3, num_out_ch=3, num_feat=64, num_block=23, num_grow_ch=32, scale=4)
    model_path = download_model()
    
    upsampler = RealESRGANer(
        scale=4,
        model_path=model_path,
        model=model,
        tile=0,
        tile_pad=10,
        pre_pad=0,
        half=False # Use half precision if available
    )
    logger.info("Real-ESRGAN model loaded successfully")
except Exception as e:
    logger.error(f"Error initializing model: {e}")
    raise

@enhance_bp.route('/upscale', methods=['POST'])
def upscale_image():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400

    file = request.files['image']
    input_path = os.path.join(UPLOAD_FOLDER, file.filename)
    output_path = os.path.join(UPLOAD_FOLDER, f"upscaled_{file.filename}")

    # Salvar imagem temporariamente
    file.save(input_path)

    # Processar imagem
    img = Image.open(input_path).convert("RGB")
    img_np = np.array(img)

    try:
        output, _ = upsampler.enhance(img_np, outscale=4)
        Image.fromarray(output).save(output_path)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    return send_file(output_path, mimetype='image/png')
