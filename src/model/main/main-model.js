class AuthModel {
    // Проверка авторизации
    isAuthenticated() {
        return localStorage.getItem('isAuthenticated') === 'true';
    }

    // Установить статус авторизации
    setAuthentication(status) {
        localStorage.setItem('isAuthenticated', status);
    }
}
