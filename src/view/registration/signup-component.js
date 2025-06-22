export default class SignUpComponent {
    constructor(presenter) {
        this.presenter = presenter;
        this.form = document.createElement("form"); 
        
        this.form.innerHTML = 
            `<div class="signup-cont cont">
                <form action="#" method="post" enctype="multipart/form-data">
						                    <input type="name" name="name" id="name" class="inpt" required="required" placeholder="Ваше имя">
						                    <label for="name">Your name</label>
                    <input type="email" name="email" id="email" class="inpt" required="required" placeholder="Ваш email">
						                    <label for="email">Your email</label>
						                    <input type="password" name="password" id="password" class="inpt" required="required" placeholder="Ваш пароль">
                						    <label for="password">Your password</label>
						                    <div class="submit-wrap">
							                        <input type="submit" value="Зарегистрироваться" class="submit">
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
            name: this.form.querySelector('[name="name"]').value,
            email: this.form.querySelector('[name="email"]').value,
            password: this.form.querySelector('[name="password"]').value
        };

        this.presenter.handleSignUpSubmit(data);
    }
}