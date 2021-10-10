import React from "react";
import { Route, Switch, Link, withRouter } from "react-router-dom";

import api from "../utils/api.js";
import auth from "../utils/auth.js"

import { CurrentUserContext } from "../contexts/CurrentUserContext";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";

import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import EditProfilePopup from "./EditProfilePopup";
import AddPlacePopup from "./AddPlacePopup";
import PopupWithForm from "./PopupWithForm";
import InfoTooltip from "./InfoTooltip";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoggedIn: false,
      isEditProfilePopupOpen: false,
      isAddPlacePopupOpen: false,
      isEditAvatarPopupOpen: false,
      isImagePopupOpen: false,
      isErrorPopupOpen: false,
      isSuccessPopupOpen: false,
      selectedCard: {
        _id: "",
        createdAt: "",
        likes: [],
        link: "",
        name: "",
        owner: {},
      },
      currentUser: {},
      cards: [],
    };
  }

  componentDidMount() {
    this.tokenCheck();
  }

  _setCard = (card) => {
    const { cards } = this.state;
    const newCardsArray = cards.map((c) => (c._id === card._id ? card : c));
    this.setState({
      cards: newCardsArray,
    });
  };

  handleCardLike = (card) => {
    const isLiked = card.likes.some((i) => i === this.state.currentUser._id);
    if (isLiked) {
      api
        .deleteLike(card._id)
        .then((newCard) => this._setCard(newCard))
        .catch((err) => console.log(err));
    } else {
      api
        .addLike(card._id)
        .then((newCard) => this._setCard(newCard))
        .catch((err) => console.log(err));
    }
  };

  handleCardDelete = (card) => {
    api
      .deleteCard(card._id)
      .then((data) => {
        const newCardsArray = this.state.cards.filter(
          (_card) => _card._id !== card._id
        );
        this.setState({
          cards: newCardsArray,
        });
        this.closeAllPopups();
        console.log(card);
      })
      .catch((err) => console.log(err));
  };

  handleUpdateAvatar = (link) => {
    api
      .updateAvatar(link)
      .then((currentUser) => {
        console.log(currentUser);
        this.setState({
          currentUser,
        });
        this.closeAllPopups();
      })
      .catch((err) => console.log(err));
  };

  handleUpdateUser = (userData) => {
    api
      .updateProfile(userData.name, userData.about)
      .then((userData) => {
        this.setState({
          currentUser: userData,
        });
        this.closeAllPopups();
      })
      .catch((err) => console.log(err));
  };

  handleCardClick = (card) => {
    this.setState({
      selectedCard: card,
      isImagePopupOpen: true,
    });
  };

  closeAllPopups = (e) => {
    this.setState({
      isEditAvatarPopupOpen: false,
      isAddPlacePopupOpen: false,
      isEditProfilePopupOpen: false,
      isImagePopupOpen: false,
      isErrorPopupOpen: false,
      isSuccessPopupOpen: false,
      selectedCard: {
        _id: "",
        createdAt: "",
        likes: [],
        link: "",
        name: "",
        owner: {},
      },
    });
  };

  handleEditAvatarClick = (e) => {
    this.setState({
      isEditAvatarPopupOpen: true,
    });
  };

  handleEditProfileClick = (e) => {
    this.setState({
      isEditProfilePopupOpen: true,
    });
  };

  handleAddPlaceClick = (e) => {
    this.setState({
      isAddPlacePopupOpen: true,
    });
  };

  handleAddPlaceSubmit = (name, link) => {
    const cardsArray = this.state.cards;
    api
      .addCard(name, link)
      .then((card) => {
        const newCardsArray = [card, ...cardsArray];
        this.setState({
          cards: newCardsArray,
        });
        this.closeAllPopups();
      })
      .catch((err) => console.log(err));
  };

  handleRegister = (email, password) => {
    auth
      .register(password, email)
      .then((data) => {
        this.setState(
          {
            isSuccessPopupOpen: true,
          }
        );
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          isErrorPopupOpen: true,
        });
      });
  };

  handleLogin = (email, password) => {
    auth
      .login(password, email)
      .then((data) => {
        if (data.token) {
          localStorage.setItem('jwt', data.token)
          this.setState({ isLoggedIn: true },
            () => {
              this.tokenCheck();
              this.props.history.push("/");
          });
        }
      })
      .catch((err) => console.log(err)); // запускается, если пользователь не найден

    
  };

  handleLogout = (e) => {
    localStorage.removeItem("jwt");
    this.setState({
      isLoggedIn: false,
    });
    this.props.history.push("/sign-in");
  };

  tokenCheck = () => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      api
        .validate(jwt)
        .then((res) => {
          if (res) {
            this.setState(
              {
                isLoggedIn: true,
              },
              () => {
                api
                  .getUserInfo()
                  .then((user) => this.setState({ currentUser: user }))
                  .catch((err) => console.log(err));

                api
                  .getCardList()
                  .then((cards) => {
                    this.setState({
                      cards,
                    });
                    this.props.history.push("/");
                  })
                  .catch((err) => console.log(err));
              }
            );
        }
      });
    }
  };

  render() {
    return (
      <CurrentUserContext.Provider value={this.state.currentUser}>
        <Switch>
          <ProtectedRoute exact path="/" isLoggedIn={this.state.isLoggedIn}>
            <>
              <Header>
                <div className="header__email">
                  <p className="email">{this.state.currentUser.email}</p>
                  <button
                    className="button header__button-logout"
                    onClick={this.handleLogout}
                  >
                    Выйти
                  </button>
                </div>
              </Header>
              <Main
                onEditProfile={this.handleEditProfileClick}
                onAddPlace={this.handleAddPlaceClick}
                onEditAvatar={this.handleEditAvatarClick}
                onCardClick={this.handleCardClick}
                onCardLike={this.handleCardLike}
                onCardDelete={this.handleCardDelete}
                cards={this.state.cards}
              />

              <Footer />
              <ImagePopup
                isOpen={this.state.isImagePopupOpen}
                card={this.state.selectedCard}
                onClose={this.closeAllPopups}
              />
              <EditAvatarPopup
                onUpdateAvatar={this.handleUpdateAvatar}
                isOpen={this.state.isEditAvatarPopupOpen}
                onClose={this.closeAllPopups}
              />
              <EditProfilePopup
                onUpdateUser={this.handleUpdateUser}
                isOpen={this.state.isEditProfilePopupOpen}
                onClose={this.closeAllPopups}
              />
              <AddPlacePopup
                onAddPlace={this.handleAddPlaceSubmit}
                isAddPlacePopupOpen={this.state.isAddPlacePopupOpen}
                closeAllPopups={this.closeAllPopups}
              />
              <PopupWithForm
                name="deletePopup"
                title="Вы уверены?"
                onClose={this.closeAllPopups}
                isOpen={false}
              />
            </>
          </ProtectedRoute>
          <Route path="/sign-in">
            <Header>
              <Link className="header__link" to="/sign-up">
                Регистрация
              </Link>
            </Header>
            <Login handleLogin={this.handleLogin} />
          </Route>
          <Route path="/sign-up">
            <Header>
              <Link className="header__link" to="/sign-in">
                Войти
              </Link>
            </Header>
            <Register
              onUserRegister={this.handleRegister}
            />
            <InfoTooltip
              isErrorPopupOpen={this.state.isErrorPopupOpen}
              isSuccessPopupOpen={this.state.isSuccessPopupOpen}
              onClose={this.closeAllPopups}
      />

          </Route>
        </Switch>
      </CurrentUserContext.Provider>
    );
  }
}

export default withRouter(App);
