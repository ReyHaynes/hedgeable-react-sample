import axios from 'axios'
import { Component } from 'react'
import { Redirect } from 'react-router-dom'
import user from '../user'
import { LoginUI } from './ui/Login-UI'

export { user }

export default class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            error: false,
            loggedin: this.checkIfLoggedIn()
        }
        this.api = axios.create({ baseURL: './api' })
        this.UI = LoginUI.bind(this)
    }

    checkIfLoggedIn() {
        return !!user.data.token
    }

    onValueUpdate(updating, value) {
        this.setState({ [updating]: value })
    }

    submit(e,_this, _email, _password) {
        e.preventDefault()
        _this.setState({loading: true})
        _this.api.post('/client/login', { appToken: 'token', email: _email, password: _password })
            .then((response) => {
                if (response.data.status !== 200) {
                    _this.setState({
                        loading: false,
                        error: response.data.payload.error
                    })
                    return
                }

                let { token, email, clientId } = response.data.payload.response

                user.data.token = token
                user.data.email = email
                user.data.username = email
                user.data.clientId = clientId
                user.save()

                _this.setState({
                    loading: false,
                    loggedin: true
                })
            })
            .catch((error) => _this.setState({
                loading: false,
                error: 'Could not connect. Please try again in a few moments.'
            }))
    }

    render() {
        // Render UI
        return ( this.UI() )
    }
}
