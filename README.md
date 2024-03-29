# pgtg-serverless-demo
Prince George Technology Group - Serverless Computing Demo  
(original event: https://princegeorge.tech/events/september-18-2019/)  

This project uses the Open Data API from the City of Prince George, BC:  
https://data-cityofpg.opendata.arcgis.com/

The Google Maps API:  
https://developers.google.com/maps/documentation/javascript/tutorial

is used to render property boundaries given a property ID (PID) which can 
be found by right clicking any property from this city map (or found on your property tax form):  
https://www.arcgis.com/home/webmap/viewer.html?panel=gallery&suggestField=true&url=https%3A%2F%2Fservices2.arcgis.com%2FCnkB6jCzAsyli34z%2Farcgis%2Frest%2Fservices%2FOpenData_Cadastre%2FFeatureServer%2F6

The presentation slides-show can be viewed here:  
https://docs.google.com/presentation/d/1xvh_fnSFLijko8yCAXSGYVdzRuzNdzKijVSAj1O3rZU/edit?usp=sharing

We use Serverless functions to wrap the calls to Open Data and Google Maps using both Amazon AWS and Google Cloud Functions.  

The Google Cloud function is defined as a node.js 10 function:  

```
index.js:
exports.helloWorld = function helloWorld(req, res) {
  	const request = require('request');
  	const mapAPIKey = process.env.MAP_API_KEY
    request(`https://maps.googleapis.com/maps/api/js?key=${mapAPIKey}&callback=initMap`).pipe(res)
};
```

The Google map MAP_API_KEY is defined as an environment variable in the function details console. The dependencies are defined in:  

```
package.json:
{
  "name": "proxy-google-map-http",
  "version": "0.0.1",
  "dependencies": {
    "request": "^2.81.0"
  }
}
```

The Amazon Lambda function is defined as a Python 3.7 function:  

I found it more challenging to deploy a cloud function in AWS due to the need to hook up the API Gateway to the cloud function as a seperate step. Save yourself time and follow along below via Part 1 and 2:  
Part 1:  
https://www.coursera.org/lecture/aws-fundamentals-building-serverless-applications/aws-lambda-demo-part-1-MVw7u  
Part 2:  
https://www.coursera.org/lecture/aws-fundamentals-building-serverless-applications/aws-lambda-demo-part-2-we2Bw  

```
lambda_function.py:
import json
from botocore.vendored import requests

def lambda_handler(event, context):
    print(event)
    pid = event['queryStringParameters']['pid']
    url = "https://services2.arcgis.com/CnkB6jCzAsyli34z/arcgis/rest/services/OpenData_Cadastre/FeatureServer/6/query?where=PID like '{}'&outFields=&outSR=4326&f=json".format(pid)
    print('URL = {}'.format(url))
    r = requests.get(url)
    data = r.json()
    print('Result = {}'.format(data))
    
    if 'features' not in data:
        raise ValueError("Invalid response #1 for PID!")
    feat = data['features']
    if len(feat) == 0:
        raise ValueError("Invalid response #2 for PID!")
    if 'geometry' not in feat[0]:
        raise ValueError("Invalid response #3 for PID!")
    geo = feat[0]['geometry']
    if 'rings' not in geo:
        raise ValueError("Invalid response #4 for PID!")
    rings = geo['rings']
    if len(rings) == 0:
        raise ValueError("Invalid response #5 for PID!")
    rings = rings[0];
    
    propertyCoords = []
    for ring in rings:
      # console.log('lat: ' + ring[0] + ', long: ' + ring[1]);
      propertyCoords.append({
        'lat': ring[1],
        'lng': ring[0]
      })

    return {
        'statusCode': 200,
        'headers':{'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Credentials': True},
        'body':  json.dumps(propertyCoords)
    }
```

Notice above that i added a special header to avoid CORS errors since my application is stored on mutliple clouds this would trigger a security error without that header. For more info read the following link:  
https://forum.serverless.com/t/has-been-blocked-by-cors-policy-no-access-control-allow-origin-header-is-present-on-the-requested-resource/8974

The static content (html, javascript and css) was pushed into Google Cloud Storage following these steps:  
https://cloud.google.com/appengine/docs/flexible/go/serving-static-files
