import Component from '../../framework/component.js';

export default class EditComponent extends Component {
  constructor() {
    super(`
      <div id="editModal" class="modal hidden">
        <div class="modal-content">
          <p>Редактировать тему</p>
          <div class="modal-body">
            <label for="editTitleInput">Заголовок:</label>
            <input type="text" id="editTitleInput" placeholder="Введите новый заголовок">
            <label for="editTagsInput">Теги:</label>
            <input type="text" id="editTagsInput" placeholder="Введите новый тег при необходимости">
            <label for="editDescriptionInput">Описание</label>
            <textarea id="editDescriptionInput" rows="4"></textarea>
          </div>
          <div class="modal-buttons">
            <button id="confirmEditBtn">Сохранить</button>
            <button id="cancelEditBtn">Отмена</button>
          </div>
        </div>
      </div>
    `);
  }

  render() {
    return this.element;
  }
}
