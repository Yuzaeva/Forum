import { CommentComponent } from "./comment-component.js";

export class CommentListComponent {
  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'comments';
    this.list = document.createElement('ul');
    this.list.className = 'comments_list';
  }

  render() {
    this.container.innerHTML = '<h4>Ответы</h4>';
    this.container.appendChild(this.list);
    return this.container;
  }

  updateComments(comments, currentUserId, presenter) {
    this.list.innerHTML = '';
    comments.forEach(comment => {
      const item = new CommentComponent({
        author: comment.author,
        photopath: comment.photopath,
        content: comment.post_content,
        date: comment.post_date,
        currentUserId, presenter, comment: comment
      }).render();
      this.list.appendChild(item);
    });
  }
}
