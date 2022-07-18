import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import dbConnector from '../../firebase/dbConnector'

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories', async () => {
    return await dbConnector.getCategories()
  }
)

export const saveFavorite = createAsyncThunk(
  'categories/saveFavorite', async (prodId) => {
    return await dbConnector.saveFavorite(prodId)
  }
)

export const removeFavorite = createAsyncThunk(
  'categories/removeFavorite', async (prodId) => {
    return await dbConnector.deleteFavorite(prodId)
  }
)

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    list: [],
    favorites: []
  },
  extraReducers: {
    [fetchCategories.pending]: (state) => {
      state.status = 'loading'
    },
    [fetchCategories.fulfilled]: (state, {payload}) => {
      state.status = 'success'
      state.list = payload
      let favorites = []

      payload.forEach(category => {
        category.products.forEach(product => {
          if(product.favorite) {
            favorites.push(product)
          }
        })
      })

      state.favorites = favorites

    },
    [fetchCategories.rejected]: (state) => {
      state.status = 'failed'
    },
    [saveFavorite.pending]: (state) => {
      state.status = 'loading'
    },
    [saveFavorite.fulfilled]: (state, {payload}) => {
      // this method is resolved by the setFavoriteON reducer called from addToFavorites
    },
    [saveFavorite.rejected]: (state) => {
      state.status = 'failed'
    },
    [removeFavorite.pending]: (state) => {
      state.status = 'loading'
    },
    [removeFavorite.fulfilled]: (state, {payload}) => {
      // this method is resolved by the setFavoriteOFF reducer called from removeFromFavorites
    },
    [removeFavorite.rejected]: (state) => {
      state.status = 'failed'
    }
  },
  reducers: {
    setFavoriteON: (state, {payload}) => {
      const newFavorites = []
      state.list = state.list.map( cat => {
        cat.products.map( prod => {
          if(prod.id === payload) {
            prod.favorite = true
            newFavorites.push(prod)
          }
          return prod
        })
        return cat
      })

      state.favorites = [...state.favorites, ...newFavorites]
    },
    setFavoriteOFF: (state, {payload}) => {
      state.list = state.list.map( cat => {
        cat.products.map( prod => {
          if(prod.id === payload) {
            prod.favorite = false
          }
          return prod
        })

        return cat
      })

      state.favorites = state.favorites.filter(fav => fav.id !== payload)
    }
  }
})

export default categoriesSlice.reducer
const { setFavoriteON, setFavoriteOFF } = categoriesSlice.actions

export const addToFavorites = (prodId) => {
  return (dispatch) => {
    const add = async () => {
      dispatch(setFavoriteON(prodId))
      dispatch(saveFavorite(prodId)).then(saved => !saved && dispatch(setFavoriteOFF(prodId)))
    }

    return add()
  }  
}

export const removeFromFavorites = (prodId) => {
  return (dispatch) => {
    const remove = async () => {
      dispatch(setFavoriteOFF(prodId))
      dispatch(removeFavorite(prodId)).then(removed => !removed && dispatch(setFavoriteON(prodId)))
    }

    return remove()
  }  
}