// Video Project #603 : Making a Professional HTML Email With Apps Script and Gmail
// Author             : Joni's Lab  (youtube.com@jonislab)
//
// This Apps Script video is about HTML formatting Gmail for making a semi-professional look for beginners. 
// Reference Docs:
// https://developers.google.com/apps-script/guides/html
// https://mailbakery.com/blog/how-email-html-coding-differs-from-web-html-coding/
// https://www.emailonacid.com/blog/article/email-development/why-should-i-set-my-table-role-as-presentation/




function myFunction() {
}

function sendMail(){
  var template="template1";
  var html = HtmlService.createHtmlOutputFromFile(template).getContent();  
  GmailApp.sendEmail("jjdmgroup@gmail.com", "Testing "+ template,'', {htmlBody: html});
}

function createDraftEmail(){
  var template="draft2"
  var temp = HtmlService.createTemplateFromFile(template)
  temp.Recipient = "Peter";
  temp.Message = "I would like to introduce my youtube channel at https://youtube.com/@jonislab. See yah! ";
  var html=temp.evaluate().getContent(); 
  GmailApp.createDraft("jjdmgroup@gmail.com","Subject for " + template,"",{htmlBody:html});
}


