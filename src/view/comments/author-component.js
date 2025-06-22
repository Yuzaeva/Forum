export class AuthorComponent {
  constructor(name, photopath = '/images/default-avatar.jpg', date = null) {
    this.name = name;
    this.photopath = photopath || '/images/default-avatar.jpg';
    this.date = date;
  }

  render() {
    const authorDiv = document.createElement('div');
    authorDiv.className = 'author';
    authorDiv.innerHTML = `
      <div class="photo">
        <img src="${this.photopath}" alt="Фото профиля" width="150" />
      </div>
      <p class="name">${this.name}</p>
      ${this.date ? `<span class="data">${this.date}</span>` : ''}
    `;
    return authorDiv;
  }
}
