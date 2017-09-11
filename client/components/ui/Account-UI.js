import { Redirect } from 'react-router-dom'
import user from '../../user'

export function AccountUI() {
    let { loggedin, loading, data_current_holdings, data_historical_balance, data_transactions } = this.state
    let { logout } = this
    return (
        <div className="account">
            <nav className="navbar fixed-top navbar-light bg-light">
                <span className="navbar-brand" href="#">
                    <img className="navbar-logo" src="/assets/img/hedgeable.svg" alt="" />
                </span>
                <form className="form-inline my-2 my-lg-0">
                    <button type="button" className="close account-logout_button" aria-label="Close" onClick={logout.bind(this)}>
                        <span aria-hidden="true">
                            <span className="account-logout">Logout</span> &times;
                        </span>
                    </button>
                </form>
            </nav>
            { (!loggedin) ?
                <Redirect to="/login" />
                :
                <div className="account-info">
                { (loading) ?
                    <div className="account-loading row align-items-center justify-content-center">
                        <h3 className="col-sm-6 row justify-content-center">
                            <div className="account-loadingInner col-12">
                                <img className="account-loadingGif" src="/assets/img/ninja-gif-4.gif" />
                            </div>
                            <div className="account-loadingInner col-12">Loading...</div>
                        </h3>
                    </div>
                    :
                    <div className="account-data">
                        <div className="account-user">
                            Account: <b>{user.data.email}</b><br/>
                            ID: <b>{user.data.clientId}</b>
                        </div>
                        <div className="account-info-wrapper account-holdings">
                            <h2>Current Holdings</h2>
                            <div className="chart-wrapper">
                                <canvas id="currentHoldings" />
                            </div>
                            <table className="table table-striped table-responsive account-table">
                                <thead>
                                    <tr>
                                        <th>Security</th>
                                        <th>Purchase Date</th>
                                        <th>Weight</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                { (data_current_holdings.length) ?
                                    data_current_holdings.map((item, i) =>
                                    <tr key={i}>
                                        <th scope="row">{item.securitiesId}</th>
                                        <td>{item.date}</td>
                                        <td>{item.weight}</td>
                                        <td>{item.amount}</td>
                                    </tr>
                                ) : null }
                                </tbody>
                            </table>
                        </div>
                        <div className="account-info-wrapper account-history">
                            <h2>Historical Balance</h2>
                            <h5>Last 12 Months</h5>
                            <div className="chart-wrapper">
                                <canvas id="historicalBalance" />
                            </div>
                            <table className="table table-striped table-responsive account-table">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Balance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                { (data_historical_balance.length) ?
                                    data_historical_balance.slice(0).reverse().slice(0,12).map((item, i) =>
                                    <tr key={i}>
                                        <th scope="row">{item.date}</th>
                                        <td>{item.value}</td>
                                    </tr>
                                ) : null }
                                </tbody>
                            </table>
                        </div>
                        <div className="account-info-wrapper account-transactions">
                            <h2>Past Transactions</h2>
                        </div>
                        <table className="table table-striped table-responsive account-table">
                            <thead>
                                <tr>
                                    <th>Tx #</th>
                                    <th>Security</th>
                                    <th>Date</th>
                                    <th>Quanitity</th>
                                    <th>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                            { (data_transactions.length) ?
                                data_transactions.sort((a, b) => {
                                    return b.portfolioTransactionId - a.portfolioTransactionId;
                                }).map((item, i) =>
                                <tr key={i}>
                                    <th scope="row">{item.portfolioTransactionId}</th>
                                    <td>{item.securitiesId}</td>
                                    <td>{item.date}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.price}</td>
                                </tr>
                            ) : null }
                            </tbody>
                        </table>
                    </div>
                }
                </div>
            }
        </div>
    )
}
