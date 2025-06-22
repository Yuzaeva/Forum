export default class HeaderComponent {
  constructor() {
    this._element = null;
    this._authState = false;
    this._userData = null;
    this._logoutHandler = null;
  }

  get template() {
    return `
      <header class="site-header">    
        <span><a href="../pages/about.html">О нас</a></span>
        <span><a href="../pages/forum.html">Обсуждение</a></span>
        ${this._authState ? `
          <span class="profile"><a href="../pages/profile.html">Профиль</a></span>
        ` : `
          <span class="auth-link">
            <a href="../pages/registration.html" class="auth-link-text">Регистрация и вход</a>
          </span>
        `}
        <img class="header-search" src="../images/search.svg" alt="search" />
        <a href="../pages/main.html" class="footer-top__link logo">
          <img src="../images/logo.png" alt="logo" class="logo" />
        </a>
      </header>
    `;
  }

  get element() {
    if (!this._element) {
      this._element = this._createElement(this.template);
      this._setEventListeners();
    }
    return this._element;
  }

  _createElement(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.firstElementChild;
  }

  _setEventListeners() {
    if (this._authState) {
      const logoutBtn = this._element.querySelector('.logout-btn');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          this._logoutHandler?.();
        });
      }
    }
  }

  update(authState, userData = null) {
    const prevAuthState = this._authState;
    this._authState = authState;
    this._userData = userData;

    if (this._element && prevAuthState !== authState) {
      const parent = this._element.parentElement;
      const newElement = this._createElement(this.template);
      parent.replaceChild(newElement, this._element);
      this._element = newElement;
      this._setEventListeners();
    }
  }

  setLogoutHandler(handler) {
    this._logoutHandler = handler;
  }
}