import ProfileInfoComponent from '../../src/view/profile/profile-info-component.js';
import ProfileActivityComponent from '../../src/view/profile/profile-activity-component.js';
import ProfileEditComponent from '../view/profile/profile-edit-component.js';
import ProfileTabsComponent from '../view/profile/profile-tabs-component.js';
import FavoritesComponent from '../view/profile/favorites-component.js';
import TopicTabComponent from '../view/profile/topic-tab-component.js';
import PostsTabComponent from '../view/profile/post-tab-component.js';

function getCookie(name) {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === name) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

export default class ProfilePresenter {
    constructor(model, infoContainer, activityContainer) {
      this.model = model;
      this.infoContainer = infoContainer;
      this.activityContainer = activityContainer;

      this.componentInfo = new ProfileInfoComponent(this);
      this.componentActivity = new ProfileActivityComponent();

      this.editComponent = new ProfileEditComponent(this);
      this.tabsComponent = new ProfileTabsComponent(this);

      this.topicsComponent = new TopicTabComponent(this);
      this.topicsComponent.onRetry = () => this.loadTopics();
      this.topicsComponent.onRemove = (topicId) => this.removeTopic(topicId);

      this.postsComponent = new PostsTabComponent(this);
      this.postsComponent.onRetry = () => this.loadPosts();
      this.postsComponent.onRemove = (postId) => this.removePost(postId);

      this.favoritesComponent = new FavoritesComponent();
      this.favoritesComponent.onRetry = () => this.loadFavorites();
      this.favoritesComponent.onRemove = (topicId) => this.removeFavorite(topicId);

      this.infoContainer.replaceWith(this.componentInfo.render());
      this.activityContainer.replaceWith(this.componentActivity.render());

      this.currentProfile = null;
    }

    async init() {
      try {
        const data = await this.model.fetchProfile();
        this.currentProfile = data;
        this.renderInfo();
        this.renderTabs();
        const allTopics = await this.model.getTopics(); 
        const userTopics = allTopics.filter(topic => topic.user_id === this.currentProfile.user_id);

        const userID = Number(getCookie('userId'));
    const token = getCookie('XSRF-TOKEN');

    // Получаем темы и посты
    const [topicsRes, postsRes] = await Promise.all([
      fetch(`/api/topics/user/${userID}`, {
        credentials: 'include',
        headers: { 'X-XSRF-TOKEN': token }
      }),
      fetch(`/api/posts/user/${userID}`, {
        credentials: 'include',
        headers: { 'X-XSRF-TOKEN': token }
      })
    ]);

    if (!topicsRes.ok || !postsRes.ok) throw new Error('Ошибка сервера');

    const topics = await topicsRes.json();
    const posts = await postsRes.json();

    // Обновляем статистику
    this.componentActivity.updateStats({
      topics: topics.length,
      replies: posts.length
    });

  } catch (e) {
    console.error("Ошибка при загрузке данных профиля:", e);
    window.location.href = '/';
  }
}

    renderInfo() {
      const newInfo = this.componentInfo.render();
      this.infoContainer.replaceWith(newInfo);
      this.infoContainer = newInfo;
      this.componentInfo.updateProfile(this.currentProfile);
    }

    renderEdit() {
      const newEdit = this.editComponent.render(this.currentProfile);
      this.infoContainer.replaceWith(newEdit);
      this.infoContainer = newEdit;
    }

    renderTabs() {
      const tabsElement = this.tabsComponent.render();
      this.componentActivity.setTabs(tabsElement);
    }
    

    async handleLogout() {
      await this.model.logout();
      window.location.href = '/';
    }

    async handlePhotoUpload(file) {
      try {
        const { photoPath } = await this.model.uploadPhoto(file);
        const name = this.componentInfo.nameEl.textContent;
        const email = this.componentInfo.emailEl.textContent;
        this.componentInfo.updateProfile({ name, email, photoPath });
      } catch {
        alert('Ошибка загрузки фото');
      }
    }

    editProfile() {
      this.renderEdit();
    }

    cancelEdit() {
      this.renderInfo();
    }

  async saveProfileChanges(data) {
  try {
    const csrfToken = getCookie('XSRF-TOKEN');

    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,   // Передаем токен в заголовке
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Не удалось обновить профиль');
    }

    const updatedProfile = await response.json();

    this.currentProfile = updatedProfile;

    this.renderInfo();
  } catch (error) {
    console.error('Ошибка при сохранении профиля:', error);
  }
}

