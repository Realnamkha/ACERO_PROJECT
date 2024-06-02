document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed");
  
  // Send a message to clear data
  chrome.runtime.sendMessage({ method: "clear" }, () => {
    console.log("Message sent to clear data");

    // Query the active tab in the current window
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log("Tabs queried:", tabs);

      // Execute the content script
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

            // Send a message to get data
            chrome.runtime.sendMessage({ method: "get" }, (response) => {
              if (chrome.runtime.lastError) {
                console.error("Error retrieving data:", chrome.runtime.lastError.message);
              } else {
                console.log("Data retrieved successfully");
                console.log("Data received:", response);
                console.log("Going to dataToPopup");
                
                // Call the function to handle the retrieved data
                dataToPopup(response);
              }
            });
          }
        }
      );
    });
  });
});

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

    const imagesData = listImages();
    chrome.runtime.sendMessage({ method: "imagesData", value: imagesData });
  
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

  
  function extractKeywords() {
      const text = document.body.textContent.toLowerCase(); // Get all text content and convert to lowercase
      const words = text.match(/\b\w+\b/g); // Extract words using regular expression
      const wordCounts = {}; // Object to store word counts
      const totalWords = words.length; // Total number of words
    
      // Calculate word counts
      words.forEach(word => {
        if (wordCounts[word]) {
          wordCounts[word]++;
        } else {
          wordCounts[word] = 1;
        }
      });
    
      // Calculate density for each keyword and store word, count, and density in an array
      const keywords = Object.keys(wordCounts).map(word => ({
        word: word,
        count: wordCounts[word],
        density: (wordCounts[word] / totalWords) * 100 // Density calculation (percentage)
      }));
    
      return keywords;
    }
  const keywordsData = extractKeywords();
  chrome.runtime.sendMessage({ method: "keywordsData", value: keywordsData  });


  const xmlSitemapExists = async() => {
    try {
      let xmlRes = await fetch('/sitemap.xml');
      let xmlSitemap = xmlRes.status === 404 ? false : true;
      return xmlSitemap;
    } catch (error) {
      return false;
    }
  }

  const fetchRobotsTxt = async () => {
    try {
      // Fetch the robots.txt file from the root directory of the website
      let response = await fetch('/robots.txt');
      
      // Check the response status
      if (response.status === 404) {
        // If the status is 404 (not found), return an object indicating the file does not exist
        return { exists: false, content: null };
      } else {
        // If the file exists, read the content
        let content = await response.text();
        // Return an object indicating the file exists and include its content
        return { exists: true, content: content };
      }
    } catch (error) {
      // If there's any error during the fetch, return an object indicating the file does not exist
      return { exists: false, content: null };
    }
  }

  
  const getCanonicalUrl = () => {
    try {
      let canonicalUrl = undefined;
      let nodeList = document.getElementsByTagName("link");
      for (let i = 0; i < nodeList.length; i++)
      {
          if((nodeList[i].getAttribute("rel") == "canonical"))
          {
            canonicalUrl = nodeList[i].getAttribute("href");
          }
      }
    
      if(canonicalUrl) {
        return canonicalUrl;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  const getNoindexTag = () => {
    try {
      let robotsTagExists = document.getElementsByTagName('meta').robots.content
      if(robotsTagExists) {
        let included = content.includes('noindex');

        if(included) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    } catch(error) {
      return false
    } 
  }

  const getSSL = () => {
    try {
      let content = document.location.protocol
      let included = content.includes('https');

      if(included) return true;
      else return false;
    } catch (error) {
      return false;
    }
  }
  const listSchemas = async () => {
    try {
      // Get the current page URL
      let url = window.location.href;
  
      // Fetch the HTML content of the current URL
      let response = await fetch(url);
      let html = await response.text();
  
      // Create a temporary DOM element to parse the HTML
      let parser = new DOMParser();
      let doc = parser.parseFromString(html, 'text/html');
  
      // Find all script tags with type "application/ld+json"
      let scripts = doc.querySelectorAll('script[type="application/ld+json"]');
  
      // Array to store the detected schema types
      let schemas = [];
  
      // Function to recursively extract @type values and details
      const extractTypes = (json) => {
        if (Array.isArray(json)) {
          json.forEach(item => extractTypes(item));
        } else if (typeof json === 'object') {
          schemas.push(json);
          Object.values(json).forEach(value => {
            if (typeof value === 'object' || Array.isArray(value)) {
              extractTypes(value);
            }
          });
        }
      };
  
      scripts.forEach(script => {
        // Parse the JSON content
        let jsonContent;
        try {
          jsonContent = JSON.parse(script.textContent);
        } catch (error) {
          console.error('Error parsing JSON-LD:', error);
          return;
        }
        extractTypes(jsonContent);
      });
  
      // Send the schema types data to the background script
      chrome.runtime.sendMessage({ method: "schemaTypesData", value: schemas }, (response) => {
        if (chrome.runtime.lastError) {
          console.error("Error sending schema types data:", chrome.runtime.lastError.message);
        } else {
          console.log("Schema types data sent successfully:", schemas);
        }
      });
  
      // Return or log the list of schema types
      return schemas;
    } catch (error) {
      console.error('Error fetching or parsing schema:', error);
      return [];
    }
  };


  // Function to check for Open Graph tags and display their details
// Function to check for Open Graph tags and send their details

const checkOpenGraphTags = () => {
  // Define an object of Open Graph properties to check for
  const ogProperties = {
    'og:title': null,
    'og:type': null,
    'og:image': null,
    'og:url': null,
    'og:description': null,
    'og:site_name': null,
    'og:locale': null,
    'og:video': null,
    'og:audio': null,
    'og:determiner': null,
    'og:updated_time': null,
    'twitter:card': null,
    'twitter:title': null,
    'twitter:description': null,
    'twitter:image': null
    // Add more Open Graph properties or specific social media tags as needed
  };

  // Initialize an object to store the Open Graph tags found
  const openGraphData = {};

  // Loop through each Open Graph property
  for (const property in ogProperties) {
    // Find the meta tag with the given property
    const metaTag = document.querySelector(`meta[property='${property}']`) || 
                    document.querySelector(`meta[name='${property}']`);
    if (metaTag) {
      // If the meta tag exists, add its content to the openGraphData object
      openGraphData[property] = metaTag.getAttribute('content');
    }
  }

  // Send the Open Graph data to the background script or handle it locally
  // Based on your application's requirements
  chrome.runtime.sendMessage({ method: "openGraphData", value: openGraphData }, (response) => {
    if (chrome.runtime.lastError) {
      console.error("Error sending Open Graph data:", chrome.runtime.lastError.message);
    } else {
      console.log("Open Graph data sent successfully:", openGraphData);
    }
  });

  return openGraphData;
};

// const checkOpenGraphTags = () => {
//   // Define an array of Open Graph properties to check for
//   const ogProperties = [
//       'og:title', 'og:type', 'og:image', 'og:url', 'og:description',
//       'og:site_name', 'og:locale', 'og:video', 'og:audio',
//       'og:determiner', 'og:updated_time'
//   ];

//   // Initialize an object to store the Open Graph tags found
//   const openGraphData = {};

//   // Loop through each Open Graph property
//   ogProperties.forEach(property => {
//       // Find the meta tag with the given property
//       const metaTag = document.querySelector(`meta[property='${property}']`);
//       if (metaTag) {
//           // If the meta tag exists, add its content to the openGraphData object
//           openGraphData[property] = metaTag.getAttribute('content');
//       }
//   });

//   // Send the Open Graph data to the background script
//   chrome.runtime.sendMessage({ method: "openGraphData", value: openGraphData }, (response) => {
//     if (chrome.runtime.lastError) {
//       console.error("Error sending Open Graph data:", chrome.runtime.lastError.message);
//     } else {
//       console.log("Open Graph data sent successfully:", openGraphData);
//     }
//   });

//   return openGraphData;
// };


  
  
  // Call the listSchemas function
  listSchemas();
  checkOpenGraphTags();
  
  
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
    let xmlSitemap = xmlSitemapExists();
    let robotsTxt = fetchRobotsTxt();
    let canonicalUrl = getCanonicalUrl();
    let noindexTag = getNoindexTag();
    let ssl = getSSL();

  
    let keyPoints = {
      performanceObject, title, description, h1Count, h2Count, h3Count, h4Count, h5Count, h6Count,
      images, alt_images, domain,word_count, links,xmlSitemap, robotsTxt,canonicalUrl,noindexTag,ssl
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
  
    // document.getElementById("report-btn").style.display = "none";
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


      // XML Sitemap
  if (keyPoints.xmlSitemap) {
    score = scorePerSuccess + score;
    document.getElementById('site-xml').classList.add("success-mark")
    document.getElementById("site-xml").innerHTML = "Good, you have XML Sitemap file";
  } else {
    document.getElementById('site-xml').classList.add("error-mark")
    document.getElementById("site-xml").innerHTML = "Oops, you have not XML Sitemap file";
  }

  // Robots.txt
  if (keyPoints.robotsTxt) {
    score = scorePerSuccess + score;
    document.getElementById('site-robots').classList.add("success-mark")
    document.getElementById("site-robots").innerHTML = "Good, you have Robots.txt file";
  } else {
    document.getElementById('site-robots').classList.add("error-mark")
    document.getElementById("site-robots").innerHTML = "Oops, you have not Robots.txt file";
  }

  if (keyPoints.canonicalUrl) {
    score = scorePerSuccess + score;
    document.getElementById("site-canonical").classList.add("success-mark")
    document.getElementById("site-canonical").innerHTML = "Your page is using the Canonical Tag.";
    let canonical = document.getElementById("site-canonical")
    let div = document.createElement("a");
    div.setAttribute("id", "site-canonical-url");
    div.setAttribute("class", "card-value");
    div.href = keyPoints.canonicalUrl;
    div.innerHTML = keyPoints.canonicalUrl;

    canonical.parentNode.insertBefore(div, canonical.nextSibling);
  } else {
    document.getElementById("site-canonical").classList.add("error-mark")
    document.getElementById("site-canonical").innerHTML = "Your page is not using the Canonical Tag.";
  }

  // NoIndex Tag
  if (!keyPoints.noindexTag) {
    score = scorePerSuccess + score;
    document.getElementById("site-noindex").classList.add("success-mark");
    document.getElementById("site-noindex").innerHTML = "Your page is not using the Noindex Tag which prevents indexing.";
  } else {
    document.getElementById("site-noindex").classList.add("error-mark");
    document.getElementById("site-noindex").innerHTML = "Your page is using the Noindex Tag which prevents indexing.";
  }

  // SSL Enabled
  if (keyPoints.ssl) {
    score = scorePerSuccess + score;
    document.getElementById("site-ssl").classList.add("success-mark")
    document.getElementById("site-ssl").innerHTML = "Greate, Your website has SSL enabled.";
  } else {
    document.getElementById("site-ssl").classList.add("error-mark")
    document.getElementById("site-ssl").innerHTML = "Oops, Your website has not been SSL enabled.";
  }
  



  
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
