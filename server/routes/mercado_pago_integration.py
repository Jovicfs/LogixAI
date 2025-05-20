import os
from dotenv import load_dotenv
import mercadopago
import logging

load_dotenv()
logger = logging.getLogger(__name__)

# Get the access token and validate it
access_token = os.getenv('MERCADOPAGO_ACCESS_TOKEN')
if not access_token:
    logger.error("MERCADOPAGO_ACCESS_TOKEN not found in environment variables")
    raise ValueError("MERCADOPAGO_ACCESS_TOKEN is required")

try:
    sdk = mercadopago.SDK(str(access_token))
except Exception as e:
    logger.error(f"Failed to initialize MercadoPago SDK: {e}")
    raise

def create_preference(title, description, price, external_reference):
    try:
        preference_data = {
            "items": [
                {
                    "title": title,
                    "description": description,
                    "quantity": 1,
                    "currency_id": "BRL",
                    "unit_price": price
                }
            ],
            "external_reference": external_reference,
            "back_urls": {
                "success": "http://localhost:3000/payment/success",
                "failure": "http://localhost:3000/payment/failure",
                "pending": "http://localhost:3000/payment/pending"
            },
            "notification_url": "http://localhost:5000/webhook",
            "auto_return": "approved"
        }

        preference_response = sdk.preference().create(preference_data)
        return preference_response["response"]
    except Exception as e:
        logger.error(f"MercadoPago preference creation error: {e}")
        raise