import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { FourZeroFour } from './404'
import Login, { user } from './Login'
import Account from './Account'

export const App = () => (
    <div id="app" className="container">
        <Switch>
            <Route exact path="/" component={HomeRedirect} />
            <Route path="/login" component={Login} />
            <Route path="/account" component={Account} />
            <Route component={FourZeroFour} />
        </Switch>
    </div>
)

const HomeRedirect = () => {
    return (
        (!!user.data.token) ? <Redirect to="/account" /> : <Redirect to="/login" />
    )
}
