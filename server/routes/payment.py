from flask import Blueprint, request, jsonify
from data.db import verify_token, create_payment, update_payment_status, get_payment_by_reference
import stripe
import os
from dotenv import load_dotenv

load_dotenv()
payment_bp = Blueprint('payment', __name__, url_prefix='/payment')

stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

@payment_bp.route('/create-checkout-session', methods=['POST'])
def create_checkout_session():
    try:
        token = request.cookies.get('session')
        if not token:
            return jsonify({'error': 'No authentication cookie'}), 401
            
        user = verify_token(token)
        if not user:
            return jsonify({'error': 'Invalid session'}), 401

        # Create Stripe checkout session with proper price ID and URLs
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price': os.getenv('STRIPE_PRICE_ID'),
                'quantity': 1,
            }],
            mode='payment',
            success_url='http://localhost:5173/payment/success',
            cancel_url='http://localhost:5173/payment/cancel',
            metadata={'user_id': str(user.id)}
        )

        # Create payment record with proper error handling
        try:
            payment = create_payment(
                user_id=user.id,
                amount=float(checkout_session.amount_total) / 100,
                external_reference=checkout_session.id
            )
            if not payment:
                raise Exception("Failed to create payment record")
        except Exception as e:
            logger.error(f"Database error: {str(e)}")
            return jsonify({'error': 'Failed to create payment record'}), 500

        return jsonify({
            'sessionId': checkout_session.id
        })

    except stripe.error.StripeError as e:
        logger.error(f"Stripe error: {str(e)}")
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"Server error: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

@payment_bp.route('/webhook', methods=['POST'])
def webhook():
    payload = request.get_data()
    sig_header = request.headers.get('Stripe-Signature')

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, os.getenv('STRIPE_WEBHOOK_SECRET')
        )

        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']
            
            # Update payment status in database
            update_payment_status(
                external_reference=session.id,
                status='approved'
            )

        return jsonify({'status': 'success'})

    except Exception as e:
        return jsonify({'error': str(e)}), 400
