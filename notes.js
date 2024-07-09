document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed for Note JS");
    displayNotes();
  });

  document.getElementById('save-note').addEventListener('click', saveNote);
  function saveNote() {
    const noteContent = document.getElementById('note-area').value;
    if (noteContent.trim() !== "") {
        // Save to local storage
        chrome.storage.local.get(['notes'], function(result) {
            const notes = result.notes || [];
            notes.push(noteContent);
            chrome.storage.local.set({notes: notes}, function() {
                alert('Note saved successfully!!!!');
                console.log('Note saved to local storage successfully');
                document.getElementById('note-area').value = '';
                displayNotes();
            });
        });
    } else {
        alert('Please write something before saving.');
    }
    console.log('Save function executed'); // Add this line for debugging
}


// Function to display notes from local storage
function displayNotes() {
    chrome.storage.local.get(['notes'], function(result) {
        const notes = result.notes || [];
        const savedNotesDiv = document.getElementById('saved-notes');
        savedNotesDiv.innerHTML = '';
        notes.forEach((note, index) => {
            const noteDiv = document.createElement('div');
            noteDiv.textContent = note;
            noteDiv.id = `note-${index}`; // Assign unique ID for each note
            noteDiv.style.marginBottom = '10px'; // Add some space between notes
            noteDiv.style.padding = '10px'; // Add padding for better spacing
            noteDiv.style.border = '1px solid #ccc'; // Add a border for better visibility
            noteDiv.style.borderRadius = '5px'; // Rounded corners
            noteDiv.style.display = 'flex'; // Use flexbox for alignment
            noteDiv.style.flexDirection = "column";
            noteDiv.style.justifyContent = 'space-between'; // Space out items

            // Edit Button
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.style.backgroundColor = '#231F21'; // Blue background
            editButton.style.color = 'white'; // White text
            editButton.style.border = 'none'; // No border
            editButton.style.padding = '5px 10px'; // Padding for the button
            editButton.style.borderRadius = '5px'; // Rounded corners
            editButton.style.cursor = 'pointer'; // Pointer cursor on hover
            editButton.addEventListener('click', () => editNoteHandler(index));

            // Delete Button
            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = 'Delete'; // Unicode for "X" symbol
            deleteButton.style.backgroundColor = '#231F21'; // Red background
            deleteButton.style.color = 'white'; // White text
            deleteButton.style.border = 'none'; // No border
            deleteButton.style.padding = '5px 10px'; // Padding for the button
            deleteButton.style.borderRadius = '5px'; // Rounded corners
            deleteButton.style.cursor = 'pointer'; // Pointer cursor on hover
            deleteButton.style.marginLeft = "10px";
            deleteButton.addEventListener('click', () => deleteNoteHandler(index));

            // Append buttons to noteDiv
            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex'; // Use flexbox for alignment
            buttonContainer.appendChild(editButton);
            buttonContainer.appendChild(deleteButton);

            noteDiv.appendChild(buttonContainer);

            // Append noteDiv to savedNotesDiv
            savedNotesDiv.appendChild(noteDiv);
        });
    });
}

// Function to handle edit note action
function editNoteHandler(index) {
    // Call editNote after ensuring displayNotes has completed rendering
    setTimeout(() => {
        editNote(index);
    }, 100); // Adjust the delay time if necessary
}

// Function to edit note content
function editNote(index) {
    chrome.storage.local.get(['notes'], function(result) {
        const notes = result.notes || [];
        const noteDiv = document.getElementById(`note-${index}`);

        if (noteDiv) {
            // Disable editing for other notes while editing one
            const otherNotes = document.querySelectorAll('.note-editing');
            otherNotes.forEach((otherNote) => {
                if (otherNote !== noteDiv) {
                    otherNote.classList.remove('note-editing');
                    otherNote.innerHTML = notes[otherNote.dataset.index];
                }
            });

            // Toggle editing mode for the selected note
            noteDiv.classList.toggle('note-editing');
            const noteContent = notes[index];

            if (noteDiv.classList.contains('note-editing')) {
                // Enter edit mode
                noteDiv.innerHTML = `<textarea id="edit-note-${index}" rows="4">${noteContent}</textarea>
                                     <button id="save-edit-${index}">Save</button>`

                // Save edit button functionality
                const saveButton = document.getElementById(`save-edit-${index}`);
                saveButton.addEventListener('click', function() {
                    const updatedNoteContent = document.getElementById(`edit-note-${index}`).value;
                    if (updatedNoteContent.trim() !== '') {
                        notes[index] = updatedNoteContent.trim();
                        chrome.storage.local.set({ notes: notes }, function() {
                            console.log('Note edited successfully');
                            displayNotes();
                        });
                    } else {
                        alert('Note content cannot be empty. Note not updated.');
                    }
                });
            } else {
                // Exit edit mode
                noteDiv.innerHTML = noteContent;
            }
        } else {
            console.error(`Note element with id 'note-${index}' not found.`);
        }
    });
}


// Function to handle delete note action
function deleteNoteHandler(index) {
    chrome.storage.local.get(['notes'], function(result) {
        const notes = result.notes || [];
        notes.splice(index, 1);
        chrome.storage.local.set({ notes: notes }, function() {
            console.log('Note deleted successfully');
            displayNotes(); // Refresh the displayed notes after delete
        });
    });
}



  
  
  
  
  
  
  
  
  
    