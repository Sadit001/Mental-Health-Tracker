document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.querySelector('.toggle-password');
    const forgotPassword = document.querySelector('.forgot-password');

    // Toggle password visibility
    togglePassword.addEventListener('click', function() {
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
        this.innerHTML = isPassword ? '<i class="far fa-eye-slash"></i>' : '<i class="far fa-eye"></i>';
    });

    // Form validation
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = passwordInput.value;
        
        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.input-group').forEach(el => el.classList.remove('error'));
        
        // Validate email
        if (!validateEmail(email)) {
            showError('email', 'Please enter a valid email address');
            return;
        }
        
        // Validate password length (12 chars)
        if (password.length < 12) {
            showError('password', 'Password must be at least 12 characters');
            return;
        }
        
        // If validation passes
        console.log('Login submitted:', { email, password });
        window.location.href = "dashboard.html";
        
        // Show loading state
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            alert('Login successful! Redirecting to dashboard...');
        }, 1500);
    });
    
    // Forgot password handler
    forgotPassword.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Password reset link will be sent to your email!');
        // In real app: window.location.href = "/forgot-password";
    });

    // Helper functions
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function showError(fieldId, message) {
        const inputGroup = document.getElementById(fieldId).closest('.input-group');
        inputGroup.classList.add('error');
        
        const errorEl = document.createElement('div');
        errorEl.className = 'error-message';
        errorEl.textContent = message;
        inputGroup.appendChild(errorEl);
    }
});