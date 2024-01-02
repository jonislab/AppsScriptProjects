// To setup the project in your own Gmail Account

// STEP 1. Copy the entire script from github. Go to https://script.google.com. 
// STEP 2. Create a new project. Name it "Event Automation1". Delete the MyFunction and paste the entire script.
// STEP 3. Open Google drive, create a folder name "Event Folder" or whatever you want to call it. Copy the FileID.
// STEP 4. Replace the "const folderID='REPLACE ME'" in the script.
// STEP 5. Copy the background color bg.png from github to your folder. Open the file and copy the fileID.
// STEP 6. Replace the "const bgImageFileId='REPLACE ME'"
// STEP 7. Save the script, run the "createForm". 
// STEP 8. Open the Google drive, check the form and excel files are created. Check the trigger is created.
// STEP 9. Go back to Google drive, open the form, send an invitation.
// STEP 10. Check the execution logs.
// STEP 11. Check the form responses and open the excel file for entries.
// STEP 12. The guest should have received the response email with the route list and route map.

// Examples:
// const folderID='19dmQS7zTDiZZWU8DmJJWAaVosgFclQ0X'   
// const bgImageFileId='1mn78Y8ElY_ov79vjf7hwcIR-BZMyaUsC'

const folderID='REPLACE ME'   
const bgImageFileId='REPLACE ME'

// Define your event address here
const eventAddress='6380 Fallsview Blvd, Niagara Falls, ON L2G 3W6'

function onFormSubmit(e) {
  // Get the form response object
  var response = e.response;

  // Get the item responses as an array
  var itemResponsesAsArray = response.getItemResponses();

  // Loop through the item responses and get the values
  
  for (var i = 0; i < itemResponsesAsArray.length; i++) {
    var itemResponse = itemResponsesAsArray[i];
    var title = itemResponse.getItem().getTitle();
    var value = itemResponse.getResponse();
    Logger.log(i + ': ' + title + ': ' + value);
  }
  
  // We know the guest email is index 1 and address is 4 from the itemresponsesAsArray
  guestDictionary={
    'name':itemResponsesAsArray[0].getResponse(),
    'email':itemResponsesAsArray[1].getResponse(),
    'addr':itemResponsesAsArray[4].getResponse()
  }
  routeDictionary = createRouteMap(guestDictionary)

}

function createRouteMap(guestDictionary)
{
  var mapDictionary = {
    "image": '',
    "routeList":''
  };

  var folder = DriveApp.getFolderById(folderID);

  var originAddr=guestDictionary['addr'];
  var destAddr=eventAddress
  
  var directions = Maps.newDirectionFinder()
      .setMode(Maps.DirectionFinder.Mode.DRIVING)
      .setAvoid(Maps.DirectionFinder.Avoid.TOLLS)  
      .setOrigin(originAddr)
      .setDestination(destAddr)
      .getDirections();
  var route = directions.routes[0];
  var routeArray = directions.routes[0].legs[0].steps;
  //Logger.log(routeArray);
  // Loop through the steps and get the routeArray items
  
  var routeItems = '';
  for (var i = 0; i < routeArray.length; i++) {
    var step = routeArray[i];
    routeItems += (i + 1) + '. ' + step.html_instructions + '<br>';
  }
  //Logger.log(routeItems)


  // Set up marker styles.
  var markerSize = Maps.StaticMap.MarkerSize.MID;
  var markerColor = Maps.StaticMap.Color.RED

  var map = Maps.newStaticMap()
  .setMarkerStyle(markerSize, markerColor,"A")  
  .addMarker(originAddr)
  .addMarker(destAddr)

  .addPath(route.overview_polyline.points)
  .setSize(600, 400)
  .getBlob();
  
  // Convert the blob to a png format
  var pngBlob = map.getAs(MimeType.PNG);
  folder.createFile(pngBlob).setName(guestDictionary['name'].replace(" ","_") +"_routeToEvent");

  sendMail(guestDictionary,map,routeItems)

} 

function sendMail(guestDictionary,map,routeItems){
  //
  var bgImageId=bgImageFileId
  var bgFile = DriveApp.getFileById(bgImageId)
  var blob=bgFile.getBlob();

  // send the email with the map and route
  GmailApp.sendEmail(guestDictionary['email'], 'Your Event Registration!', '', {
    htmlBody: `<body style=\"background-image: url(cid:bg); min-height:600px;font-size:large; \"><div style=\"margin:20px;padding:10px; \"> <p>Hi, ${guestDictionary['name']}</p><p>Thanks for coming to our event! Here is the map and directions to the event:</p><div style=\"font-size:normal\"> ${routeItems} </div><br><br><p>Thank you and see you soon!</p><p>Harry & Megan</p></div></body>`,
    inlineImages: {
    'bg': blob
    },
    attachments: [map]
  });
}
