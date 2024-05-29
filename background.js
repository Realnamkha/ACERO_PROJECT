let value = "";
let linksData = {};
let headingsData = {};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
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
    case "getLinks":
      // Respond to link.js with the stored links data
      if (linksData) {
        sendResponse(linksData);
        console.log("Links data sent to link.js:", linksData);
      } else {
        console.error("Error: Links data not available.");
      }
      break;
    case "getHeadings":
      // Respond to heading.js with the stored headings data
      if (headingsData) {
        sendResponse(headingsData);
        console.log("Headings data sent to heading.js:", headingsData);
      } else {
        console.error("Error: Headings data not available.");
      }
      break;
    case "set":
      // When the popup sends data to be stored
      value = message.value;
      sendResponse({ value: null });
      break;
    case "get":
      // When the popup requests to get stored data
      sendAfterSet(sendResponse);
      break;
    case "clear":
      // When the popup requests to clear stored data
      value = "";
      sendResponse({ value: null });
      break;
    default:
      console.error("Unknown method:", message.method);
  }
  return true;
});


// Function to get all links on the page
function getAllLinks() {
  const currentDomain = window.location.hostname;
  const links = document.querySelectorAll('a');
  const internalLinks = [];
  const externalLinks = [];

  links.forEach(link => {
    const href = link.href;
    if (href.startsWith('http') || href.startsWith('//')) {
      if (!href.includes(currentDomain)) {
        externalLinks.push(href);
      } else {
        internalLinks.push(href);
      }
    } else {
      internalLinks.push(href);
    }
  });

  return { internalLinks, externalLinks };
}

// Asynchronous function to send stored data to the popup after it has been set
async function sendAfterSet(sendResponse) {
  for (let i = 0; i < 10; i++) {
    if (value !== "") {
      sendResponse({ value: value });
      return;
    }
    console.log("Start Sleep 1s.");
    await new Promise(s => setTimeout(s, 1000));
    console.log("End Sleep 1s.");
  }
  value = "Error: Document information could not be obtained.";
}
