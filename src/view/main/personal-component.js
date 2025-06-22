import Component from '../../framework/component.js';

export default class PersonalComponent extends Component {
  constructor() {
      super(`
      <div id="personal">
            <img class="information"
            src="../images/forum.png"
            alt="infa"
          />
          <div class="personal">
            <span>Возникли сложности с вязанием? <br>
                Смотри видео, которые тебе <br> помогут, или же переходи <br> в форум-обсуждение,
                 <br> где опытные рукодельницы <br> тебе подскажут</span>
          </div>
        </div>
    `);
  }
}
