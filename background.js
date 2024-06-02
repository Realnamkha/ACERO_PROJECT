let value = "";
let linksData = {};
let headingsData = {};
let imagesData = {};
let keywordsData = {}; 
let schema = {};
let openGraphData = {}; // New variable for Open Graph data

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(message.method)
  switch (message.method) {
    case "linksData":
      // Receive links data from popup.js
      linksData = message.value;
      console.log("Links data received from popup.js:", linksData);
      break;
    case "headingsData":
      // Receive headings data from heading.js
      headingsData = message.value;
      console.log("Headings data received from heading.js:", headingsData);
      break;
    case "imagesData":
      // Receive images data from script.js
      imagesData = message.value;
      console.log("Images data received from script.js:", imagesData);
      break;
    case "keywordsData":
      // Receive keywords data from keyword.js
      keywordsData = message.value;
      console.log("Keywords data received from keyword.js:", keywordsData);
      break;
    case "schemaTypesData":
      // Receive schema types data from content script
      schema = message.value;
      console.log("Schema types data received from content script:", schema);
      break;
    case "openGraphData": // New case for handling Open Graph data
      // Receive Open Graph data from content script
      openGraphData = message.value;
      console.log("Open Graph data received from content script:", openGraphData);
      break;
    case "getLinks":
      // Respond to link.js with the stored links data
      if (Object.keys(linksData).length > 0) {
        sendResponse(linksData);
        console.log("Links data sent to link.js:", linksData);
      } else {
        console.error("Error: Links data not available.");
      }
      break;
    case "getHeadings":
      // Respond to heading.js with the stored headings data
      if (Object.keys(headingsData).length > 0) {
        sendResponse(headingsData);
        console.log("Headings data sent to heading.js:", headingsData);
      } else {
        console.error("Error: Headings data not available.");
      }
      break;
    case "getImages":
      // Respond to image.js with the stored images data
      if (Object.keys(imagesData).length > 0) {
        sendResponse(imagesData);
        console.log("Images data sent to image.js:", imagesData);
      } else {
        console.error("Error: Images data not available.");
      }
      break;
    case "getSchema":
        // Respond to image.js with the stored schema data
        if (Object.keys(schema).length > 0) {
          sendResponse(schema);
          console.log("Schema data sent to image.js:", schema);
        } else {
          console.error("Error: Schema data not available.");
        }
        break;
    case "getOpenGraph": // New case for responding to opengraph.js
      // Respond to opengraph.js with the stored Open Graph data
      if (Object.keys(openGraphData).length > 0) {
        sendResponse(openGraphData);
        console.log("Open Graph data sent to opengraph.js:", openGraphData);
      } else {
        console.error("Error: Open Graph data not available.");
      }
      break;
    case "getKeywords":
      // Respond to keyword.js with the stored keywords data
      if (Object.keys(keywordsData).length > 0) {
        sendResponse(keywordsData);
        console.log("Keywords data sent to keyword.js:", keywordsData);
      } else {
        console.error("Error: Keywords data not available.");
      }
      break;
    case "set":
      // When the popup sends data to be stored
      value = message.value;
      sendResponse({ value: null });
      console.log("Value set to:", value);
      break;
    case "get":
      // When the popup requests to get stored data
      sendAfterSet(sendResponse);
      break;
    case "clear":
      // When the popup requests to clear stored data
      value = "";
      sendResponse({ value: null });
      console.log("Value cleared.");
      break;
    default:
      console.error("Unknown method:", message.method);
  }
  return true;
});

async function sendAfterSet(sendResponse) {
  console.log("Function started. Initial value:", value);

  for (let i = 0; i < 20; i++) {
    if (value !== "") {
      console.log("Value found:", value);
      sendResponse({ value: value });
      return;
    }
    console.log(`Iteration ${i + 1}: Value not found. Sleeping for 1s.`);
    await new Promise(s => setTimeout(s, 1000));
  }

  console.log("Value not set after 10 seconds. Setting error message.");
  value = "Error: Document information could not be obtained.";
  sendResponse({ value: value });
  console.log(value);
}



// Function to get all links on the page

// Asynchronous function to send stored data to the popup after it has been set
// async function sendAfterSet(sendResponse) {
//   for (let i = 0; i < 10; i++) {
//     if (value !== "") {
//       console.log("Value found:", value);
//       sendResponse({ value: value });
//       return;
//     }
//     console.log("Start Sleep 1s.");
//     await new Promise(s => setTimeout(s, 1000));
//     console.log("End Sleep 1s.");
//   }
//   value = "Error: Document information could not be obtained.";
//   sendResponse({ value: value });
//   console.log(value);
// }
