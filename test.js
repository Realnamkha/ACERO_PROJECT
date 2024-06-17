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

            const lineBreak = document.createElement('br'); // Create line break element
            linkContainer.appendChild(lineBreak); // Append line break

            const anchorTextSpan = document.createElement('span');
            anchorTextSpan.textContent = ` Anchor: ${linkCounts[link].anchorText}`;
            linkContainer.appendChild(anchorTextSpan);

            const count = document.createElement('span');
            count.textContent = ` Count: ${linkCounts[link].count}`;
            linkContainer.appendChild(count);

            listContainer.appendChild(linkContainer);
        });
    };

    const internalLinksList = document.getElementById('internal-links-list');
    displayLinkList(internalLinks, internalLinksList);

    const externalLinksList = document.getElementById('external-links-list');
    displayLinkList(externalLinks, externalLinksList);
}

document.addEventListener('DOMContentLoaded', () => {
    const links = {
        internalLinks: [
            { href: 'https://acero.digital/', anchorText: 'Home' },
            { href: 'https://acero.digital/about-us-2/', anchorText: 'About us' },
            { href: 'https://acero.digital/', anchorText: 'Home' }
        ],
        externalLinks: [
            { href: 'https://external.example.com/page1', anchorText: 'External Page 1' },
            { href: 'https://external.example.com/page2', anchorText: 'External Page 2' },
            { href: 'https://external.example.com/page1', anchorText: 'External Page 1 Duplicate' }
        ]
    };

    displayLinks(links);
});
