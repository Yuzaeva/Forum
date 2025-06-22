import HeaderPresenter from "./presenter/main-preseneter.js";
import ForumPagePresenter from "./presenter/forum-presenter.js";
import FooterComponent from "./view/main/footer-component.js";
import { render } from "./framework/render.js";
import ForumModel from "./model/forum/forum-model.js"; 

document.addEventListener('DOMContentLoaded', () => {
  const headerPresenter = new HeaderPresenter('.header-container');
  headerPresenter.init();

  const container = document.querySelector('.forum-root');
  const footerContainer = document.querySelector('.footer');

  if (footerContainer) {
    const footer = new FooterComponent();
    render(footer, footerContainer);
  }

  if (container) {
    const forumPresenter = new ForumPagePresenter(container, ForumModel);
    forumPresenter.init(); 
  }
});
