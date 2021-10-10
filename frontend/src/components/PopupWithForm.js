import React from "react";

export default function PopupWithForm(props){
  const { name, title, isOpen, onClose, children, onSubmit, buttonText='Сохранить'} = props;
  const isOpenClass = isOpen ? "popup popup_opened" : "popup";
  return (
      <div className={isOpenClass} id={`${name}PopupWithFrom`} tabIndex="-1">
        <div className="popup__container">
        <form onSubmit={onSubmit} className="popup__form" name={`popup-form-${name}`}>
            <h2 className="popup__header">{title}</h2>
            {children}
            <button
              type="submit"
              className="button popup__save-button"
            >
            {buttonText}
          </button>
          
          </form>
          <button
            type="button"
            className="button popup__close-button"
            onClick={onClose}
          ></button>
        </div>
      </div>
    );
  }
