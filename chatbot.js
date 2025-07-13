// DOM Elements
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

// Positive and negative keywords
const positiveKeywords = ['happy', 'good', 'great', 'wonderful', 'excellent', 'joy', 'joyful', 'positive', 'amazing', 'fantastic', 'awesome', 'better', 'improving'];
const negativeKeywords = ['sad', 'depressed', 'bad', 'terrible', 'awful', 'anxious', 'anxiety', 'stress', 'stressed', 'lonely', 'hurt', 'pain', 'angry', 'frustrated', 'hopeless'];

// Initial bot messages
const welcomeMessages = [
    "Hello there! I'm your MindCare assistant. How can I help you today?",
    "Welcome to your safe space. How are you feeling right now?",
    "Hi! I'm here to listen. What's on your mind today?"
];

const followUpQuestions = [
    "How has your day been so far?",
    "What emotions are you experiencing right now?",
    "Would you like to share what's been on your mind lately?",
    "How are you really feeling deep inside?",
    "What's something you'd like to get off your chest today?"
];

// Positive responses
const positiveResponses = [
    "That's wonderful to hear! Keep nurturing those positive feelings.",
    "I'm so glad you're feeling good! You deserve this happiness.",
    "Your positivity is inspiring! Remember this feeling on tougher days.",
    "That's fantastic! Celebrate these good moments.",
    "It's great that you're feeling this way! What do you think contributed to this?"
];

// Negative responses
const negativeResponses = [
    "I'm sorry you're feeling this way. Remember, this feeling is temporary.",
    "It's okay to feel this way. You're stronger than you think.",
    "I hear you. Would it help to talk more about what's bothering you?",
    "These feelings are valid. Let's work through them together.",
    "I'm here for you. You're not alone in this."
];

// Motivational messages
const motivationalMessages = [
    "Every day may not be good, but there's something good in every day.",
    "You've survived 100% of your bad days so far. You've got this!",
    "This tough time is just a chapter in your story, not the whole book.",
    "Healing isn't linear. Be patient with yourself.",
    "You are capable of amazing things, even on days when you don't feel like it."
];

// Initialize chat
function initChat() {
    // Show welcome message after a short delay
    setTimeout(() => {
        addBotMessage(welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)]);
        
        // Show follow-up question after another delay
        setTimeout(() => {
            addBotMessage(followUpQuestions[Math.floor(Math.random() * followUpQuestions.length)]);
        }, 1500);
    }, 500);
}

// Add message to chat
function addMessage(text, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Add bot message with typing indicator
function addBotMessage(text) {
    // Show typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('typing-indicator');
    typingDiv.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Remove typing indicator and show message after delay
    setTimeout(() => {
        chatMessages.removeChild(typingDiv);
        addMessage(text, false);
    }, 1500);
}

// Analyze user message sentiment
function analyzeSentiment(message) {
    const lowerMsg = message.toLowerCase();
    
    // Check for positive keywords
    const isPositive = positiveKeywords.some(word => lowerMsg.includes(word));
    
    // Check for negative keywords
    const isNegative = negativeKeywords.some(word => lowerMsg.includes(word));
    
    return {
        isPositive,
        isNegative
    };
}

// Generate bot response
function generateResponse(userMessage) {
    const { isPositive, isNegative } = analyzeSentiment(userMessage);
    
    if (isPositive) {
        const randomPositive = positiveResponses[Math.floor(Math.random() * positiveResponses.length)];
        const randomMotivational = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
        return `${randomPositive} ${randomMotivational}`;
    } 
    else if (isNegative) {
        const randomNegative = negativeResponses[Math.floor(Math.random() * negativeResponses.length)];
        const randomMotivational = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
        return `${randomNegative} ${randomMotivational}`;
    }
    else {
        return "Thank you for sharing. Would you like to tell me more about how you're feeling?";
    }
}

// Handle user input
function handleUserInput() {
    const message = userInput.value.trim();
    if (message === '') return;
    
    // Add user message
    addMessage(message, true);
    userInput.value = '';
    
    // Generate and show bot response after a delay
    setTimeout(() => {
        const response = generateResponse(message);
        addBotMessage(response);
        
        // Ask follow-up question
        setTimeout(() => {
            addBotMessage(followUpQuestions[Math.floor(Math.random() * followUpQuestions.length)]);
        }, 2000);
    }, 1000);
}

// Event listeners
sendButton.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleUserInput();
    }
});

// Initialize chat when page loads
document.addEventListener('DOMContentLoaded', initChat);