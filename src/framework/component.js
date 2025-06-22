import {createElement} from '../framework/render.js';

export default class Component {
    constructor(template) {
      this._template = template;
      this._element = null;
    }
  
    getTemplate() {
      return this._template;
    }
  
    getElement() {
      if (!this._element) {
        this._element = createElement(this.getTemplate());
      }
      return this._element;
    }

    createElement(template) {
      const newElement = document.createElement('div');
      newElement.innerHTML = template;
      return newElement.firstElementChild;
    }
  
    removeElement() {
      this._element = null;
    }

  }
  