export default class TopicFormComponent {
  constructor(presenter) {
    this.presenter = presenter;
    this.container = document.createElement('div');
    this.container.classList.add('topics');

    this.container.innerHTML = `
      <form id="new-topic-form">
        <div class="topic-form-header">
          <input type="text" id="topic-title" placeholder="Название темы" required />
          <input type="text" id="topic-tags" placeholder="Теги (необязательно)" />
        </div>
        <textarea id="topic-description" name="topic-description" placeholder="Описание темы" rows="5" cols="40"></textarea>
        <button type="submit">Создать тему</button>
        <div id="form-error-message" style="color: red; margin-top: 8px;"></div>
      </form>
    `;

    this.form = this.container.querySelector('#new-topic-form');
    this.titleInput = this.container.querySelector('#topic-title');
    this.descriptionInput = this.container.querySelector('#topic-description');
    this.tagsInput = this.container.querySelector('#topic-tags');
    this.errorMessage = this.container.querySelector('#form-error-message');

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = this.titleInput.value.trim();
      const description = this.descriptionInput.value.trim();
      const tags = this.tagsInput.value.trim().split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      if (!title) return;

      const topicData = { title, description, tags };
      this.presenter.handleTopicSubmit(topicData);
      this.form.reset();
    });
  }

  showError(message) {
    this.errorMessage.textContent = message;

    // Очистить сообщение через 5 секунд
    if (this.errorTimeout) clearTimeout(this.errorTimeout);
    this.errorTimeout = setTimeout(() => {
      this.errorMessage.textContent = '';
    }, 5000);
  }

  render() {
    return this.container;
  }
}
