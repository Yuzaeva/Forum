import TopicItemComponent from "./topic-item-component.js";
export default class TopicListComponent {
  constructor(presenter) {
    this.presenter = presenter;
    this.container = document.createElement('div');
    this.container.classList.add('topics');
    this.container.innerHTML = `<ul class="topics-list"></ul>`;
    this.list = this.container.querySelector('.topics-list');
    this.topics = [];
    this.currentUserId = null;
  }

  updateTopics(topics, currentUserId) {
    if (!Array.isArray(topics)) {
      console.error('Ошибка: topics не является массивом.');
      return;
    }

    this.topics = topics;
    this.currentUserId = currentUserId;
    return this.render();
  }

  render() {
    this.list.innerHTML = '';

    this.topics.forEach(topic => {
      const topicItem = new TopicItemComponent(topic, this.currentUserId, this.presenter);
      this.list.appendChild(topicItem.render());
    });

    return this.container;
  }
}
