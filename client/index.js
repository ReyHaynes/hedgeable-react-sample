import React from 'react'
import { render } from 'react-dom'
import { App } from './components'
import { BrowserRouter, Route } from 'react-router-dom'

window.React = React

render(
    <BrowserRouter>
        <Route component={App} />
    </BrowserRouter>,
    document.getElementById('root')
)
