import { createStore, compose } from 'redux'
import rootReducer from './modules'

export default function configureStore ( initialState ) {
  const store = createStore(
        rootReducer,
        initialState,
        compose(
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
