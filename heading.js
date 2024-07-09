document.addEventListener('DOMContentLoaded', () => {
  console.log("DOM fully loaded and parsed");
  chrome.runtime.sendMessage({ method: "getHeadings" }, (response) => {
      if (chrome.runtime.lastError) {
          console.error("Error retrieving headings:", chrome.runtime.lastError.message);
      } else {
          console.log("Headings retrieved successfully:", response);
          displayHeadings(response);
      }
  });
});



function displayHeadings(headingsData) {
    // Select the container where headings will be appended
    const headingsContainer = document.querySelector('.card-value');
  
    // Check if the container exists
    if (!headingsContainer) {
      console.error('Error: headingsContainer element not found.');
      return;
    }
  
    // Check if headingsData.headingsList is an array
    if (Array.isArray(headingsData.headingsList)) {
      headingsData.headingsList.forEach((heading) => {
        // Create a div element for each heading
        const headingElement = document.createElement('div');
        headingElement.classList.add('grid-item', 'full-width', 'col-6', `heading-${heading.tag.toLowerCase()}`);
        
        // Create a span element for the opening tag
        const tagElement = document.createElement('span');
        tagElement.textContent = `<${heading.tag.toUpperCase()}>: `;
        tagElement.classList.add('heading-tag');
        
        // Create a span element for the heading text
        const textElement = document.createElement('span');
        textElement.textContent = heading.text;
        
        // Create a span element for the closing tag
        const closingTagElement = document.createElement('span');
        closingTagElement.textContent = ` </${heading.tag.toUpperCase()}>`;
        closingTagElement.classList.add('heading-tag');
        
        // Append the opening tag, text, and closing tag to the heading element
        headingElement.appendChild(tagElement);
        headingElement.appendChild(textElement);
        headingElement.appendChild(closingTagElement);
  
        // Append the heading element to the container
        headingsContainer.appendChild(headingElement);
      });
    } else {
      console.error('Error: headingsList is not an array or is undefined.');
    }
  }
  









  