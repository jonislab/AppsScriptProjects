const locationA='1305 Walnut St, Philadelphia, PA 19107, United States'
const locationB='6380 Fallsview Blvd, Niagara Falls, ON L2G 3W6'

function tester1(){
  testStaticMap()
  Logger.log ("Distance = " + distanceCalc(locationA,locationB) + " km")
}

function tester2(){
  route_result=testDirection()
  testStaticMap2(route_result["route"])
  Logger.log('Total Driving Distance: ' + route_result["distance"] + ' km');
}

function testStaticMap()
{
  const folderID='1iKxiSo0h356SwnylqDJtSWszSRPiUj-L' 
  var folder = DriveApp.getFolderById(folderID);

  var markerSize = Maps.StaticMap.MarkerSize.MID;
  var markerColor = Maps.StaticMap.Color.GREEN
  var map = Maps.newStaticMap()
  .setMarkerStyle(markerSize, markerColor,"A") 
  .addMarker(locationA)
  .addMarker(locationB)
  .beginPath()
  .addAddress(locationA)
  .addAddress(locationB)
  .endPath()
  .setSize(600, 400)
  .getBlob();
  
  // Convert the blob to a png format
  var pngBlob = map.getAs(MimeType.PNG);
  folder.createFile(pngBlob)
}

function testStaticMap2( route){
  const folderID='1iKxiSo0h356SwnylqDJtSWszSRPiUj-L' 
  var folder = DriveApp.getFolderById(folderID);

  var markerSize = Maps.StaticMap.MarkerSize.MID;
  var markerColor = Maps.StaticMap.Color.GREEN
  var map = Maps.newStaticMap()
  .setMarkerStyle(markerSize, markerColor,"A")
  .addPath(route.overview_polyline.points) 
  .addMarker(locationA)
  .addMarker(locationB)
  .setSize(600, 400)
  .getBlob();
  
  // Convert the blob to a png format
  var pngBlob = map.getAs(MimeType.PNG);
  folder.createFile(pngBlob)
}

function testDirection() {
  var route_result={}
  var directions = Maps.newDirectionFinder()
    .setOrigin(locationA)
    .setDestination(locationB)
    .setMode(Maps.DirectionFinder.Mode.DRIVING)
    .setAvoid(Maps.DirectionFinder.Avoid.TOLLS)
    .getDirections();

  if (directions["status"] == "OK") {
    // consider first toure [0] as the best route
    var route = directions.routes[0];
    route_result["route"]=route
    var routeArray = route.legs[0].steps;
    // Calculate total distance
    var miles = route.legs[0].distance.text;
    var km = parseFloat(miles) * 1.60934;
    Logger.log('Total Driving Distance: ' + miles + ' (' + km + ' km)');
    route_result["distance"]=km
    // Loop through the steps and get the routeArray items
    var routeItems = '';
    for (var i = 0; i < routeArray.length; i++) {
      var step = routeArray[i];
      routeItems += (i + 1) + '. ' + step.html_instructions + '\n';  // this wil measure distance in miles
    }
    Logger.log(routeItems);
  } else {
    Logger.log('Error: Unable to retrieve directions.');
  }
  return route_result
}


// Calculate distance between two points in KM
function distanceCalc(src,dest) {
  // Get the coordinates (latitude and longitude) for the origin and destination
  var originResult = Maps.newGeocoder().geocode(src);
  var destResult = Maps.newGeocoder().geocode(dest);

  // Check if the geocoding was successful for both addresses
  if (originResult["status"]=="OK" && destResult["status"]=="OK") {
    var originCoords = originResult["results"][0].geometry.location;
    var destCoords = destResult["results"][0].geometry.location;

    // Calculate the straight-line distance using the Haversine formula
    var distance = haversineDistance(originCoords.lat, originCoords.lng, destCoords.lat, destCoords.lng);
  } else {
    // something is wrong, we will return zero
    distance=0;
  }
  return distance
}

// Haversine formula to calculate distance between two points on a sphere
// https://en.wikipedia.org/wiki/Haversine_formula

function haversineDistance(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the Earth in kilometers
  var dLat = (lat2 - lat1) * Math.PI / 180;
  var dLon = (lon2 - lon1) * Math.PI / 180;
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var distance = R * c; // Distance in kilometers
  return distance;
}
