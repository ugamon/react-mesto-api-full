import React from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export default function Card(props) {

  const { card, onCardLike, onCardDelete, onCardClick } = props;

  const context = React.useContext(CurrentUserContext)

  const isOwn = card.owner === context._id;
  const isLiked = card.likes.some((i) => i === context._id);

  const cardDeleteButtonClassName = `button place__bucket ${isOwn ? "" : "place__bucket_invisible"
    }`;
  const cardLikeButtonClassName = `button place__button-like ${isLiked ? "place__button-like_active" : ""
    }`;

  const handleClick = () => {
    onCardClick(card)
  }

  return (
    <div className="place" id={`card-${card._id}`} >
      <button type="button" className={cardDeleteButtonClassName} onClick={onCardDelete}></button>
      <button className="button" onClick={handleClick}>
        <img alt={card.name} src={card.link} className="place__image" />
      </button>
      <div className="place__header">
        <h2 className="place__title">{card.name}</h2>
        <div className="place__likes-container">
          <button type="button" className={cardLikeButtonClassName} onClick={onCardLike} ></button>
          <span className="place__likes-count">{card.likes.length}</span>
        </div>
      </div>
    </div>
  );
}