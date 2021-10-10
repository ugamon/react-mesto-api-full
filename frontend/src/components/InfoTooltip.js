import React from "react";

import errorRegister from "../images/Union-error.svg";
import successRegister from "../images/Union.svg";

export default function InfoTooltip(props) {
    const { isErrorPopupOpen, isSuccessPopupOpen, onClose } = props;
    const config = {
        error: {
            name: "errorLoginPopup",
            title: "Произошла ошибка при регистрации",
            img: errorRegister,
        },
        success: {
            name: "successLoginPopup",
            title: "Вы успешно зарегистрировались",
            img: successRegister,
        },
    };

    const type = isErrorPopupOpen ? "error" : "success";

    const isOpenClass =
        isSuccessPopupOpen || isErrorPopupOpen ? "popup popup_opened" : "popup";
    const config_parsed = config[type]

    return (
        <div
            className={isOpenClass}
            id={`${config_parsed.name}PopupWithForm`}
            tabIndex="-1"
        >
            <div className="popup__container">
                <div className="popup__form" name={`popup-form-${config_parsed.name}`}>
                    <img
                        className="popup__error-logo"
                        src={config_parsed.img}
                        alt={config_parsed.title}
                    />
                    <h2 className="popup__header popup__header_type_login">
                        {config_parsed.title}
                    </h2>
                </div>
                <button
                    type="button"
                    className="button popup__close-button"
                    onClick={onClose}
                ></button>
            </div>
        </div>
    );
}
