# pgtg-serverless-demo
Prince George Technology Group - Serverless Computing Demo

This project uses the Open Data API from the City of Prince George, BC (https://data-cityofpg.opendata.arcgis.com/)
and the Google Maps API (https://developers.google.com/maps/documentation/javascript/tutorial) to render 
property boundaires given a property ID which can be option click right lcikcing any property from this map:
https://www.arcgis.com/home/webmap/viewer.html?panel=gallery&suggestField=true&url=https%3A%2F%2Fservices2.arcgis.com%2FCnkB6jCzAsyli34z%2Farcgis%2Frest%2Fservices%2FOpenData_Cadastre%2FFeatureServer%2F6

We use Serverless functions to wrap the calls to Open Data and Google Maps using both Amazon AWS and Google Cloud Functions.
