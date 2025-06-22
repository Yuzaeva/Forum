import Component from '../../framework/component.js';

export default class OnlyComponent extends Component {
    constructor() {
      super(`
        <section class="only">
          <h1 class="only__title">Только у нас</h1>
          <div class="only-circles">
            <div class="only-circle">
              <img src="../images/only2.png" alt="icon" class="only-circle__img" />
              <p class="only-circle__desc">Возможность <br> обсуждения</p>
            </div>
            <div class="only-circle">
              <img src="../images/only3.png" alt="icon" class="only-circle__img" />
              <p class="only-circle__desc">Поиск <br> по тегам</p>
            </div>
            <div class="only-circle">
              <img src="../images/only4.png" alt="icon" class="only-circle__img" />
              <p class="only-circle__desc">Продажа <br> товаров</p>
            </div>
          </div>
        </section>
      `);
    }
  }
  