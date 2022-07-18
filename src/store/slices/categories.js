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

export const saveNewOrder = createAsyncThunk(
  'categories/saveNewOrder', async ({categoryId, prodId, direction, currentOrder}) => {
    return await dbConnector.saveNewOrder(categoryId, prodId, direction, currentOrder)
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
    _setFavoriteON: (state, {payload}) => {
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
    _setFavoriteOFF: (state, {payload}) => {
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
    },
    _changeProdOrder: (state, {payload}) => {
      const {categoryId, prodId, direction, currentOrder} = payload;
      const newOrderNumber = direction === 'left' ? currentOrder - 1 : currentOrder + 1

      state.list = state.list.map(category => {
        category.products.map(product => {
          if (product.categoryId === categoryId) {
            if (product.id === prodId) {
              product.orderNumber = newOrderNumber
            } else if (product.orderNumber === newOrderNumber) {
              product.orderNumber = currentOrder
            }
          }
          return product
        })

        category.products.sort((a, b) => a.orderNumber - b.orderNumber)
        return category
      })
    }
  }
})

export default categoriesSlice.reducer
const { _setFavoriteON, _setFavoriteOFF, _changeProdOrder } = categoriesSlice.actions

export const addToFavorites = (prodId) => {
  return (dispatch) => {
    const add = async () => {
      dispatch(_setFavoriteON(prodId))
      dispatch(saveFavorite(prodId)).then(saved => !saved && dispatch(_setFavoriteOFF(prodId)))
    }

    return add()
  }  
}

export const removeFromFavorites = (prodId) => {
  return (dispatch) => {
    const remove = async () => {
      dispatch(_setFavoriteOFF(prodId))
      dispatch(removeFavorite(prodId)).then(removed => !removed && dispatch(_setFavoriteON(prodId)))
    }

    return remove()
  }  
}

export const changeProdOrder = (categoryId, prodId, direction, currentOrder) => {
  return (dispatch) => {
    const rearrange = async () => {
      dispatch(_changeProdOrder({categoryId, prodId, direction, currentOrder}))
      dispatch(saveNewOrder({categoryId, prodId, direction, currentOrder})).then(
        changed => !changed && dispatch(
          _changeProdOrder({categoryId, prodId, direction: direction === 'left' ? 'right' : 'left', currentOrder}
        )
      ))
    }

    return rearrange()
  }
}