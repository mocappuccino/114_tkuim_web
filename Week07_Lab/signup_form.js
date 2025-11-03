document.addEventListener('DOMContentLoaded', () => {

    // 表單
    const form = document.querySelector('#signup-form');

    // 欄位
    const nameInput = document.querySelector('#name');
    const emailInput = document.querySelector('#email');
    const phoneInput = document.querySelector('#phone');
    const passwordInput = document.querySelector('#password');
    const confirmPasswordInput = document.querySelector('#confirmPassword');
    const interestsGroup = document.querySelector('#interests-group'); 
    const termsCheckbox = document.querySelector('#terms');

    // 錯誤訊息
    const nameError = document.querySelector('#name-error');
    const emailError = document.querySelector('#email-error');
    const phoneError = document.querySelector('#phone-error');
    const passwordError = document.querySelector('#password-error');
    const confirmPasswordError = document.querySelector('#confirmPassword-error');
    const interestError = document.querySelector('#interest-error');
    const termsError = document.querySelector('#terms-error');

    // 按鈕
    const submitButton = document.querySelector('#submit-button');
    const resetButton = document.querySelector('#reset-button'); 

    // 密碼強度
    const passwordStrengthBar = document.querySelector('#password-strength-bar');

    const lsKey = 'signupFormData';

    // 即時驗證
    const touchedFields = new Set();



    /**
     * 顯示錯誤訊息
     * @param {HTMLElement} inputEl
     * @param {HTMLElement} errorEl
     * @param {string} message
     */
    const showError = (inputEl, errorEl, message) => {
        if (inputEl) inputEl.classList.add('is-invalid');
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.add('is-visible');
        }
    };

    /**
     * 清除錯誤訊息
     * @param {HTMLElement} inputEl
     * @param {HTMLElement} errorEl
     */
    const clearError = (inputEl, errorEl) => {
        if (inputEl) inputEl.classList.remove('is-invalid');
        if (errorEl) {
            errorEl.textContent = '';
            errorEl.classList.remove('is-visible');
        }
    };

 
    const validateName = () => {
        nameInput.setCustomValidity('');
        if (nameInput.validity.valueMissing) {
            const msg = '姓名為必填欄位';
            nameInput.setCustomValidity(msg);
            showError(nameInput, nameError, msg);
            return false;
        }
        clearError(nameInput, nameError);
        return true;
    };

    const validateEmail = () => {
        emailInput.setCustomValidity('');
        if (emailInput.validity.valueMissing) {
            const msg = 'Email 為必填欄位';
            emailInput.setCustomValidity(msg);
            showError(emailInput, emailError, msg);
            return false;
        }
        if (emailInput.validity.typeMismatch) {
            const msg = '請輸入有效的 Email 格式 (例如: user@example.com)';
            emailInput.setCustomValidity(msg);
            showError(emailInput, emailError, msg);
            return false;
        }
        clearError(emailInput, emailError);
        return true;
    };

    const validatePhone = () => {
        phoneInput.setCustomValidity('');
        if (phoneInput.validity.valueMissing) {
            const msg = '手機號碼為必填欄位';
            phoneInput.setCustomValidity(msg);
            showError(phoneInput, phoneError, msg);
            return false;
        }
        if (phoneInput.validity.patternMismatch) {
            const msg = '請輸入以 09 開頭的 10 碼手機號碼';
            phoneInput.setCustomValidity(msg);
            showError(phoneInput, phoneError, msg);
            return false;
        }
        clearError(phoneInput, phoneError);
        return true;
    };

    const validatePassword = () => {
        passwordInput.setCustomValidity('');
        const value = passwordInput.value;
        const mixRegex = /(?=.*[a-zA-Z])(?=.*\d)/; // 至少一個英文和一個數字

        if (passwordInput.validity.valueMissing) {
            const msg = '密碼為必填欄位';
            passwordInput.setCustomValidity(msg);
            showError(passwordInput, passwordError, msg);
            return false;
        }
        if (passwordInput.validity.tooShort) {
            const msg = '密碼長度至少 8 碼';
            passwordInput.setCustomValidity(msg);
            showError(passwordInput, passwordError, msg);
            return false;
        }
        if (!mixRegex.test(value)) {
            const msg = '密碼需包含至少一個英文和一個數字';
            passwordInput.setCustomValidity(msg);
            showError(passwordInput, passwordError, msg);
            return false;
        }
        clearError(passwordInput, passwordError);
        return true;
    };

    const validateConfirmPassword = () => {
        confirmPasswordInput.setCustomValidity('');
        if (confirmPasswordInput.validity.valueMissing) {
            const msg = '確認密碼為必填欄位';
            confirmPasswordInput.setCustomValidity(msg);
            showError(confirmPasswordInput, confirmPasswordError, msg);
            return false;
        }
        if (confirmPasswordInput.value !== passwordInput.value) {
            const msg = '兩次輸入的密碼不一致';
            confirmPasswordInput.setCustomValidity(msg);
            showError(confirmPasswordInput, confirmPasswordError, msg);
            return false;
        }
        clearError(confirmPasswordInput, confirmPasswordError);
        return true;
    };

    const validateInterests = () => {
        const firstCheckbox = interestsGroup.querySelector('input');
        if (firstCheckbox) firstCheckbox.setCustomValidity('');

        const checkedCount = interestsGroup.querySelectorAll('input[name="interest"]:checked').length;
        if (checkedCount < 1) {
            const msg = '請至少勾選 1 個興趣';
            if (firstCheckbox) firstCheckbox.setCustomValidity(msg);
            interestError.textContent = msg;
            interestError.classList.add('is-visible');
            return false;
        }
        interestError.textContent = '';
        interestError.classList.remove('is-visible');
        return true;
    };

    const validateTerms = () => {
        termsCheckbox.setCustomValidity('');
        if (!termsCheckbox.checked) {
            const msg = '您必須同意服務條款';
            termsCheckbox.setCustomValidity(msg);
            showError(termsCheckbox, termsError, msg);
            return false;
        }
        clearError(termsCheckbox, termsError);
        return true;
    };

    // 密碼強度
    const updatePasswordStrength = () => {
        if (!passwordStrengthBar) return;

        const value = passwordInput.value;
        let score = 0;
        if (value.length >= 8) score++;
        if (value.length >= 10) score++;
        if (/(?=.*[a-z])/.test(value) && /(?=.*[A-Z])/.test(value)) score++;
        if (/(?=.*\d)/.test(value)) score++; 
        if (/(?=.*[^a-zA-Z0-9])/.test(value)) score++; 

        let text = '弱';
        let color = '#d9534f'; 
        let width = '20%';

        if (value.length === 0) {
            text = '';
            width = '0%';
        } else if (score >= 4) {
            text = '強';
            color = '#5cb85c'; 
            width = '100%';
        } else if (score >= 2) {
            text = '中';
            color = '#f0ad4e'; 
            width = '60%';
        } else {
            width = '30%';
        }

        passwordStrengthBar.style.width = width;
        passwordStrengthBar.style.backgroundColor = color;
        passwordStrengthBar.textContent = text;
        passwordStrengthBar.style.display = value.length > 0 ? 'block' : 'none';
    };


    const saveToLocalStorage = () => {
        const checkedInterests = Array.from(interestsGroup.querySelectorAll('input:checked')).map(cb => cb.value);
        const data = {
            name: nameInput.value,
            email: emailInput.value,
            phone: phoneInput.value,
            interests: checkedInterests
            
        };
        localStorage.setItem(lsKey, JSON.stringify(data));
    };

    const loadFromLocalStorage = () => {
        const data = JSON.parse(localStorage.getItem(lsKey));
        if (data) {
            nameInput.value = data.name || '';
            emailInput.value = data.email || '';
            phoneInput.value = data.phone || '';
            if (data.interests && Array.isArray(data.interests)) {
                data.interests.forEach(value => {
                    const cb = interestsGroup.querySelector(`input[value="${value}"]`);
                    if (cb) {
                        cb.checked = true;
                        const lab = cb.closest('label');
                        if (lab) lab.classList.add('checked');
                    }
                });
            }
        }
    };
    

    const addLiveValidation = (inputEl, validationFn) => {
        inputEl.addEventListener('blur', () => {
            touchedFields.add(inputEl.id);
            validationFn();
        });

        inputEl.addEventListener('input', () => {
            if (touchedFields.has(inputEl.id)) {
                validationFn();
            }
        });
    };

    addLiveValidation(nameInput, validateName);
    addLiveValidation(emailInput, validateEmail);
    addLiveValidation(phoneInput, validatePhone);
    
    passwordInput.addEventListener('blur', () => {
        touchedFields.add(passwordInput.id);
        validatePassword();
    });
    passwordInput.addEventListener('input', () => {
        if (touchedFields.has(passwordInput.id)) {
            validatePassword();
            if (touchedFields.has(confirmPasswordInput.id) || confirmPasswordInput.value.length > 0) {
                validateConfirmPassword();
            }
        }
        updatePasswordStrength();// 即時更新密碼強度
    });

    // 確認密碼欄位
    addLiveValidation(confirmPasswordInput, validateConfirmPassword);

    interestsGroup.addEventListener('click', (e) => {
        if (e.target && e.target.type === 'checkbox') {
            touchedFields.add('interests-group');
            validateInterests();

            const lab = e.target.closest('label');
            if (lab) {
                if (e.target.checked) lab.classList.add('checked');
                else lab.classList.remove('checked');
            }
        }
    });

    // 服務條款
    termsCheckbox.addEventListener('change', (e) => {
        if (termsCheckbox.checked) {
            // 顯示服務條款提示
            alert('我是服務條款');
        }
        touchedFields.add(termsCheckbox.id);
        validateTerms();
    });

    [nameInput, emailInput, phoneInput].forEach(input => {
        input.addEventListener('input', saveToLocalStorage);
    });
    interestsGroup.addEventListener('click', (e) => {
         if (e.target.type === 'checkbox') saveToLocalStorage();
    });
    

    // 送出攔截

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        [nameInput, emailInput, phoneInput, passwordInput, confirmPasswordInput, termsCheckbox].forEach(input => touchedFields.add(input.id));
        touchedFields.add('interests-group');

        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        const isInterestsValid = validateInterests();
        const isTermsValid = validateTerms();
        
        const isFormValid = isNameValid && isEmailValid && isPhoneValid && isPasswordValid && isConfirmPasswordValid && isInterestsValid && isTermsValid;

        if (isFormValid) {
            console.log('表單驗證成功，準備送出...');
            
            submitButton.disabled = true;
            submitButton.textContent = '註冊中...';
            
            setTimeout(() => {
                alert('註冊成功！'); 
                
                form.reset(); 
                
                submitButton.disabled = false;
                submitButton.textContent = '註冊';
                touchedFields.clear();
                
                clearError(nameInput, nameError);
                clearError(emailInput, emailError);
                clearError(phoneInput, phoneError);
                clearError(passwordInput, passwordError);
                clearError(confirmPasswordInput, confirmPasswordError);
                clearError(termsCheckbox, termsError);
                interestError.textContent = '';
                interestError.classList.remove('is-visible');
                
                interestsGroup.querySelectorAll('label').forEach(l => l.classList.remove('checked'));

                if (passwordStrengthBar) {
                    passwordStrengthBar.style.width = '0%';
                    passwordStrengthBar.textContent = '';
                    passwordStrengthBar.style.display = 'none';
                }
                
                localStorage.removeItem(lsKey);

            }, 1000);// 1秒延遲

        } else {
            console.log('表單驗證失敗');
            
            let firstErrorInput = null;
            if (!isNameValid) firstErrorInput = nameInput;
            else if (!isEmailValid) firstErrorInput = emailInput;
            else if (!isPhoneValid) firstErrorInput = phoneInput;
            else if (!isPasswordValid) firstErrorInput = passwordInput;
            else if (!isConfirmPasswordValid) firstErrorInput = confirmPasswordInput;
            else if (!isInterestsValid) firstErrorInput = interestsGroup.querySelector('input');
            else if (!isTermsValid) firstErrorInput = termsCheckbox;
            
            if (firstErrorInput) {
                firstErrorInput.focus();
            }
        }
    });

    // 重設按鈕
    resetButton.addEventListener('click', (e) => {
        e.preventDefault();

        form.reset();
        
        const allInputs = [nameInput, emailInput, phoneInput, passwordInput, confirmPasswordInput, termsCheckbox];
        const allErrorEls = [nameError, emailError, phoneError, passwordError, confirmPasswordError, termsError, interestError];
        
        allInputs.forEach(input => input.classList.remove('is-invalid'));
        allErrorEls.forEach(el => {
            el.textContent = '';
            el.classList.remove('is-visible');
        });
        
        interestsGroup.querySelectorAll('label').forEach(l => l.classList.remove('checked'));
        
        if (passwordStrengthBar) {
            passwordStrengthBar.style.width = '0%';
            passwordStrengthBar.textContent = '';
            passwordStrengthBar.style.display = 'none';
        }
        
        localStorage.removeItem(lsKey);
        
        touchedFields.clear();
        
        console.log('表單已重設');
    });

    loadFromLocalStorage();
    
});
