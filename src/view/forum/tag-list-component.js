import { defaultTagGroups } from "../../const.js";

export default class TagListComponent {
  constructor(presenter, tags = []) {
    this.presenter = presenter;
    this.tags = tags;
    this.container = document.createElement('div');
    this.container.classList.add('tag-list-container');

    this.container.innerHTML = `
      <h3>Популярные теги</h3>
      <button class="tag-reset">Показать все</button>
      <div class="tag-groups">${this.createTagGroups()}</div>
    `;

    this.container.querySelector('.tag-reset').addEventListener('click', () => {
    this.presenter.handleTagReset();
    });

    this.container.addEventListener('click', (e) => {
      if (e.target.classList.contains('tag')) {
        this.presenter.handleSearchByTag(e.target.textContent);
      }
    });
  }

  createTagGroups() {
    const groups = [...defaultTagGroups];

    if (this.tags.length > 0) {
      groups.push({
        title: 'Другие теги',
        tags: this.tags,
      });
    }

    return groups.map(group => this.createGroup(group.title, group.tags)).join('');
  }

  createGroup(title, tags) {
    const items = tags.map(tag => `<li><button class="tag">${tag}</button></li>`).join('');
    return `<h3>${title}</h3><ul class="tag-list">${items}</ul>`;
  }

  render() {
    return this.container;
  }
}