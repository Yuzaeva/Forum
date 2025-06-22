import Component from '../../framework/component.js';

export default class CommentEditComponent extends Component {
  constructor() {
    super(`
      <div id="editModal" class="modal hidden">
        <div class="modal-content">
          <p>Редактировать комментарий</p>
          <div class="modal-body">
            <label for="editDescriptionInput">Содержание</label>
            <textarea id="editDescriptionInput" placeholder="Введите новый текст" rows="5" cols="40"></textarea>
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
