// DOM Elements
const activityForm = document.getElementById('activity-form');
const activitiesList = document.getElementById('activities-list');
const recommendationsDiv = document.getElementById('recommendations');
const navLinks = document.querySelectorAll('nav ul li a');
const pageTitle = document.getElementById('page-title');
const usernameDisplay = document.getElementById('username-display');
const userAvatar = document.getElementById('user-avatar');

// Sections
const dashboardSection = document.querySelector('.dashboard-section');
const progressSection = document.querySelector('.progress-section');
const settingsSection = document.querySelector('.settings-section');

// Chart instances
let effectivenessChart = null;
let progressChart = null;

// Sample data storage (in a real app, use a database)
let activities = JSON.parse(localStorage.getItem('mindcare_activities')) || [];
let settings = JSON.parse(localStorage.getItem('mindcare_settings')) || {
    username: 'User Demo',
    notifications: true,
    theme: 'light'
};

// Initialize the app
function init() {
    loadSettings();
    applyTheme();
    renderActivities();
    renderRecommendations();
    renderChart();
    setupEventListeners();
}

// Apply theme from settings
function applyTheme() {
    document.documentElement.setAttribute('data-theme', settings.theme);
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.parentElement.classList.remove('active'));
            
            // Add active class to clicked link
            this.parentElement.classList.add('active');
            
            // Show corresponding section
            const target = this.getAttribute('data-section');
            showSection(target);
        });
    });

    // Activity form submission
    activityForm.addEventListener('submit', function(e) {
        e.preventDefault();
        logActivity();
    });

    // Settings form submission
    document.getElementById('settings-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveSettings();
    });

    // Reset data button
    document.getElementById('reset-data').addEventListener('click', function() {
        if (confirm('Are you sure you want to delete ALL your data? This cannot be undone.')) {
            resetData();
        }
    });

    // Export data button
    document.getElementById('export-data').addEventListener('click', exportData);

    // Import data button
    document.getElementById('import-data').addEventListener('click', importData);
}

// Show specific section
function showSection(section) {
    // Hide all sections
    dashboardSection.classList.add('hidden');
    progressSection.classList.add('hidden');
    settingsSection.classList.add('hidden');

    // Update page title
    pageTitle.textContent = section.charAt(0).toUpperCase() + section.slice(1);

    // Show selected section
    switch(section) {
        case 'dashboard':
            dashboardSection.classList.remove('hidden');
            break;
        case 'self-care':
            dashboardSection.classList.remove('hidden');
            break;
        case 'progress':
            progressSection.classList.remove('hidden');
            renderProgress();
            break;
        case 'settings':
            settingsSection.classList.remove('hidden');
            break;
    }
}

// Log a new activity
function logActivity() {
    const activity = document.getElementById('activity').value;
    const duration = document.getElementById('duration').value;
    const moodBefore = document.querySelector('input[name="mood-before"]:checked').value;
    const moodAfter = document.querySelector('input[name="mood-after"]:checked').value;

    const newActivity = {
        name: activity,
        duration: parseInt(duration),
        moodBefore: parseInt(moodBefore),
        moodAfter: parseInt(moodAfter),
        date: new Date().toISOString()
    };

    activities.push(newActivity);
    saveActivities();

    // Reset form
    activityForm.reset();
    document.getElementById('mb-3').checked = true;
    document.getElementById('ma-4').checked = true;

    // Update UI
    renderActivities();
    renderRecommendations();
    renderChart();

    // Show success message
    showToast('Activity logged successfully!');
}

// Render activities list
function renderActivities() {
    activitiesList.innerHTML = '';

    if (activities.length === 0) {
        activitiesList.innerHTML = '<p class="no-activities">No activities logged yet.</p>';
        return;
    }

    activities.slice().reverse().forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';

        // Get emoji for mood
        const moodBeforeEmoji = getMoodEmoji(activity.moodBefore);
        const moodAfterEmoji = getMoodEmoji(activity.moodAfter);

        activityItem.innerHTML = `
            <div class="activity-info">
                <div class="activity-icon">
                    <i class="fas ${getActivityIcon(activity.name)}"></i>
                </div>
                <div class="activity-details">
                    <h4>${activity.name.charAt(0).toUpperCase() + activity.name.slice(1)}</h4>
                    <p>${activity.duration} min • ${formatDate(activity.date)}</p>
                </div>
            </div>
            <div class="activity-mood">
                ${moodBeforeEmoji} → ${moodAfterEmoji}
            </div>
        `;

        activitiesList.appendChild(activityItem);
    });
}

// Get emoji for mood value
function getMoodEmoji(mood) {
    const emojis = ['😢', '😞', '😐', '🙂', '😊'];
    return emojis[mood - 1] || '😐';
}

