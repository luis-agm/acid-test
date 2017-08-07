import { combineReducers } from 'redux'
import CounterReducer from './stocks'

const rootReducer = combineReducers( {
  stocks: CounterReducer
} )

export default rootReducer
