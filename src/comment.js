import { CommentsModel } from './model/comment/comment-model.js';
import { CommentsPresenter } from './presenter/comment-presenter.js';
import HeaderPresenter from './presenter/main-preseneter.js';
import FooterComponent from './view/main/footer-component.js';
import { render } from './framework/render.js';

document.addEventListener('DOMContentLoaded', () => {
    const headerPresenter = new HeaderPresenter('.header-container');
    headerPresenter.init();
    const model = new CommentsModel();
    new CommentsPresenter(model); 

    const footerContainer = document.querySelector('.footer');
    if (footerContainer) {
      const footer = new FooterComponent();
      render(footer, footerContainer);
    }
});
