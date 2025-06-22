// src/presenter/about-presenter.js
export default class AboutPresenter {
    constructor(model, view) {
      this._model = model;
      this._view = view;
    }
  
    init() {
      this._view.render(this._model);
      this._bindEvents();
    }
  
    _bindEvents() {
      this._view.onJoinForumClick = () => {
        this._model.setLoading(true);
        this._view.render(this._model);
  
        setTimeout(() => { // Имитация API-запроса
          this._model.setLoading(false);
          this._view.render(this._model);
          alert("Добро пожаловать в форум!");
        }, 1500);
      };
    }
  }