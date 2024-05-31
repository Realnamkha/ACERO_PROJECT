document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed for image.js");
    chrome.runtime.sendMessage({ method: "getKeywords" }, (response) => {
        if (chrome.runtime.lastError) {
            console.error("Error retrieving images:", chrome.runtime.lastError.message);
        } else {
            console.log("Images retrieved successfully:", response);
            displayWords(response);
        }
    });
});

function displayWords(keywordsData) {
    const keywordsContainer = document.getElementById('keywords');
    const wordCountContainer = document.getElementById('word-count');
    const densityContainer = document.getElementById('density');
  
    // Clear previous content
    keywordsContainer.innerHTML = '';
    wordCountContainer.innerHTML = '';
    densityContainer.innerHTML = '';
  
    // Iterate through keywordsData and create HTML elements
    keywordsData.forEach(keyword => {
      const keywordElement = document.createElement('div');
      keywordElement.textContent = keyword.word;
      keywordsContainer.appendChild(keywordElement);
  
      const countElement = document.createElement('div');
      countElement.textContent = keyword.count;
      wordCountContainer.appendChild(countElement);
  
      const densityElement = document.createElement('div');
      densityElement.textContent = keyword.density.toFixed(2); // Round density to two decimal places
      densityContainer.appendChild(densityElement);
    });
  }
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.method === "keywordsData") {
      displayWords(message.value);
    }
  });
  
