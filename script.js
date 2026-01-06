
const locationData = {
    "USA": {
        "California": ["Los Angeles", "San Francisco", "San Diego"],
        "New York": ["New York City", "Buffalo", "Albany"],
        "Texas": ["Houston", "Austin", "Dallas"]
    },
    "India": {
        "Maharashtra": ["Mumbai", "Pune", "Nagpur"],
        "Karnataka": ["Bangalore", "Mysore", "Hubli"],
        "Delhi": ["New Delhi", "Dwarka", "Rohini"]
    },
    "UK": {
        "England": ["London", "Manchester", "Liverpool"],
        "Scotland": ["Edinburgh", "Glasgow", "Aberdeen"],
        "Wales": ["Cardiff", "Swansea", "Newport"]
    }
};

const disposableDomains = ["tempmail.com", "mailinator.com", "10minutemail.com"];

const form = document.getElementById('registrationForm');
const countrySelect = document.getElementById('country');
const stateSelect = document.getElementById('state');
const citySelect = document.getElementById('city');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');
const submitBtn = document.getElementById('submitBtn');
const successModal = document.getElementById('successModal');
const closeModal = document.getElementById('closeModal');

// Populate Countries
Object.keys(locationData).forEach(country => {
    const option = document.createElement('option');
    option.value = country;
    option.textContent = country;
    countrySelect.appendChild(option);
});

// Cascading Dropdowns
countrySelect.addEventListener('change', function() {
    stateSelect.innerHTML = '<option value="">Select State</option>';
    citySelect.innerHTML = '<option value="">Select City</option>';
    stateSelect.disabled = true;
    citySelect.disabled = true;

    if (this.value) {
        const states = Object.keys(locationData[this.value]);
        states.forEach(state => {
            const option = document.createElement('option');
            option.value = state;
            option.textContent = state;
            stateSelect.appendChild(option);
        });
        stateSelect.disabled = false;
        
        // Update phone placeholder based on country
        const phoneInput = document.getElementById('phone');
        if (this.value === 'USA') phoneInput.placeholder = "+1 123 456 7890";
        if (this.value === 'India') phoneInput.placeholder = "+91 98765 43210";
        if (this.value === 'UK') phoneInput.placeholder = "+44 7700 900077";
    }
    validateForm();
});

stateSelect.addEventListener('change', function() {
    citySelect.innerHTML = '<option value="">Select City</option>';
    citySelect.disabled = true;

    if (this.value && countrySelect.value) {
        const cities = locationData[countrySelect.value][this.value];
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
        citySelect.disabled = false;
    }
    validateForm();
});

// Validation Logic
const inputs = form.querySelectorAll('input, select');

const validators = {
    firstName: (val) => val.length > 0,
    lastName: (val) => val.length > 0,
    email: (val) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(val)) return false;
        const domain = val.split('@')[1];
        return !disposableDomains.includes(domain);
    },
    phone: (val) => /^[+]?[\d\s-]{10,}$/.test(val),
    age: (val) => !val || (val >= 18 && val <= 100),
    gender: () => document.querySelector('input[name="gender"]:checked'),
    country: (val) => !!val,
    state: (val) => !stateSelect.disabled ? !!val : true, // Only if enabled
    city: (val) => !citySelect.disabled ? !!val : true, // Only if enabled
    password: (val) => val.length >= 6,
    confirmPassword: (val) => val === passwordInput.value,
    terms: () => document.getElementById('terms').checked
};

function showError(input, id, show) {
    const errorEl = document.getElementById(id + 'Error');
    const group = input.closest('.form-group') || input.closest('.checkbox-group') || input.parentElement;
    
    if (show) {
        group.classList.add('has-error');
        input.classList.add('error');
        input.classList.remove('valid');
    } else {
        group.classList.remove('has-error');
        input.classList.remove('error');
        if (input.value) input.classList.add('valid');
    }
}

function validateInput(input) {
    const name = input.name;
    const val = input.value;
    
    if (!validators[name]) return true;

    const isValid = validators[name](val);
    
    // Custom handling for gender since it's a group
    if (name === 'gender') {
        const group = document.querySelector('.radio-group').closest('.form-group');
        if (!isValid) group.classList.add('has-error'); 
        else group.classList.remove('has-error');
        return isValid;
    }

    // Don't show error immediately for empty optional fields or initial state
    if (!isValid && input.required) {
         showError(input, name, true);
    } else {
         showError(input, name, false);
    }
    
    return isValid;
}

// Attach listeners
inputs.forEach(input => {
    if (input.type === 'radio' || input.type === 'checkbox') {
        input.addEventListener('change', validateForm);
    } else {
        input.addEventListener('input', () => {
            validateInput(input);
            validateForm();
        });
        input.addEventListener('blur', () => {
             validateInput(input);
             validateForm();
        });
    }
});

// Password Strength
passwordInput.addEventListener('input', function() {
    const val = this.value;
    let strength = 0;
    
    if (val.length > 5) strength++;
    if (val.length > 8) strength++;
    if (/[A-Z]/.test(val)) strength++;
    if (/[0-9]/.test(val)) strength++;
    if (/[^A-Za-z0-9]/.test(val)) strength++;

    let color = 'red';
    let text = 'Weak';
    let width = '20%';

    if (strength > 2) {
        color = 'orange';
        text = 'Medium';
        width = '60%';
    }
    if (strength > 4) {
        color = 'var(--success)';
        text = 'Strong';
        width = '100%';
    }
    
    if (val.length === 0) width = '0';

    strengthBar.style.width = width;
    strengthBar.style.backgroundColor = color;
    strengthText.textContent = text;
    strengthText.style.color = color;
});

function validateForm() {
    let isValid = true;
    
    // Check all required fields
    const requiredInputs = Array.from(form.querySelectorAll('[required]'));
    
    requiredInputs.forEach(input => {
        if (input.name === 'gender') {
            if (!document.querySelector('input[name="gender"]:checked')) isValid = false;
        } else if (input.type === 'checkbox') {
            if (!input.checked) isValid = false;
        } else {
             if (!input.value) isValid = false;
             // Specific validators check
             if (validators[input.name] && !validators[input.name](input.value)) isValid = false;
        }
    });

    // Check specific logic like password match
    if (passwordInput.value !== confirmPasswordInput.value) isValid = false;

    submitBtn.disabled = !isValid;
    return isValid;
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateForm()) {
        successModal.style.display = 'flex';
        // forced reflow
        successModal.offsetHeight;
        successModal.classList.add('show');
        form.reset();
        submitBtn.disabled = true;
    }
});

closeModal.addEventListener('click', () => {
    successModal.classList.remove('show');
    setTimeout(() => {
        successModal.style.display = 'none';
        // Reset cascading dropdowns
        stateSelect.innerHTML = '<option value="">Select State</option>';
        citySelect.innerHTML = '<option value="">Select City</option>';
        stateSelect.disabled = true;
        citySelect.disabled = true;
        
        // Remove valid classes
        form.querySelectorAll('.valid').forEach(el => el.classList.remove('valid'));
        strengthBar.style.width = '0';
        strengthText.textContent = '';
    }, 300);
});
