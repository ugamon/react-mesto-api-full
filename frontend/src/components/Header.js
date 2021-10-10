import React from "react";
import logo from "../images/logo.svg";

export default function Header(props) {
  const {children} = props
  return (
    <header className="header root__header">
      <img className="header__logo" src={logo} alt="Место, логотип" />
      {children}
    </header>
  );
}
