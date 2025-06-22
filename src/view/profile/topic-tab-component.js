export default class TopicTabComponent {
  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'topic-container';
    this.container.innerHTML = this.getLoadingTemplate();
  }

  // Шаблоны
  getLoadingTemplate() {
    return `
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Загрузка ваших тем...</p>
      </div>
    `;
  }

  getEmptyTemplate() {
    return `
      <div class="empty-list">
        <img class="dialog" src="../images/dialog.svg" alt="Нет избранного">
        <div class="text">У вас пока нет созданных тем</div>
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

  getListTemplate(topics) {
    return `
      <div class="topics-list">
        ${topics.map(topic => `
          <div class="topics-item" data-topic-id="${topic.topic_id}">
            <div class="topics-content">
              <h3 class="topics-title">${topic.title}</h3>
              <div class="topics-meta">
                <span class="author">${topic.author}</span>
                <span class="date">${new Date(topic.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <button class="remove-topic" data-topic-id="${topic.topic_id}">
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

  update(topics) {
    if (!topics || topics.length === 0) {
      this.showEmpty();
    } else {
      this.container.innerHTML = this.getListTemplate(topics);
      this.bindRemoveButtons();
      this.bindItemClicks();
    }
  }

  // Обработчики событий
  bindRetryButton() {
    const button = this.container.querySelector('.retry-button');
    if (button) {
      button.addEventListener('click', () => this.onRetry?.());
    }
  }

  bindRemoveButtons() {
    this.container.querySelectorAll('.remove-topic').forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const topicId = button.dataset.topicId;
        this.onRemove?.(topicId);
      });
    });
  }

  bindItemClicks() {
    this.container.querySelectorAll('.topics-item').forEach(item => {
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