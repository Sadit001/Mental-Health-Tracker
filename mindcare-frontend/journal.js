// journal.js
document.addEventListener("DOMContentLoaded", function () {
    // === 1. Initialize Quill Editor ===
    const quill = new Quill("#editor", {
        theme: "snow",
        modules: {
            toolbar: [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image"],
                ["clean"]
            ]
        }
    });

    // === 2. Set Current Date ===
    const dateElement = document.getElementById("currentDate");
    const today = new Date();
    dateElement.textContent = today.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    // === 3. Writing Prompts ===
    document.querySelectorAll(".prompt").forEach(button => {
        button.addEventListener("click", function () {
            const promptText = this.getAttribute("data-prompt");
            quill.clipboard.dangerouslyPasteHTML(quill.root.innerHTML + `<p>${promptText}</p>`);
        });
    });

    // === 4. Save Entry to Local Storage ===
    document.getElementById("saveJournal").addEventListener("click", function () {
        const title = document.getElementById("entryTitle").value.trim();
        const mood = document.getElementById("mood").value;
        const content = quill.root.innerHTML;
        const date = today.toISOString();

        if (!title || quill.getText().trim() === "") {
            alert("Please enter a title and some content before saving.");
            return;
        }

        // Get existing entries or create empty array
        let entries = JSON.parse(localStorage.getItem("journalEntries")) || [];

        // Add new entry
        entries.push({ title, mood, content, date });

        // Save back to localStorage
        localStorage.setItem("journalEntries", JSON.stringify(entries));

        // Show celebration + preview
        showCelebration();
        showSavedEntryBox(title, date, content);
    });

    // === 5. Celebration Modal ===
    function showCelebration() {
        const modal = document.getElementById("celebrationModal");
        modal.classList.add("active");

        document.getElementById("closeModal").addEventListener("click", () => {
            modal.classList.remove("active");
        });

        launchConfetti();
    }

    // === 6. Confetti Animation ===
    function launchConfetti() {
        const container = document.getElementById("confettiContainer");
        container.innerHTML = "";
        for (let i = 0; i < 30; i++) {
            const confetti = document.createElement("div");
            confetti.classList.add("confetti");
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.backgroundColor = getRandomColor();
            confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
            container.appendChild(confetti);

            setTimeout(() => confetti.remove(), 3000);
        }
    }

    function getRandomColor() {
        const colors = ["#6c63ff", "#ff6584", "#4ecdc4", "#4ade80", "#facc15"];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // === 7. Saved Entry Box ===
    function showSavedEntryBox(title, date, content) {
        const savedBox = document.getElementById("savedEntryBox");
        document.getElementById("savedTitle").textContent = title;
        document.getElementById("savedDateTime").textContent = new Date(date).toLocaleString();
        document.getElementById("savedPreview").innerHTML = content;

        savedBox.classList.add("show");

        document.getElementById("closeEntryBox").addEventListener("click", () => {
            savedBox.classList.remove("show");
        });

        document.getElementById("viewFullEntry").addEventListener("click", () => {
            alert("Feature coming soon: View full journal entry!");
        });
    }
});
