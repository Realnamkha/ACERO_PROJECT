document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed for social.js");
    chrome.runtime.sendMessage({ method: "getOpenGraph" }, (response) => {
        if (chrome.runtime.lastError) {
            console.error("Error retrieving Open Graph tags:", chrome.runtime.lastError.message);
        } else {
            console.log("Open Graph tags retrieved successfully:", response);
            displayOpenGraphTags(response);
        }
    });
  });


  function displayOpenGraphTags(openGraphData) {
    const openGraphContainer = document.querySelector('.open-graph-container');
    // Loop through the Open Graph data and create meta tags
    Object.entries(openGraphData).forEach(([property, content]) => {
        // Create meta tag
        const metaTag = document.createElement('meta');
        if (property.startsWith('og:') || property.startsWith('twitter:')) {
            metaTag.setAttribute('property', property.startsWith('og:') ? property : `twitter:${property.substring(8)}`);
            metaTag.setAttribute('content', content);
            // Append meta tag to container
            openGraphContainer.appendChild(metaTag);
        }
    });
}


  
  