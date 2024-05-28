import json
import pandas as pd
import urllib.request

pd.set_option('display.max_columns', 14)
pd.set_option('display.width', 0)
pd.set_option('display.max_rows', 200)

##with open('championFull.json', encoding='utf-8') as f:
##    data = json.load(f)

def get_url_json(url):
    hdr = {'User-Agent':'Mozilla/5.0'}
    req = urllib.request.Request(url, headers=hdr)
    response = urllib.request.urlopen(req)
    data_json = json.loads(response.read()) 
##    print(data_json)
    return data_json

url_version = 'https://ddragon.leagueoflegends.com/realms/na.json'
version = get_url_json(url_version)['dd']
print(version)
url_champion = 'http://ddragon.leagueoflegends.com/cdn/' + version + '/data/en_US/championFull.json'
print(url_champion)
championFull = get_url_json(url_champion)
##print(championFull)

with open('championFull.json', 'w') as f:
    json_object = json.dumps(championFull, indent=4)
    json.dump(championFull, f)
    
