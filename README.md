Hedgeable React Sample Project
==============================

Sample app created in Node/ES6/React to:
- Authenticate app on server side (Protect your Keys)
- Log in sample user
- Display sample user holdings

Using:
    - Front-end: React, Bootstrap, jQuery, chart.js
    - Back-end: Node.js, Express, ssl-root-cas
    - Build: Webpack, Babel
    - Misc: Redbull, Music, Broken Code 😢, Fixed Code 🤓

Quick Start
-----------

1. Install Dependencies: `node install`

2. Edit `/server.config.json` with the proper Hedgeable API username, private key, server uri & port to run the app.
File format:
```json
{
    "username": "<Hedgeable username>",
    "key": "<Hedgeable privateKey>",
    "server": "https://sandbox.hedgeable.com/api",
    "port": 3000
}
```

3. Build and start app: `npm start`.

    Optionally, also use `npm run webpack` to watch/build `/client` side code.


4. Go to `http://localhost:<config port>` on your browser.

Project Info
------------
`/client`: Code for the client side is edited here.

`/public`: Client side code is compiled into `assets/bundle.(js|css)`

`/public/assets`: Static files can go here. Do not touch the bundle files.

`/server`: Middleware API server to protect private key and configure acceptable routes.

`/index.js`: Loads express servers, routing, and preps for API authentication.

`/server.config.json`: API and server port config file.


To Do
-----
- Fix bootstrap 4/webpack 3 build. Currently using CDN.
- Implement error messages & UI
- Refactor `/client/components/Account.js` graph code
- Create production build (Especially client side!)
- Use redux!
