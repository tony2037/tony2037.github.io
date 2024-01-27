import requests
import json


# This is dangerous, I should not put my API key here
# It's just more me slacking
API_KEY = 'REDACTED_FINNHUB_KEY'

def api_get_wrapper(url: str, method=None):
    res = requests.get(url)
    if res.status_code != 200:
        return None
    content = res.content
    if method:
        content = method(content)
    return content

def company_profile_2(symbol: str):
    api = f'https://finnhub.io/api/v1/stock/profile2?symbol={symbol}&token={API_KEY}'
    res = api_get_wrapper(api, json.loads)
    return res

def company_quote(symbol: str):
    api = f'https://finnhub.io/api/v1/quote?symbol={symbol}&token={API_KEY}'
    res = api_get_wrapper(api, json.loads)
    return res

def company_recommendation_trends(symbol: str):
    api = f'https://finnhub.io/api/v1/stock/recommendation?symbol={symbol}&token={API_KEY}'
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
