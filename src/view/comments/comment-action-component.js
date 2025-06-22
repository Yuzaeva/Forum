export default class CommentActionsComponent {
  constructor(comment, presenter) {
    this.comment = comment;
    this.presenter = presenter;
    this.container = document.createElement('div');
    this.container.classList.add('comment-actions');
  }

  render(isOwner = false) {
    this.container.innerHTML = `
      ${isOwner ? `
        <button class="edit-btn">
          <img src="../../images/edit.png" alt="Редактировать" width="30" height="30">
        </button>
        <button class="delete-btn">
          <img src="../../images/delete.png" alt="Удалить" width="30" height="30">
        </button>
      ` : ''}
    `;

    if (isOwner) {
      this.container.querySelector('.edit-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        this.presenter.handleEditClick(this.comment);
      });

      this.container.querySelector('.delete-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        this.presenter.handleDeleteClick(this.comment);
      });
    }

    return this.container;
  }
}
