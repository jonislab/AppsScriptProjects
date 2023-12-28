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



function tester()
{
  guestDictionary={
    'name':'<yourname>',
    'email':'<your email',
    'addr':"<youraddress>0"
  }
  var bgImageId=bgImageFileId
  var bgFile = DriveApp.getFileById(bgImageId)
  var blob=bgFile.getBlob();
  
  sendMail(guestDictionary,blob,'')
}



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
      .setOrigin(originAddr)
      .setDestination(destAddr)
      .setMode(Maps.DirectionFinder.Mode.DRIVING)
      .setAvoid(Maps.DirectionFinder.Avoid.TOLLS)
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
  var markerColor = Maps.StaticMap.Color.GREEN

  var map = Maps.newStaticMap()
  .addMarker(originAddr)
  .addMarker(destAddr)
  .setMarkerStyle(markerSize, markerColor,"A")
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

// ================ run this portion once only =====================//

function createForm() {
  // version 1.0
  var folder = DriveApp.getFolderById(folderID);
  // Create a new form and set the title
  var form = FormApp.create('Event Invitation');
  var file = DriveApp.getFileById(form.getId());
  file.moveTo(folder);

  formId = form.getId();

  form.setTitle('You are invited to our event! Please RSVP');
   
  // Add a text item for the name
  var nameItem = form.addTextItem();
  nameItem.setTitle('Name');

  // Add an email item for the email address
  var emailItem = form.addTextItem();
  emailItem.setTitle('Email');

  // Add a multiple choice item for the RSVP
  var rsvpItem = form.addMultipleChoiceItem();
  rsvpItem.setTitle('Will you attend our event?');
  rsvpItem.setChoices([
    rsvpItem.createChoice('Yes, I will be there'),
    rsvpItem.createChoice('No, I cannot make it'),
    rsvpItem.createChoice('Maybe, I will let you know later')
  ]);

  // Add a list item for the number of guests
  var guestItem = form.addListItem();
  guestItem.setTitle('How many guests are you bringing?');
  guestItem.setChoiceValues(['0', '1', '2', '3', '4', '5']);

  // Add a paragraph text item for the address
  var addressItem = form.addParagraphTextItem();
  addressItem.setTitle('What is your postal address?');

  // Add a checkbox item for the dietary preferences
  var dietItem = form.addCheckboxItem();
  dietItem.setTitle('Do you have any dietary preferences?');
  dietItem.setChoices([
    dietItem.createChoice('Vegetarian'),
    dietItem.createChoice('Vegan'),
    dietItem.createChoice('Gluten-free'),
    dietItem.createChoice('Nut-free'),
    dietItem.createChoice('Other')
  ]);

  // Add a paragraph text item for the additional comments
  var commentItem = form.addParagraphTextItem();
  commentItem.setTitle('Do you have any additional comments or requests?');
  
  // Create a new spreadsheet and get the ID
  var ss = SpreadsheetApp.create('Event Responses');
  ssFile=DriveApp.getFileById(ss.getId());
  ssFile.moveTo(folder);

  // Set the form destination to the spreadsheet
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  // Create a trigger that runs the function on form submit

  var form = FormApp.openById(formId);

  if (!isTrigger ('onFormSubmit')) { // Check if the trigger does not exist
    ScriptApp.newTrigger('onFormSubmit')
      .forForm(form)
      .onFormSubmit()
      .create();
  }
}

function isTrigger (funcName) {
  var r = false; // Initialize a variable to store the result
  if (funcName) { // Check if the function name is valid
    var allTriggers = ScriptApp.getProjectTriggers (); // Get all the project triggers
    for (let i = 0; i < allTriggers.length; i++) { // Loop through the triggers
      if (funcName == allTriggers [i].getHandlerFunction ()) { // Compare the function names
        r = true; // Set the result to true if there is a match
        break; // Exit the loop
      }
    }
  }
  return r; // Return the result
}
