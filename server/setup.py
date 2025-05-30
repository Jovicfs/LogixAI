import os
import subprocess
import shutil
from pathlib import Path

def setup_realesrgan():
    # Define paths
    server_dir = Path(__file__).parent
    models_dir = server_dir / 'models'
    realesrgan_dir = models_dir / 'Real-ESRGAN'

    # Create directories if they don't exist
    models_dir.mkdir(exist_ok=True)
    
    # Clone Real-ESRGAN if not exists
    if not realesrgan_dir.exists():
        subprocess.run(['git', 'clone', 'https://github.com/xinntao/Real-ESRGAN.git', str(realesrgan_dir)])
    
    # Install dependencies
    subprocess.run(['pip', 'install', '-r', str(realesrgan_dir / 'requirements.txt')])
    subprocess.run(['pip', 'install', 'basicsr', 'facexlib', 'gfpgan'])
    
    # Download pre-trained model
    model_dir = realesrgan_dir / 'experiments' / 'pretrained_models'
    model_dir.mkdir(parents=True, exist_ok=True)
    model_path = model_dir / 'RealESRGAN_x4plus.pth'
    
    if not model_path.exists():
        print("Please download RealESRGAN_x4plus.pth from:")
        print("https://github.com/xinntao/Real-ESRGAN/releases/download/v0.1.0/RealESRGAN_x4plus.pth")
        print(f"And place it in: {model_path}")

if __name__ == '__main__':
    setup_realesrgan()
