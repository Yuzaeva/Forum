export class ThemComponent {
  constructor(title, description) {
    this.title = title;
    this.description = description;
  }

  render() {
    const container = document.createElement('div');
    container.innerHTML = `
      <h1 class="title">${this.title}</h1>
      <p class="description">${this.description}</p>
      <hr>
    `;
    return container;
  }
}
