import Header from "./Header/Header.jsx";
import Main from "./main/Main.jsx";
import Footer from "./footer/Footer.jsx";
import PopupWithForm from "./popupWithForm/PopupWithForm.jsx";
import ImagePopup from "./imagePopup/ImagePopup.jsx";
import { useCallback, useEffect, useState } from "react";
import CurrentUserContext from "../contexts/CurrentUserContext.js";
import api from "../utils/api";
import EditProfilePopup from "./editProfilePopup/EditProfilePopup.jsx";
import EditAvatarPopup from "./editAvatarPopup/EditAvatarPopup.jsx";
import AddPlacePopup from "./addPlacePopup/AddPlacePopup.jsx";
import Register from "./register/Register.jsx";
import Login from "./login/Login.jsx";
import ProtectedRoute from "./protectedRoute/ProtectedRoute.jsx";

import { autorization } from "../utils/mestoAuth.js";
import { registration } from "../utils/mestoAuth.js";
import { getContent } from "../utils/mestoAuth.js";

import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import InfoToolTip from "./infoTooltip/InfoTooltip.jsx";

function App() {
  const navigate = useNavigate();

  // Состояния попапов
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isDeleteCardPopupOpen, setIsDeleteCardPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  // const[isImagePopup, setIsImagePopup] = useState(false)

  //контекст
  const [currentUser, setCurrentUser] = useState({});

  // состояния карточек
  const [cards, setCards] = useState([]);
  const [deleteCardId, setDeleteCardId] = useState("");

  //состояние логина регистрации
  const [loggedIn, setLoggedIn] = useState(false);
  // const [dataUser, setDataUser] = useState("");
  const [emailUser, setEmailUser] = useState('')
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const auth = (jwt) => {
    getContent(jwt)
    .then((res) => {
      if (res) {
        setLoggedIn(true);
        setEmailUser(res.data.email);
        // console.log(res)
      }
    })
    .catch(console.err)
  };

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      auth(jwt);
    }
  }, []);

  useEffect(() => {
    if (loggedIn) {
      navigate("/");
    }
  }, [loggedIn]);

  const onLogin = ({ password, email }) => {
    return autorization(password, email).then((res) => {
      if (res.token) {
        localStorage.setItem("jwt", res.token);
        setLoggedIn(true);
        setEmailUser(email);
      }
    })
    .catch(console.error)
  };

  const onRegister = useCallback(({ password, email }) => {
    return registration(password, email)
      .then((res) => {
        return res;
      })
      .then(() => setIsSuccess(true))
  }, []);

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setSelectedCard(null);
    setIsDeleteCardPopupOpen(false);
    setIsSuccess(false);
    setIsError(false);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleDeleteCardClick(cardId) {
    setDeleteCardId(cardId);
    setIsDeleteCardPopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
    // setIsImagePopup(true)
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((item) => currentUser._id === item._id);
    if (isLiked) {
      api
        .deleteLike(card._id)
        .then((res) => {
          setCards((state) => state.map((c) => (c._id === card._id ? res : c)));
        })
        .catch(console.error);
    } else {
      api
        .addCardLike(card._id)
        .then((res) => {
          setCards((state) => state.map((c) => (c._id === card._id ? res : c)));
        })
        .catch(console.error);
    }
  }

  useEffect(() => {
    Promise.all([api.getInfo(), api.getCards()])
      .then(([emailUser, dataCard]) => {
        setCurrentUser(emailUser);
        setCards(dataCard);
      })
      .catch(console.error);
  }, []);

  function handleDeleteCardSubmit(event) {
    event.preventDefault();
    api
      .deleteCard(deleteCardId)
      .then(() => {
        setCards(
          cards.filter((card) => {
            return card._id !== deleteCardId;
          })
        );
        closeAllPopups();
      })
      .catch(console.error);
  }

  function handleUpdateUser(emailUser) {
    api
      .setUserInfo(emailUser)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch(console.error);
  }

  function handleUpdateAvatar(emailUser) {
    api
      .setNewAvatar(emailUser)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch(console.error);
  }

  function handleAddPlaceSubmit(newCard) {
    api
      .addNewCard(newCard)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch(console.error);
  }

  function onSingOut() {
    localStorage.removeItem("jwt");
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Routes>
          <Route
            path="/"
            element={
              <>
              <Header emailUser={emailUser} loggedIn={loggedIn} onSingOut={onSingOut} />
              <ProtectedRoute
                element={Main}
                onEditProfile={handleEditProfileClick}
                onAddPlace={handleAddPlaceClick}
                onEditAvatar={handleEditAvatarClick}
                onCardClick={handleCardClick}
                onDeleteCard={handleDeleteCardClick}
                cards={cards}
                onCardLike={handleCardLike}
                loggedIn={loggedIn}
                emailUser={emailUser}
              />
              </>
            }
          />

          <Route
            path="signup"
            // name='signup'
            element={
              <>
                <Header name="signup"
                loggedIn={loggedIn}
                 />
                <Register
                  name="signup"
                  onRegister={onRegister}
                  setIsError={setIsError}
                />
              </>
            }
          />

          <Route
            path="signin"
            // name='signin'
            element={
              <>
                <Header name="signin"
                loggedIn={loggedIn} />
                <Login 
                name="signin" 
                onLogin={onLogin} 
                />
              </>
            }
          />

          <Route path="*" element={<Navigate to={"/"} replace />} />
        </Routes>

        <Footer />

        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />

        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlaceSubmit}
        />

        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />

        <PopupWithForm
          name="delete"
          title="Вы уверены?"
          titleButton="Да"
          isOpen={isDeleteCardPopupOpen}
          onClose={closeAllPopups}
          onSubmit={handleDeleteCardSubmit}
        />

        <ImagePopup
          card={selectedCard}
          onClose={closeAllPopups}
        />

        <InfoToolTip
          name="success"
          titleText="Вы успешно зарегистрировались"
          isOpen={isSuccess}
          onClose={closeAllPopups}
        />

        <InfoToolTip
          name="error"
          titleText="Что-то пошло не так! Попробуйте ещё раз."
          isOpen={isError}
          onClose={closeAllPopups}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
