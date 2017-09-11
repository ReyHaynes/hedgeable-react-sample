import axios from 'axios'
import { Component } from 'react'
import { Redirect } from 'react-router-dom'
import user from '../user'

export { user }

let _email, _password

export default class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            error: false,
            loggedin: this.checkIfLoggedIn()
        }
        this.api = axios.create({ baseURL: './api' })
    }

    checkIfLoggedIn() {
        return !!user.data.token
    }

    submit(e) {
        e.preventDefault()
        this.setState({loading: true})
        this.api.post('/client/login', { appToken: 'token', email: _email.value, password: _password.value })
            .then((response) => {
                if (response.data.status !== 200) {
                    this.setState({
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

                this.setState({
                    loading: false,
                    loggedin: true
                })
            })
            .catch((error) => this.setState({
                loading: false,
                error: 'Could not connect. Please try again in a few moments.'
            }))
    }

    render() {
        let { loading, error, loggedin } = this.state
        return (
            <div className="login row align-items-center justify-content-center">
            { (loggedin) ?
                <Redirect to="/account" />
                :
                <form className="login-form col-12 col-sm-6 row justify-content-center" onSubmit={this.submit.bind(this)}>
                    <h2 className="login-title col-12">
                        <img src="/assets/img/hedgeable.svg" className="login-logo" /><br />
                        Account Login
                    </h2>
                    { (!loading) ?
                        // Login Form
                        <div className="login-data col-auto">
                            <label className="login-label" htmlFor="email">Email: </label><br />
                            <input type="email"
                                   className="login-input"
                                   id="email"
                                   ref={input => _email = input} /><br />
                            <label className="login-label" htmlFor="password">Password: </label><br />
                            <input type="password"
                                   className="login-input"
                                   id="password"
                                   ref={input => _password = input} /><br />
                            <br />
                            <button className="btn btn-primary btn-block">Submit</button>
                            { (error) ?
                                <div className="error">{error}</div>
                                :
                                null
                            }
                        </div>
                        :
                        // Submit / Loading Screen
                        <div className="login-loading">Loading...</div>
                    }
                </form>
            }
            </div>
        )
    }
}
