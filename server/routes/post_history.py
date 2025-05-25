from flask import Blueprint, request, jsonify
from data.db import verify_token, get_posts_history, create_post, update_post, delete_post
import logging

post_history_bp = Blueprint('post_history', __name__, url_prefix='/post')
logger = logging.getLogger(__name__)

@post_history_bp.route('/history', methods=['GET'])
def get_history():
    try:
        token = request.cookies.get('session')
        if not token:
            return jsonify({'error': 'No authentication cookie'}), 401

        user = verify_token(token)
        if not user:
            return jsonify({'error': 'Invalid session'}), 401

        posts = get_posts_history(user.id)
        if not posts:
            return jsonify({'posts': []}), 200

        return jsonify({
            'posts': [{
                'id': post.id,
                'topic': post.topic,
                'content': post.content,
                'format': post.format,
                'tone': post.tone,
                'word_count': post.word_count,
                'created_at': post.created_at.isoformat() if hasattr(post.created_at, 'isoformat') else str(post.created_at)
            } for post in posts]
        }), 200

    except Exception as e:
        logger.exception("Error fetching post history")
        return jsonify({'error': str(e), 'posts': []}), 500

@post_history_bp.route('/save', methods=['POST'])
def save_post():
    try:
        token = request.cookies.get('session')
        if not token:
            return jsonify({'error': 'No authentication cookie'}), 401

        user = verify_token(token)
        if not user:
            return jsonify({'error': 'Invalid session'}), 401

        data = request.json
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        topic = data.get('topic')
        content = data.get('content')
        format_ = data.get('format', '')
        tone = data.get('tone', '')
        word_count = data.get('wordCount') or data.get('word_count') or 0

        try:
            word_count = int(word_count)
        except Exception:
            word_count = 0

        if not topic or not content:
            return jsonify({'error': 'Missing required fields'}), 400

        post = create_post(
            user_id=user.id,
            topic=topic,
            content=content,
            format=format_,
            tone=tone,
            word_count=word_count
        )

        if not post:
            return jsonify({'error': 'Failed to save post'}), 500

        return jsonify({
            'message': 'Post saved successfully',
            'post': {
                'id': post.id,
                'topic': post.topic,
                'content': post.content
            }
        }), 201

    except Exception as e:
        logger.exception("Error saving post")
        return jsonify({'error': str(e)}), 500

@post_history_bp.route('/update/<int:post_id>', methods=['PUT'])
def update_existing_post(post_id):
    try:
        token = request.cookies.get('session')
        if not token:
            return jsonify({'error': 'No authentication cookie'}), 401

        user = verify_token(token)
        if not user:
            return jsonify({'error': 'Invalid session'}), 401

        data = request.json
        topic = data.get('topic')
        content = data.get('content')
        if not topic or not content:
            return jsonify({'error': 'Missing required fields'}), 400

        success = update_post(
            post_id=post_id,
            user_id=user.id,
            topic=topic,
            content=content
        )

        if not success:
            return jsonify({'error': 'Failed to update post'}), 500

        return jsonify({'message': 'Post updated successfully'}), 200

    except Exception as e:
        logger.exception("Error updating post")
        return jsonify({'error': str(e)}), 500

@post_history_bp.route('/delete/<int:post_id>', methods=['DELETE'])
def delete_existing_post(post_id):
    try:
        token = request.cookies.get('session')
        if not token:
            return jsonify({'error': 'No authentication cookie'}), 401

        user = verify_token(token)
        if not user:
            return jsonify({'error': 'Invalid session'}), 401

        success = delete_post(post_id, user.id)
        if not success:
            return jsonify({'error': 'Failed to delete post'}), 500

        return jsonify({'message': 'Post deleted successfully'}), 200

    except Exception as e:
        logger.exception("Error deleting post")
        return jsonify({'error': str(e)}), 500
