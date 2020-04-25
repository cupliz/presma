const INITIAL_STATE = {
  auth: null,
  cart: null,
  jadwalTerpilih: {},
  pelatihanTerpilih: {},
  biodataPeserta: {},
  kodePembayaran: null
}

// REDUCERS
export const rootReducer = (state = INITIAL_STATE, { type, data }) => {
  switch (type) {
    case 'LOGIN':
      return Object.assign({}, state, { auth: data })
    case 'LOGOUT':
      return Object.assign({}, state, { auth: null })
    case 'SET_CART':
      return Object.assign({}, state, { cart: data })
    case 'SET_JADWAL':
      return Object.assign({}, state, { jadwalTerpilih: data })
    case 'SET_PELATIHAN':
      return Object.assign({}, state, { pelatihanTerpilih: data })
    case 'SET_BIODATA':
      return Object.assign({}, state, { biodataPeserta: data })
    case 'KONFIRMASI':
      return Object.assign({}, state, { kodePembayaran: data })
    default:
      return state
  }
}
