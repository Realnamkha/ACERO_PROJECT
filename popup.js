document.getElementById("report-btn").onclick = () => {
    console.log("Button clicked");
    chrome.runtime.sendMessage({ method: "clear" }, () => {
      console.log("Message sent to clear data");
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        console.log("Tabs queried:", tabs);
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            function: getDocumentInfo,
          },
          (results) => {
            if (chrome.runtime.lastError) {
              console.error("Error executing content script:", chrome.runtime.lastError.message);
              document.getElementById("base-url").value = "Error: " + chrome.runtime.lastError.message;
            } else {
              console.log("Content script executed successfully", results);
              chrome.runtime.sendMessage({ method: "get" }, (response) => {
                if (chrome.runtime.lastError) {
                  console.error("Error retrieving data:", chrome.runtime.lastError.message);
                } else {
                  console.log("Data retrieved successfully");
                  console.log("Data received:", response);
                  console.log("Going to dataToPopup");
                  dataToPopup(response);
                }
              });
            }
          }
        );
      });
    });
  };
  // popup.js or background script


//   document.addEventListener('DOMContentLoaded', () => {
//     const headingButton = document.getElementById("heading-btn");
  
//     if (headingButton) {
//         headingButton.addEventListener("click", (event) => {
//             // event.preventDefault(); // Prevent default behavior (navigation)
//             console.log("Heading button clicked");
//         });
//     } else {
//         console.error("Heading button element not found");
//     }
// });



