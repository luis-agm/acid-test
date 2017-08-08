import React from 'react'
import ReactDOM from 'react-dom'
import './styles/index.css'
import { Provider } from 'react-redux'
import App from './components/App'
import configureStore from './redux/configureStore'
import { unregister } from './registerServiceWorker'

const preloadedState = window.preloadedState ? window.preloadedState : false
const store = preloadedState ? configureStore( preloadedState ) : configureStore()

ReactDOM.render(
  <Provider store={ store }>
    <App />
  </Provider>,
  document.getElementById( 'root' )
)

unregister()