async updateStats() {
  try {
    const userID = Number(getCookie('userId'));
    const token = getCookie('XSRF-TOKEN');

    const [topicsRes, postsRes] = await Promise.all([
      fetch(`/api/topics/user/${userID}`, {
        credentials: 'include',
        headers: { 'X-XSRF-TOKEN': token }
      }),
      fetch(`/api/posts/user/${userID}`, {
        credentials: 'include',
        headers: { 'X-XSRF-TOKEN': token }
      })
    ]);

    if (!topicsRes.ok || !postsRes.ok) throw new Error('Ошибка сервера');

    const topics = await topicsRes.json();
    const posts = await postsRes.json();

    this.componentActivity.updateStats({
      topics: topics.length,
      replies: posts.length
    });

  } catch (err) {
    console.error('Ошибка при обновлении статистики:', err);
  }
}

   async switchTab(tabName) {
    this.tabsComponent.setActiveTab(tabName);
    
    const substrate = this.componentActivity.container.querySelector('.substrate');
    substrate.innerHTML = '';
    
    switch(tabName) {

      case 'topics':
      substrate.appendChild(this.topicsComponent.render());
      await this.loadTopics(); 
      await this.updateStats();
      break;

      case 'posts':
      substrate.appendChild(this.postsComponent.render());
      await this.loadPosts();
      await this.updateStats(); 
      break;

      case 'favorites':
        substrate.appendChild(this.favoritesComponent.render());
        this.loadFavorites();
        break;
    }
  }

  async loadFavorites() {
    this.favoritesComponent.showLoading();
    
    try {
      const token = getCookie('XSRF-TOKEN');
      const response = await fetch('/api/favourites', { credentials: 'include', headers: {
        'X-XSRF-TOKEN': token
      } });
      if (!response.ok) throw new Error('Server error');
      
      const favorites = await response.json();
      favorites.length > 0 
        ? this.favoritesComponent.showFavorites(favorites)
        : this.favoritesComponent.showEmpty();
        
    } catch (error) {
      this.favoritesComponent.showError('Не удалось загрузить избранное');
      console.error('Favorites load error:', error);
    }
  }

  async removeFavorite(topicId) {
    try {
      const token = getCookie('XSRF-TOKEN');
      await fetch(`/api/favourites/${topicId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
        'X-XSRF-TOKEN': token
      }
      });
      this.loadFavorites(); // Перезагружаем список
    } catch (error) {
      this.favoritesComponent.showError('Ошибка при удалении');
    }
  }

  async loadTopics() {
    try {
      const token = getCookie('XSRF-TOKEN');
      const userID = Number(getCookie('userId'));
      const response = await fetch(`/api/topics/user/${userID}`, {
        credentials: 'include',
        headers: {
          'X-XSRF-TOKEN': token
        }
      });
      if (!response.ok) throw new Error('Server error');
      
      const topics = await response.json();
      this.topicsComponent.update(topics);
    } catch (err) {
      this.topicsComponent.showError('Не удалось загрузить темы');
    }
  }

  async removeTopic(topicId) {
    try {
      const token = getCookie('XSRF-TOKEN');
      await fetch(`/api/topics/${topicId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
        'X-XSRF-TOKEN': token
      }
      });
      await this.loadTopics();  // было: this.loadTopics()
      await this.updateStats(); // Перезагружаем список
    } catch (error) {
      this.topicsComponent.showError('Ошибка при удалении');
    }
  }

  async loadPosts() {
    try {
      const token = getCookie('XSRF-TOKEN');
      const userID = Number(getCookie('userId'));

      const [postsRes, topicsRes] = await Promise.all([
        fetch(`/api/posts/user/${userID}`, {
          credentials: 'include',
          headers: { 'X-XSRF-TOKEN': token }
        }),
        fetch(`/api/topics`, {
          credentials: 'include',
          headers: { 'X-XSRF-TOKEN': token }
        })
      ]);

      if (!postsRes.ok || !topicsRes.ok) throw new Error('Ошибка сервера');

      const posts = await postsRes.json();
      const topics = await topicsRes.json();

      const topicMap = Object.fromEntries(topics.map(t => [Number(t.topic_id), t]));
      const topic = posts.length ? topicMap[Number(posts[0].topic_id)] : null;

      this.postsComponent.update(posts, topicMap);

    } catch (err) {
      console.error(err);
      this.postsComponent.showError('Не удалось загрузить ответы');
    }
  }

  async removePost(postId) {
    try {
      const token = getCookie('XSRF-TOKEN');
      await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
        'X-XSRF-TOKEN': token
      }
      });
      await this.loadPosts();   
      await this.updateStats(); 
    } catch (error) {
      this.topicsComponent.showError('Ошибка при удалении');
    }
  }
}
