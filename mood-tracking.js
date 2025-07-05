document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const assessmentSection = document.getElementById('assessment');
    const resultsSection = document.getElementById('results');
    const questionContainer = document.querySelector('.question-container');
    const progressFill = document.querySelector('.progress-fill');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    const newEntryBtn = document.getElementById('newEntryBtn');
    const historyBtn = document.getElementById('historyBtn');
    
    // Result elements
    const resultIcon = document.getElementById('result-icon');
    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');
    const resultAdvice = document.getElementById('result-advice');

    // Questions data
    const questions = [
        {
            question: "How would you rate your mood today?",
            type: "scale",
            options: [
                { value: 1, label: "Terrible", icon: "fa-face-sad-cry" },
                { value: 2, label: "Very Bad", icon: "fa-face-frown-open" },
                { value: 3, label: "Bad", icon: "fa-face-frown" },
                { value: 4, label: "Below Average", icon: "fa-face-meh" },
                { value: 5, label: "Neutral", icon: "fa-face-meh-blank" },
                { value: 6, label: "Above Average", icon: "fa-face-smile" },
                { value: 7, label: "Good", icon: "fa-face-smile-beam" },
                { value: 8, label: "Very Good", icon: "fa-face-laugh-squint" },
                { value: 9, label: "Excellent", icon: "fa-face-laugh-beam" },
                { value: 10, label: "Perfect", icon: "fa-face-grin-stars" }
            ]
        },
        {
            question: "Which emotions are you feeling most strongly today?",
            type: "multi-select",
            options: [
                { value: "happy", label: "Happy", icon: "fa-face-laugh-beam" },
                { value: "sad", label: "Sad", icon: "fa-face-sad-cry" },
                { value: "anxious", label: "Anxious", icon: "fa-flushed" },
                { value: "angry", label: "Angry", icon: "fa-face-angry" },
                { value: "tired", label: "Tired", icon: "fa-face-tired" },
                { value: "calm", label: "Calm", icon: "fa-face-smile" },
                { value: "excited", label: "Excited", icon: "fa-face-grin-stars" },
                { value: "lonely", label: "Lonely", icon: "fa-face-sad-tear" }
            ]
        },
        {
            question: "What's the main reason for your current mood?",
            type: "text",
            placeholder: "Briefly describe what's affecting your mood..."
        }
    ];

    // User responses
    let currentQuestion = 0;
    let responses = {
        moodRating: null,
        emotions: [],
        reason: ""
    };

    // Initialize the assessment
    renderQuestion(currentQuestion);
    updateProgress();

    // Event listeners
    prevBtn.addEventListener('click', goToPreviousQuestion);
    nextBtn.addEventListener('click', goToNextQuestion);
    submitBtn.addEventListener('click', submitAssessment);
    newEntryBtn.addEventListener('click', startNewAssessment);
    historyBtn.addEventListener('click', viewHistory);

    // Render current question
    function renderQuestion(index) {
        questionContainer.innerHTML = '';
        
        const question = questions[index];
        const questionEl = document.createElement('div');
        questionEl.className = `question ${index === currentQuestion ? 'active' : ''}`;
        
        questionEl.innerHTML = `
            <h3>${question.question}</h3>
        `;
        
        if (question.type === 'scale') {
            questionEl.innerHTML += `
                <div class="option-grid">
                    ${question.options.map(opt => `
                        <button class="option-btn scale-option" data-value="${opt.value}">
                            <i class="fas ${opt.icon}"></i>
                            <span>${opt.label}</span>
                        </button>
                    `).join('')}
                </div>
            `;
        } else if (question.type === 'multi-select') {
            questionEl.innerHTML += `
                <div class="option-grid">
                    ${question.options.map(opt => `
                        <button class="option-btn emotion-option" data-value="${opt.value}">
                            <i class="fas ${opt.icon}"></i>
                            <span>${opt.label}</span>
                        </button>
                    `).join('')}
                </div>
            `;
        } else {
            questionEl.innerHTML += `
                <textarea id="reasonTextarea" placeholder="${question.placeholder}" 
                          style="width: 100%; min-height: 100px; padding: 1rem; border-radius: 8px; border: 1px solid #ddd;"></textarea>
            `;
        }
        
        questionContainer.appendChild(questionEl);
        
        // Add event listeners to options
        if (question.type === 'scale') {
            document.querySelectorAll('.scale-option').forEach(btn => {
                btn.addEventListener('click', function() {
                    document.querySelectorAll('.scale-option').forEach(b => b.classList.remove('selected'));
                    this.classList.add('selected');
                    responses.moodRating = parseInt(this.dataset.value);
                    enableNextButton();
                });
            });
        } else if (question.type === 'multi-select') {
            document.querySelectorAll('.emotion-option').forEach(btn => {
                btn.addEventListener('click', function() {
                    this.classList.toggle('selected');
                    const emotion = this.dataset.value;
                    
                    if (this.classList.contains('selected')) {
                        if (!responses.emotions.includes(emotion)) {
                            responses.emotions.push(emotion);
                        }
                    } else {
                        responses.emotions = responses.emotions.filter(e => e !== emotion);
                    }
                    
                    enableNextButton();
                });
            });
        } else {
            document.getElementById('reasonTextarea').addEventListener('input', function() {
                responses.reason = this.value;
                enableNextButton();
            });
        }
        
        updateNavigation();
    }

    // Navigation functions
    function goToPreviousQuestion() {
        if (currentQuestion > 0) {
            currentQuestion--;
            renderQuestion(currentQuestion);
            updateProgress();
        }
    }

    function goToNextQuestion() {
        if (validateCurrentQuestion()) {
            if (currentQuestion < questions.length - 1) {
                currentQuestion++;
                renderQuestion(currentQuestion);
                updateProgress();
            }
        } else {
            alert('Please answer the current question before proceeding.');
        }
    }

    function validateCurrentQuestion() {
        const question = questions[currentQuestion];
        
        if (question.type === 'scale') return responses.moodRating !== null;
        if (question.type === 'multi-select') return responses.emotions.length > 0;
        return true; // For text question, it's optional
    }

    function enableNextButton() {
        if (validateCurrentQuestion()) {
            nextBtn.disabled = false;
            if (currentQuestion === questions.length - 1) {
                submitBtn.disabled = false;
            }
        } else {
            nextBtn.disabled = true;
            submitBtn.disabled = true;
        }
    }

    function updateNavigation() {
        prevBtn.disabled = currentQuestion === 0;
        nextBtn.style.display = currentQuestion === questions.length - 1 ? 'none' : 'flex';
        submitBtn.style.display = currentQuestion === questions.length - 1 ? 'flex' : 'none';
        enableNextButton();
    }

    function updateProgress() {
        const progress = ((currentQuestion + 1) / questions.length) * 100;
        progressFill.style.width = `${progress}%`;
    }

    // Assessment submission
    function submitAssessment() {
        if (!validateCurrentQuestion()) {
            alert('Please complete all questions before submitting.');
            return;
        }

        // Save to localStorage
        saveResults();

        // Show results
        showResults();

        // Hide assessment, show results
        assessmentSection.classList.remove('active-section');
        assessmentSection.classList.add('hidden-section');
        resultsSection.classList.remove('hidden-section');
        resultsSection.classList.add('active-section');
    }

    function saveResults() {
        const entry = {
            ...responses,
            date: new Date().toISOString(),
            timestamp: Date.now()
        };

        let history = JSON.parse(localStorage.getItem('moodHistory') || '[]');
        history.unshift(entry);
        localStorage.setItem('moodHistory', JSON.stringify(history));
    }

    function showResults() {
        // Determine mood category
        let moodCategory;
        if (responses.moodRating >= 7) {
            moodCategory = 'positive';
        } else if (responses.moodRating >= 4) {
            moodCategory = 'neutral';
        } else {
            moodCategory = 'negative';
        }

        // Set result content based on mood
        if (moodCategory === 'positive') {
            resultIcon.className = 'fas fa-laugh-beam';
            resultIcon.style.color = 'var(--positive)';
            resultTitle.textContent = 'Great Mood!';
            resultMessage.textContent = 'Your mood assessment shows you\'re feeling positive today. Here are some ways to maintain this good energy:';
            
            resultAdvice.innerHTML = `
                <li><i class="fas fa-seedling"></i> Practice gratitude journaling</li>
                <li><i class="fas fa-heart"></i> Share your positive energy with others</li>
                <li><i class="fas fa-music"></i> Listen to uplifting music</li>
                <li><i class="fas fa-hiking"></i> Engage in activities you enjoy</li>
            `;
            
            // Add emotion-specific advice
            if (responses.emotions.includes('happy')) {
                resultAdvice.innerHTML += `<li><i class="fas fa-share-alt"></i> Spread your happiness to others</li>`;
            }
            if (responses.emotions.includes('excited')) {
                resultAdvice.innerHTML += `<li><i class="fas fa-bolt"></i> Channel your excitement into creative projects</li>`;
            }
            
        } else if (moodCategory === 'neutral') {
            resultIcon.className = 'fas fa-meh-blank';
            resultIcon.style.color = 'var(--neutral)';
            resultTitle.textContent = 'Neutral Mood';
            resultMessage.textContent = 'Your mood assessment shows you\'re feeling neither particularly good nor bad today. Here are some suggestions:';
            
            resultAdvice.innerHTML = `
                <li><i class="fas fa-walking"></i> Take a short walk to refresh your mind</li>
                <li><i class="fas fa-mug-hot"></i> Enjoy a warm beverage mindfully</li>
                <li><i class="fas fa-book-open"></i> Read something interesting</li>
                <li><i class="fas fa-pencil-alt"></i> Write down your thoughts</li>
            `;
            
        } else {
            resultIcon.className = 'fas fa-sad-tear';
            resultIcon.style.color = 'var(--negative)';
            resultTitle.textContent = 'Feeling Down?';
            resultMessage.textContent = 'Your responses suggest you might be feeling low. Remember these things:';
            
            resultAdvice.innerHTML = `
                <li><i class="fas fa-heartbeat"></i> Your feelings are valid and temporary</li>
                <li><i class="fas fa-spa"></i> Try deep breathing exercises</li>
                <li><i class="fas fa-book"></i> Read something comforting</li>
                <li><i class="fas fa-phone-alt"></i> Reach out to someone you trust</li>
            `;
            
            // Add emotion-specific advice
            if (responses.emotions.includes('sad')) {
                resultAdvice.innerHTML += `<li><i class="fas fa-film"></i> Watch a comforting movie</li>`;
            }
            if (responses.emotions.includes('anxious')) {
                resultAdvice.innerHTML += `<li><i class="fas fa-yin-yang"></i> Try a 5-minute meditation</li>`;
            }
            if (responses.emotions.includes('angry')) {
                resultAdvice.innerHTML += `<li><i class="fas fa-running"></i> Physical activity can help release tension</li>`;
            }
            if (responses.emotions.includes('lonely')) {
                resultAdvice.innerHTML += `<li><i class="fas fa-users"></i> Consider joining an online community</li>`;
            }
        }
    }

    function startNewAssessment() {
        // Reset responses
        responses = {
            moodRating: null,
            emotions: [],
            reason: ""
        };
        
        currentQuestion = 0;
        
        // Show assessment, hide results
        assessmentSection.classList.remove('hidden-section');
        assessmentSection.classList.add('active-section');
        resultsSection.classList.remove('active-section');
        resultsSection.classList.add('hidden-section');
        
        renderQuestion(currentQuestion);
        updateProgress();
    }

    function viewHistory() {
        alert('Mood history feature will be implemented in the next version!');
        // window.location.href = 'mood-history.html';
    }
});