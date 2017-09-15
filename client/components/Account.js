import axios from 'axios'
import { Component } from 'react'
import user from '../user'
import Chart from 'chart.js'
import { AccountUI } from './ui/Account-UI'

let _clientHoldings

export default class Account extends Component {
    constructor(props) {
        super(props)
        this.state = {
            error: false,
            loading: false,
            loggedin: this.checkIfLoggedIn(),
            data_all_information: false,
            data_current_holdings: false,
            data_historical_balance: false,
            data_transactions: false
        }
        this.api = axios.create({ baseURL: './api' })
        this.UI = AccountUI.bind(this)
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

    getAllInfomation() {
        return new Promise((resolve, reject) => {
            let { clientId, token } = user.data
            this.getFromAPI(
                `/client/${clientId}/getallinformation`,
                { appToken:'token', usertoken:token, clientid: clientId })
                .then((res) => {
                    this.setState({ data_all_information: res })
                    resolve(true)
                })
                .catch((err) => {
                    this.setState({ data_all_information: false })
                    reject(false)
                })
        })
    }

    getCurrentHoldings() {
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

    getHistoricalBalance() {
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

    getTransactions() {
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
        }).catch((err) => console.log('Load error:', err))
    }

    render() {
        // Render UI
        return( this.UI() )
    }
}
