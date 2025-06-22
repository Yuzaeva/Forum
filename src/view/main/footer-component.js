import Component from '../../framework/component.js';

export default class FooterComponent extends Component {
  constructor() {
      super(`
      <footer class="footer">
            <footer class="footer">
              <div class="footer-top">
                <a href="../pages/about.html" class="footer-top__link">О нас</a>
                <a href="#" class="footer-top__link logo"
                  ><img
                  src="../images/logo.png"
                  alt="logo"
                  class="logo"
                /></a>
                <a href="#Services" class="footer-top__link">На главную</a>
              </div>
              <div class="footer-bottom">
                <img src="../images/telegram.png" alt="telegram" class="footer_png" />
                <img src="../images/youtube.png" alt="youtube" class="footer_png" />
                <img src="../images/pinterest.png" alt="pinterest" class="footer_png" />
                <img src="../images/vk.png" alt="vk" class="footer_png" />
              </div>
          </footer>
    `);
  }
}