const INITIAL_STATE = {
  auth: null,
  jadwalTerpilih: {},
  pelatihanTerpilih: {},
  biodataPeserta: {},
  pendaftaran: {}
}

// REDUCERS
export const rootReducer = (state = INITIAL_STATE, { type, data }) => {
  switch (type) {
    case 'LOGIN':
      return Object.assign({}, state, { auth: data })
    case 'LOGOUT':
      return Object.assign({}, state, { auth: null })
    case 'SET_JADWAL':
      return Object.assign({}, state, { jadwalTerpilih: data })
    case 'SET_PELATIHAN':
      return Object.assign({}, state, { pelatihanTerpilih: data })
    case 'SET_BIODATA':
      return Object.assign({}, state, { biodataPeserta: data })
    case 'KONFIRMASI':
      return Object.assign({}, state, { pendaftaran: data })
    default:
      return state
  }
}
