export default class PostsTabComponent {
  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'posts-container';
  }

  formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

  // Шаблон: Загрузка
  getLoadingTemplate() {
    return `
      <div class="loading-state">
        <div class="spinner"></div>
        <p>Загрузка ваших ответов...</p>
      </div>
    `;
  }

  // Шаблон: Пусто
  getEmptyTemplate() {
    return `
      <div class="empty-list">
        <img class="dialog" src="../images/dialog.svg" alt="Нет избранного">
        <div class="text">У вас пока нет ответов</div>
      </div>
    `;
  }

  // Шаблон: Ошибка
  getErrorTemplate(message) {
    return `
      <div class="error-state">
        <img class="dialog" src="../images/dialog.svg" alt="Ошибка">
        <p>${message}</p>
        <button class="retry-button">Повторить попытку</button>
      </div>
    `;
  }

  // Шаблон: Список постов
  getListTemplate(posts, topicMap) {
    return `
        <div class="posts-list">
        ${posts.map(post => {
            const topic = topicMap[post.topic_id];
            return `
            <div class="posts-item" data-post-id="${post.post_id}">
                <div class="post_topic">
                    <div class="posts-question">${topic?.title || 'Без темы'}</div>
                    <div class="posts-content">${post.post_content}</div>
                </div>
                <div class="posts-date">${this.formatDate(post.post_date)}</div>
                <div class="answers__actions">
                <button class="remove-post" data-post-id="${post.post_id}">
                    <img src="../../images/delete.png" alt="Удалить" width="30" height="30">
                </button>
                </div>
            </div>
            `;
        }).join('')}
        </div>
    `;
    }

  // Отображение: загрузка
  showLoading() {
    this.container.innerHTML = this.getLoadingTemplate();
  }

  // Отображение: пусто
  showEmpty() {
    this.container.innerHTML = this.getEmptyTemplate();
  }

  // Отображение: ошибка
  showError(message) {
    this.container.innerHTML = this.getErrorTemplate(message);
    this.bindRetryButton();
  }

  
  update(posts, topicMap) {
    if (!posts || posts.length === 0) {
        this.showEmpty();
    } else {
        this.container.innerHTML = this.getListTemplate(posts, topicMap);
        this.bindRemoveButtons();
        this.bindItemClicks();
    }
    }
  // Обработчик кнопки "Повторить"
  bindRetryButton() {
    const button = this.container.querySelector('.retry-button');
    if (button) {
      button.addEventListener('click', () => this.onRetry?.());
    }
  }

  // Обработчик удаления постов
  bindRemoveButtons() {
    this.container.querySelectorAll('.remove-post').forEach(button => {
      button.addEventListener('click', (e) => {
        e.stopPropagation();
        const postId = button.dataset.postId;
        this.onRemove?.(postId);
      });
    });
  }

  bindItemClicks() {
    this.container.querySelectorAll('.posts-item').forEach(item => {
      item.addEventListener('click', () => {
        const postId = item.dataset.postId;
        this.onItemClick?.(postId);
      });
    });
  }

  render() {
    return this.container;
  }

  // Колбэки
  onRetry = null;
  onRemove = null;
  onItemClick = null;
}
