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
            quill.insertText(range.index, prompt + '\n\n');
            quill.setSelection(range.index + prompt.length + 2);
        });
    });

    // Save journal entry
    document.getElementById('saveJournal').addEventListener('click', function() {
        const title = document.getElementById('entryTitle').value;
        const mood = document.getElementById('mood').value;
        const content = quill.root.innerHTML;
        
        if (!title.trim() || !content.trim()) {
            alert('Please add a title and some content before saving.');
            return;
        }

        // Create journal entry object
        const journalEntry = {
            title: title,
            mood: mood,
            content: content,
            date: today.toISOString(),
            timestamp: Date.now()
        };

        // Save to localStorage
        saveEntryToStorage(journalEntry);
        
        // Show celebration
        showCelebration();
        
        // Create confetti
        createConfetti();
    });

    // Close modal button
    document.getElementById('closeModal').addEventListener('click', function() {
        document.getElementById('celebrationModal').classList.remove('active');
    });

    function saveEntryToStorage(entry) {
        let journalEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
        journalEntries.unshift(entry); // Add new entry to beginning
        localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
    }

    function showCelebration() {
        const modal = document.getElementById('celebrationModal');
        modal.classList.add('active');
        
        // Auto-close after 5 seconds if user doesn't click
        setTimeout(() => {
            if (modal.classList.contains('active')) {
                modal.classList.remove('active');
            }
        }, 5000);
    }

    function createConfetti() {
        const colors = ['#6c63ff', '#ff6584', '#4ecdc4', '#ffd166'];
        const container = document.getElementById('confettiContainer');
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
            confetti.style.animationDelay = `${Math.random() * 0.5}s`;
            container.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }
    }
});