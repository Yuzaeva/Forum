import { render } from './framework/render.js';
import AboutModel from './model/about/about-model.js';
import AboutComponent from './view/about/about-component.js';
import FooterComponent from './view/main/footer-component.js';
import AboutPresenter from './presenter/about-presenter.js';
import HeaderPresenter from './presenter/main-preseneter.js';

class App {
  constructor() {
    this._headerPresenter = null;
    this._aboutPresenter = null;
    this._initTime = performance.now();
  }

  init() {
    document.addEventListener('DOMContentLoaded', () => this._onDOMLoaded());
  }

  _onDOMLoaded() {
    this._initHeader();
    this._initAboutSection();
    this._initFooter();
    this._logInitTime();
  }

  _initHeader() {
    const headerContainer = document.querySelector('.header-container');
    if (!headerContainer) {
      console.warn('Header container not found');
      return;
    }

    this._headerPresenter = new HeaderPresenter('.header-container');
    this._headerPresenter.init();
  }

  _initAboutSection() {
    const aboutContainer = document.querySelector('.about');
    if (!aboutContainer) {
      console.warn('About container not found');
      return;
    }

    const aboutComponent = new AboutComponent();
    render(aboutComponent, aboutContainer);

    const aboutModel = new AboutModel();
    this._aboutPresenter = new AboutPresenter(aboutModel, aboutComponent);
    this._aboutPresenter.init();
  }

  _initFooter() {
    const footerContainer = document.querySelector('.footer');
    if (!footerContainer) {
      console.warn('Footer container not found');
      return;
    }

    const footerComponent = new FooterComponent();
    render(footerComponent, footerContainer);
  }

  _logInitTime() {
    const initTime = (performance.now() - this._initTime).toFixed(2);
    console.debug(`Application initialized in ${initTime}ms`);
  }
}

// Запуск приложения
const app = new App();
app.init();