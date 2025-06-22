export default class ProfileEditComponent {
    constructor(presenter) {
      this.presenter = presenter;
      this.container = document.createElement('div');
      this.container.classList.add('profile-edit');
  
      this.container.innerHTML = `
        <form id="edit-form">
          <label>Имя: <input type="text" id="edit-name" /></label>
          <label>Почта: <input type="email" id="edit-email" /></label>
          <button type="submit">Сохранить</button>
          <button type="button" id="cancel-edit">Отмена</button>
        </form>
      `;
  
      this.form = this.container.querySelector('#edit-form');
      this.cancelButton = this.container.querySelector('#cancel-edit');
  
      this.form.addEventListener('submit', this.onSubmit.bind(this));
      this.cancelButton.addEventListener('click', () => this.presenter.cancelEdit());
    }
  
    render(profileData) {
      this.container.querySelector('#edit-name').value = profileData.name;
      this.container.querySelector('#edit-email').value = profileData.email;
      return this.container;
    }
  
    onSubmit(event) {
      event.preventDefault();
      const name = this.container.querySelector('#edit-name').value;
      const email = this.container.querySelector('#edit-email').value;
      this.presenter.saveProfileChanges({ name, email });
    }
  }
  