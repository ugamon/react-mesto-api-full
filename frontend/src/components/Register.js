import React from "react";
import { Link } from "react-router-dom";

export default function Register(props) {
  const { onUserRegister} =
    props;
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleChange = (e) => {
    if (e.target.name === "email") {
      setEmail(e.target.value);
    } else {
      setPassword(e.target.value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUserRegister(email, password);
  };

  return (
    <>
      <form className="root__login-form login-form" onSubmit={handleSubmit}>
        <h2 className="login-form__header">Регистрация</h2>
        <input
          id="login-email"
          type="email"
          name="email"
          className="login-form__input"
          minLength="2"
          maxLength="40"
          required
          onChange={handleChange}
          value={email}
          placeholder="Email"
        />
        <input
          id="login-psw"
          type="password"
          name="password"
          className="login-form__input"
          required
          onChange={handleChange}
          value={password}
          placeholder="Пароль"
        />
        <button className="login-form__button" type="submit">
          Зарегистрироваться
        </button>
        <span className="login-form__helper-text">
          Уже зарегистрированы?
          <Link to="/sign-in" className="login-form__helper-text-link">
            Войти
          </Link>
        </span>
      </form>
      
    </>
  );
}
