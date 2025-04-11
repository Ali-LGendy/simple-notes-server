document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const noteForm = document.getElementById('noteForm');
    const notesList = document.getElementById('notesList');
    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');
    const noteIdInput = document.getElementById('noteId');
    const submitBtn = document.getElementById('submitBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    
    // Function to fetch all notes
    const fetchNotes = async () => {
      try {
        const response = await fetch('/api/notes');
        if (!response.ok) {
          throw new Error('Failed to fetch notes');
        }
        const notes = await response.json();
        renderNotes(notes);
      } catch (error) {
        console.error('Error fetching notes:', error);
        notesList.innerHTML = '<p>Error loading notes. Please try again later.</p>';
      }
    };
    
    // Function to render notes to the DOM
    const renderNotes = (notes) => {
      if (!Array.isArray(notes) || notes.length === 0) {
        notesList.innerHTML = '<p>No notes found. Add a new note to get started!</p>';
        return;
      }
      
      notesList.innerHTML = '';
      notes.forEach(note => {
        const noteCard = document.createElement('div');
        noteCard.className = 'note-card';
        noteCard.innerHTML = `
          <h3>${note.title}</h3>
          <p>${note.content}</p>
          <div class="note-actions">
            <button class="edit-btn" data-id="${note.id}">Edit</button>
            <button class="delete-btn" data-id="${note.id}">Delete</button>
          </div>
        `;
        notesList.appendChild(noteCard);
      });
      
      // Add event listeners to edit and delete buttons
      document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', handleEdit);
      });
      
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', handleDelete);
      });
    };
    
    // Function to handle form submission
    const handleSubmit = async (event) => {
      event.preventDefault();
      
      const title = titleInput.value.trim();
      const content = contentInput.value.trim();
      
      if (!title || !content) {
        alert('Please fill in all fields');
        return;
      }
      
      const noteData = { title, content };
      const noteId = noteIdInput.value;
      
      try {
        let response;
        
        if (noteId) {
          // Update existing note
          response = await fetch(`/api/notes/${noteId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(noteData)
          });
        } else {
          // Create new note
          response = await fetch('/api/notes', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(noteData)
          });
        }
        
        if (!response.ok) {
          throw new Error('Failed to save note');
        }
        
        // Reset form and refresh notes
        resetForm();
        fetchNotes();
      } catch (error) {
        console.error('Error saving note:', error);
        alert('Error saving note. Please try again.');
      }
    };
    
    // Function to handle edit button click
    const handleEdit = async (event) => {
      const noteId = event.target.dataset.id;
      
      try {
        const response = await fetch(`/api/notes/${noteId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch note');
        }
        
        const note = await response.json();
        
        // Populate form with note data
        titleInput.value = note.title;
        contentInput.value = note.content;
        noteIdInput.value = note.id;
        
        // Change button text and show cancel button
        submitBtn.textContent = 'Update Note';
        cancelBtn.style.display = 'inline-block';
        
        // Scroll to form
        noteForm.scrollIntoView({ behavior: 'smooth' });
      } catch (error) {
        console.error('Error fetching note for edit:', error);
        alert('Error loading note. Please try again.');
      }
    };
    
    // Function to handle delete button click
    const handleDelete = async (event) => {
      const noteId = event.target.dataset.id;
      
      if (!confirm('Are you sure you want to delete this note?')) {
        return;
      }
      
      try {
        const response = await fetch(`/api/notes/${noteId}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete note');
        }
        
        fetchNotes();
      } catch (error) {
        console.error('Error deleting note:', error);
        alert('Error deleting note. Please try again.');
      }
    };
    
    // Function to reset the form
    const resetForm = () => {
      noteForm.reset();
      noteIdInput.value = '';
      submitBtn.textContent = 'Add Note';
      cancelBtn.style.display = 'none';
    };
    
    // Add event listeners
    noteForm.addEventListener('submit', handleSubmit);
    cancelBtn.addEventListener('click', resetForm);
    
    // Initial fetch
    fetchNotes();
});