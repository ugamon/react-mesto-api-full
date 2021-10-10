import React, { useState } from 'react'
import PopupWithForm from './PopupWithForm'

export default function AddPlacePopup(props) {
    const { isAddPlacePopupOpen, closeAllPopups, onAddPlace } = props

    const [name, setPlaceName] = useState('')
    const [link, setPlaceLink] = useState('')



    const handleSubmit = e => {
        e.preventDefault();
        onAddPlace(name, link)
        setPlaceName('')
        setPlaceLink('')
    }

    const handleChange = e => {
        if (e.target.name === 'name') {
            setPlaceName(e.target.value)
        }
        else {
            setPlaceLink(e.target.value)
        }
    }

    return (
        <PopupWithForm
            onSubmit={handleSubmit}
            name="placePopup"
            title="Новое место"
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
        >
                <input
                    id="place-input"
                    type="text"
                    name="name"
                    placeholder="Название"
                    className="popup__input"
                    minLength="2"
                    maxLength="30"
                    required
                    onChange={handleChange}
                    value={name}
                />
                <span className="place-input-error"></span>
                <input
                    id="link-input"
                    type="url"
                    name="link"
                    placeholder="Ссылка на картинку"
                    className="popup__input"
                    required
                    onChange={handleChange}
                    value={link}
                />
                <span className="link-input-error"></span>
            
        </PopupWithForm>

    )
}