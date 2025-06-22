export default class SignInComponent {
    constructor(presenter) {
        this.presenter = presenter;
        this.form = document.createElement("form");
        this.form.innerHTML = 
				            `<div class="signin-cont cont">
                                <form action="#" method="post" enctype="multipart/form-data">
                                    <input type="email" name="email" id="email" class="inpt" required="required" placeholder="Ваш email">
                                    <label for="email">Your email</label>
                                    <input type="password" name="password" id="password" class="inpt" required="required" placeholder="Ваш password">
                                    <label for="password">Your password</label>
                                    <input type="checkbox" id="remember" class="checkbox" checked>
                                    <label for="remember">Запомнить меня</label>
                                    <div class="submit-wrap">
                                            <input type="submit" value="Вход" class="submit">
                                            <a href="#" class="more">Забыли пароль?</a>
                                    </div>
                                </form>
    				        </div>`
        ;
        this.form.addEventListener("submit", this.onSubmit.bind(this));
    }

    render() {
        return this.form;
    }

    onSubmit(event) {
        event.preventDefault();

        const data = {
            email: this.form.querySelector('[name="email"]').value,
            password: this.form.querySelector('[name="password"]').value
        };

        this.presenter.handleSignInSubmit(data);
    }
}