// src/view/about/about-component.js
import Component from "../../framework/component.js";

export default class AboutComponent extends Component {
  constructor() {
    super();
    this._model = null;
  }

  getTemplate() {
    if (!this._model) return '<div class="about">Загрузка...</div>';

    return `
      <section class="about">
        <h1 class="title1">${this._model.title}</h1>
        <div class="about1">
          <div class="inf1">
            <p class="inf_1">${this._model.description}</p>
            <span>Независимо от уровня вашего мастерства, вы всегда найдёте что-то полезное</span>
          </div>
          <img src="../images/inf_1.png" alt="Вязание" class="inf_1-img" />
        </div>
        <div class="about2">
          <div class="inf2">
            <h2 class="title2">Почему стоит присоединиться к нам?</h2>
            <ul class="inf_2"">
              ${this._model.reasonsToJoin.map(reason => `<li>${reason}</li>`).join("")}
            </ul>
          </div>
          <img src="../images/inf_2.png" alt="Пряжа" class="inf_2-img" />
        </div>
        <div class="inf3">
          <p class="inf_3">Мы верим, что вязание — это не просто хобби, а искусство и возможность самовыражения.
                    Присоединяйтесь к нашему сообществу, делитесь своими творческими находками</p>
          <a href="../pages/forum.html" target="_blank">
            <button class="forum">Вступить в форум!</button>
          </a>
          <p class="inf_3">Вяжите с удовольствием и находите друзей по интересам!</p>  
        </div>
      </section>
    `;
  }

  render(model) {
    this._model = model;
    this._element.innerHTML = this.getTemplate();
    return this._element;
  }

  set onJoinForumClick(callback) {
    this._element.addEventListener('click', (evt) => {
      if (evt.target.closest('.forum')) callback();
    });
  }
}