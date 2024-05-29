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

  if (Array.isArray(headingsData.headingsList)) {
    headingsData.headingsList.forEach((heading) => {
      const headingElement = document.createElement('div');
      headingElement.classList.add('col-6');
      headingElement.textContent = `${heading.tag}: ${heading.text}`;
      
      headingsContainer.appendChild(headingElement);
    });
  } else {
    console.log('Headings list is not an array or is undefined');
  }
}






  