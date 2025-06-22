function getCsrfTokenFromCookie() {
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

const ForumModel = {
  getTopics() {
    return fetch('/api/topics')
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) {
          console.error('Ответ не является массивом:', data);
          return [];
        }
        return data;
      })
      .catch(err => {
        console.error("Ошибка получения тем:", err);
        return [];
      });
  },

  createTopic(data) {
    const token = getCsrfTokenFromCookie();

    return fetch('/api/topics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-XSRF-TOKEN': token
      },
      body: JSON.stringify(data)
    }).then(async res => {
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Ошибка при создании темы');
      }
      return result;
    });
  },

async toggleFavourite(topicId) {
  const token = getCsrfTokenFromCookie();

  const response = await fetch(`/api/favourites/${topicId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-XSRF-TOKEN': token
    },
    credentials: 'include',
    body: JSON.stringify({ topicId })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error("Не удалось переключить избранное: " + errorText);
  }

  return response.json(); 
}
};

export default ForumModel;