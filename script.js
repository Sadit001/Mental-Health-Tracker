document.addEventListener('DOMContentLoaded', function() {
    const getStartedBtn = document.getElementById('getStartedBtn');
    
    getStartedBtn.addEventListener('click', function() {
        // 1. Add loading animation
        const originalText = this.innerHTML;
        this.innerHTML = 'Redirecting <i class="fas fa-spinner fa-spin"></i>';
        this.disabled = true;
        
        // 2. Redirect after 1 second (simulate loading)
        setTimeout(() => {
            window.location.href = "motivation.html";
        }, 1000);
        
        // 3. Fallback in case redirect fails
        setTimeout(() => {
            this.innerHTML = originalText;
            this.disabled = false;
        }, 3000);
    });
    
    // Keep your existing floating shapes animation code
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        const randomX = Math.random() * 80;
        const randomY = Math.random() * 80;
        const randomDelay = Math.random() * 5;
        const randomDuration = 10 + Math.random() * 20;
        
        shape.style.left = `${randomX}%`;
        shape.style.top = `${randomY}%`;
        shape.style.animationDelay = `${randomDelay}s`;
        shape.style.animationDuration = `${randomDuration}s`;
    });
});