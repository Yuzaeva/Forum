import { RenderPosition, render } from '../src/framework/render.js';
import HeaderComponent from './view/main/header-component.js';
import PersonalComponent from './view/main/personal-component.js';
import OnlyComponent from './view/main/only-component.js';
import VideoComponent from './view/main/video-component.js';
import FooterComponent from './view/main/footer-component.js';
import HeaderPresenter from './presenter/main-preseneter.js';

document.addEventListener('DOMContentLoaded', () => {
const headerPresenter = new HeaderPresenter('.header-container');
headerPresenter.init();

  // Остальные компоненты
  const formContainer = document.querySelector('.main');
  render(new PersonalComponent(), formContainer);
  render(new OnlyComponent(), formContainer);
  render(new VideoComponent(), formContainer);
  render(new FooterComponent(), formContainer);
});
