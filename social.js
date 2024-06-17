document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed for social.js");
    chrome.runtime.sendMessage({ method: "getOpenGraph" }, (response) => {
        if (chrome.runtime.lastError) {
            console.error("Error retrieving Open Graph tags:", chrome.runtime.lastError.message);
        } else {
            console.log("Open Graph tags retrieved successfully:", response);
            displayOpenGraphData(response);
        }
    });
  });


  const displayOpenGraphData = (openGraphData) => {
    const container = document.querySelector('.open-graph-container');
  
    // Clear any existing content
    container.innerHTML = '';
  
    // Loop through the Open Graph data and create a list of items
    for (const [property, content] of Object.entries(openGraphData)) {
      const item = document.createElement('p');
      item.style.margin = '5px 0';
      item.style.color = '#27187E';
  
      const propertySpan = document.createElement('span');
      propertySpan.style.fontWeight = 'bold';
      propertySpan.textContent = `${property}: `;
  
      const contentSpan = document.createElement('span');
      contentSpan.textContent = content;
  
      item.appendChild(propertySpan);
      item.appendChild(contentSpan);
      container.appendChild(item);
    }
};

  
  


  
  