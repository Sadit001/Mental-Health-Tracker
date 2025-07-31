// journal.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Quill editor
    const quill = new Quill('#editor', {
        theme: 'snow',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['link', 'image'],
                ['clean']
            ]
        },
        placeholder: 'Write your thoughts and feelings here...',
    });

    // Set current date
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').textContent = today.toLocaleDateString('en-US', options);

    // Handle writing prompts
    document.querySelectorAll('.prompt').forEach(button => {
        button.addEventListener('click', function() {
            const prompt = this.getAttribute('data-prompt');
            const range = quill.getSelection();
            if (range) { // Ensure a selection exists
                quill.insertText(range.index, prompt + '\n\n');
                quill.setSelection(range.index + prompt.length + 2);
            } else {
                quill.insertText(quill.getLength(), prompt + '\n\n'); // Insert at end if no selection
                quill.setSelection(quill.getLength());
            }
        });
    });

    // Save journal entry - NOW SENDS TO BACKEND
    document.getElementById('saveJournal').addEventListener('click', async function() {
        const title = document.getElementById('entryTitle').value;
        const mood = document.getElementById('mood').value; // Your Journal.js does not use mood in schema, but it's in HTML
        const content = quill.root.innerHTML; // Get HTML content from Quill

        if (!title.trim() || !content.trim()) {
            alert('Please add a title and some content before saving.');
            return;
        }

        // Create journal entry object for the backend
        const journalEntry = {
            title: title,
            content: content,
            // mood: mood, // Uncomment and add to Journal.js schema if you want to store mood
            date: today.toISOString(), // Send ISO string for date
        };

        try {
            // **IMPORTANT: Ensure this URL matches your backend server's address and port**
            // If running locally, it's usually http://localhost:5000/api/journal
            const response = await fetch('http://localhost:5000/api/journals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // If you implement user authentication later, you'd add:
                    // 'Authorization': 'Bearer YOUR_JWT_TOKEN_HERE'
                },
                body: JSON.stringify(journalEntry)
            });

            if (!response.ok) {
                // If the response is not OK (e.g., 400, 500 status)
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save journal entry.');
            }

            const data = await response.json();
            console.log('Journal entry saved successfully:', data);

            // Show celebration
            showCelebration();

            // Create confetti
            createConfetti();

            // Optionally, clear the form after successful save
            document.getElementById('entryTitle').value = '';
            quill.setContents([{ insert: '\n' }]); // Clear Quill editor content

        } catch (error) {
            console.error('Error saving journal entry:', error);
            alert('Error saving journal entry: ' + error.message);
        }
    });

    // Close modal button
    document.getElementById('closeModal').addEventListener('click', function() {
        document.getElementById('celebrationModal').classList.remove('active');
    });

    // --- Helper functions (no changes needed here) ---
    function showCelebration() {
        const modal = document.getElementById('celebrationModal');
        modal.classList.add('active');

        setTimeout(() => {
            if (modal.classList.contains('active')) {
                modal.classList.remove('active');
            }
        }, 5000);
    }

    function createConfetti() {
        const colors = ['#6c63ff', '#ff6584', '#4ecdc4', '#ffd166'];
        const container = document.getElementById('confettiContainer');

        // Clear existing confetti before adding new ones
        container.innerHTML = '';

        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
            confetti.style.animationDelay = `${Math.random() * 0.5}s`;
            container.appendChild(confetti);

            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }
    }

    // You can add a function here to fetch and display past journal entries
    // For example, if you have a "View All Entries" page or section.
    async function fetchJournalEntries() {
        try {
            const response = await fetch('http://localhost:5000/api/journal'); // Adjust URL if needed
            if (!response.ok) {
                throw new Error('Failed to fetch journal entries.');
            }
            const entries = await response.json();
            console.log('Fetched all journal entries:', entries);
            // Here you would typically render `entries` into your HTML,
            // e.g., create a list of entries.
        } catch (error) {
            console.error('Error fetching journal entries:', error);
        }
    }

    // Call this function if you want to load entries on page load,
    // or when the user navigates to a journal history page.
    // fetchJournalEntries();
});