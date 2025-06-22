export class CommentsModel {
  constructor() {
    this.comments = [];
  }

  // Получить все комментарии
  getComments() {
    return this.comments;
  }

  // Добавить новый комментарий
  addComment(content) {
    const newComment = {           
      content,                    
      date: new Date().toLocaleDateString('ru-RU')  
    };
    this.comments.push(newComment);
  }
}
