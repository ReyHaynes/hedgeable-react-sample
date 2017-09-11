import axios from 'axios'
import ssl from 'ssl-root-cas'
import queryString from 'query-string'
import ep from './endpoints.json'
import config from '../server.config.json'

/* --------------------------------
    SSL required to prevent request errors.
    Cannot verify and get response without SSL cert.

    Download: https://support.comodo.com/index.php?/Knowledgebase/Article/View/970/108/intermediate-2-sha-2-comodo-rsa-domain-validation-secure-server-ca
   -------------------------------- */
ssl.addFile(__dirname + '/comodorsadvsecureca.crt').inject()

/* --------------------------------
    Remove Username & API Key to external file and .gitignore
   -------------------------------- */

export default class HedgeableAPI {
    constructor() {
        this.auth_token = null;
        this.api = axios.create({ baseURL: config.server })
        this.endpoints = ep;
    }

    connect(username='', key='') {
        return new Promise((resolve, reject) => {
            this.post('/authenticate', {username:username, key:key})
                .then((res) => {
                    this.auth_token = res.payload.response;
                    resolve(res);
                })
                .catch((err) => reject(err))
        })
    }

    replaceAuthToken(props) {
        if (props.appToken) {
            props[props.appToken] = this.auth_token
            delete props['appToken']
        }
        return props
    }

    // POST
    post(path='/', props={}) {
        let authProps = this.replaceAuthToken(props)

        // Console Log Output Request
        // console.log('Request: POST ' + path + ' ' + JSON.stringify(props))

        // Return Promise
        return new Promise((resolve, reject) => {
            this.api.post(path, authProps)
                .then((response) => {
                    if (path !== '/authenticate') console.log('[SUCCESS] Request: POST',path,' | Reply:',response.status)
                    resolve({
                        status: response.status,
                        payload: response.data
                    })
                })
                .catch((error) => {
                    console.log('[ERROR] Request: POST',path,'| Reply:',error.response.status)
                    reject({
                        status: error.response.status,
                        payload: error.response.data
                    })
                })
        })
    }

    get(path='/', props={}) {
        let authProps = this.replaceAuthToken(props)

        // Console Log Output Request
        // console.log('API URL Request:',path+'?'+queryString.stringify(authProps))

        // Return Promise
        return new Promise((resolve, reject) => {
            this.api.get(path+'?'+queryString.stringify(authProps))
                .then((response) => {
                    console.log('[SUCCESS] Request: GET',path,'| Reply:',response.status)
                    resolve({
                        status: response.status,
                        payload: response.data
                    })
                })
                .catch((error) => {
                    console.log('[ERROR] Request: GET',path,'| Reply:',error.response.status)
                    reject({
                        status: error.response.status,
                        payload: error.response.data
                    })
                })
        })
    }

    fourZeroFour(req) {
        console.log('[ERROR] Request:',req.method,req.path,'| Reply: 404')
        return {
            status: 404,
            payload: {
                error: 'API endpoint not found'
            }
        }
    }
}

export { config }
