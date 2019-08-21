// This example creates a simple property boundary for a given property id in Prince George, BC
var map = null;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 18,
      // UNBC is the starting point
      center: {lat: 53.8940453, lng: -122.8131766},
      mapTypeId: 'satellite'
    });
}

function pgGetPropertyBounds() {
    // debugger;
    var pid = document.getElementById('pid');
    // Validate the property id is not blank
    if(pid.value == '') {
        var status = document.getElementById('status');
        status.innerHTML = 'Invalid Property Id!';
        pid.focus();
        return;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        var status = document.getElementById('status');
        status.innerHTML = 'Looking up property information for PID:'+pid.value + ' server status: ' + this.status;
        if (this.readyState == 4 && this.status == 200) {
            // debugger;
            var propertyBounds = [];
            var data = JSON.parse(this.response);
             
            propertyBounds = data;
            // Construct the property lines
            var propertyPolyBounds = new google.maps.Polygon({
              paths: propertyBounds,
              strokeColor: '#FF0000',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#FF0000',
              fillOpacity: 0.35
            });
            propertyPolyBounds.setMap(map);
            map.setCenter(propertyBounds[0]);
         }
    };
    // xhttp.open("POST", "https://services2.arcgis.com/CnkB6jCzAsyli34z/arcgis/rest/services/OpenData_Cadastre/FeatureServer/6/query?where=PID like '"+pid.value+"'&outFields=&outSR=4326&f=json", true);
    xhttp.open("GET", "https://2huac0dabc.execute-api.us-east-2.amazonaws.com/prod?pid="+pid.value);
    xhttp.send();
    var status = document.getElementById('status');
    status.innerHTML = 'Looking up property information for PID:'+pid.value;
}
