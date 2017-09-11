import { Redirect } from 'react-router-dom'

export function LoginUI() {
    let _email, _password
    let { loading, error, loggedin } = this.state
    let { submit } = this

    return (
        <div className="login row align-items-center justify-content-center">
        { (loggedin) ?
            <Redirect to="/account" />
            :
            <form className="login-form col-12 col-sm-6 row justify-content-center"
                onSubmit={(e) => submit(e, this, _email, _password)}>
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
                               onChange={input => _email = input.target.value} /><br />
                        <label className="login-label" htmlFor="password">Password: </label><br />
                        <input type="password"
                               className="login-input"
                               id="password"
                               onChange={input => _password = input.target.value} /><br />
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
