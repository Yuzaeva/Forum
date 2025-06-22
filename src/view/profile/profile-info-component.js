export default class ProfileInfoComponent {
    constructor(presenter) {
      this.presenter = presenter;
      this.container = document.createElement('div');
      this.container.classList.add('user-info');
      this.container.innerHTML = `
        <div id="photo-section">
          <img id="profile-photo" src="/images/default-avatar.jpg" alt="Фото профиля" width="150" />
          <form id="photo-form" enctype="multipart/form-data">
            <input type="file" name="photo" accept="image/*" />
            <button type="submit">Загрузить фото</button>
          </form>
        </div>
        <div class="user-info__content">
          <h1>Привет, <span id="name">пользователь</span>!</h1>
          <p>Почта:</p>
          <span id="email">почта</span>
        </div>
        <button class="red">Редактировать профиль</button>
        <button id="logout">Выход</button>
      `;
  
      this.photoForm = this.container.querySelector('#photo-form');
      this.photoInput = this.photoForm.querySelector('input[type="file"]');
      this.logoutButton = this.container.querySelector('#logout');
      this.nameEl = this.container.querySelector('#name');
      this.emailEl = this.container.querySelector('#email');
      this.photoEl = this.container.querySelector('#profile-photo');
  
      this.photoForm.addEventListener('submit', this.onPhotoSubmit.bind(this));
      this.logoutButton.addEventListener('click', this.onLogout.bind(this));
    }
  
    render() {
      return this.container;
    }
  
    onPhotoSubmit(event) {
      event.preventDefault();
      if (!this.photoInput.files.length) return;
      const file = this.photoInput.files[0];
      this.presenter.handlePhotoUpload(file);
    }
  
    onLogout() {
      this.presenter.handleLogout();
    }
  
    updateProfile({ name, email, photoPath }) {
      this.nameEl.textContent = name;
      this.emailEl.textContent = email;
      if (photoPath) this.photoEl.src = photoPath;
      this.editButton = this.container.querySelector('.red');
      this.editButton.addEventListener('click', () => {
        this.presenter.editProfile();  
      });
    }
  }