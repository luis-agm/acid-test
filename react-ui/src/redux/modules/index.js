import { combineReducers } from 'redux'
import CounterReducer from './stocks'
import { routerReducer } from 'react-router-redux'

const rootReducer = combineReducers( {
  stocks: CounterReducer,
  router: routerReducer
} )

export default rootReducer
