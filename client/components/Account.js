import axios from 'axios'
import { Component } from 'react'
import { Redirect } from 'react-router-dom'
import user from '../user'
import Chart from 'chart.js';

let _clientHoldings

export default class Account extends Component {
    constructor(props) {
        super(props)
        this.state = {
            error: false,
            loading: false,
            loggedin: this.checkIfLoggedIn(),
            data_current_holdings: false,
            data_historical_balance: false,
            data_transactions: false
        }
        this.api = axios.create({ baseURL: './api' })
    }

    componentDidMount() {
        if (this.state.loggedin) {
            this.loadData()
        }
    }

    graphCurrentHoldingsData() {
        let info = {
            amount: [],
            securitiesId: [],
            total: 0
        }

        let sortedData = this.state.data_current_holdings.sort((a, b) => {
            return b.amount - a.amount;
        })

        sortedData.map((item) =>  {
            info.amount = [...info.amount, item.amount]
            info.securitiesId = [...info.securitiesId, 'Security #'+item.securitiesId]
            info.total += item.amount
        })

        let ctx = document.getElementById("currentHoldings").getContext("2d")
        let data = {
            datasets: [{
                data: info.amount,

                // Needs to be edited for color generation
                backgroundColor: [
                    "lime", "green", "darkgreen", "lightblue", "blue",
                    "darkblue", "purple", "red", "orange", "darkorange"
                ],
            }],
            labels: info.securitiesId
        }

        let options = {
            responsive: true
        }

        let pieChart = new Chart(ctx, {
            type: 'pie',
            data: data,
            options: options
        })
    }

    graphHistoricalBalanceData() {
        let info = {
            balance: [],
            date: []
        }

        let sortedData = this.state.data_historical_balance.slice(0).reverse().slice(0,12).reverse()

        sortedData.map((item) =>  {
            info.balance = [...info.balance, item.value]
            info.date = [...info.date, item.date]
        })

        let ctx = document.getElementById("historicalBalance").getContext("2d")
        let data = {
            datasets: [{
                data: info.balance,
                backgroundColor: "#41d9f4",
                borderColor: "#42a4f4",
                fill: "start",
                label: 'Balance',
            }],
            labels: info.date
        }

        let options = {
            responsive: true
        }

        let barChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: options
        })
    }

    checkIfLoggedIn() {
        return !!user.data.token
    }

    getCurrentHoldings(uri, props) {
        return new Promise((resolve, reject) => {
            let { clientId, token } = user.data
            this.getFromAPI(
                `/client/${clientId}/holding/agg`,
                { appToken:'token', usertoken:token, clientid: clientId })
                .then((res) => {
                    this.setState({ data_current_holdings: res })
                    resolve(true)
                })
                .catch((err) => {
                    this.setState({ data_current_holdings: false })
                    reject(false)
                })
        })
    }

    getHistoricalBalance(uri, props) {
        return new Promise((resolve, reject) => {
            let { clientId, token } = user.data
            this.getFromAPI(
                `/client/${clientId}/assetsize/agg`,
                { appToken:'token', usertoken:token, clientid: clientId, sortType: 'M' })
                .then((res) => {
                    this.setState({ data_historical_balance: res })
                    resolve(true)
                })
                .catch((err) => {
                    this.setState({ data_historical_balance: false })
                    reject(false)
                })
        })
    }

    getTransactions(uri, props) {
        return new Promise((resolve, reject) => {
            let { clientId, token } = user.data
            this.getFromAPI(
                `/client/${clientId}/transaction/all`,
                { appToken:'token', usertoken:token, clientid: clientId })
                .then((res) => {
                    this.setState({ data_transactions: res })
                    resolve(true)
                })
                .catch((err) => {
                    this.setState({ data_transactions: false })
                    reject(false)
                })
        })
    }

    getFromAPI(uri, props) {
        return new Promise((resolve, reject) => {
            this.api.get(uri, { params: props })
                .then((res) => {
                    if (res.data.status !== 200) {
                        reject(false)
                        return
                    }
                    resolve(res.data.payload.response)
                })
                .catch((error) => {
                    console.log('error...')
                    console.log(error.data)
                    reject(false)
                })
        })
    }

    logout() {
        user.delete()
        this.setState({ loggedin: false })
    }

    loadData() {
        let { clientId, token } = user.data
        if (!user.data.response) user.data.response = {}
        this.setState({ loading: true })

        let loadingData = Promise.all([
            this.getCurrentHoldings(), this.getHistoricalBalance(), this.getTransactions()
        ]).then((res) => {
            this.setState({ loading: false })
            this.graphCurrentHoldingsData()
            this.graphHistoricalBalanceData()
        }).catch((err) => console.log('error'))
    }

    render() {
        let { loggedin, loading, data_current_holdings, data_historical_balance, data_transactions } = this.state
        return (
            <div className="account">
                <nav className="navbar fixed-top navbar-light bg-light">
                    <span className="navbar-brand" href="#">
                        <img className="navbar-logo" src="/assets/img/hedgeable.svg" alt="" />
                    </span>
                    <form className="form-inline my-2 my-lg-0">
                        <button type="button" className="close account-logout_button" aria-label="Close" onClick={this.logout.bind(this)}>
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
}
