from flask import Blueprint, request, jsonify, current_app
import logging
from .mercado_pago_integration import create_preference
from data.db import (
    create_payment,
    update_payment_status,
    get_payment_by_reference,
    get_user_payment_status
)
from functools import wraps
import jwt

payment_bp = Blueprint('payment', __name__)
logger = logging.getLogger(__name__)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        try:
            token = token.split(' ')[1]
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            return f(data['user_id'], *args, **kwargs)
        except:
            return jsonify({'error': 'Invalid token'}), 401
    return decorated

@payment_bp.route('/pagar', methods=['POST'])
@token_required
def pagar(user_id):
    try:
        data = request.get_json()
        title = data.get('title', 'LogixAI Premium')
        description = data.get('description', 'Premium access to LogixAI')
        price = float(data.get('price', 5.00))

        # Create payment record in database
        payment_data = create_payment(user_id, price)
        if not payment_data:
            return jsonify({'error': 'Failed to create payment record'}), 500

        # Create MercadoPago preference
        preference_response = create_preference(
            title, 
            description, 
            price,
            payment_data['external_reference']
        )

        return jsonify({
            'preference_id': preference_response['id'],
            'init_point': preference_response['init_point'],
            'external_reference': payment_data['external_reference']
        }), 200

    except Exception as e:
        logger.error(f"Error creating payment: {e}")
        return jsonify({'error': 'Failed to create payment'}), 500

@payment_bp.route('/webhook', methods=['POST'])
def webhook():
    try:
        data = request.get_json()
        if data['type'] == 'payment':
            payment_info = data['data']
            external_reference = payment_info['external_reference']
            status = payment_info['status']
            
            success = update_payment_status(external_reference, status)
            if not success:
                logger.error(f"Failed to update payment status for ref: {external_reference}")
                return jsonify({'error': 'Payment update failed'}), 500

        return jsonify({'message': 'Webhook processed'}), 200
    except Exception as e:
        logger.error(f"Webhook error: {e}")
        return jsonify({'error': 'Webhook processing failed'}), 500

@payment_bp.route('/verify-status', methods=['GET'])
@token_required
def verify_status(user_id):
    try:
        has_valid_payment = get_user_payment_status(user_id)
        return jsonify({
            'has_valid_payment': has_valid_payment
        }), 200
    except Exception as e:
        logger.error(f"Error verifying payment status: {e}")
        return jsonify({'error': 'Failed to verify payment status'}), 500

@payment_bp.route('/payment-info/<external_reference>', methods=['GET'])
@token_required
def payment_info(user_id, external_reference):
    try:
        payment_data = get_payment_by_reference(external_reference)
        if not payment_data:
            return jsonify({'error': 'Payment not found'}), 404
        if payment_data['user_id'] != user_id:
            return jsonify({'error': 'Unauthorized'}), 403
        return jsonify(payment_data), 200
    except Exception as e:
        logger.error(f"Error fetching payment info: {e}")
        return jsonify({'error': 'Failed to fetch payment info'}), 500
