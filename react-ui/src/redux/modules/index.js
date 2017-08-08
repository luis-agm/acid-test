import { combineReducers } from 'redux'
import CounterReducer from './stocks'
import SocketReducer from './socket'
import { routerReducer } from 'react-router-redux'

const rootReducer = combineReducers( {
  stocks: CounterReducer,
  router: routerReducer,
  socket: SocketReducer
} )

export default rootReducer