// Get icon for activity
function getActivityIcon(activity) {
    const icons = {
        meditation: 'fa-spa',
        walk: 'fa-walking',
        journaling: 'fa-book',
        yoga: 'fa-spa',
        reading: 'fa-book-open',
        music: 'fa-music',
        exercise: 'fa-dumbbell'
    };
    return icons[activity] || 'fa-heart';
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Render recommendations
function renderRecommendations() {
    if (activities.length < 2) {
        recommendationsDiv.innerHTML = '<p>Complete at least 2 activities to get recommendations.</p>';
        return;
    }

    // Calculate activity effectiveness
    const activityEffectiveness = {};
    activities.forEach(activity => {
        if (!activityEffectiveness[activity.name]) {
            activityEffectiveness[activity.name] = {
                count: 0,
                totalImprovement: 0
            };
        }
        activityEffectiveness[activity.name].count++;
        activityEffectiveness[activity.name].totalImprovement += (activity.moodAfter - activity.moodBefore);
    });

    // Get top 3 most effective activities
    const topActivities = Object.entries(activityEffectiveness)
        .map(([name, data]) => ({
            name,
            avgImprovement: data.totalImprovement / data.count
        }))
        .sort((a, b) => b.avgImprovement - a.avgImprovement)
        .slice(0, 3);

    recommendationsDiv.innerHTML = `
        <p>Based on your activities, we recommend:</p>
        ${topActivities.map(activity => `
            <div class="recommendation-item">
                <i class="fas fa-check-circle"></i>
                Try <strong>${activity.name}</strong> (improves your mood by ${activity.avgImprovement.toFixed(1)} points on average)
            </div>
        `).join('')}
    `;
}

// Render effectiveness chart
function renderChart() {
    const ctx = document.getElementById('effectivenessChart').getContext('2d');

    if (activities.length === 0) {
        effectivenessChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['No data yet'],
                datasets: [{
                    label: 'Mood Improvement',
                    data: [0],
                    backgroundColor: 'rgba(108, 99, 255, 0.5)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        return;
    }

    // Group activities by type and calculate average mood improvement
    const activityData = {};
    activities.forEach(activity => {
        if (!activityData[activity.name]) {
            activityData[activity.name] = {
                count: 0,
                totalImprovement: 0
            };
        }
        activityData[activity.name].count++;
        activityData[activity.name].totalImprovement += (activity.moodAfter - activity.moodBefore);
    });

    const labels = Object.keys(activityData);
    const data = labels.map(name => (activityData[name].totalImprovement / activityData[name].count).toFixed(1));

    if (effectivenessChart) {
        effectivenessChart.destroy();
    }

    effectivenessChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels.map(name => name.charAt(0).toUpperCase() + name.slice(1)),
            datasets: [{
                label: 'Average Mood Improvement',
                data: data,
                backgroundColor: [
                    'rgba(108, 99, 255, 0.7)',
                    'rgba(255, 101, 132, 0.7)',
                    'rgba(56, 176, 0, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                    'rgba(75, 192, 192, 0.7)'
                ],
                borderColor: [
                    'rgba(108, 99, 255, 1)',
                    'rgba(255, 101, 132, 1)',
                    'rgba(56, 176, 0, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(75, 192, 192, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Mood Improvement (points)'
                    }
                }
            }
        }
    });
}

// Render progress data
function renderProgress() {
    // Update stats
    document.getElementById('activities-count').textContent = activities.length;
    
    const totalImprovement = activities.reduce((sum, activity) => {
        return sum + (activity.moodAfter - activity.moodBefore);
    }, 0);
    const avgImprovement = (totalImprovement / activities.length * 20).toFixed(0);
    document.getElementById('mood-improvement').textContent = activities.length > 0 ? `${avgImprovement}%` : '0%';
    
    document.getElementById('streak-days').textContent = calculateStreak();

    // Render progress chart
    const ctx = document.getElementById('progressChart').getContext('2d');
    const last7Days = getLast7Days();
    
    if (progressChart) {
        progressChart.destroy();
    }

    progressChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: last7Days.map(day => day.label),
            datasets: [{
                label: 'Daily Mood (Avg)',
                data: last7Days.map(day => day.avgMood),
                borderColor: 'rgba(108, 99, 255, 1)',
                backgroundColor: 'rgba(108, 99, 255, 0.1)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    min: 1,
                    max: 5,
                    ticks: {
                        callback: function(value) {
                            return getMoodEmoji(value);
                        }
                    }
                }
            }
        }
    });

    // Render achievements
    renderAchievements();
}

