import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import dbConnector from '../../firebase/dbConnector'

export const saveFavorite = createAsyncThunk(
  'favorites/saveFavorite', async (prodId) => {
    return await dbConnector.saveFavorite(prodId)
  }
)

export const deleteFavorite = createAsyncThunk(
  'favorites/deleteFavorite', async (prodId) => {
    return await dbConnector.deleteFavorite(prodId)
  }
)

export const getFavorites = createAsyncThunk(
  'favorites/getFavorites', async () => {
    return await dbConnector.getFavorites()
  }
)

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    list: []
  },
  extraReducers: {
    [getFavorites.pending]: (state) => {
      state.status = 'loading'
    },
    [getFavorites.fulfilled]: (state, {payload}) => {
      state.status = 'success'
      state.list = payload
    },
    [getFavorites.rejected]: (state) => {
      state.status = 'failed'
    },
    [saveFavorite.pending]: (state) => {
      state.status = 'loading'
    },
    [saveFavorite.fulfilled]: (state, {payload}) => {
      state.status = 'success'
    },
    [saveFavorite.rejected]: (state) => {
      state.status = 'failed'
    },
    [deleteFavorite.pending]: (state) => {
      state.status = 'loading'
    },
    [deleteFavorite.fulfilled]: (state, {payload}) => {
      state.status = 'success'
    },
    [deleteFavorite.rejected]: (state) => {
      state.status = 'failed'
    },
  },
  reducers: {
    addToList: (state, {payload}) => {
      state.list = [...new Set([...state.list, payload])]
    },
    removeFromList: (state, {payload}) => {
      state.list = state.list.filter(item => item !== payload)
    }
  }
})

export default favoritesSlice.reducer
const { addToList, removeFromList } = favoritesSlice.actions

export const addToFavorites = (prodId) => {
  return (dispatch) => {
    const add = async () => {
      dispatch(addToList(prodId))
      dispatch(saveFavorite(prodId)).then(saved => !saved && dispatch(removeFromList(prodId)))
    }

    return add()
  }  
}

export const removeFromFavorites = (prodId) => {
  return (dispatch) => {
    const remove = async () => {
      dispatch(removeFromList(prodId))
      dispatch(deleteFavorite(prodId)).then(removed => !removed && dispatch(addToList(prodId)))
    }

    return remove()
  }  
}