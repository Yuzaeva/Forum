export default class ProfileActivityComponent {
  constructor() {
    this.container = document.createElement('div');
    this.container.classList.add('user-active');
    this.container.innerHTML = `
      <div class="statistic">
        <div class="statistic-item">
          <h1 class="topics-count">0</h1>
          <p>Созданных тем</p>
        </div>
        <div class="statistic-item">
          <h1 class="replies-count">0</h1>
          <p>Ответов на форуме</p>
        </div>
      </div>
      <div class="tabs-container"></div>
      <div class="substrate">
        <div class="empty-list">
          <img class="dialog" src="../images/dialog.svg" alt="dialog" />
          <div class="text">Участвуйте в обсуждениях на форуме и сможете следить здесь за вашей активностью.</div>
        </div>
      </div>
    `;

    this.tabsContainer = this.container.querySelector('.tabs-container');

    this.topicsCountElement = this.container.querySelector('.topics-count');
    this.repliesCountElement = this.container.querySelector('.replies-count');
  }

  render() {
    return this.container;
  }

  setTabs(tabsElement) {
    this.tabsContainer.innerHTML = '';
    this.tabsContainer.appendChild(tabsElement);
  }

  updateStats({ topics, replies }) {
    this.topicsCountElement.textContent = topics;
    this.repliesCountElement.textContent = replies;
  }
}
