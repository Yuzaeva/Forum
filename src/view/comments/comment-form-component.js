export class CommentFormComponent {
  constructor(onSubmit) {
    this.onSubmit = onSubmit;
    this.errorTimeout = null;
    this.textarea = null; // добавлено
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.className = 'form_comments';

    wrapper.innerHTML = `
      <p class="form_txt">Ваш ответ автору</p>
      <textarea id="form_comment" placeholder="Ваш ответ" required></textarea>
      <button type="button" class="form_btn">Отправить</button>
      <div id="form-error-message" style="color: red; margin-top: 8px;"></div>
    `;

    const button = wrapper.querySelector('.form_btn');
    this.textarea = wrapper.querySelector('#form_comment'); 
    this.errorMessage = wrapper.querySelector('#form-error-message');

    button.addEventListener('click', () => {
      const comment = this.textarea.value.trim();
      if (!comment) {
        this.showError('Комментарий не может быть пустым.');
        return;
      }

      this.showError(''); 
      this.onSubmit(comment);
      this.textarea.value = ''; 
    });

    return wrapper;
  }

  showError(message) {
    if (this.errorTimeout) {
      clearTimeout(this.errorTimeout);
    }
    this.errorMessage.textContent = message;
    if (message) {
      this.errorTimeout = setTimeout(() => {
        this.errorMessage.textContent = '';
      }, 5000);
    }
  }

  clear() {
    if (this.textarea) {
      this.textarea.value = '';
    }
  }
}
