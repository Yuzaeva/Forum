import HeaderComponent from './view/main/header-component.js';
import ProfilePresenter from './presenter/profile-presenter.js';
import ProfileModel from './model/profile/profile-model.js';
import FooterComponent from './view/main/footer-component.js';
import { render, RenderPosition } from './framework/render.js';
import HeaderPresenter from './presenter/main-preseneter.js';

document.addEventListener('DOMContentLoaded', () => {
  const headerPresenter = new HeaderPresenter('.header-container');
  headerPresenter.init();

  const infoContainer = document.getElementById('profile-info-container');
  const activityContainer = document.getElementById('profile-activity-container');
  const footerContainer = document.querySelector('.footer');

  if (footerContainer) {
    const footer = new FooterComponent();
    render(footer, footerContainer);
  }

  if (infoContainer && activityContainer) {
    const model = new ProfileModel();
    const presenter = new ProfilePresenter(model, infoContainer, activityContainer);
    presenter.init();
  } else {
    console.warn('Контейнеры профиля не найдены.');
  }
});
