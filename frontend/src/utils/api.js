class RestfullClient {
  constructor(options) {
    this._options = options;
  }
  setAuthHeaders = (token, params) => {
    const headers = {"Authorization": `Bearer ${token}`, ...params}
    this._headers = headers
  }


  _requestOptions(urlPath, method) {
      this._apiUrl = `${this._options.baseUrl}/${urlPath}`;
      this._method = method;
  }

  _checkResponse(res) {
      if (res.ok) {
          return res.json();
      }
      return Promise.reject(`Ошибка ${res.status}`)
  }

  _bodyReq(urlPath, method, body) {
    this._requestOptions(urlPath, method);

    return fetch(this._apiUrl, {
      method: this._method,
      headers: this._headers,
      body: JSON.stringify(body),
    })
      .then(this._checkResponse)
      .then(({ data }) => data)
  }

  _uriReq(urlPath, method) {
    this._requestOptions(urlPath, method);
    return fetch(this._apiUrl, {
      method: this._method,
      headers: this._headers,
    })
      .then(this._checkResponse)
      .then(({ data }) => data)
  }

}

class Api extends RestfullClient {

  validate(token) {
    return fetch(`${this._options.baseUrl}/users/me`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })
    .then(res => res.json())
      .then(data => {
        this.setAuthHeaders(token, { "Content-Type": "application/json" })
        return data
      })
  } 

  getUserInfo() {
    return this._uriReq("users/me", "GET")
  }
  
  getCardList() {
    return this._uriReq("cards", "GET");
  }

  updateAvatar(link) {
    return this._bodyReq("users/me/avatar", "PATCH", { avatar: link });
  }

  updateProfile(name, about) {
    return this._bodyReq("users/me", "PATCH", { name: name, about: about });
  }

  addCard(name, link) {
    return this._bodyReq("cards", "POST", { name: name, link: link });
  }

  deleteCard(cardId) {
    return this._uriReq(`cards/${cardId}`, "DELETE");
  }

  addLike(cardId) {
    return this._uriReq(`cards/${cardId}/likes`, "PUT");
  }

  deleteLike(cardId) {
    return this._uriReq(`cards/${cardId}/likes`, "DELETE");
  }

}


const api = new Api({
  baseUrl: `https://auth.nomoreparties.co`
});

export default api;
