import Component from '../../framework/component.js';

export default class VideoComponent extends Component {
  constructor() {
      super(`
      <div class="video">
            <h5 class="for_new_people">Для новичков</h5>
            <div class="youtube_video">
              <iframe width="900" height="500" src="https://rutube.ru/play/embed/e9a18e28c4dca079c8bc113e51e5920d/" 
              title="YouTube video player" frameBorder="0" allow="clipboard-write; autoplay" 
              webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>
              <iframe width="900" height="500" src="https://rutube.ru/play/embed/6d6adfcf5a7d1e065919c79e6d0ca0be/" 
              title="YouTube video player" frameBorder="0" allow="clipboard-write; autoplay" 
              webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>
            </div>
          </div>
    `);
  }
}