document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const passwordStrength = document.getElementById('passwordStrength');
    const requirementElems = {
        length: document.getElementById('reqLength'),
        upper: document.getElementById('reqUpper'),
        number: document.getElementById('reqNumber'),
        special: document.getElementById('reqSpecial')
    };

    // Password visibility toggle
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const isPassword = passwordInput.type === 'password';
            const icon = this.querySelector('i');
            const text = this.querySelector('span');
            
            passwordInput.type = isPassword ? 'text' : 'password';
            icon.classList.toggle('fa-eye-slash', !isPassword);
            icon.classList.toggle('fa-eye', isPassword);
            text.textContent = isPassword ? 'Hide Password' : 'Show Password';
        });
    }

    // Password strength checker
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        checkPasswordStrength(password);
    });

    function checkPasswordStrength(password) {
        // Requirements
        const hasMinLength = password.length >= 12;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        
        // Update requirement indicators
        toggleRequirementClass(requirementElems.length, hasMinLength);
        toggleRequirementClass(requirementElems.upper, hasUpperCase);
        toggleRequirementClass(requirementElems.number, hasNumber);
        toggleRequirementClass(requirementElems.special, hasSpecialChar);
        
        // Calculate strength (0-100)
        let strength = 0;
        if (hasMinLength) strength += 25;
        if (hasUpperCase) strength += 25;
        if (hasNumber) strength += 25;
        if (hasSpecialChar) strength += 25;
        
        // Update strength meter
        updateStrengthMeter(strength);
    }
    
    function toggleRequirementClass(element, isMet) {
        if (isMet) {
            element.classList.add('requirement-met');
        } else {
            element.classList.remove('requirement-met');
        }
    }
    
    function updateStrengthMeter(strength) {
        let color = '';
        if (strength < 50) color = 'var(--error)';
        else if (strength < 75) color = 'var(--warning)';
        else color = 'var(--success)';
        
        passwordStrength.style.setProperty('--strength', `${strength}%`);
        passwordStrength.style.setProperty('--strength-color', color);
    }

    // Form submission
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            contact: document.getElementById('contact').value,
            occupation: document.getElementById('occupation').value,
            dob: document.getElementById('dob').value,
            password: passwordInput.value
        };
        
        // Validate form
        if (validateForm(formData)) {
            // Show loading state
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                console.log('Registration data:', formData);
                alert('Account created successfully! Redirecting to dashboard...');
                // window.location.href = "dashboard.html";
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        }
    });
    
    function validateForm(data) {
        let isValid = true;
        
        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(el => el.remove());
        document.querySelectorAll('.input-group').forEach(el => el.classList.remove('error'));
        
        // Name validation
        if (!data.name.trim()) {
            showError('name', 'Full name is required');
            isValid = false;
        }
        
        // Email validation
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            showError('email', 'Please enter a valid email');
            isValid = false;
        }
        
        // Contact validation
        if (!/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(data.contact)) {
            showError('contact', 'Please enter a valid phone number');
            isValid = false;
        }
        
        // Occupation validation
        if (!data.occupation) {
            showError('occupation', 'Please select your occupation');
            isValid = false;
        }
        
        // DOB validation
        if (!data.dob) {
            showError('dob', 'Date of birth is required');
            isValid = false;
        } else {
            const dobDate = new Date(data.dob);
            const minDate = new Date('1900-01-01');
            const maxDate = new Date('2010-01-01');
            
            if (dobDate < minDate || dobDate > maxDate) {
                showError('dob', 'Please enter a valid date of birth');
                isValid = false;
            }
        }
        
        // Password validation
        const password = data.password;
        if (password.length < 12) {
            showError('password', 'Password must be at least 12 characters');
            isValid = false;
        } else if (!/[A-Z]/.test(password)) {
            showError('password', 'Password needs at least 1 uppercase letter');
            isValid = false;
        } else if (!/\d/.test(password)) {
            showError('password', 'Password needs at least 1 number');
            isValid = false;
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            showError('password', 'Password needs at least 1 special character');
            isValid = false;
        }
        
        return isValid;
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