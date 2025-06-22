import { AuthorComponent } from "./author-component.js";
import CommentActionsComponent from "./comment-action-component.js";

export class CommentComponent {
  constructor({ author, photopath, content, date, comment, currentUserId, presenter }) {
    this.author = author;
    this.photopath = photopath;
    this.content = content;
    this.date = date;
    this.comment = comment;             
    this.currentUserId = currentUserId; 
    this.presenter = presenter;     
  }

  render() {
    const li = document.createElement('li');
    li.className = 'comment';

    const authorName = typeof this.author === 'string' ? this.author : this.author?.name || 'Аноним';
    const authorBlock = new AuthorComponent(authorName, this.photopath, this.date).render();
    li.appendChild(authorBlock);

    const hr = document.createElement('hr');
    li.appendChild(hr);

    const p = document.createElement('p');
    p.className = 'comment_content';
    p.textContent = this.content;
    li.appendChild(p);

    const actionsContainer = document.createElement('div');
    actionsContainer.className = 'comment-actions';
    li.appendChild(actionsContainer);

    if (this.currentUserId != null) {
      const actionsComponent = new CommentActionsComponent(this.comment, this.presenter);
      const showActions = Number(this.currentUserId) === Number(this.comment.user_id);
      actionsContainer.appendChild(actionsComponent.render(showActions));
    }

    return li;
  }
}
