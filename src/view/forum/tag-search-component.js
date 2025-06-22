export default class TagSearchComponent {
  constructor(presenter) {
    this.presenter = presenter;
    this.container = document.createElement('div');
    this.container.classList.add('tag-search-container');

    this.container.innerHTML = `
      <div class="tag-search">
        <input type="text" id="tag-search-input" placeholder="Введите тег (например, носки)">
      </div>
    `;

    this.container.querySelector('#tag-search-input').addEventListener('input', (e) => {
      const value = e.target.value.trim();
      this.presenter.handleSearchByTag(value);
    });
  }

  render() {
    return this.container;
  }
}