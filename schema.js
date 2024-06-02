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
  
    schemas.forEach(schema => {
      const schemaElement = document.createElement('div');
      schemaElement.classList.add('schema');
  
      const schemaDetails = JSON.stringify(schema, null, 2).replace(/(\\n)/g, '<br>');
  
      schemaElement.innerHTML = `
        <pre>${schemaDetails}</pre>
      `;
  
      container.appendChild(schemaElement);
    });
  };

// function displaySchemaDetails(schema) {
//     console.log(schema)
// }

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