// Get last 7 days data
function getLast7Days() {
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayActivities = activities.filter(act => 
            act.date.split('T')[0] === dateStr
        );
        
        const avgMood = dayActivities.length > 0 ? 
            (dayActivities.reduce((sum, act) => sum + act.moodAfter, 0) / dayActivities.length) : 
            0;
        
        days.push({
            label: date.toLocaleDateString('en-US', { weekday: 'short' }),
            date: dateStr,
            count: dayActivities.length,
            avgMood: avgMood || null
        });
    }
    return days;
}

// Calculate streak
function calculateStreak() {
    if (activities.length === 0) return 0;
    
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    const dates = [...new Set(activities.map(a => a.date.split('T')[0]))].sort();
    
    // Check if today has activity
    if (dates.includes(today)) streak++;
    
    // Check previous days
    let checkDate = new Date();
    while (true) {
        checkDate.setDate(checkDate.getDate() - 1);
        const dateStr = checkDate.toISOString().split('T')[0];
        if (dates.includes(dateStr)) {
            streak++;
        } else {
            break;
        }
    }
    
    return streak;
}

// Render achievements
function renderAchievements() {
    const achievementsDiv = document.getElementById('achievements');
    achievementsDiv.innerHTML = '';

    const achievements = [
        {
            id: 'first_activity',
            title: 'First Step',
            description: 'Logged your first activity',
            icon: 'fa-star',
            unlocked: activities.length >= 1
        },
        {
            id: 'three_day_streak',
            title: '3-Day Streak',
            description: 'Completed activities for 3 consecutive days',
            icon: 'fa-fire',
            unlocked: calculateStreak() >= 3
        },
        {
            id: 'five_activities',
            title: 'Regular User',
            description: 'Logged 5 activities',
            icon: 'fa-check-circle',
            unlocked: activities.length >= 5
        },
        {
            id: 'mood_improver',
            title: 'Mood Improver',
            description: 'Improved your mood by 2+ points',
            icon: 'fa-smile',
            unlocked: activities.some(a => (a.moodAfter - a.moodBefore) >= 2)
        }
    ];

    achievements.forEach(achievement => {
        const achievementEl = document.createElement('div');
        achievementEl.className = `achievement ${achievement.unlocked ? 'unlocked' : 'locked'}`;
        achievementEl.innerHTML = `
            <i class="fas ${achievement.icon}"></i>
            <h4>${achievement.title}</h4>
            <p>${achievement.description}</p>
        `;
        achievementsDiv.appendChild(achievementEl);
    });
}

// Load settings
function loadSettings() {
    document.getElementById('username').value = settings.username;
    document.getElementById('notifications').checked = settings.notifications;
    document.getElementById('theme').value = settings.theme;
    usernameDisplay.textContent = settings.username;
    userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(settings.username)}`;
}

// Save settings
function saveSettings() {
    settings = {
        username: document.getElementById('username').value || 'User Demo',
        notifications: document.getElementById('notifications').checked,
        theme: document.getElementById('theme').value
    };
    
    localStorage.setItem('mindcare_settings', JSON.stringify(settings));
    usernameDisplay.textContent = settings.username;
    userAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(settings.username)}`;
    applyTheme();
    showToast('Settings saved successfully!');
}

// Save activities to localStorage
function saveActivities() {
    localStorage.setItem('mindcare_activities', JSON.stringify(activities));
}

// Reset all data
function resetData() {
    localStorage.removeItem('mindcare_activities');
    activities = [];
    saveActivities();
    showToast('All data has been reset.');
    renderActivities();
    renderRecommendations();
    renderChart();
    if (!progressSection.classList.contains('hidden')) {
        renderProgress();
    }
}

// Export data
function exportData() {
    const data = {
        activities: activities,
        settings: settings,
        exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportName = `mindcare_export_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportName);
    linkElement.click();
    
    showToast('Data exported successfully!');
}

// Import data
function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = event => {
            try {
                const data = JSON.parse(event.target.result);
                
                if (data.activities && Array.isArray(data.activities)) {
                    if (confirm(`Import ${data.activities.length} activities? This will replace your current data.`)) {
                        activities = data.activities;
                        saveActivities();
                        
                        if (data.settings) {
                            settings = data.settings;
                            localStorage.setItem('mindcare_settings', JSON.stringify(settings));
                            loadSettings();
                            applyTheme();
                        }
                        
                        showToast('Data imported successfully!');
                        renderActivities();
                        renderRecommendations();
                        renderChart();
                        if (!progressSection.classList.contains('hidden')) {
                            renderProgress();
                        }
                    }
                } else {
                    showToast('Invalid data format', 'error');
                }
            } catch (err) {
                showToast('Error importing data', 'error');
                console.error(err);
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', init);