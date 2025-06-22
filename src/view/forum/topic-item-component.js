import TopicActionsComponent from './topic-actions-component.js';
export default class TopicItemComponent {
  constructor(topic, currentUserId, presenter) {
    this.topic = topic;
    this.currentUserId = currentUserId;
    this.presenter = presenter;
    this.container = document.createElement('li');
    this.container.classList.add('topic');
    this.container.dataset.tags = Array.isArray(topic.tags) ? topic.tags.join(',') : '';
  }

  render() {
    const title = this.topic.text || this.topic.title || 'Без названия';
    const author = this.topic.author || 'Неизвестен';

    this.container.innerHTML = `
      <div class="topic-text">
        <p>${title}</p>
        <span>Автор: ${author}</span>
      </div>
      <div class="topic-actions" data-topic-id="${this.topic.topic_id}"></div>
    `;

    this.container.addEventListener('click', () => {
      if (this.presenter?.handleTopicClick) {
        this.presenter.handleTopicClick(this.topic);
      }
    });

    if (this.currentUserId) {
      const actionsContainer = this.container.querySelector('.topic-actions');
      const actionsComponent = new TopicActionsComponent(this.topic, this.presenter);
      actionsContainer.appendChild(actionsComponent.render(this.currentUserId === this.topic.user_id));
    }

    return this.container;
  }
}
