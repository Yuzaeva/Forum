export default class ForumTitleComponent {
    constructor() {
      this.container = document.createElement('div');
      this.container.classList.add('forum-title');
      this.container.innerHTML = `<h1>Форум для общения</h1>`;
    }
  
    render() {
      return this.container;
    }
  }
  