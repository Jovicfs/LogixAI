from flask import Blueprint, request, jsonify
from pytrends.request import TrendReq
import openai
import os

trends_bp = Blueprint('trends', __name__, url_prefix='/trending')

# Configure sua API key
openai.api_key = os.getenv("AZURE_OPENAI_API_KEY")
# Inicializa PyTrends
pytrends = TrendReq(hl='pt-BR', tz=360)

@trends_bp.route('/', methods=['GET'])
def get_trending_topics():
    keyword = request.args.get('keyword')
    if not keyword:
        return jsonify({'error': 'Missing keyword'}), 400

    try:
        pytrends.build_payload([keyword], timeframe='now 7-d')
        related_queries = pytrends.related_queries()
        top_related = related_queries[keyword]['top']

        if top_related is None:
            return jsonify({'message': 'No trending data found for the keyword.'}), 404

        trends = top_related.head(5).to_dict(orient='records')
        return jsonify({'keyword': keyword, 'trends': trends})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
