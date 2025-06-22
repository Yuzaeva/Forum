export default class TopicActionsComponent {
  constructor(topic, presenter) {
    this.topic = topic;
    this.presenter = presenter;
    this.container = document.createElement('div');
    this.container.classList.add('topic-actions');
  }

  render(isOwner = false) {
    const isFavourite = this.topic.favourited;

    this.container.innerHTML = `
      <button class="favourite-btn">
        <img src="../../images/${isFavourite ? 'favourite' : 'not-favourite'}.png" alt="Избранное" width="30" height="30">
      </button>
      ${isOwner ? `
        <button class="edit-btn">
          <img src="../../images/edit.png" alt="Редактировать" width="30" height="30">
        </button>
        <button class="delete-btn">
          <img src="../../images/delete.png" alt="Удалить" width="30" height="30">
        </button>
      ` : ''}
    `;

    this.container.querySelector('.favourite-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      this.presenter.toggleFavourite(this.topic.topic_id);
    });

    if (isOwner) {
      this.container.querySelector('.edit-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        this.presenter.handleEditClick(this.topic);
      });

      this.container.querySelector('.delete-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        this.presenter.handleDeleteClick(this.topic);
      });
    }

    return this.container;
  }
}
