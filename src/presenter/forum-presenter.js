import ForumTitleComponent from '../view/forum/title-component.js';
import TagSectionComponent from '../view/forum/tag-component.js';
import TopicFormComponent from '../view/forum/topics-form-component.js';
import TopicListComponent from '../view/forum/topic-list-component.js';
import DeleteComponent from '../view/forum/delete-model-component.js';
import EditComponent from '../view/forum/edit-model-component.js';
import {CommentsPresenter} from '../presenter/comment-presenter.js';

export default class ForumPagePresenter {
  constructor(container, model) {
    this.container = container;
    this.model = model;

    this.allTopics = [];

    this.titleComponent = new ForumTitleComponent();
    this.tagComponent = new TagSectionComponent(this);
    this.topicFormComponent = new TopicFormComponent(this);
    this.topicListComponent = new TopicListComponent(this);
    this.editModalComponent = new EditComponent(this);
    this.deleteModalComponent = new DeleteComponent();
  }

  async init() {
    const authData = await fetch('/api/check-auth').then(r => r.json());
    this.currentUserId = authData?.user?.user_id;

    this.allTopics = await this.model.getTopics();
    const topics = await this.model.getTopics();
    this.allTopics = topics.map(topic => ({
    ...topic,
    favourited: topic.favourited ?? topic.is_favourited ?? false
  }));
    this.topicListComponent.updateTopics(this.allTopics, this.currentUserId);
    this.renderPage();
  }

  renderPage() {
  this.container.innerHTML = ''; 

  this.container.appendChild(this.titleComponent.render());
  this.container.appendChild(this.deleteModalComponent.getElement());
  this.container.appendChild(this.editModalComponent.getElement());

  const content = document.createElement('div');
  content.classList.add('content');

  const sidebar = document.createElement('div');
  sidebar.classList.add('sidebar');
  sidebar.appendChild(this.tagComponent.render());
  
  const mainSection = document.createElement('div');
  mainSection.classList.add('main-section');
  mainSection.appendChild(this.topicFormComponent.render());

  const topicListNode = this.topicListComponent.render(); 
  if (topicListNode instanceof Node) {
    mainSection.appendChild(topicListNode);
  } else {
    console.error('Ошибка: метод render() не возвращает DOM-узел.');
  }

  content.appendChild(sidebar);
  content.appendChild(mainSection);

  this.container.appendChild(content);
  }

  async handleTopicSubmit(data) {
    try {
      await this.model.createTopic(data);
      this.allTopics = await this.model.getTopics();
      this.topicListComponent.updateTopics(this.allTopics, this.currentUserId);
      this.topicFormComponent.showError(''); 
    } catch (error) {
      this.topicFormComponent.showError(error.message);
    }
  }
  
  async handleDeleteClick(topic) {
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
        const res = await fetch(`/api/topics/${topic.topic_id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': this.getCSRFToken()
          }
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error("Не удалось удалить тему. " + errorText);
        }

        this.allTopics = await this.model.getTopics();
        this.topicListComponent.updateTopics(this.allTopics, this.currentUserId);

      } catch (err) {
        alert("Ошибка при удалении темы: " + err.message);
        console.error("Детали ошибки удаления:", err);
      }
    };

    confirmBtn.addEventListener('click', onConfirm);
    cancelBtn.addEventListener('click', closeModal);
  }

  async handleEditClick(topic) {
    const modal = document.getElementById('editModal');
    const titleInput = document.getElementById('editTitleInput');
    const tagsInput = document.getElementById('editTagsInput');
    const descriptionInput = document.getElementById('editDescriptionInput');
    const confirmBtn = document.getElementById('confirmEditBtn');
    const cancelBtn = document.getElementById('cancelEditBtn');

    titleInput.value = topic.title;
    descriptionInput.value = topic.description || '';
    const tags = Array.isArray(topic.tags) ? topic.tags : [];
    tagsInput.value = tags.join(', ');
    modal.classList.remove('hidden');

    const closeModal = () => {
      modal.classList.add('hidden');
      confirmBtn.removeEventListener('click', onConfirm);
      cancelBtn.removeEventListener('click', closeModal);
    };

    const onConfirm = async () => {
      const newTitle = titleInput.value.trim();
      const newDescription = descriptionInput.value.trim();
      const newTags = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag);
      if (!newTitle) {
        alert("Заголовок не может быть пустым.");
        return;
      }

      closeModal();

      try {
        const res = await fetch(`/api/topics/${topic.topic_id}`, {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': this.getCSRFToken()
          },
          body: JSON.stringify({ title: newTitle, name_tag:  newTags, description: newDescription })
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error("Не удалось обновить тему. " + errorText);
        }

        this.allTopics = await this.model.getTopics();
        this.topicListComponent.updateTopics(this.allTopics, this.currentUserId);

      } catch (err) {
        alert("Ошибка при редактировании темы: " + err.message);
        console.error("Детали ошибки редактирования:", err);
      }
    };

    confirmBtn.addEventListener('click', onConfirm);
    cancelBtn.addEventListener('click', closeModal);
  }

handleTopicClick(topic) {
  const forumRoot = document.querySelector('.forum-root');
  if (forumRoot) {
    forumRoot.remove();
  }

  const commentsContainer = document.createElement('div');
  commentsContainer.className = 'comments-page';

  const main = document.querySelector('main');
  const footer = document.querySelector('.footer');

  if (main) {
    main.innerHTML = '';
    main.appendChild(commentsContainer);
  } else if (footer && footer.parentNode) {
    footer.parentNode.insertBefore(commentsContainer, footer);
  } else {
    document.body.appendChild(commentsContainer); 
  }

  new CommentsPresenter(topic, '.comments-page', this.currentUserId);
}



  handleTagReset() {
    this.topicListComponent.updateTopics(this.allTopics, this.currentUserId);
  }

  getCSRFToken() {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='));
    return cookie ? decodeURIComponent(cookie.split('=')[1]) : '';
  }

  async handleSearchByTag(tag) {
    try {
      if (!this.currentUserId) {
        const authRes = await fetch('/api/check-auth');
        const authData = await authRes.json();
        this.currentUserId = authData?.user?.user_id || null;
      }

      const res = await fetch(`/api/topics/search?tag=${encodeURIComponent(tag)}`);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.error || 'Ошибка при загрузке тем');
      }

      const topics = await res.json();

      if (!Array.isArray(topics)) {
        throw new Error("Некорректный формат ответа: ожидался массив тем");
      }

      this.topicListComponent.updateTopics(topics, this.currentUserId);
      
    } catch (err) {
      console.error("Ошибка при поиске по тегу:", err);
    }
  }

  async toggleFavourite(topicId) {
    try {
      const updatedData = await this.model.toggleFavourite(topicId); 

      const index = this.allTopics.findIndex(t => t.topic_id === topicId);
      if (index !== -1) {
        this.allTopics[index] = {
          ...this.allTopics[index],
          favourited: updatedData.favourited ?? false
        };
      }

      this.topicListComponent.updateTopics(this.allTopics, this.currentUserId);
    } catch (error) {
      console.error('Ошибка при переключении избранного:', error);
    }
  }

  updateTopics(updatedTopics, currentUserId) {
    this.allTopics = updatedTopics;
    this.topicListComponent.updateTopics(this.allTopics, currentUserId);
  }

}
