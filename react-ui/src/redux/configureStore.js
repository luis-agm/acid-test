import { createStore, compose, applyMiddleware } from 'redux'
import rootReducer from './modules'
import createHistory from 'history/createBrowserHistory'
import { routerMiddleware } from 'react-router-redux'

export const history = createHistory()

export default function configureStore ( initialState ) {
  const store = createStore(
        rootReducer,
        initialState,
        compose(
            applyMiddleware( routerMiddleware( history ) ),
            window.devToolsExtension ? window.devToolsExtension() : f => f
        )
    )

  if ( module.hot ) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept( './modules', () => {
      const nextRootReducer = require( './modules' ).default
      store.replaceReducer( nextRootReducer )
    } )
  }

  return store
}
