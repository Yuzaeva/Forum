export default class RegistrationModel {
    validateEmail(email) {
        return /\S+@\S+\.\S+/.test(email);
    }

    validatePassword(password) {
        return password.length >= 6;
    }

    validateName(name) {
        return name.length >= 2;
    }

    // Валидация для регистрации
    validateSignUp(data) {
        const { name, email, password } = data;
        let errors = {};

        if (!this.validateName(name)) errors.name = "Имя должно быть не менее 2 символов";
        if (!this.validateEmail(email)) errors.email = "Неверный формат email";
        if (!this.validatePassword(password)) errors.password = "Пароль должен быть не менее 6 символов";

        return errors;
    }

    // Валидация для входа
    validateSignIn(data) {
        const { email, password } = data;
        let errors = {};

        if (!this.validateEmail(email)) errors.email = "Неверный формат email";
        if (!this.validatePassword(password)) errors.password = "Пароль должен быть не менее 6 символов";

        return errors;
    }
}
