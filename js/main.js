// Валидация формы
class FormValidator {
    constructor(formSelector) {
        this.form = document.querySelector(formSelector);
        this.errors = {};
        this.init();
    }

    init() {
        if (!this.form) return;
        
        // Добавляем обработчики событий
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Валидация в реальном времени
        const inputs = this.form.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    // Обработка отправки формы
    handleSubmit(e) {
        e.preventDefault();
        
        // Очищаем предыдущие ошибки
        this.clearAllErrors();
        
        // Валидируем все поля
        const isValid = this.validateForm();
        
        if (isValid) {
            this.submitForm();
        } else {
            this.displayErrors();
        }
    }

    // Валидация всей формы
    validateForm() {
        const email = this.form.querySelector('input[placeholder="E-mail*"]');
        const organization = this.form.querySelector('input[placeholder="Название организации"]');
        const fullName = this.form.querySelector('input[placeholder="ФИО"]');
        const password = this.form.querySelector('input[placeholder="Пароль"]');
        const confirmPassword = this.form.querySelector('input[placeholder="Подтверждение пароля"]');
        const checkbox = this.form.querySelector('input[type="checkbox"]');

        let isValid = true;

        // Валидация email
        if (!this.validateEmail(email.value.trim())) {
            this.errors.email = 'Введите корректный email адрес';
            isValid = false;
        }

        // Валидация пароля
        if (!this.validatePassword(password.value)) {
            this.errors.password = 'Пароль должен содержать минимум 6 символов';
            isValid = false;
        }

        // Валидация подтверждения пароля
        if (password.value !== confirmPassword.value) {
            this.errors.confirmPassword = 'Пароли не совпадают';
            isValid = false;
        }

        // Валидация чекбокса согласия
        if (!checkbox.checked) {
            this.errors.checkbox = 'Необходимо дать согласие на обработку персональных данных';
            isValid = false;
        }

        // Валидация ФИО (необязательное, но если заполнено - проверяем)
        if (fullName.value.trim() && !this.validateFullName(fullName.value.trim())) {
            this.errors.fullName = 'ФИО должно содержать только буквы и пробелы';
            isValid = false;
        }

        return isValid;
    }

    // Валидация отдельного поля
    validateField(input) {
        const value = input.value.trim();
        const placeholder = input.getAttribute('placeholder');
        
        this.clearFieldError(input);

        switch (placeholder) {
            case 'E-mail*':
                if (!this.validateEmail(value)) {
                    this.showFieldError(input, 'Введите корректный email адрес');
                }
                break;
            case 'Пароль':
                if (!this.validatePassword(value)) {
                    this.showFieldError(input, 'Пароль должен содержать минимум 6 символов');
                }
                break;
            case 'Подтверждение пароля':
                const password = this.form.querySelector('input[placeholder="Пароль"]').value;
                if (value !== password) {
                    this.showFieldError(input, 'Пароли не совпадают');
                }
                break;
            case 'ФИО':
                if (value && !this.validateFullName(value)) {
                    this.showFieldError(input, 'ФИО должно содержать только буквы и пробелы');
                }
                break;
        }
    }

    // Валидация email
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return email && emailRegex.test(email);
    }

    // Валидация пароля
    validatePassword(password) {
        return password && password.length >= 6;
    }

    // Валидация ФИО
    validateFullName(fullName) {
        const nameRegex = /^[a-zA-Zа-яА-ЯёЁ\s]+$/;
        return nameRegex.test(fullName);
    }

    // Показать ошибку для поля
    showFieldError(input, message) {
        const container = input.closest('.form_input') || input.closest('.b-label');
        if (container) {
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = message;
            errorElement.style.color = '#ff0000';
            errorElement.style.fontSize = '12px';
            errorElement.style.marginTop = '5px';
            
            container.appendChild(errorElement);
            container.classList.add('has-error');
        }
    }

    // Очистить ошибку поля
    clearFieldError(input) {
        const container = input.closest('.form_input') || input.closest('.b-label');
        if (container) {
            const errorElement = container.querySelector('.error-message');
            if (errorElement) {
                errorElement.remove();
            }
            container.classList.remove('has-error');
        }
    }

    // Очистить все ошибки
    clearAllErrors() {
        this.errors = {};
        const errorElements = this.form.querySelectorAll('.error-message');
        errorElements.forEach(el => el.remove());
        
        const containers = this.form.querySelectorAll('.has-error');
        containers.forEach(container => container.classList.remove('has-error'));
    }

    // Отобразить ошибки
    displayErrors() {
        const email = this.form.querySelector('input[placeholder="E-mail*"]');
        const password = this.form.querySelector('input[placeholder="Пароль"]');
        const confirmPassword = this.form.querySelector('input[placeholder="Подтверждение пароля"]');
        const fullName = this.form.querySelector('input[placeholder="ФИО"]');
        const checkbox = this.form.querySelector('input[type="checkbox"]');

        if (this.errors.email) {
            this.showFieldError(email, this.errors.email);
        }
        if (this.errors.password) {
            this.showFieldError(password, this.errors.password);
        }
        if (this.errors.confirmPassword) {
            this.showFieldError(confirmPassword, this.errors.confirmPassword);
        }
        if (this.errors.fullName) {
            this.showFieldError(fullName, this.errors.fullName);
        }
        if (this.errors.checkbox) {
            this.showFieldError(checkbox, this.errors.checkbox);
        }
    }

    // Отправка формы (здесь можно добавить AJAX запрос)
    submitForm() {
        // Собираем данные формы
        const formData = new FormData(this.form);
        const data = {};
        
        data.email = this.form.querySelector('input[placeholder="E-mail*"]').value.trim();
        data.organization = this.form.querySelector('input[placeholder="Название организации"]').value.trim();
        data.fullName = this.form.querySelector('input[placeholder="ФИО"]').value.trim();
        data.password = this.form.querySelector('input[placeholder="Пароль"]').value;

        console.log('Данные формы:', data);
        
        // Здесь добавить отправку данных на сервер
        // fetch('/api/register', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(data)
        // })
        // .then(response => response.json())
        // .then(result => {
        //     console.log('Успех:', result);
        //     // Показать сообщение об успехе
        // })
        // .catch(error => {
        //     console.error('Ошибка:', error);
        //     // Показать сообщение об ошибке
        // });

        alert('Форма успешно отправлена!');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const validator = new FormValidator('.reg_form_block form');
});

