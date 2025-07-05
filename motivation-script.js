document.addEventListener('DOMContentLoaded', function() {
    // Motivational quotes array
    const quotes = [
        {
            text: "You don't have to control your thoughts. You just have to stop letting them control you.",
            author: "Dan Millman"
        },
        {
            text: "Mental health is not a destination, but a process. It's about how you drive, not where you're going.",
            author: "Noam Shpancer"
        },
        {
            text: "Self-care is how you take your power back.",
            author: "Lalah Delia"
        },
        {
            text: "It's okay to not be okay. What's not okay is staying that way.",
            author: "Unknown"
        },
        {
            text: "Healing takes time, and asking for help is a courageous step.",
            author: "Mariska Hargitay"
        }
    ];

    // DOM Elements
    const motivationText = document.getElementById('motivationText');
    const authorElement = document.querySelector('.author');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');

    // Display random quote
    function displayRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        
        motivationText.style.opacity = 0;
        authorElement.style.opacity = 0;
        
        setTimeout(() => {
            motivationText.textContent = `"${quote.text}"`;
            authorElement.textContent = `- ${quote.author}`;
            
            motivationText.style.opacity = 1;
            authorElement.style.opacity = 1;
        }, 500);
    }

    // Rotate quotes every 8 seconds
    let quoteInterval = setInterval(displayRandomQuote, 8000);

    // Button click handlers
    loginBtn.addEventListener('click', function() {
        console.log("Redirecting to login page...");
        // window.location.href = "/login";
    });

    registerBtn.addEventListener('click', function() {
        console.log("Redirecting to registration page...");
        // window.location.href = "/register";
    });

    // Initialize with random quote
    displayRandomQuote();

    // Floating shapes animation
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        const randomDuration = 15 + Math.random() * 15;
        const randomDelay = Math.random() * 5;
        
        shape.style.animationDuration = `${randomDuration}s`;
        shape.style.animationDelay = `${randomDelay}s`;
    });
});