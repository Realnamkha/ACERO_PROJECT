document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");
    chrome.runtime.sendMessage({ method: "getLinks" }, (response) => {
        if (chrome.runtime.lastError) {
            console.error("Error retrieving links:", chrome.runtime.lastError.message);
        } else {
            console.log("Links retrieved successfully:", response);
            displayLinks(response);
        }
    });
});

function displayLinks(links) {
    console.log("Display Links function called with:", links);
    
    const { internalLinks, externalLinks } = links;

    const internalLinksList = document.getElementById('internal-links-list');
    if (!internalLinksList) {
        console.error("Element with ID 'internal-links-list' not found");
    } else {
        console.log("Internal links list element found");
        internalLinksList.innerHTML = '';  // Clear any existing content
        internalLinks.forEach(link => {
            console.log("Processing internal link:", link);
            const span = document.createElement('span');
            const anchor = document.createElement('a');
            anchor.href = link;
            anchor.textContent = link;
            span.appendChild(anchor);
            internalLinksList.appendChild(span);
            internalLinksList.appendChild(document.createElement('br'));  // Add line break for readability
        });
    }

    const externalLinksList = document.getElementById('external-links-list');
    if (!externalLinksList) {
        console.error("Element with ID 'external-links-list' not found");
    } else {
        console.log("External links list element found");
        externalLinksList.innerHTML = '';  // Clear any existing content
        externalLinks.forEach(link => {
            console.log("Processing external link:", link);
            const span = document.createElement('span');
            const anchor = document.createElement('a');
            anchor.href = link;
            anchor.textContent = link;
            span.appendChild(anchor);
            externalLinksList.appendChild(span);
            externalLinksList.appendChild(document.createElement('br'));  // Add line break for readability
        });
    }
}
