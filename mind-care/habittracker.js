document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const newHabitBtn = document.getElementById('newHabitBtn');
    const habitModal = document.getElementById('habitModal');
    const closeBtn = document.querySelector('.close-btn');
    const habitForm = document.getElementById('habitForm');
    const habitsGrid = document.getElementById('habitsGrid');
    const habitChartCtx = document.getElementById('habitChart');
    const chartLegends = document.getElementById('chartLegends');
    const timeframeBtns = document.querySelectorAll('.timeframe-btn');
    const statsModal = document.getElementById('statsModal');
    const closeStatsBtn = document.getElementById('closeStatsBtn');
    const singleHabitChartCtx = document.getElementById('singleHabitChart');
    const singleHabitLegends = document.getElementById('singleHabitLegends');
    const singleHabitTimeframeBtns = document.querySelectorAll('#statsModal .timeframe-btn');
    
    // Initialize variables
    let habits = JSON.parse(localStorage.getItem('habits')) || [];
    let habitChart;
    let singleHabitChart;
    let currentTimeframe = 'week';
    let currentHabitId = null;
    
    // Initialize the page
    function init() {
        renderHabits();
        updateStats();
        updateHabitChart();
        setupEventListeners();
    }
    
    // Set up all event listeners
    function setupEventListeners() {
        // New Habit button
        newHabitBtn.addEventListener('click', function() {
            habitModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
        
        // Close modal buttons
        closeBtn.addEventListener('click', closeModal);
        closeStatsBtn.addEventListener('click', closeStatsModal);
        
        // Close modals when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === habitModal) {
                closeModal();
            }
            if (event.target === statsModal) {
                closeStatsModal();
            }
        });
        
        // Form submission
        habitForm.addEventListener('submit', function(e) {
            e.preventDefault();
            createNewHabit();
        });
        
        // Main analytics timeframe buttons
        timeframeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                timeframeBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentTimeframe = this.dataset.timeframe;
                updateHabitChart();
            });
        });
        
        // Single habit stats timeframe buttons
        singleHabitTimeframeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                singleHabitTimeframeBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                currentTimeframe = this.dataset.timeframe;
                if (currentHabitId) {
                    showHabitStats(currentHabitId);
                }
            });
        });
    }
    
    // Close modal function
    function closeModal() {
        habitModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Close stats modal function
    function closeStatsModal() {
        statsModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Create a new habit
    function createNewHabit() {
        const newHabit = {
            id: Date.now(),
            name: document.getElementById('habitName').value,
            category: document.getElementById('habitCategory').value,
            time: document.getElementById('habitTime').value,
            duration: parseInt(document.getElementById('habitDuration').value),
            reminder: document.getElementById('habitReminder').checked,
            streak: 0,
            calendar: {},
            createdAt: new Date().toISOString()
        };
        
        habits.push(newHabit);
        saveHabits();
        renderHabits();
        updateStats();
        updateHabitChart();
        
        habitForm.reset();
        closeModal();
    }
    
    // Render all habits
    function renderHabits() {
        habitsGrid.innerHTML = '';
        
        if (habits.length === 0) {
            habitsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <h3>No habits yet</h3>
                    <p>Click "New Habit" to get started</p>
                </div>
            `;
            return;
        }
        
        habits.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        habits.forEach(habit => {
            const habitCard = document.createElement('div');
            habitCard.className = `habit-card ${habit.category}`;
            habitCard.innerHTML = `
                <div class="habit-card-header">
                    <h3 class="habit-name">${habit.name}</h3>
                    <span class="habit-category">${capitalizeFirstLetter(habit.category)}</span>
                </div>
                <div class="habit-details">
                    <span><i class="fas fa-clock"></i> Best time: ${capitalizeFirstLetter(habit.time)}</span>
                    <span><i class="fas fa-hourglass-half"></i> Duration: ${habit.duration} min</span>
                    ${habit.reminder ? '<span><i class="fas fa-bell"></i> Reminder set</span>' : ''}
                </div>
                <div class="habit-streak">
                    <span class="streak-count">${habit.streak} days</span>
                    <span class="streak-label">current streak</span>
                </div>
                <div class="habit-calendar">
                    ${renderCalendar(habit.calendar)}
                </div>
                <div class="habit-actions">
                    <button class="action-btn delete-btn" data-id="${habit.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                    <button class="action-btn stats-btn" data-id="${habit.id}">
                        <i class="fas fa-chart-line"></i> Stats
                    </button>
                </div>
            `;
            habitsGrid.appendChild(habitCard);
        });
        
        document.querySelectorAll('.day-cell:not(.empty)').forEach(day => {
            day.addEventListener('click', function() {
                const habitId = parseInt(this.closest('.habit-card').querySelector('.delete-btn').dataset.id);
                const date = this.dataset.date;
                toggleHabitCompletion(habitId, date);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const habitId = parseInt(this.dataset.id);
                deleteHabit(habitId);
            });
        });
        
        document.querySelectorAll('.stats-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const habitId = parseInt(this.dataset.id);
                currentHabitId = habitId;
                showHabitStats(habitId);
            });
        });
    }
    
    // Render calendar for a habit
    function renderCalendar(calendarData) {
        let calendarHTML = '';
        const today = new Date();
        const currentDate = formatDate(today);
        const daysToShow = currentTimeframe === 'week' ? 7 : 30;
        
        for (let i = daysToShow - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = formatDate(date);
            
            let dayClass = 'day-cell';
            if (dateStr === currentDate) {
                dayClass += ' today';
            }
            
            if (calendarData[dateStr] !== undefined) {
                dayClass += calendarData[dateStr] ? ' completed' : ' missed';
                calendarHTML += `<div class="${dayClass}" data-date="${dateStr}">${date.getDate()}</div>`;
            } else {
                calendarHTML += `<div class="${dayClass}" data-date="${dateStr}">${date.getDate()}</div>`;
            }
        }
        
        return calendarHTML;
    }
    
    // Toggle habit completion
    function toggleHabitCompletion(habitId, date) {
        const habitIndex = habits.findIndex(h => h.id === habitId);
        if (habitIndex === -1) return;
        
        const habit = habits[habitIndex];
        habit.calendar[date] = !habit.calendar[date];
        updateStreak(habit);
        
        saveHabits();
        renderHabits();
        updateStats();
        updateHabitChart();
        
        if (currentHabitId === habitId) {
            showHabitStats(habitId);
        }
    }
    
    // Update streak for a habit
    function updateStreak(habit) {
        const dates = Object.keys(habit.calendar)
            .filter(date => habit.calendar[date])
            .sort()
            .reverse();
        
        if (dates.length === 0) {
            habit.streak = 0;
            return;
        }
        
        let streak = 1;
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        const todayStr = formatDate(today);
        const yesterdayStr = formatDate(yesterday);
        
        if (dates.includes(todayStr) || dates.includes(yesterdayStr)) {
            for (let i = 1; i < dates.length; i++) {
                const prevDate = new Date(dates[i-1]);
                const currDate = new Date(dates[i]);
                const diffDays = (prevDate - currDate) / (1000 * 60 * 60 * 24);
                
                if (diffDays === 1) streak++;
                else break;
            }
        }
        
        habit.streak = streak;
    }
    
    // Delete a habit
    function deleteHabit(habitId) {
        if (confirm('Are you sure you want to delete this habit?')) {
            habits = habits.filter(h => h.id !== habitId);
            saveHabits();
            renderHabits();
            updateStats();
            updateHabitChart();
            
            if (currentHabitId === habitId) {
                closeStatsModal();
                currentHabitId = null;
            }
        }
    }
    
    // Update statistics
    function updateStats() {
        const longestStreak = habits.reduce((max, habit) => Math.max(max, habit.streak), 0);
        document.getElementById('currentStreak').textContent = `${longestStreak} day${longestStreak !== 1 ? 's' : ''}`;
        
        document.getElementById('habitsTracked').textContent = habits.length;
        
        if (habits.length === 0) {
            document.getElementById('completionRate').textContent = '0%';
            return;
        }
        
        const today = formatDate(new Date());
        const completedToday = habits.filter(habit => habit.calendar[today]).length;
        const completionRate = Math.round((completedToday / habits.length) * 100);
        document.getElementById('completionRate').textContent = `${completionRate}%`;
    }
    
    // Update habit chart
    function updateHabitChart() {
        const categories = {};
        const daysToAnalyze = currentTimeframe === 'week' ? 7 : 30;
        
        habits.forEach(habit => {
            if (!categories[habit.category]) {
                categories[habit.category] = { completed: 0, total: 0 };
            }
            
            const recentDates = getRecentDates(daysToAnalyze);
            recentDates.forEach(date => {
                if (habit.calendar[date] !== undefined) {
                    categories[habit.category].total++;
                    if (habit.calendar[date]) categories[habit.category].completed++;
                }
            });
        });
        
        const labels = [];
        const data = [];
        const backgroundColors = [];
        const categoryColors = {
            health: '#4CAF50',
            fitness: '#2196F3',
            mindfulness: '#9C27B0',
            learning: '#FF9800',
            productivity: '#607D8B'
        };
        
        Object.entries(categories).forEach(([category, stats]) => {
            if (stats.total > 0) {
                labels.push(capitalizeFirstLetter(category));
                data.push(Math.round((stats.completed / stats.total) * 100));
                backgroundColors.push(categoryColors[category] || '#5D5FEF');
            }
        });
        
        if (labels.length === 0) {
            chartLegends.innerHTML = `
                <div class="chart-empty">
                    <i class="fas fa-chart-pie"></i>
                    <p>No habit data available for the selected timeframe</p>
                </div>
            `;
            if (habitChart) habitChart.destroy();
            return;
        }
        
        if (habitChart) {
            habitChart.data.labels = labels;
            habitChart.data.datasets[0].data = data;
            habitChart.data.datasets[0].backgroundColor = backgroundColors;
            habitChart.update();
        } else {
            habitChart = new Chart(habitChartCtx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: backgroundColors,
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `${context.label}: ${context.raw}% completion`;
                                }
                            }
                        }
                    }
                }
            });
        }
        
        updateChartLegends(labels, data, backgroundColors);
    }
    
    // Show stats for a single habit
    function showHabitStats(habitId) {
        const habit = habits.find(h => h.id === habitId);
        if (!habit) return;
        
        const daysToAnalyze = currentTimeframe === 'week' ? 7 : 30;
        const recentDates = getRecentDates(daysToAnalyze);
        
        let completed = 0;
        let totalDays = 0;
        
        recentDates.forEach(date => {
            if (habit.calendar[date] !== undefined) {
                totalDays++;
                if (habit.calendar[date]) completed++;
            }
        });
        
        const completionRate = totalDays > 0 ? Math.round((completed / totalDays) * 100) : 0;
        const missedRate = totalDays > 0 ? 100 - completionRate : 0;
        
        const data = [completionRate, missedRate];
        const labels = ['Completed', 'Missed'];
        const backgroundColors = ['#4CAF50', '#F44336'];
        
        if (singleHabitChart) {
            singleHabitChart.data.labels = labels;
            singleHabitChart.data.datasets[0].data = data;
            singleHabitChart.data.datasets[0].backgroundColor = backgroundColors;
            singleHabitChart.update();
        } else {
            singleHabitChart = new Chart(singleHabitChartCtx, {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        data: data,
                        backgroundColor: backgroundColors,
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `${context.label}: ${context.raw}%`;
                                }
                            }
                        }
                    }
                }
            });
        }
        
        // Update legends
        singleHabitLegends.innerHTML = '';
        labels.forEach((label, index) => {
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            legendItem.innerHTML = `
                <span class="legend-color" style="background: ${backgroundColors[index]}"></span>
                <span>${label}: ${data[index]}%</span>
            `;
            singleHabitLegends.appendChild(legendItem);
        });
        
        // Show modal
        statsModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    // Get recent dates for analysis
    function getRecentDates(days) {
        const dates = [];
        const today = new Date();
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            dates.push(formatDate(date));
        }
        
        return dates;
    }
    
    // Update chart legends
    function updateChartLegends(labels, data, colors) {
        chartLegends.innerHTML = '';
        
        labels.forEach((label, index) => {
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            legendItem.innerHTML = `
                <span class="legend-color" style="background: ${colors[index]}"></span>
                <span>${label}: ${data[index]}%</span>
            `;
            chartLegends.appendChild(legendItem);
        });
    }
    
    // Save habits to localStorage
    function saveHabits() {
        localStorage.setItem('habits', JSON.stringify(habits));
    }
    
    // Helper function to capitalize first letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    // Helper function to format date as YYYY-MM-DD
    function formatDate(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    // Initialize the application
    init();
});