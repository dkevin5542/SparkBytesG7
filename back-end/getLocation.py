import requests
#this method gets the current location of the user
def get_current_location():
    
    #payload = {'key': '', 'ip': requests.get('https://api.ipify.org').text, 'format': 'json'}
    # need to add our key 
    
    api_result = requests.get('https://api.ip2location.io/', params=payload)
    json_result = api_result.json()
    city = json_result['city_name']
    latitude = json_result['latitude']
    longitude = json_result['longitude']
    return latitude, longitude, city

print(get_current_location())