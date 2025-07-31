document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const micBtn = document.getElementById('mic-btn');
    const typingIndicator = document.getElementById('typing-indicator');
    const minimizeBtn = document.getElementById('minimize-btn');
    const closeBtn = document.getElementById('close-btn');
    const chatbotContainer = document.querySelector('.chatbot-container');
    
    // Positive words and responses
    const positiveWords = [
        'good', 'great', 'awesome', 'happy', 'joyful', 'excited', 
        'nice', 'wonderful', 'fantastic', 'amazing', 'perfect', 
        'grateful', 'thankful', 'blissful', 'content', 'peaceful',
        'optimistic', 'hopeful', 'lovely', 'adorable', 'marvelous'
    ];
    
    // Negative words and responses
    const negativeWords = [
        'bad', 'sad', 'angry', 'depressed', 'anxious', 'stressed',
        'hate', 'worst', 'terrible', 'awful', 'horrible', 'pain',
        'fear', 'scared', 'lonely', 'tired', 'exhausted', 'frustrated',
        'annoyed', 'upset', 'disappointed', 'hopeless', 'helpless'
    ];
    
    // Motivational messages
    const motivationalMessages = [
        "Remember, tough times don't last but tough people do. You've got this!",
        "Every storm runs out of rain. Brighter days are ahead for you.",
        "You are stronger than you think. This challenge will make you wiser.",
        "The comeback is always stronger than the setback. Keep going!",
        "You've survived 100% of your bad days so far. That's impressive!",
        "This is just a chapter, not your whole story. Turn the page!",
        "Stars can't shine without darkness. Your light will return.",
        "Healing isn't linear. Be patient with yourself today.",
        "You are not alone in this. I'm here to support you.",
        "Your current situation is not your final destination. Keep believing."
    ];
    
    // Appreciation messages
    const appreciationMessages = [
        "That's wonderful to hear! Keep nurturing those positive feelings!",
        "Your positivity is contagious! Thanks for sharing your good energy!",
        "I'm so glad you're feeling this way! Celebrate these moments!",
        "Your good vibes are inspiring! Keep shining bright!",
        "Happiness looks great on you! Savor this feeling!",
        "What a beautiful state of mind! How can we build on this?",
        "Your positive attitude is your superpower! Keep it up!",
        "It's heartwarming to hear you're feeling so good today!",
        "Moments like these are precious. Thanks for sharing your joy!",
        "Your optimism is refreshing! The world needs more of this energy!"
    ];
    
    // Welcome messages
    const welcomeMessages = [
        "Welcome to MindCare! I'm your emotional support assistant. How are you feeling today?",
        "Hello there! I'm here to help you navigate your emotions. What's on your mind?",
        "Welcome back! Let's check in - how are you feeling right now?",
        "Hi friend! I'm MindCare. Before we begin, how are you truly feeling today?"
    ];
    
    // Initial welcome message
    setTimeout(() => {
        addMessage('bot', getRandomMessage(welcomeMessages), 'neutral');
    }, 500);
    
    // Send message function
    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;
        
        addMessage('user', message, 'user');
        userInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Simulate bot thinking
        setTimeout(() => {
            hideTypingIndicator();
            const botResponse = generateResponse(message);
            addMessage('bot', botResponse.text, botResponse.type);
        }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
    }
    
    // Generate appropriate response
    function generateResponse(message) {
        const lowerMsg = message.toLowerCase();
        
        // Check for positive words
        const hasPositive = positiveWords.some(word => lowerMsg.includes(word));
        
        // Check for negative words
        const hasNegative = negativeWords.some(word => lowerMsg.includes(word));
        
        if (hasPositive) {
            return {
                text: getRandomMessage(appreciationMessages),
                type: 'positive'
            };
        }
        
        if (hasNegative) {
            return {
                text: getRandomMessage(motivationalMessages),
                type: 'motivational'
            };
        }
        
        // Default neutral response
        return {
            text: "Thank you for sharing. I'm here to support you. How else are you feeling?",
            type: 'neutral'
        };
    }
    
    // Add message to chat
    function addMessage(sender, text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(sender === 'bot' ? 'bot-message' : 'user-message');
        
        if (sender === 'bot' && type !== 'user') {
            messageDiv.classList.add(type);
        }
        
        const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.innerHTML = `
            <div class="message-text">${text}</div>
            <span class="message-time">${timeString}</span>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Helper functions
    function getRandomMessage(messages) {
        return messages[Math.floor(Math.random() * messages.length)];
    }
    
    function showTypingIndicator() {
        typingIndicator.style.display = 'flex';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function hideTypingIndicator() {
        typingIndicator.style.display = 'none';
    }
    
    // Event listeners
    sendBtn.addEventListener('click', sendMessage);
    
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });
    
    // Voice recognition (optional)
    micBtn.addEventListener('click', function() {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Your browser doesn't support voice recognition");
            return;
        }
        
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        
        micBtn.classList.add('listening');
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            userInput.value = transcript;
            sendMessage();
            micBtn.classList.remove('listening');
        };
        
        recognition.onerror = function(event) {
            console.error(event.error);
            micBtn.classList.remove('listening');
        };
        
        recognition.start();
    });
    
    // Chatbot controls
    minimizeBtn.addEventListener('click', function() {
        chatbotContainer.classList.toggle('minimized');
    });
    
    closeBtn.addEventListener('click', function() {
        document.body.innerHTML = '<h1>MindCare Chatbot Closed</h1><p>Refresh page to reopen</p>';
    });
});