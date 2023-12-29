// Video #602 : Apps Script Gmail Automation For Beginners
// Author     : Joni's Lab  (@jonislab)


// TOPICS:
// 1. Introduction to GmailApp
// 2. Understanding Gmail threads and messages
// 3. Iterating through threads
// 4. Reading File Attachments and saving to GDrive
// 5. Setting up a trigger to process emails
// 6. auto-reply to email


function myFunction() {
  
}

function readMail1(){
  var threads = GmailApp.getInboxThreads(0,2);
  // Loop for each thread (emails displayed in inbox)
  threads.forEach(function(thread){
    var messages=thread.getMessages();
    Logger.log("sender:" + messages[0].getFrom()+  " | subject:"  + messages[0].getSubject() + " | id =" + messages[0].getId());
  });
}


function readMail1_1(){
  // Log the subject lines of up to the first 50 emails in your Inbox
  var noOfEmailsToRead=2
  var threads = GmailApp.getInboxThreads(0, noOfEmailsToRead);
  // Loop for each thread (emails displayed in inbox)
  threads.forEach(function(thread){
    var messages=thread.getMessages();
    for (var j = 0; j < messages.length; j++) {
      Logger.log("[j=" + j + "]" + "sender:" + messages[j].getFrom()+  " | subject:"  + messages[j].getSubject() + " | id =" + messages[j].getId());
    }
  });
}

function readMail2(){
  // Get the list of emails
  var noOfEmailsToRead=1
  var threads = GmailApp.getInboxThreads(0, noOfEmailsToRead);
  var messages = GmailApp.getMessagesForThreads(threads);
  for (var i = 0 ; i < messages.length; i++) {
    // if email has multiple replies, then messages[i].length is greater than 1
    for (var j = 0; j < messages[i].length; j++) {
      Logger.log("[i=" + i + " j=" + j + "]" + "sender:" + messages[i][j].getFrom()+  " | subject:"  + messages[i][j].getSubject());
    }
  }
}

function readMail2_2(){
  // Get the list of emails
  var lastEmailCount=1
  var threads = GmailApp.getInboxThreads(0, lastEmailCount);
  var messages = GmailApp.getMessagesForThreads(threads);
  for (var i = 0 ; i < messages.length; i++) {
    // if email has multiple replies, then messages[i].length is greater than 1
    for (var j = 0; j < messages[i].length; j++) {
      Logger.log("[i=" + i + " j=" + j + "]" + "sender:" + messages[i][j].getFrom()+  " | subject:"  + messages[i][j].getSubject());
      Logger.log(messages[i][j].getId() + " | " + messages[i][j].getHeader("Message-ID"))
    }
  }
}

function readMail3_attachment(){
  // Get the list of emails
  var noOfEmailsToRead=1
  var threads = GmailApp.getInboxThreads(0, noOfEmailsToRead);
  var messages = GmailApp.getMessagesForThreads(threads);
  for (var i = 0 ; i < messages.length; i++) {
    // if email has multiple replies, then messages[i].length is greater than 1
    for (var j = 0; j < messages[i].length; j++) {
      Logger.log("[i=" + i + " j=" + j + "]" + "sender:" + messages[i][j].getFrom()+  " | subject:"  + messages[i][j].getSubject());
      var attachments = messages[i][j].getAttachments();
      for (var k = 0; k < attachments.length; k++) {
        Logger.log('Message "%s" contains the attachment "%s" (%s bytes)',
            messages[i][j].getSubject(), attachments[k].getName(), attachments[k].getSize());
            saveFileToFolder(attachments[k]);
       }
    }
  }
}

function readMail4_attachment(){
  // Get the list of emails
  var noOfEmailsToRead=1
  var threads = GmailApp.getInboxThreads(0, noOfEmailsToRead);
  var messages = GmailApp.getMessagesForThreads(threads);
  for (var i = 0 ; i < messages.length; i++) {
    // if email has multiple replies, then messages[i].length is greater than 1
    for (var j = 0; j < messages[i].length; j++) {
      Logger.log("[i=" + i + " j=" + j + "]" + "sender:" + messages[i][j].getFrom()+  " | subject:"  + messages[i][j].getSubject());
      var attachments = messages[i][j].getAttachments();
      for (var k = 0; k < attachments.length; k++) {
        Logger.log('Message "%s" contains the attachment "%s" (%s bytes)',
            messages[i][j].getSubject(), attachments[k].getName(), attachments[k].getSize());
        
        fileName = "myfile_" + getFormattedDate() + "." + attachments[k].getName().split(".")[1];
        saveFileToFolder(attachments[k],fileName);
       }
    }
  }
}

function readMail5_attachment(){
  // Get the list of emails
  var noOfEmailsToRead=1
  var threads = GmailApp.getInboxThreads(0, noOfEmailsToRead);
  var messages = GmailApp.getMessagesForThreads(threads);
  for (var i = 0 ; i < messages.length; i++) {
    // if email has multiple replies, then messages[i].length is greater than 1
    for (var j = 0; j < messages[i].length; j++) {
      subject= messages[i][j].getSubject();
      if (subject.indexOf("Report") > -1){
        var attachments = messages[i][j].getAttachments();
        for (var k = 0; k < attachments.length; k++) {
          fileName = "myfile_" + getFormattedDate() + "." + attachments[k].getName().split(".")[1];
          saveFileToFolder(attachments[k],fileName);
          Logger.log("done saving " + fileName);
        }
      }
      else{
        Logger.log("Nothing to save ");
      }
    }
  }
}

function saveFileToFolder(attachment){
  const folderId='1z4kWIZ8Qc0NAZhfQ1K-fiHTk3rwZO3Hf';
  var folder = DriveApp.getFolderById(folderId);
  var file = folder.createFile(attachment);
}

function saveFileToFolder(attachment, fileName){
  const folderId='1z4kWIZ8Qc0NAZhfQ1K-fiHTk3rwZO3Hf';
  var folder = DriveApp.getFolderById(folderId);
  var file = folder.createFile(attachment);
  file.setName(fileName);
}

function getFormattedDate(){
   var date=Utilities.formatDate(new Date(), "GMT-4", "YYYYMMdd")  
   return date.toString();
}


function sendMail6_attachment(){
  // Get the list of emails
  var noOfEmailsToRead=1
  var threads = GmailApp.getInboxThreads(0, noOfEmailsToRead);
  var messages = GmailApp.getMessagesForThreads(threads);
  for (var i = 0 ; i < messages.length; i++) {
    // if email has multiple replies, then messages[i].length is greater than 1
    for (var j = 0; j < messages[i].length; j++) {
      subject= messages[i][j].getSubject();
      if (subject.indexOf("Report") > -1){
        var attachments = messages[i][j].getAttachments();
        for (var k = 0; k < attachments.length; k++) {
          fileName = "myfile_" + getFormattedDate() + "." + attachments[k].getName().split(".")[1];
          saveFileToFolder(attachments[k],fileName);
          Logger.log("done saving " + fileName);
          messages[i][j].reply("I got the report. Thank you!");
        }
      }
      else{
        Logger.log("Nothing to save ");
      }
    }
  }
}