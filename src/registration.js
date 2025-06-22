import RegistrationPresenter from './presenter/registration-presenter.js';
import RegistrationModel from './model/registration/registration-model.js'; // Подключаем модель

// Получаем контейнер, куда будем рендерить
const authContainer = document.getElementById('auth-container');

if (authContainer) {
    // Создаём экземпляры модели и презентера
    const registrationModel = new RegistrationModel();
    const registrationPresenter = new RegistrationPresenter(authContainer, registrationModel);

    // Инициализируем презентер
    registrationPresenter.init();
} else {
    console.error("Ошибка: контейнер #auth-container не найден!");
}
