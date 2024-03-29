class BaseAuth {

    constructor(options) {
        this._options = options
    }

    _checkResponse = (res) => {
        if (res.ok) {
            return res.json()
        }
        else {
            return Promise.reject(`Register error: ${res.json()}`)
        }
    }
}


class Auth extends BaseAuth{


    register = (password, email) => {
        const body = JSON.stringify({ "password": password, "email": email })

        return fetch(`${this._options.baseUrl}/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: body
        })
            .then(this._checkResponse)
       
    }
    login = (password, email) => {
        const body = JSON.stringify({ "password": password, "email": email })
        return fetch(`${this._options.baseUrl}/signin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: body
        })
            .then(this._checkResponse)
    }
}

const auth = new Auth({
    baseUrl: `https://ugamon2.nomoredomains.club/api`
    //baseUrl: `http://localhost:3000/api`
  });
  
  export default auth;