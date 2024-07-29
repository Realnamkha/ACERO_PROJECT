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

    const normalizeLink = (link) => {
        return link.replace(/\/$|\?.*$/g, '');
    };

    const displayLinkList = (linkList, listContainer) => {
        if (!listContainer) {
            console.error(`Element with ID '${listContainer.id}' not found`);
            return;
        }

        console.log(`${listContainer.id} element found`);
        listContainer.innerHTML = '';

        const linkCounts = {};

        linkList.forEach((linkObj) => {
            const normalizedLink = normalizeLink(linkObj.href);
            if (!linkCounts[normalizedLink]) {
                linkCounts[normalizedLink] = { count: 0, anchorText: linkObj.anchorText };
            }
            linkCounts[normalizedLink].count++;
        });

        Object.keys(linkCounts).forEach((link, index) => {
            console.log(`Processing ${listContainer.id === 'internal-links-list' ? 'internal' : 'external'} link:`, link);

            const linkContainer = document.createElement('div');
            linkContainer.classList.add('col-6', 'card-value', 'link-item');
            linkContainer.style.color = "#27187E";

            const countSpan = document.createElement('span');
            countSpan.textContent = `${index + 1}. `;
            linkContainer.appendChild(countSpan);

            const anchor = document.createElement('a');
            anchor.href = link;
            anchor.textContent = link;
            linkContainer.appendChild(anchor);

            // const lineBreak = document.createElement('br'); // Create line break element
            // linkContainer.appendChild(lineBreak); // Append line break

            // const anchorTextSpan = document.createElement('span');
            // anchorTextSpan.textContent = ` Anchor: ${linkCounts[link].anchorText}`;
            // linkContainer.appendChild(anchorTextSpan);

            const count = document.createElement('span');
            count.textContent = ` Count: ${linkCounts[link].count}`;
            // linkContainer.appendChild(count);

            listContainer.appendChild(linkContainer);
        });
    };

    const internalLinksList = document.getElementById('internal-links-list');
    displayLinkList(internalLinks, internalLinksList);

    const externalLinksList = document.getElementById('external-links-list');
    displayLinkList(externalLinks, externalLinksList);
}


// function displayLinks(links) {
//     console.log("Display Links function called with:", links);

//     const { internalLinks, externalLinks } = links;

//     const normalizeLink = (link) => {
//         // Remove trailing slash and query parameters
//         return link.replace(/\/$|\?.*$/g, '');
//     };

//     const displayLinkList = (linkList, listContainer) => {
//         if (!listContainer) {
//             console.error(`Element with ID '${listContainer.id}' not found`);
//             return;
//         }

//         console.log(`${listContainer.id} element found`);
//         listContainer.innerHTML = ''; // Clear any existing content

//         // Object to track link counts
//         const linkCounts = {};

//         // Normalize and count links
//         linkList.forEach((link) => {
//             const normalizedLink = normalizeLink(link);
//             // Increment count for the normalized link or set it to 1 if it doesn't exist yet
//             linkCounts[normalizedLink] = (linkCounts[normalizedLink] || 0) + 1;
//         });

//         // Display each unique link with count
//         Object.keys(linkCounts).forEach((link, index) => {
//             console.log(`Processing ${listContainer.id === 'internal-links-list' ? 'internal' : 'external'} link:`, link);

//             const linkContainer = document.createElement('div');
//             linkContainer.classList.add('link-item');

//             const countSpan = document.createElement('span');
//             countSpan.textContent = `${index + 1}. `;
//             linkContainer.appendChild(countSpan);

//             const anchor = document.createElement('a');
//             anchor.href = link;
//             anchor.textContent = link;
//             linkContainer.appendChild(anchor);

//             // Add count info
//             const count = document.createElement('span');
//             count.textContent = ` (Count: ${linkCounts[link]})`;
//             linkContainer.appendChild(count);

//             listContainer.appendChild(linkContainer);

//             listContainer.appendChild(document.createElement('br')); // Add line break for readability
//         });

//         // Display total count
//         const totalCount = Object.keys(linkCounts).length;
//         const totalSpan = document.getElementById(`${listContainer.id}-total`);
//         if (totalSpan) {
//             totalSpan.textContent = `Total Links: ${totalCount}`;
//         }
//     };

//     const internalLinksList = document.getElementById('internal-links-list');
//     displayLinkList(internalLinks, internalLinksList);

//     const externalLinksList = document.getElementById('external-links-list');
//     displayLinkList(externalLinks, externalLinksList);
// }

// function displayLinks(links) {
//     console.log("Display Links function called with:", links);

//     const { internalLinks, externalLinks } = links;

//     const displayLinkList = (linkList, listContainer) => {
//         if (!listContainer) {
//             console.error(`Element with ID '${listContainer.id}' not found`);
//             return;
//         }

//         console.log(`${listContainer.id} element found`);
//         listContainer.innerHTML = ''; // Clear any existing content

//         // Object to track link counts
//         const linkCounts = {};

//         // Loop through linkList to count occurrences
//         linkList.forEach((link) => {
//             // Increment count for the link or set it to 1 if it doesn't exist yet
//             linkCounts[link] = (linkCounts[link] || 0) + 1;
//         });

//         // Display each link with count
//         linkList.forEach((link, index) => {
//             console.log(`Processing ${listContainer.id === 'internal-links-list' ? 'internal' : 'external'} link:`, link);

//             const linkContainer = document.createElement('div');
//             linkContainer.classList.add('link-item');

//             const countSpan = document.createElement('span');
//             countSpan.textContent = `${index + 1}. `;
//             linkContainer.appendChild(countSpan);

//             const anchor = document.createElement('a');
//             anchor.href = link;
//             anchor.textContent = link;
//             linkContainer.appendChild(anchor);

//             // Add count info
//             const count = document.createElement('span');
//             count.textContent = ` (Count: ${linkCounts[link]})`;
//             linkContainer.appendChild(count);

//             listContainer.appendChild(linkContainer);

//             listContainer.appendChild(document.createElement('br')); // Add line break for readability
//         });

//         // Display total count
//         const totalCount = linkList.length;
//         const totalSpan = document.getElementById(`${listContainer.id}-total`);
//         if (totalSpan) {
//             totalSpan.textContent = `Total Links: ${totalCount}`;
//         }
//     };

//     const internalLinksList = document.getElementById('internal-links-list');
//     displayLinkList(internalLinks, internalLinksList);

//     const externalLinksList = document.getElementById('external-links-list');
//     displayLinkList(externalLinks, externalLinksList);
// }

