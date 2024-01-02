
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