from flask import request, jsonify, Blueprint, Response
import logging
import urllib.parse
from data.db import save_video, get_user_videos, delete_video, verify_token
import requests

video_bp = Blueprint('video', __name__)
logger = logging.getLogger(__name__)

@video_bp.before_request
def before_request():
    if request.method == 'OPTIONS':
        return '', 204
    
    token = request.cookies.get('session')
    if not token and request.path not in ['/login', '/register']:
        return jsonify({'error': 'No authentication cookie'}), 401

    request.token = token

@video_bp.route('/generate_video', methods=['POST', 'OPTIONS'])
def generate_video():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5173')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response

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
        duration = data.get('duration')

        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400

        # Temporary video generation (replace with actual service)
        generated_video_url = f"https://example.com/video_{prompt.replace(' ', '_')}.mp4"
        
        # Save video data
        video_data = save_video(user.id, prompt, style, generated_video_url, duration)
        if not video_data:
            return jsonify({'error': 'Failed to save video'}), 500

        response = jsonify({
            'video_url': generated_video_url,
            'video_id': video_data['id']
        })
        return response, 200

    except Exception as e:
        logger.exception("Error generating video")
        return jsonify({'error': str(e)}), 500

@video_bp.route('/user_videos', methods=['GET'])
def get_videos():
    try:
        token = request.cookies.get('session')
        if not token:
            return jsonify({'error': 'No session cookie'}), 401
            
        user = verify_token(token)
        if not user:
            return jsonify({'error': 'Invalid session'}), 401

        videos = get_user_videos(user.id)
        
        return jsonify({
            'videos': [{
                'id': video.id,
                'prompt': video.prompt,
                'style': video.style,
                'video_url': video.video_url,
                'duration': video.duration,
                'created_at': video.created_at
            } for video in videos]
        }), 200

    except Exception as e:
        logger.exception("Error fetching videos")
        return jsonify({'error': str(e)}), 500

@video_bp.route('/delete_video/<int:video_id>', methods=['DELETE'])
def remove_video(video_id):
    try:
        token = request.cookies.get('session')
        if not token:
            return jsonify({'error': 'No session cookie'}), 401
            
        user = verify_token(token)
        if not user:
            return jsonify({'error': 'Invalid session'}), 401

        if delete_video(video_id, user.id):
            return jsonify({'message': 'Video deleted successfully'}), 200
        return jsonify({'error': 'Video not found'}), 404

    except Exception as e:
        logger.exception("Error deleting video")
        return jsonify({'error': 'Internal server error'}), 500

@video_bp.route('/download_video/<int:video_id>', methods=['GET'])
def download_video(video_id):
    try:
        token = request.cookies.get('session')
        if not token:
            return jsonify({'error': 'No session cookie'}), 401
            
        user = verify_token(token)
        if not user:
            return jsonify({'error': 'Invalid session'}), 401

        video = get_user_videos(user.id, video_id)
        if not video:
            return jsonify({'error': 'Video not found'}), 404

        # Handle video download (implementation depends on how videos are stored)
        response = requests.get(video.video_url, stream=True)
        if response.status_code != 200:
            return jsonify({'error': 'Failed to download video'}), 400

        return Response(
            response.iter_content(chunk_size=8192),
            content_type='video/mp4',
            headers={
                'Content-Disposition': f'attachment; filename=video_{video_id}.mp4'
            }
        )

    except Exception as e:
        logger.exception("Error downloading video")
        return jsonify({'error': 'Internal server error'}), 500