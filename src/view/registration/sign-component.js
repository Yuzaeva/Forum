export default class SignComponent {
    constructor() {
        this.container = document.createElement("article");
        this.container.classList.add("half");

        // Создаем .content сразу в конструкторе
        this.contentContainer = document.createElement("div");
        this.contentContainer.classList.add("content");
    }

    render() {
        this.container.innerHTML = `
            <h1>Личный кабинет</h1>
            <div class="tabs">
                <span class="tab signin active"><a href="#signin">Вход</a></span>
                <span class="tab signup"><a href="#signup">Регистрация</a></span>
            </div>
            `
        ;

        this.container.appendChild(this.contentContainer); // Добавляем .content
        
        return this.container;
    }
}