export default class ProfileTabsComponent {
    constructor(presenter) {
      this.presenter = presenter;
      this.container = document.createElement('div');
      this.container.classList.add('tabs');
  
      this.container.innerHTML = `
        <div class="tabs__tab" data-tab="topics">Темы</div>
        <div class="tabs__tab" data-tab="posts">Ответы</div>
        <div class="tabs__tab" data-tab="favorites">Избранное</div>
      `;
  
      this.container.addEventListener('click', (e) => {
        if (e.target.classList.contains('tabs__tab')) {
          this.setActiveTab(e.target.dataset.tab);
          this.presenter.switchTab(e.target.dataset.tab);
        }
      });
    }
  
    render() {
      return this.container;
    }
  
    setActiveTab(tab) {
      this.container.querySelectorAll('.tabs__tab').forEach(tabEl =>
        tabEl.classList.toggle('tabs__tab_active', tabEl.dataset.tab === tab)
      );
    }
  }
  