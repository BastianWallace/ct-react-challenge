import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import dbConnector from '../../firebase/dbConnector'

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories', async (searchValue = null) => {
    return await dbConnector.getCategories(searchValue)
  }
)

const saveFavorite = createAsyncThunk(
  'categories/saveFavorite', async (prodId) => {
    return await dbConnector.saveFavorite(prodId)
  }
)

const removeFavorite = createAsyncThunk(
  'categories/removeFavorite', async (prodId) => {
    return await dbConnector.deleteFavorite(prodId)
  }
)

const saveNewOrder = createAsyncThunk(
  'categories/saveNewOrder', async ({categoryId, prodId, direction, currentOrder}) => {
    return await dbConnector.saveNewOrder(categoryId, prodId, direction, currentOrder)
  }
)

const deleteProduct = createAsyncThunk(
  'categories/deleteProduct', async (prodId) => {
    return await dbConnector.deleteProduct(prodId)
  }
)

const deleteCategory = createAsyncThunk(
  'categories/deleteCategory', async (catId) => {
    return await dbConnector.deleteCategory(catId)
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
  extraReducers: {
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
    [saveFavorite.pending]: (state) => {state.statusSaveFavorite = 'loading'},
    [saveFavorite.fulfilled]: (state) => {state.statusSaveFavorite = 'success'},
    [saveFavorite.rejected]: (state) => {state.statusSaveFavorite = 'failed'},
    [removeFavorite.pending]: (state) => {state.statusRemoveFavorite = 'loading'},
    [removeFavorite.fulfilled]: (state) => {state.statusRemoveFavorite = 'success'},
    [removeFavorite.rejected]: (state) => {state.statusRemoveFavorite = 'failed'},
    [deleteProduct.pending]: (state) => {state.statusRemoveProduct = 'loading'},
    [deleteProduct.fulfilled]: (state) => {state.statusRemoveProduct = 'success'},
    [deleteProduct.rejected]: (state) => {state.statusRemoveProduct = 'failed'},
    [deleteCategory.pending]: (state) => {state.statusRemoveCategory = 'loading'},
    [deleteCategory.fulfilled]: (state) => {state.statusRemoveCategory = 'success'},
    [deleteCategory.rejected]: (state) => {state.statusRemoveCategory = 'failed'}
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
    _showProduct: (state, {payload}) => {
      state.list = state.list.map( cat => {
        cat.products.map( prod => {
          if(prod.id === payload) {
            prod.hide = false
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
    _showCategory: (state, {payload}) => {
      state.list = state.list.filter( cat => {
        if(cat.id === payload) {
          cat.hide = false
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
  }
})

export default categoriesSlice.reducer

const { 
  _setFavoriteON, 
  _setFavoriteOFF, 
  _changeProdOrder, 
  _setSearchValue, 
  _hideProduct, 
  _showProduct,
  _hideCategory,
  _showCategory
} = categoriesSlice.actions

export const searchByValue = (searchValue) => {
  return (dispatch) => {
    const setSearchValue = async () => {
      dispatch(_setSearchValue(searchValue))
      dispatch(fetchCategories(searchValue))
    }

    return setSearchValue()
  }  
}

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

export const removeProduct = (prodId) => {
  return (dispatch) => {
    const remove = async () => {
      dispatch(_hideProduct(prodId))
      dispatch(deleteProduct(prodId)).then(removed => !removed && dispatch(_showProduct(prodId)))
    }

    return remove()
  }  
}

export const removeCategory = (catId) => {
  return (dispatch) => {
    const remove = async () => {
      dispatch(_hideCategory(catId))
      dispatch(deleteCategory(catId)).then(removed => !removed && dispatch(_showCategory(catId)))
    }

    return remove()
  }  
}