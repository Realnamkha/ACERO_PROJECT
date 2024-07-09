document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed for schema.js");
    chrome.runtime.sendMessage({ method: "getSchema" }, (response) => {
        if (chrome.runtime.lastError) {
            console.error("Error retrieving schema:", chrome.runtime.lastError.message);
        } else {
            console.log("Schema retrieved successfully:", response);
            displaySchemaDetails(response); // Corrected function name
        }
    });
});


const displaySchemaDetails = (schemas) => {
  const container = document.getElementById('schema-details');
  container.innerHTML = ''; // Clear any existing content

  if (schemas.length === 0) {
    const noSchemaMessage = document.createElement('div');
    noSchemaMessage.textContent = 'No schema present';
    noSchemaMessage.style.textAlign = 'center';
    noSchemaMessage.style.fontStyle = 'italic';
    noSchemaMessage.style.color = '#888';
    container.appendChild(noSchemaMessage);
    return;
  }

  const createSchemaElement = (schema, level = 0) => {
    const schemaElement = document.createElement('div');
    schemaElement.style.marginLeft = `${level * 20}px`;

    for (const key in schema) {
      if (schema.hasOwnProperty(key)) {
        const value = schema[key];

        if (typeof value === 'object' && value !== null) {
          // If the value is an object, recursively create nested schema elements
          const itemElement = createSchemaElement(value, level + 1);
          schemaElement.appendChild(itemElement);
        } else {
          // Otherwise, display the key-value pair
          const pairElement = document.createElement('div');
          pairElement.classList.add('schema-pair');
          // pairElement.style.marginLeft = `${level * 20}px`; // Indent key-value pair
          pairElement.innerHTML = `<span class="schema-key">${key}:</span> <span class="schema-value">${value}</span>`;
          // pairElement.style.borderBottom = '1px solid #ccc';
          schemaElement.appendChild(pairElement);
          schemaElement.appendChild(document.createElement('hr'));
        }
      }
    }

    return schemaElement;
  };

  schemas.forEach(schema => {
    const schemaItem = createSchemaElement(schema);
    container.appendChild(schemaItem);
  });
};






// const displaySchemaDetails = (schemas) => {
//     const container = document.getElementById('schema-details');
  
//     schemas.forEach(schema => {
//       const schemaElement = document.createElement('div');
//       schemaElement.classList.add('schema');
  
//       const schemaDetails = JSON.stringify(schema, null, 2).replace(/(\\n)/g, '<br>');
  
//       schemaElement.innerHTML = `
//         <pre>${schemaDetails}</pre>
//       `;
  
//       container.appendChild(schemaElement);
//     });
//   };

// function displaySchemaDetails(schema) {
//     // Get the container element where the schema details will be displayed
//     const container = document.getElementById("schema-details");
    
//     // Clear any existing content in the container
//     container.innerHTML = "";
    
//     // Iterate over each schema object and display its details
//     schema.forEach(schemaObject => {
//         // Create a div element to contain the details of the current schema object
//         const schemaDiv = document.createElement("div");
//         schemaDiv.classList.add("schema-object");
        
//         // Iterate over the properties of the current schema object
//         Object.entries(schemaObject).forEach(([key, value]) => {
//             // Create a paragraph element to display the property name and value
//             const propertyParagraph = document.createElement("p");
//             propertyParagraph.textContent = `${key}: ${value}`;
            
//             // Append the property paragraph to the schema div
//             schemaDiv.appendChild(propertyParagraph);
//         });
        
//         // Append the schema div to the container
//         container.appendChild(schemaDiv);
//     });
// }


