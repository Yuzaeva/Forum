export default class FavoritesComponent {
  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'favorites-container';
    this.container.innerHTML = this.getLoadingTemplate();
  }

  // Шаблоны
  getLoadingTemplate() {
    return `
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Загрузка избранного...</p>
      </div>
    `;
  }

  getEmptyTemplate() {
    return `
      <div class="empty-list">
        <img class="dialog" src="../images/dialog.svg" alt="Нет избранного">
        <div class="text">У вас пока нет избранных тем</div>
      </div>
    `;
  }

  getErrorTemplate(message) {
    return `
      <div class="error-state">
        <img class="dialog" src="../images/dialog.svg" alt="Ошибка">
        <p>${message}</p>
        <button class="retry-button">Повторить попытку</button>
      </div>
    `;
  }

  getListTemplate(favorites) {
    return `
      <div class="favorites-list">
        ${favorites.map(fav => `
          <div class="favorite-item" data-topic-id="${fav.topic_id}">
            <div class="favorite-content">
              <h3 class="favorite-title">${fav.title}</h3>
              <div class="favorite-meta">
                <span class="author">${fav.author}</span>
                <span class="date">${new Date(fav.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <button class="remove-favorite" data-topic-id="${fav.topic_id}">
              <img src="../../images/delete.png" alt="Удалить" width="30" height="30">
            </button>
          </div>
        `).join('')}
      </div>
    `;
  }

  showLoading() {
    this.container.innerHTML = this.getLoadingTemplate();
  }

  showEmpty() {
    this.container.innerHTML = this.getEmptyTemplate();
  }

  showError(message) {
    this.container.innerHTML = this.getErrorTemplate(message);
    this.bindRetryButton();
  }

  showFavorites(favorites) {
    this.container.innerHTML = this.getListTemplate(favorites);
    this.bindRemoveButtons();
    this.bindItemClicks();
  }

  // Обработчики событий
  bindRetryButton() {
    const button = this.container.querySelector('.retry-button');
    if (button) {
      button.addEventListener('click', () => this.onRetry?.());
    }
  }

  bindRemoveButtons() {
    this.container.querySelectorAll('.remove-favorite').forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const topicId = button.dataset.topicId;
        this.onRemove?.(topicId);
      });
    });
  }

  bindItemClicks() {
    this.container.querySelectorAll('.favorite-item').forEach(item => {
      item.addEventListener('click', () => {
        const topicId = item.dataset.topicId;
        this.onItemClick?.(topicId);
      });
    });
  }

  render() {
    return this.container;
  }

  onRetry = null;
  onRemove = null;
  onItemClick = null;
}