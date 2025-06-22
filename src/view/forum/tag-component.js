import TagSearchComponent from './tag-search-component.js';
import TagListComponent from './tag-list-component.js';

export default class TagSectionComponent {
  constructor(presenter, tags = []) {
    this.presenter = presenter;
    this.tags = tags;
    this.container = document.createElement('div');
    this.container.classList.add('tags');
    
    const searchComponent = new TagSearchComponent(presenter);
    const listComponent = new TagListComponent(presenter, tags);

    this.container.append(
      searchComponent.render(),
      listComponent.render()
    );
  }

  render() {
    return this.container;
  }
}