import HeaderComponent from '../view/main/header-component.js';

export default class HeaderPresenter {
  constructor(container, model) {
    this._container = document.querySelector(container);
    this._headerComponent = new HeaderComponent();
    this._currentAuthState = false;
    this._model = model;
  }

  init() {
    if (!this._container) {
      console.error(`Контейнер ${this._container} не найден`);
      return;
    }

    this._container.append(this._headerComponent.element);
    this._checkAuthStatus();
  }

  async _checkAuthStatus() {
    try {
      const response = await fetch('/api/check-auth', {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      const data = await response.json();

      this._currentAuthState = !!data.user;
      this._headerComponent.update(this._currentAuthState, data.user);

      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Ошибка проверки авторизации:', error);
      this._fallbackAuthCheck();
    }
  }

  _fallbackAuthCheck() {
    const userData = localStorage.getItem('user');
    const authState = !!userData;
    this._headerComponent.update(
      authState,
      authState ? JSON.parse(userData) : null
    );
  }

  async handleLogout() {
    if (!this._model || typeof this._model.logout !== 'function') {
      console.error('Model не передана или нет метода logout');
      return;
    }
    try {
      await this._model.logout();
      localStorage.removeItem('user');
      window.location.href = '/';
    } catch (error) {
      console.error('Ошибка выхода из системы:', error);
    }
  }
}
