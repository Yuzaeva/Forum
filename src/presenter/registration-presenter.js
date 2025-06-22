import SignInComponent from "../view/registration/signin-component.js";
import SignUpComponent from "../view/registration/signup-component.js";
import SignComponent from "../view/registration/sign-component.js";

function getCsrfTokenFromCookie() {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
}

export default class RegistrationPresenter {
    constructor(authContainer, model) {
        this.container = authContainer;
        this.model = model;
        this.signInView = new SignInComponent(this);
        this.signUpView = new SignUpComponent(this);
        this.signComponent = new SignComponent();
    }

    init() {
        this.render();
    }

    render() {
        this.container.innerHTML = "";
        this.container.appendChild(this.signComponent.render());

        this.contentContainer = this.container.querySelector(".content");
        if (!this.contentContainer) {
            console.error("Ошибка: .content не найден!");
            return;
        }

        this.showSignIn();
        this.initTabSwitcher();
    }

    initTabSwitcher() {
        const signInTab = this.container.querySelector(".tab.signin");
        const signUpTab = this.container.querySelector(".tab.signup");

        if (!signInTab || !signUpTab) {
            console.error("Ошибка: вкладки не найдены!");
            return;
        }

        signInTab.addEventListener("click", (e) => {
            e.preventDefault();
            this.showSignIn();
        });

        signUpTab.addEventListener("click", (e) => {
            e.preventDefault();
            this.showSignUp();
        });
    }

    renderView(view) {
        if (!this.contentContainer) {
            console.error("Ошибка: .content не найден!");
            return;
        }

        this.contentContainer.innerHTML = "";
        this.contentContainer.appendChild(view.render());
    }

    showSignIn() {
        this.toggleActiveTab("signin");
        this.renderView(this.signInView);
    }

    showSignUp() {
        this.toggleActiveTab("signup");
        this.renderView(this.signUpView);
    }

    toggleActiveTab(type) {
        const signInTab = this.container.querySelector(".tab.signin");
        const signUpTab = this.container.querySelector(".tab.signup");

        if (!signInTab || !signUpTab) return;

        if (type === "signin") {
            signInTab.classList.add("active");
            signUpTab.classList.remove("active");
        } else {
            signUpTab.classList.add("active");
            signInTab.classList.remove("active");
        }
    }

    handleSignInSubmit(data) {
        const errors = this.model.validateSignIn(data);
        if (Object.keys(errors).length > 0) {
            console.error("Ошибки валидации:", errors);
            return;
        }
    
        const csrfToken = getCsrfTokenFromCookie();
    
        fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": csrfToken
            },
            body: JSON.stringify(data),
            credentials: 'include'
        })
        .then(response => {
            if (response.redirected) {
                window.location.href = "/profile";
                return;
            }
    
            if (response.status === 403) {
                console.error("Ошибка авторизации: CSRF-токен не прошёл проверку.");
                return;
            }
    
            if (!response.ok) {
                console.error(`Ошибка: ${response.status} ${response.statusText}`);
                return;
            }
    
            return response.json();
        })
        .then(user => {
            console.log('Пользователь:', user);  // Добавь для проверки, что user не пустой
            if (user) {
                localStorage.setItem("user", JSON.stringify({
                name: user.name,
                email: user.email
                }));
                console.log('Переходим на профиль'); // Лог перед редиректом
                window.location.href = "/profile";  // Проверь путь и попробуй './profile.html' или '/pages/profile.html'
            } else {
                console.log('Пользователь пустой, редирект не выполнен');
            }
            })
        .catch(err => {
            console.error("Ошибка запроса:", err);
        });
    }    

    handleSignUpSubmit(data) {
        const errors = this.model.validateSignUp(data);
        if (Object.keys(errors).length > 0) {
            console.error("Ошибки валидации:", errors);
            return;
        }
    
        const csrfToken = getCsrfTokenFromCookie();
    
        fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-Token": csrfToken
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.redirected) {
                window.location.href = "/profile";
                return;
            }
    
            if (!response.ok) {
                console.error(`Ошибка регистрации: ${response.status} ${response.statusText}`);
                return;
            }
    
            return response.json();
        })
        .then(user => {
            if (user && user.redirectUrl) {
                localStorage.setItem("user", JSON.stringify({
                name: user.name,
                email: user.email
                }));
                window.location.href = "/profile";
            }
            })
        .catch(err => {
            console.error("Ошибка запроса:", err);
        });
    }  
}    