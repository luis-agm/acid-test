import io from 'socket.io-client'

// Actions
const SET_SOCKET = 'acid-test/socket/SET_SOCKET'

const initialState = {
  socket: io()
}

// Reducer

export default function reducer ( state = initialState, action = {} ) {
  switch ( action.type ) {
    case SET_SOCKET:
      return {
        socket: action.payload
      }
    default:
      return state
  }
}

// Action Creators
export function setSocket ( payload ) {
  return { type: SET_SOCKET, payload }
}
