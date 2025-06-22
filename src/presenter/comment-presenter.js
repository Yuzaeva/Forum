import { ThemComponent } from '../view/comments/them-component.js';
import { AuthorComponent } from '../view/comments/author-component.js';
import { CommentFormComponent } from '../view/comments/comment-form-component.js';
import { CommentListComponent } from '../view/comments/comment-list-component.js';
import CommentDeleteComponent from '../view/comments/comment-delete-component.js';
import CommentEditComponent from '../view/comments/comment-edit-component.js';

export class CommentsPresenter {
  constructor(topic, rootSelector = '#content_comments', currentUserId) {
    this.topic = topic; 
    this.topicId = topic.topic_id;
    this.root = document.querySelector(rootSelector);
    this.currentUserId = currentUserId;

    this.themComponent = new ThemComponent(topic.title, topic.description ?? ''); 
    this.authorComponent = new AuthorComponent(
      topic.author,
      topic.photopath,
    );
    this.commentFormComponent = new CommentFormComponent(this.handleAddComment.bind(this));
    this.commentListComponent = new CommentListComponent();
    this.commentEditComponent = new CommentEditComponent(this);
    this.commentDeleteComponent = new CommentDeleteComponent();

    this.renderInitialView();
  }

  renderInitialView() {
    this.root.appendChild(this.themComponent.render());
    this.root.appendChild(this.authorComponent.render());
    this.root.appendChild(document.createElement('hr'));
    this.root.appendChild(this.commentFormComponent.render());
    this.root.appendChild(this.commentListComponent.render());
    this.root.appendChild(this.commentDeleteComponent.getElement());
    this.root.appendChild(this.commentEditComponent.getElement());

    this.renderComments();
  }

async handleAddComment(content) {
  try {
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': this.getCSRFToken()
      },
      body: JSON.stringify({
        topic_id: this.topicId,
        post_content: content
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      this.commentFormComponent.showError(errText);
      return;
    }

    this.commentFormComponent.clear();
    this.commentFormComponent.showError('');

    await new Promise(resolve => setTimeout(resolve, 100));
    await this.renderComments();

  } catch (error) {
    this.commentFormComponent.showError(error.message);
  }
}

  async renderComments() {
    try {
      const res = await fetch(`/api/posts/topic/${this.topicId}/view`);
      if (!res.ok) throw new Error('Ошибка загрузки комментариев');

      const data = await res.json();
      const comments = data.posts || data; 
      comments.sort((a, b) => new Date(b.post_date) - new Date(a.post_date));
      this.commentListComponent.updateComments(comments, this.currentUserId, this);
    } catch (err) {
      console.error('Ошибка загрузки комментариев:', err.message);
      alert(err.message); 
    }
  }

  async handleDeleteClick(post) {
    const modal = document.getElementById('deleteModal');
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    const cancelBtn = document.getElementById('cancelDeleteBtn');

    modal.classList.remove('hidden');

    const closeModal = () => {
      modal.classList.add('hidden');
      confirmBtn.removeEventListener('click', onConfirm);
      cancelBtn.removeEventListener('click', closeModal);
    };

    const onConfirm = async () => {
      closeModal();

      try {
        const res = await fetch(`/api/posts/${post.post_id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': this.getCSRFToken()
          }
          // credentials: 'include'
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error("Не удалось удалить комментарий. " + errorText);
        }

        await this.renderComments();

      } catch (err) {
        alert("Ошибка при удалении комментария: " + err.message);
        console.error("Детали ошибки удаления:", err);
      }
    };

    confirmBtn.addEventListener('click', onConfirm);
    cancelBtn.addEventListener('click', closeModal);
  }

  async handleEditClick(post) {
    const modal = document.getElementById('editModal');
    const descriptionInput = document.getElementById('editDescriptionInput');
    const confirmBtn = document.getElementById('confirmEditBtn');
    const cancelBtn = document.getElementById('cancelEditBtn');

    descriptionInput.value = post.post_content;
    modal.classList.remove('hidden');

    const closeModal = () => {
      modal.classList.add('hidden');
      confirmBtn.removeEventListener('click', onConfirm);
      cancelBtn.removeEventListener('click', closeModal);
    };

    const onConfirm = async () => {
      const newDescription = descriptionInput.value.trim();
      if (!newDescription) {
        alert("Содержание не может быть пустым.");
        return;
      }

      closeModal();

      try {
        const res = await fetch(`/api/posts/${post.post_id}`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': this.getCSRFToken()
          },
          body: JSON.stringify({ post_content: newDescription })
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error("Не удалось обновить комментарий. " + errorText);
        }

        await this.renderComments();

      } catch (err) {
        alert("Ошибка при редактировании комментария: " + err.message);
        console.error("Детали ошибки редактирования:", err);
      }
    };

    confirmBtn.addEventListener('click', onConfirm);
    cancelBtn.addEventListener('click', closeModal);
  }

  getCSRFToken() {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='));
    return cookie ? decodeURIComponent(cookie.split('=')[1]) : '';
  }
}
