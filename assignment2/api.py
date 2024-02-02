import requests
import json
from datetime import date
from dateutil.relativedelta import relativedelta


# This is dangerous, I should not put my API key here
# It's just more me slacking
FINNHUB_API_KEY = 'REDACTED_FINNHUB_KEY'
POLYGON_API_KEY = 'REDACTED_POLYGON_KEY'

def api_get_wrapper(url: str, method=None):
    res = requests.get(url)
    if res.status_code != 200:
        return None
    content = res.content
    if method:
        content = method(content)
    return content

def company_profile_2(symbol: str):
    api = f'https://finnhub.io/api/v1/stock/profile2?symbol={symbol}&token={FINNHUB_API_KEY}'
    res = api_get_wrapper(api, json.loads)
    return res

def company_quote(symbol: str):
    api = f'https://finnhub.io/api/v1/quote?symbol={symbol}&token={FINNHUB_API_KEY}'
    res = api_get_wrapper(api, json.loads)
    return res

def company_recommendation_trends(symbol: str):
    api = f'https://finnhub.io/api/v1/stock/recommendation?symbol={symbol}&token={FINNHUB_API_KEY}'
    res = api_get_wrapper(api, json.loads)
    return res

def finnhub_wrapper(symbol: str):
    res = {}
    
    target_keys = ('logo', 'name', 'ticker', 'exchange', 'ipo', 'finnhubIndustry')
    profile = company_profile_2(symbol)
    if not profile:
        return {}
    for key in target_keys:
        res[key] = profile[key]

    target_keys = ('t', 'pc', 'o', 'h', 'l', 'd', 'dp')
    quote = company_quote(symbol)
    if not quote:
        return {}
    for key in target_keys:
        res[key] = quote[key]

    trends = company_recommendation_trends(symbol)
    if not trends or len(trends) == 0:
        return {}
    res['recommendation_trends'] = trends[-1]

    return res

def aggr_service(symbol: str):
    symbol = symbol.upper()
    TODAY = date.today()
    FROM = TODAY - relativedelta(months=6, days=1)
    TO = TODAY
    FROM = FROM.strftime('%Y-%m-%d')
    TO = TO.strftime('%Y-%m-%d')
    print(f'{FROM} to {TO}')
    api = f'https://api.polygon.io/v2/aggs/ticker/{symbol}/range/1/day/{FROM}/{TO}?adjusted=true&sort=asc&apiKey={POLYGON_API_KEY}'
    res = api_get_wrapper(api, json.loads)
    return res

def polygon_wrapper(symbol: str):
    aggregate_data = aggr_service(symbol)
    return aggregate_data