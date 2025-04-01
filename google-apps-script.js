// This code should be deployed as a Google Apps Script Web App
// Follow these steps to set it up:
// 1. Go to https://script.google.com/
// 2. Create a new project
// 3. Delete any code in the editor and paste this code
// 4. Save the project with a name like "Quiz Lead Capture"
// 5. Click on Deploy > New deployment
// 6. Select "Web app" as the deployment type
// 7. Set "Who has access" to "Anyone" (this allows your form to submit data)
// 8. Click "Deploy" and copy the Web App URL
// 9. Replace the scriptURL in script.js with your Web App URL

function doPost(e) {
  try {
    // Get the form data
    let data

    // Handle both JSON and form data submissions
    if (e.postData.type === "application/json") {
      data = JSON.parse(e.postData.contents)
    } else {
      // For form data
      data = {}
      if (e.parameter) {
        Object.keys(e.parameter).forEach((key) => {
          data[key] = e.parameter[key]
        })
      }
    }

    // Open the Google Sheet (replace with your Sheet ID)
    const ss = SpreadsheetApp.openById("YOUR_SPREADSHEET_ID")
    const sheet = ss.getSheetByName("Responses") || ss.insertSheet("Responses")

    // Check if headers exist, if not add them
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Name", "Email", "Phone", "Company", "Quiz Result"])
    }

    // Append the data to the sheet
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.name || "",
      data.email || "",
      data.phone || "",
      data.company || "",
      data.result || "",
    ])

    // Return success response
    return ContentService.createTextOutput(
      JSON.stringify({
        result: "success",
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  } catch (error) {
    // Log the error for debugging
    console.error("Error in doPost:", error)

    // Return error response
    return ContentService.createTextOutput(
      JSON.stringify({
        result: "error",
        error: error.toString(),
      }),
    ).setMimeType(ContentService.MimeType.JSON)
  }
}

// This function handles GET requests (not used in this application)
function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({
      result: "GET requests not supported",
    }),
  ).setMimeType(ContentService.MimeType.JSON)
}

