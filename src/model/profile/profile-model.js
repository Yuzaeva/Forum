export default class ProfileModel {
  getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [key, value] = cookie.trim().split('=');
      if (key === name) {
        return decodeURIComponent(value);
      }
    }
    return null;
  }
    async fetchProfile() {
      const csrfToken = document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1];

      const res = await fetch('/api/profile', {
        method: 'GET',
        headers: {
          'X-CSRF-Token': csrfToken,
        },
        credentials: 'include',  
      });

      if (!res.ok) throw new Error('Unauthorized');
      return await res.json();
    }

    async logout() {
      await fetch('/logout');
    }
  
    async uploadPhoto(file) {
      const formData = new FormData();
      formData.append('photo', file);
      const res = await fetch('/api/upload-photo', {
        method: 'POST',
        body: formData,
        credentials: 'include', // очень важно для отправки cookie с токеном!
        headers: {
          'X-CSRF-Token': this.getCookie('XSRF-TOKEN') // 👈 передаём токен вручную
        }
      });
      if (!res.ok) throw new Error('Ошибка загрузки');
      return await res.json();
    }

    async updateProfile(data) {
      const res = await fetch('/api/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
    
      if (!res.ok) throw new Error('Ошибка при сохранении');
      return await res.json();
    }

    async getTopics() {
      const res = await fetch('/api/topics');
      if (!res.ok) throw new Error('Ошибка при загрузке тем');
      const topics = await res.json();
      return topics;
    }
    
  async saveProfileChanges(data) {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Не удалось обновить профиль');
      }

      const updatedProfile = await response.json();
      console.log('Профиль обновлен:', updatedProfile);

      // Обновляем текущий профиль в презентере
      this.currentProfile = updatedProfile;

      // Обновляем информацию на странице
      this.renderInfo();
    } catch (error) {
      console.error('Ошибка при сохранении профиля:', error);
    }
  }
}