import React from "react";

export default function ImagePopup(props) {
  const { onClose, card, isOpen } = props
  const popup_class = isOpen ? "popup popup_opened" : "popup";
  return (
    <div className={popup_class} id="imagePlacePopup" tabIndex="-1">
      <div className="popup__container popup__container_type_preview">
        <img className="popup__image" alt={card.name} src={card.link} />
        <button
          type="button"
          className="button popup__close-button"
          onClick={onClose}
        ></button>
        <h2 className="popup__header popup__header_type_preview">
          {card.name}
        </h2>
      </div>
    </div>
  );
}
