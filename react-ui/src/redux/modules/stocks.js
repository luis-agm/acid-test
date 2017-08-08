// Actions
const SET_STOCKS = 'acid-test/stocks/SET_STOCKS'
const SET_CURRENT = 'acid-test/stocks/SET_CURRENT'
const SET_ERROR = 'acid-test/stocks/SET_ERROR'
const CLEAR_ERROR = 'acid-test/stocks/CLEAR_ERROR'

const initialState = {
  all: [],
  currentStock: '',
  error: undefined
}

// Reducer

export default function reducer ( state = initialState, action = {} ) {
  switch ( action.type ) {
    case SET_STOCKS:
      return {
        all: action.payload,
        currentStock: state.currentStock,
        error: state.error
      }
    case SET_CURRENT:
      return {
        all: state.all,
        currentStock: action.payload,
        error: state.error
      }
    case SET_ERROR:
      return {
        all: state.all,
        currentStock: state.currentStock,
        error: action.payload
      }
    case CLEAR_ERROR:
      return {
        all: state.all,
        currentStock: state.currentStock,
        error: undefined
      }
    default:
      return state
  }
}

// Action Creators
export function setStocks ( payload ) {
  return { type: SET_STOCKS, payload }
}

export function setCurrent ( payload ) {
  return { type: SET_CURRENT, payload }
}

export function setError ( payload ) {
  return { type: SET_ERROR, payload }
}

export function clearError () {
  return { type: CLEAR_ERROR }
}
