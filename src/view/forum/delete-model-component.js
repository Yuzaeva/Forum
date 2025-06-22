import Component from '../../framework/component.js';

export default class DeleteComponent extends Component {
  constructor() {
      super(`
     <div id="deleteModal" class="modal hidden">
        <div class="modal-content">
            <p>Вы уверены, что хотите удалить тему?</p>
            <div class="modal-buttons">
            <button id="confirmDeleteBtn">Удалить</button>
            <button id="cancelDeleteBtn">Отмена</button>
            </div>
        </div>
    </div>
    `);
  }
  
  render() {
    return this.element;
  }
}
