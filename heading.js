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
  const headingsContainer = document.querySelector('.card-value');

  if (!headingsContainer) {
      console.error('Error: headingsContainer element not found.');
      return;
  }

  if (Array.isArray(headingsData.headingsList)) {
      headingsData.headingsList.forEach((heading) => {
          const headingElement = document.createElement('div');
          headingElement.classList.add('grid-item', 'full-width', 'col-6', `heading-${heading.tag.toLowerCase()}`);
          
          const tagElement = document.createElement('span');
          tagElement.textContent = `<${heading.tag.toUpperCase()}>: `;
          tagElement.classList.add('heading-tag');
          
          const textElement = document.createElement('span');
          textElement.textContent = heading.text;
          
          const closingTagElement = document.createElement('span');
          closingTagElement.textContent = ` </${heading.tag.toUpperCase()}>`;
          closingTagElement.classList.add('heading-tag');
          
          headingElement.appendChild(tagElement);
          headingElement.appendChild(textElement);
          headingElement.appendChild(closingTagElement);

          headingsContainer.appendChild(headingElement);
      });
  } else {
      console.error('Headings list is not an array or is undefined');
  }
}









  