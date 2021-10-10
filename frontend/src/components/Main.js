import React from "react";
import Card from "./Card";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export default function Main(props) {
  
  const context = React.useContext(CurrentUserContext)
  const {cards, onCardLike, onCardDelete, onEditProfile, onAddPlace, onCardClick, onEditAvatar}  = props
  return (
      <>
        <section className="profile root__profile">
          <div className="profile__avatar-container">
            <button
              className="button profile__avatar-edit-button"
              onClick={onEditAvatar}
            ></button>
            <img
              className="profile__avatar"
              alt="avatar"
              src={context.avatar}
            />
          </div>
          <div className="profile__info-block">
            <div className="profile__info">
              <h1 className="profile__name">{context.name}</h1>
              <button
                type="button"
                className="button profile__edit-button"
                onClick={onEditProfile}
              ></button>
            </div>
            <p className="profile__profession">{context.about}</p>
          </div>
          <button
            type="button"
            className="profile__add-button button"
            onClick={onAddPlace}
          ></button>
        </section>
        <section className="place-container root__place-container">
          {cards.map((card) => {
            return (
              <Card
                card={card}
                onCardClick={onCardClick}
                key={card._id}
                onCardDelete={(e) => onCardDelete(card)}
                onCardLike={(e) => onCardLike(card)}
              />
            );
          })}
        </section>
      </>
    );
  }