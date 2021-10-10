import React from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext"


export default function EditProfilePopup(props) {
  const { isOpen, onClose } = props
  const [name, setProfileName] = React.useState('')
  const [about, setProfileAbout] = React.useState('')

  const currentUser = React.useContext(CurrentUserContext);

  // После загрузки текущего пользователя из API
  // его данные будут использованы в управляемых компонентах.
  React.useEffect(() => {
    // условное выражение для запрета записи undefined в value input во время загрузки api
    if (currentUser.name && currentUser.about) {
      setProfileName(currentUser.name);
      setProfileAbout(currentUser.about);  
    }
  }, [currentUser, isOpen])

  
  const handleChange = e => {
    if (e.target.name === "name") {
      setProfileName(e.target.value)
    }
    else {
      setProfileAbout(e.target.value)
    }
  }

  const handleSubmit = e => {
    e.preventDefault();
    props.onUpdateUser({
      name,
      about,
    });
  }

  return (
    <PopupWithForm
      name="editPopup"
      title="Редактировать профиль"
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <input
          id="name-input"
          type="text"
          name="name"
          className="popup__input "
          minLength="2"
          maxLength="40"
          placeholder="Введите имя"
          required
          value={name}
          onChange={handleChange}
        />
        <span className="name-input-error"></span>
        <input
          id="job-input"
          type="text"
          name="description"
          className="popup__input"
          minLength="2"
          placeholder="Ваша профессия"
          maxLength="200"
          required
          value={about}
          onChange={handleChange}
        />
        <span className="job-input-error"></span>
      
    </PopupWithForm>
  );

}
