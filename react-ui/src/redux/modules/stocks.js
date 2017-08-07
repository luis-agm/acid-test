// Actions
const SET_STOCKS = 'acid-test/stocks/SET_STOCKS'

const initialState = {
  all: [],
  currentStock: {}
}

// Reducer

export default function reducer ( state = initialState, action = {} ) {
  switch ( action.type ) {
    case SET_STOCKS:
      return {
        all: action.payload, // Here will be data
        currentStock: state.currentStock
      }
    default:
      return state
  }
}

// Action Creators
export function setStocks ( data ) {
  return { type: SET_STOCKS, payload: data }
}
