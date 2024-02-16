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
        print(f'[{res.status_code}]: {url}')
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
    if not res or len(res) == 0:
        print('company_recommendation_trends fail')
        return {}
    return res[-1]

def company_news(symbol: str):
    TODAY = date.today()
    FROM = TODAY - relativedelta(days=30)
    FROM = FROM.strftime('%Y-%m-%d')
    TODAY = TODAY.strftime('%Y-%m-%d')
    valid_key = lambda x, k : ((k in x) and (len(x[k]) > 0))
    keys = ('image', 'headline', 'url')
    def valid(data):
        ans = True
        for key in keys:
            ans = ans and valid_key(data, key)
        return ans
    api = f'https://finnhub.io/api/v1/company-news?symbol={symbol}&from={FROM}&to={TODAY}&token={FINNHUB_API_KEY}'
    res = api_get_wrapper(api, json.loads)

    top5 = []
    for news in res:
        if not valid(news):
            continue
        top5.append(news)
        if len(top5) >= 5:
            break

    return top5

def finnhub_wrapper(symbol: str):
    res = {}
    
    target_keys = ('logo', 'name', 'ticker', 'exchange', 'ipo', 'finnhubIndustry')
    profile = company_profile_2(symbol)
    if not profile:
        print('company_profile_2 fail')
        return {}
    for key in target_keys:
        res[key] = profile[key]

    target_keys = ('t', 'pc', 'o', 'h', 'l', 'd', 'dp')
    quote = company_quote(symbol)
    if not quote:
        print('company_quote fail')
        return {}
    for key in target_keys:
        res[key] = quote[key]

    trends = company_recommendation_trends(symbol)
    res['recommendation_trends'] = trends

    news = company_news(symbol)
    if not news or len(news) == 0:
        print('company_news fail')
        return {}
    res['company_news'] = news

    return res

def aggr_service(symbol: str):
    symbol = symbol.upper()
    TODAY = date.today()
    FROM = TODAY - relativedelta(months=6, days=1)
    TO = TODAY
    FROM = FROM.strftime('%Y-%m-%d')
    TO = TO.strftime('%Y-%m-%d')
    api = f'https://api.polygon.io/v2/aggs/ticker/{symbol}/range/1/day/{FROM}/{TO}?adjusted=true&sort=asc&apiKey={POLYGON_API_KEY}'
    res = api_get_wrapper(api, json.loads)
    return res

def polygon_wrapper(symbol: str):
    aggregate_data = aggr_service(symbol)
    if not len(aggregate_data) > 0:
        return {}
    return aggregate_data