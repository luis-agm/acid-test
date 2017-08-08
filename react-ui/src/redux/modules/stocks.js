// Actions
const SET_STOCKS = 'acid-test/stocks/SET_STOCKS'
const SET_CURRENT = 'acid-test/stocks/SET_CURRENT'
const SET_CURRENT_PRICES = 'acid-test/stocks/SET_CURRENT_PRICES'
const SET_ERROR = 'acid-test/stocks/SET_ERROR'
const CLEAR_ERROR = 'acid-test/stocks/CLEAR_ERROR'

const initialState = {
  all: [],
  currentStock: {},
  currentPrices: [],
  error: undefined
}

// Reducer

export default function reducer ( state = initialState, action = {} ) {
  switch ( action.type ) {
    case SET_STOCKS:
      return {
        all: action.payload,
        currentStock: state.currentStock,
        currentPrices: state.currentPrices,
        error: state.error
      }
    case SET_CURRENT:
      return {
        all: state.all,
        currentStock: action.payload,
        currentPrices: state.currentPrices,
        error: state.error
      }
    case SET_CURRENT_PRICES:
      return {
        all: state.all,
        currentStock: state.currentStock,
        currentPrices: action.payload,
        error: state.error
      }
    case SET_ERROR:
      return {
        all: state.all,
        currentStock: state.currentStock,
        currentPrices: state.currentPrices,
        error: action.payload
      }
    case CLEAR_ERROR:
      return {
        all: state.all,
        currentStock: state.currentStock,
        currentPrices: state.currentPrices,
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

export function setCurrentPrices ( payload ) {
  return { type: SET_CURRENT_PRICES, payload }
}

export function setError ( payload ) {
  return { type: SET_ERROR, payload }
}

export function clearError () {
  return { type: CLEAR_ERROR }
}
