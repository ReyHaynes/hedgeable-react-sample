import express from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import Hedgeable, { config } from './server'

const api = new Hedgeable()
api.connect(config.username,config.key)
    .then((results) => {
        const clientServer = express(),
              apiServer = express.Router()

        const sanitizeHeader = (data) => {
            let d = data
            let filter = [
                'host','connection','cache-control','user-agent','postman-token',
                'accept','accept-encoding','accept-language']
            filter.forEach((f) => delete d[f])
            return d
        }

        apiServer.use(bodyParser.urlencoded({ extended: true }));
        apiServer.use(bodyParser.json());

        api.endpoints.map((route) => {
            switch(route.type) {
                case 'POST':
                    apiServer.post(route.endpoint, (req, res) => {
                        api.post(route.endpoint, req.body)
                            .then((response) => res.send(response))
                            .catch((response) => res.send(response))
                    })
                    break
                case 'GET':
                    apiServer.get(route.endpoint, (req, res) => {
                        api.get(req.path, req.query)
                            .then((response) => res.send(response))
                            .catch((response) => res.send(response))
                    })
                    break
                default:
                    console.log(`Unable to mount ${route.type} ${route.endpoint}`)
            }
        })

        apiServer.get('/*',(req, res) => res.send(api.fourZeroFour(req)))
        apiServer.post('/*',(req, res) => res.send(api.fourZeroFour(req)))

        clientServer.use('/api', apiServer)
        clientServer.use('/assets', express.static(path.join(__dirname, '/public/assets')))
        clientServer.get('/*',(req, res) => {
            // console.log('Client Request:', req.path)
            res.sendFile(path.join(__dirname + '/public/index.html'))
        })

        clientServer.listen(config.port, () => console.info(`
Client server running on http://localhost:${config.port}
Server API mounted on http://localhost:${config.port}/api

Server requests will be logged below:
-----------------------------------------------`))

    })
    .catch((results) => console.log(`Damn...Could not authenticate with Hedgeable API\n${res.payload.error}`))
