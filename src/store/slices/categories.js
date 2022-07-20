import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import DbCategories from '../../firebase/collections/dbCategories'
import DbFavorites from '../../firebase/collections/dbFavorites'

const _newCategory = createAsyncThunk(
  'categories/newCategory', async (data, { rejectWithValue }) => {
    return await DbCategories.newCategory(data, rejectWithValue)
  }
)

export const _newProduct = createAsyncThunk(
  'categories/_newProduct', async (data, { rejectWithValue }) => {
    return await DbCategories.newProduct(data, rejectWithValue)
  }
)

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories', async (searchValue = null) => {
    return await DbCategories.getCategories(searchValue)
  }
)

const _saveNewOrder = createAsyncThunk(
  'categories/_saveNewOrder', async (data) => {
    return await DbCategories.saveNewOrder(data)
  }
)

const _deleteProduct = createAsyncThunk(
  'categories/_deleteProduct', async (prodId, { rejectWithValue }) => {
    return await DbCategories.deleteProduct(prodId, rejectWithValue)
  }
)

const _deleteCategory = createAsyncThunk(
  'categories/_deleteCategory', async (catId, { rejectWithValue }) => {
    return await DbCategories.deleteCategory(catId, rejectWithValue)
  }
)

const _saveFavorite = createAsyncThunk(
  'categories/_saveFavorite', async (prodId, { rejectWithValue }) => {
    return await DbFavorites.saveFavorite(prodId, rejectWithValue)
  }
)

const _removeFavorite = createAsyncThunk(
  'categories/_removeFavorite', async (prodId) => {
    return await DbFavorites.deleteFavorite(prodId)
  }
)

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState: {
    loadingCategories: true,
    statusRemoveProduct: null,
    list: [],
    favorites: [],
    searchValue: ''
  },
  reducers: {
    _setSearchValue: (state, {payload}) => {
      state.searchValue = payload
    },
    _hideProduct: (state, {payload}) => {
      state.list = state.list.map( cat => {
        cat.products.map( prod => {
          if(prod.id === payload) {
            prod.hide = true
          }
          return prod
        })
        return cat
      })
    },
    _hideCategory: (state, {payload}) => {
      state.list = state.list.filter( cat => {
        if(cat.id === payload) {
          cat.hide = true
        }
        return cat
      })
    },
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
  },
  extraReducers: {
    [_newCategory.pending]: (state) => {state.statusNewCategory = 'loading'},
    [_newCategory.fulfilled]: (state) => {state.statusNewCategory = 'success'},
    [_newCategory.rejected]: (state) => {state.statusNewCategory = 'failed'},
    [_newProduct.pending]: (state) => {state.statusNewProduct = 'loading'},
    [_newProduct.fulfilled]: (state) => {state.statusNewProduct = 'success'},
    [_newProduct.rejected]: (state) => {state.statusNewProduct = 'failed'},
    [fetchCategories.pending]: (state) => {
      state.status = 'loading'
      state.loadingCategories = true
    },
    [fetchCategories.fulfilled]: (state, {payload}) => {
      state.status = 'success'
      state.loadingCategories = false
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
      state.loadingCategories = false
    },
    [_saveFavorite.pending]: (state) => {state.statusSaveFavorite = 'loading'},
    [_saveFavorite.fulfilled]: (state) => {state.statusSaveFavorite = 'success'},
    [_saveFavorite.rejected]: (state) => {state.statusSaveFavorite = 'failed'},
    [_removeFavorite.pending]: (state) => {state.statusRemoveFavorite = 'loading'},
    [_removeFavorite.fulfilled]: (state) => {state.statusRemoveFavorite = 'success'},
    [_removeFavorite.rejected]: (state) => {state.statusRemoveFavorite = 'failed'},
    [_deleteProduct.pending]: (state) => {state.statusRemoveProduct = 'loading'},
    [_deleteProduct.fulfilled]: (state) => {state.statusRemoveProduct = 'success'},
    [_deleteProduct.rejected]: (state) => {state.statusRemoveProduct = 'failed'},
    [_deleteCategory.pending]: (state) => {state.statusRemoveCategory = 'loading'},
    [_deleteCategory.fulfilled]: (state) => {state.statusRemoveCategory = 'success'},
    [_deleteCategory.rejected]: (state) => {state.statusRemoveCategory = 'failed'}
  }
})

export default categoriesSlice.reducer

const { 
  _setFavoriteON, 
  _setFavoriteOFF, 
  _changeProdOrder, 
  _setSearchValue, 
  _hideProduct,
  _hideCategory
} = categoriesSlice.actions

export const createCategory = (data) => async (dispatch) => {
  return dispatch(_newCategory(data)).then( async (result) => {
    if(result.meta.requestStatus === 'fulfilled') {
      await dispatch(fetchCategories())
    }
    return result
  })
}

export const createProduct = (data) => async (dispatch) => {
  return dispatch(_newProduct(data)).then( async (result) => {
    if(result?.meta?.requestStatus === 'fulfilled') {
      await dispatch(fetchCategories())
    }
    return result
  })
}

export const searchByValue = (data) => async (dispatch) => {
  const setSearchValue = async () => {
    dispatch(_setSearchValue(data))
    dispatch(fetchCategories(data))
  }
  return setSearchValue()
}

export const addToFavorites = (prodId) => async (dispatch) => {
  return dispatch(_saveFavorite(prodId)).then( async (result) => {
    if(result?.meta?.requestStatus === 'fulfilled') {
      dispatch(_setFavoriteON(prodId))
    }
    return result
  })
}

export const removeFromFavorites = (prodId) => async (dispatch) => {
  return await dispatch(_removeFavorite(prodId)).then( async (result) => {
    if(result?.meta?.requestStatus === 'fulfilled') {
      dispatch(_setFavoriteOFF(prodId))
    }
    return result
  })
}

export const changeProdOrder = (data) => async (dispatch) => {
  return dispatch(_saveNewOrder(data)).then( async (result) => {
    if(result?.meta?.requestStatus === 'fulfilled') {
      dispatch(_changeProdOrder(data))
    }
    return result
  })
}

export const removeProduct = (data) => async (dispatch) => {
  return dispatch(_deleteProduct(data)).then( async (result) => {
    if(result?.meta?.requestStatus === 'fulfilled') {
      dispatch(_hideProduct(data))
    }
    return result
  })
}

export const removeCategory = (data) => async (dispatch) => {
  return dispatch(_deleteCategory(data)).then( async (result) => {
    if(result?.meta?.requestStatus === 'fulfilled') {
      dispatch(_hideCategory(data))
    }
    return result
  })
}