import React from 'react'
import PopupWithForm from './PopupWithForm'

export default function EditAvatarPopup(props) {
    const { isOpen, onClose, onUpdateAvatar } = props
    const editAvatarRef = React.useRef()

    const handleSubmit = e => {
        e.preventDefault()
        onUpdateAvatar(editAvatarRef.current.value)
        editAvatarRef.current.value = ""
    }

    return (
        <PopupWithForm
            onSubmit={handleSubmit}
            name="avatar"
            title="Обновить аватар"
            isOpen={isOpen}
            onClose={onClose}
        >
            <input
                ref={editAvatarRef}
                id="avatar-input"
                type="url"
                name="link"
                placeholder="Ссылка на изображение аватара"
                className="popup__input"
                required
            />
            <span className="avatar-input-error"></span>

        </PopupWithForm>

    )
}