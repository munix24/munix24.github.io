import json
import pandas as pd
import urllib.request
##import requests

pd.set_option('display.max_columns', 14)
pd.set_option('display.width', 0)
pd.set_option('display.max_rows', 200)

with open('championFull.json', encoding='utf-8') as f:
    data = json.load(f)
champion_names = data['keys'].values()

url = 'https://raw.communitydragon.org/latest/game/data/characters/'

champions_detailed_data={}
spells=('Q', 'W', 'E', 'R')

# with open('championDetailed2.json', encoding='utf-8') as f:
#     data_json = json.load(f)

def JSON_key_contains_value_recursive(json_input, lookup_value):
    if isinstance(json_input, dict):
        for k, v in json_input.items():
            if JSON_key_contains_value_recursive(v, lookup_value):      #keeps iterating until it finds a match
                return True
    elif isinstance(json_input, list):
        for item in json_input:
            if JSON_key_contains_value_recursive(item, lookup_value):      #keeps iterating until it finds a match
                return True
    elif isinstance(json_input, str):
        if lookup_value.lower() in json_input.lower():
            return True
    return False

for champion in champion_names:
    champions_detailed_data[champion]={}
##    print(champions_detailed_data)
    champion_url = url + champion.lower() + '/' + champion.lower() + '.bin.json'
    print(champion_url)
    hdr = {'User-Agent':'Mozilla/5.0'}
    req = urllib.request.Request(champion_url, headers=hdr)
    response = urllib.request.urlopen(req)
    data_json = json.loads(response.read())
    
    for k, v  in data_json.items():
        if '{' in k:
            continue
        if JSON_key_contains_value_recursive(v, 'BaseDamage'): # or JSON_key_contains_value_recursive(v, 'Ratio'):
            champions_detailed_data[champion][k]=v
            
with open("championDetailed3.json", "w") as outfile:
    outfile.write(json.dumps(champions_detailed_data))

    

####print(champion_data)
####features=['summonerName', 'summonerLevel', 'individualPosition', 'championId', 'championName', 'teamEarlySurrendered', 'gameEndedInSurrender', 'win']
##
####print(champion_data['Aatrox'])
##table_data = [] # list of dicts
##for champion in champion_data.values():
##    champ={'name':champion['id']}
##    champ.update(champion['stats'])
##    table_data.append(champ)
##    
##df = pd.DataFrame(table_data)
##df.set_index('name', inplace=True)     # Set Champion Name as index
##
##def get_champ_stats(champ):
##    return df.loc[champ]
##
##def get_champs():
##    return data['data'].keys()
##
##if __name__ == "__main__":
##    ##print(table_data)
####    print(df)
##    print(df.loc["Aatrox"])
##    ##print(get_champ_stats('Aatrox'))