// Extract links and send them to the background script
const linksData = getAllLinks();
chrome.runtime.sendMessage({ method: "linksData", value: linksData });




  
  
  async function getDocumentInfo() {
    console.log("getDocumentInfo");
  
    // Function to get performance parameters
    const getPerformance = () => {
      try {
        let perfObject = {};
        let { timing, timeOrigin } = JSON.parse(JSON.stringify(window.performance));
        perfObject.domCompleted = (timing.domComplete - timeOrigin) / 1000; // ms to s
        perfObject.connectTime = (timing.connectEnd - timing.connectStart) / 1000; // ms to s
        perfObject.domContentEvent = (timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart) / 1000; // ms to s
        perfObject.responseTime = (timing.responseEnd - timing.requestStart) / 1000; // ms to s
        perfObject.unloadEvent = (timing.unloadEventEnd - timing.unloadEventStart) / 1000; // ms to s
        perfObject.domInteractive = (timing.domInteractive - timeOrigin) / 1000; // ms to s
        perfObject.redirectTime = (timing.redirectEnd - timing.redirectStart) / 1000; // ms to s
  
        return perfObject;
      } catch (error) {
        return error;
      }
    };
  
    // Function to get meta description
    const getMetaDescription = () => {
      const metaTags = document.getElementsByTagName('meta');
      let metaDescription = '';
  
      // Loop through all meta tags to find the description
      for (let i = 0; i < metaTags.length; i++) {
        if (metaTags[i].getAttribute('name') === 'description' || metaTags[i].getAttribute('property') === 'og:description') {
          metaDescription = metaTags[i].getAttribute('content');
          break; // Exit the loop once description is found
        }
      }
  
      return metaDescription;
    };
  
    // Function to list all images on the page
    const listImages = () => {
      const images = document.querySelectorAll('img');
      const imageList = [];
  
      images.forEach(image => {
        imageList.push({
          src: image.src,
          alt: image.alt,
          size: getImageSize(image.src)
        });
      });
  
      return imageList;
    };
  
    // Function to check alt text presence and content
    const checkAltText = () => {
      const images = document.querySelectorAll('img');
      const missingAlt = [];
  
      images.forEach(image => {
        if (!image.alt || image.alt.trim() === '') {
          missingAlt.push(image.src);
        }
      });
  
      return missingAlt;
    };
  
    // Function to get image file size
    const getImageSize = (src) => {
      const xhr = new XMLHttpRequest();
      xhr.open('HEAD', src, false);
      xhr.send(null);
  
      if (xhr.status === 200) {
        return (xhr.getResponseHeader('Content-Length') / 1024).toFixed(2) + ' KB';
      } else {
        return 'N/A';
      }
    };
    const countWords = () => {
        const text = document.body.textContent;
        const words = text.split(/\s+/).filter(word => word.trim() !== '');
        return words.length;
    };

    function getAllLinks() {
        const currentDomain = window.location.hostname;
        const links = document.querySelectorAll('a');
        const internalLinks = [];
        const externalLinks = [];
    
        links.forEach(link => {
            const href = link.href;
            if (href.startsWith('http') || href.startsWith('//')) {
                // External link
                if (!href.includes(currentDomain)) {
                    externalLinks.push(href);
                } else {
                    internalLinks.push(href);
                }
            } else {
                // Internal link (relative URL)
                internalLinks.push(href);
            }
        });
    
        return { internalLinks, externalLinks };
    }
    const linksData = getAllLinks();
    chrome.runtime.sendMessage({ method: "linksData", value: linksData });

    function getAllHeadings() {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const headingsList = Array.from(headings).map(heading => ({
          tag: heading.tagName,
          text: heading.textContent.trim(),
      }));
      return { headingsList };
  }
  
    const headingsData = getAllHeadings();
    chrome.runtime.sendMessage({ method: "headingsData", value: headingsData });
  

  
    // Collecting document information
    let performanceObject = getPerformance();
    let baseUrl = document.baseURI;
    let title = document.title;
    let description = getMetaDescription();
    let h1Count = document.getElementsByTagName("h1").length;
    let h2Count = document.getElementsByTagName("h2").length;
    let h3Count = document.getElementsByTagName("h3").length;
    let h4Count = document.getElementsByTagName("h4").length;
    let h5Count = document.getElementsByTagName("h5").length;
    let h6Count = document.getElementsByTagName("h6").length;
    let images = listImages();
    let alt_images = checkAltText();
    let domain = document.domain;
    let word_count = countWords()
    let links = getAllLinks()
  
    let keyPoints = {
      performanceObject, title, description, h1Count, h2Count, h3Count, h4Count, h5Count, h6Count,
      images, alt_images, domain,word_count, links,
    };
  
    let dataObject = { baseUrl, keyPoints };
  
    console.log("dataObject:", dataObject);


  
    // Send data back to the background script
    chrome.runtime.sendMessage({ method: "set", value: dataObject }, () => {
      console.log("Data sent to background script");
    });
  }

  function dataToPopup(response) {

    const { keyPoints, baseUrl } = response.value;
  
    let score = 0
    let scorePerSuccess = 7.14;
  
    console.log("datatopopup")
  
    document.getElementById("report-btn").style.display = "none";
    // document.getElementById("main-wrapper").style.display = "block";
    // document.getElementById("logo").style.marginTop = "5%";
    // document.getElementById("logo").style.marginBottom = "5%";
  
    document.getElementById("base-url").innerHTML = baseUrl;
  
    // Title
    document.getElementById("site-title").innerHTML = keyPoints.title;
    document.getElementById("title-length").innerHTML = "<b>Length : </b>" + keyPoints.title.length;
    if(keyPoints.title.length > 10 && keyPoints.title.length < 70) {
      score = scorePerSuccess + score;
      document.getElementById('site-title').classList.add("success-mark")
    } else {
      document.getElementById('site-title').classList.add("error-mark")
    }
  
    // Description
    if(keyPoints.description) {
      document.getElementById("site-description").innerHTML = keyPoints.description;
      document.getElementById("description-length").innerHTML = "<b>Length : </b>" + keyPoints.description.length;
      if(keyPoints.description.length > 70 && keyPoints.description.length < 320) {
        score = scorePerSuccess + score;
        document.getElementById('site-description').classList.add("success-mark")
      } else {
        document.getElementById('site-description').classList.add("warning-mark")
      }
    } else {
      document.getElementById("site-description").innerHTML = "Oops, your webpage has not any meta description";
      document.getElementById('site-description').classList.add("error-mark")
    }

    // Word Count

    if(keyPoints.word_count) {
        document.getElementById("title-word-count").innerHTML = keyPoints.word_count;
    }
    if (keyPoints.links) {
        console.log("LINKS FUNCTION EXECUTED")
        const { internalLinks, externalLinks } = keyPoints.links;
    
        document.getElementById('internal-links').textContent = internalLinks.length;
        document.getElementById('external-links').textContent = externalLinks.length;
    }
    if (keyPoints.images) {
        document.getElementById('total-images').textContent = keyPoints.images.length;
    }

    if (keyPoints.alt_images) {
        document.getElementById('img-alt').textContent = keyPoints.alt_images.length;
    }
    // Headings
    document.getElementById("heading-h1").innerHTML = keyPoints.h1Count;
    document.getElementById("heading-h2").innerHTML = keyPoints.h2Count;
    document.getElementById("heading-h3").innerHTML = keyPoints.h3Count;
    document.getElementById("heading-h4").innerHTML = keyPoints.h4Count;
    document.getElementById("heading-h5").innerHTML = keyPoints.h5Count;
    document.getElementById("heading-h6").innerHTML = keyPoints.h6Count;
  
    if(keyPoints.h1Count > 1) {
      document.getElementById("site-headings").innerHTML = "Your Webpage has more than 1 h1 tags";
      document.getElementById('site-headings').classList.add("error-mark")
    } else if(keyPoints.h1Count === 1) {
      score = scorePerSuccess + score;
      document.getElementById("site-headings").innerHTML = "Good, Your webpage has only 1 h1 tag";
      document.getElementById('site-headings').classList.add("success-mark")
    } else if(keyPoints.h1Count <= 0) {
      document.getElementById("site-headings").innerHTML = "Oops, your webpage has not any h1 tag";
      document.getElementById('site-headings').classList.add("warning-mark")
    }
  
    // Images
    // document.getElementById("site-alt-text").innerHTML = keyPoints.images.totalImages;
    // if(keyPoints.images.imagesWithoutAlt.length > 0) {
    //   document.getElementById('images-withuot-alt').classList.add("error-mark")
    //   document.getElementById("images-withuot-alt").innerHTML = keyPoints.images.imagesWithoutAlt.length + " ALT attributes are empty or missing.";
  
    //   const div = document.getElementById('images-withuot-alt');
    //   const ul = document.createElement("ul");
    //   ul.setAttribute("id", "image-list");
  
    //   for (let i = 0; i < keyPoints.images.imagesWithoutAlt.length; i++) {
    //     const li = document.createElement("li");
    //     li.innerHTML = keyPoints.images.imagesWithoutAlt[i];
    //     li.setAttribute("class", "image-list-item")
    //     ul.appendChild(li);
    //   }
  
    //   div.appendChild(ul);
  
    // } else {
    //   score = scorePerSuccess + score;
    //   document.getElementById('images-withuot-alt').classList.add("success-mark")
    //   document.getElementById("images-withuot-alt").innerHTML =  "Good, Every images have alt attributes.";
    // }
  



  
    // Performance Matrix
    // if(keyPoints.performanceObject) {
    //   const { performanceObject } = keyPoints;
    //   document.getElementById("performance-dom-completed").innerHTML = performanceObject.domCompleted + "s";
    //   document.getElementById("performance-connect-time").innerHTML = performanceObject.connectTime + "s";
    //   document.getElementById("performance-dom-content").innerHTML = performanceObject.domContentEvent + "s";
    //   document.getElementById("performance-response-time").innerHTML = performanceObject.responseTime + "s";
    //   document.getElementById("performance-unload-event").innerHTML = performanceObject.unloadEvent + "s";
    //   document.getElementById("performance-dom-interactive").innerHTML = performanceObject.domInteractive + "s";
    //   document.getElementById("performance-redirect-time").innerHTML = performanceObject.redirectTime + "s";
    // }
  
    scoreProgressBar(score);
  }
  function getHeadingInfo() {
    console.log("getHeadingInfo");

    // Function to get all headings on the page
    const getAllHeadings = () => {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        return Array.from(headings).map(heading => ({
            tag: heading.tagName,
            text: heading.textContent.trim(),
        }));
    };

    // Return the results as an object
    return {
        headings: getAllHeadings(),
        // other properties...
    };
}
