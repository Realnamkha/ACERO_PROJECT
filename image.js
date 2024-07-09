document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed for image.js");
    chrome.runtime.sendMessage({ method: "getImages" }, (response) => {
        if (chrome.runtime.lastError) {
            console.error("Error retrieving images:", chrome.runtime.lastError.message);
        } else {
            console.log("Images retrieved successfully:", response);
            console.log(response)
            displayImages(response);
        }
    });
});

function displayImages(images) {
    const gridContainer = document.querySelector('.grid');

    images.forEach((image, index) => {
        // Create grid item
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item', 'full-width');

        // Create inner container
        const innerContainer = document.createElement('div');

        // Create image title element
        const imgTitleElement = document.createElement('div');
        imgTitleElement.classList.add('col-6', 'card-value');
        imgTitleElement.textContent = `Image ${index + 1}: ${image.src}`;
        imgTitleElement.style.color = "black";

        // Create image size element
        const imgSizeElement = document.createElement('div');
        imgSizeElement.classList.add('col-6', 'card-value');
        imgSizeElement.textContent = `Size: ${image.size}`;
        imgSizeElement.style.color = "black";

        // Append image title and image size elements to inner container
        innerContainer.appendChild(imgTitleElement);
        innerContainer.appendChild(imgSizeElement);

        // Append inner container to grid item
        gridItem.appendChild(innerContainer);

        // Append grid item to grid container
        gridContainer.appendChild(gridItem);
    });
}
