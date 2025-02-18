
var TO_ADDRESS = "dfgcompanysrl@gmail.com";


function formatMailBody(obj) { // function to spit out all the keys/values from the form in HTML
  var result = "";
  for (var key in obj) { // loop over the object passed to the function
    result += "<h5 style='text-transform: capitalize; margin-bottom: 0'>" + key + "</h5><div>" + obj[key] + "</div>";
    // for every key, concatenate an `<h4 />`/`<div />` pairing of the key name and its value, 
    // and append it to the `result` string created at the start.
  }
  return result; // once the looping is done, `result` will be one long string to put in the email body
}

function doPost(e) {
  //{"parameter":{},"contextPath":"","contentLength":89,"queryString":"","parameters":{},"postData":{"type":"text/plain","length":89,"contents":"{\"name\":\"Nomee\",\"email\":\"emaill\",\"phone\":\"+391234\",\"place\":\"wat\",\"message\":\"messageeee!\"}","name":"postData"}}
  try {
    Logger.log(e); // the Google Script version of console.log see: Class Logger
    var parsedData = JSON.parse(e.postData.contents);
    //recordDataToSpreadsheet(e);

    MailApp.sendEmail({
      to: TO_ADDRESS,
      subject: "Contact form submitted",
      //replyTo: String(mailData.email), // This is optional and reliant on your form actually collecting a field named `email`
      htmlBody: formatMailBody(parsedData)
    });

    ContentService       //return json success results
    createTextOutput(
      JSON.stringify({
        "result": "success",
        "data": JSON.stringify(e.postData.contents)
      }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) { // if error return this
    Logger.log(error);
    return;

  }

}

/**
 * record_data inserts the data received from the html form submission
 * e is the data received from the POST
 */
function recordDataToSpreadsheet(e) {
  Logger.log(JSON.stringify(e)); // log the POST data in case we need to debug it
  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getSheetByName('responses'); // select the responses sheet
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var nextRow = sheet.getLastRow() + 1; // get next row
    var row = [new Date()]; // first element in the row should always be a timestamp
    // loop through the header columns
    for (var i = 1; i < headers.length; i++) { // start at 1 to avoid Timestamp column
      if (headers[i].length > 0) {
        row.push(e.parameter[headers[i]]); // add data to row
      }
    }
    // more efficient to set values as [][] array than individually
    sheet.getRange(nextRow, 1, 1, row.length).setValues([row]);
  }
  catch (error) {
    Logger.log(e);
  }
  finally {
    return;
  }


}