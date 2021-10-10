import React from 'react'

import { withRouter } from 'react-router-dom';


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }

    }
    handleChange = e => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }
    handleSubmit = e => {
        e.preventDefault()
        if (!this.state.email || !this.state.password) {
            return;
        }
        this.props.handleLogin(this.state.email, this.state.password)
        this.setState({
            email: "",
            password: ""
        })


    }
    render() {
        return (
            <form className="root__login-form login-form" onSubmit={this.handleSubmit}>
                <h2 className="login-form__header">Вход</h2>
                <input
                    id="login-email"
                    type="email"
                    name="email"
                    className="login-form__input"
                    minLength="2"
                    maxLength="40"
                    required
                    onChange={this.handleChange}
                    value={this.state.email}
                    placeholder="Email"
                />
                <input
                    id="login-psw"
                    type="password"
                    name="password"
                    className="login-form__input"
                    required
                    onChange={this.handleChange}
                    value={this.state.password}
                    placeholder="Пароль"
                />
                <button className="login-form__button">
                    Войти
                </button>
            </form>
        )

    }
}


export default withRouter(Login)