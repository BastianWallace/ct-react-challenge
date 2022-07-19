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
  'categories/_saveNewOrder', async ({categoryId, prodId, direction, currentOrder}) => {
    return await DbCategories.saveNewOrder(categoryId, prodId, direction, currentOrder)
  }
)

const _deleteProduct = createAsyncThunk(
  'categories/_deleteProduct', async (prodId) => {
    return await DbCategories.deleteProduct(prodId)
  }
)

const _deleteCategory = createAsyncThunk(
  'categories/_deleteCategory', async (catId) => {
    return await DbCategories.deleteCategory(catId)
  }
)

const _saveFavorite = createAsyncThunk(
  'categories/_saveFavorite', async (prodId) => {
    return await DbFavorites.saveFavorite(prodId)
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

export const createCategory = (data) => async (dispatch) => {
  await dispatch(_newCategory(data))
  return await dispatch(fetchCategories())
}

export const createProduct = (data) => async (dispatch) => {
  console.log('Create Product')
  await dispatch(_newProduct(data))
  console.log('Fetch Categories')
  return await dispatch(fetchCategories())
}

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
      dispatch(_saveFavorite(prodId)).then(saved => !saved && dispatch(_setFavoriteOFF(prodId)))
    }

    return add()
  }  
}

export const removeFromFavorites = (prodId) => {
  return (dispatch) => {
    const remove = async () => {
      dispatch(_setFavoriteOFF(prodId))
      dispatch(_removeFavorite(prodId)).then(removed => !removed && dispatch(_setFavoriteON(prodId)))
    }

    return remove()
  }  
}

export const changeProdOrder = (categoryId, prodId, direction, currentOrder) => {
  return (dispatch) => {
    const rearrange = async () => {
      dispatch(_changeProdOrder({categoryId, prodId, direction, currentOrder}))
      dispatch(_saveNewOrder({categoryId, prodId, direction, currentOrder})).then(
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
      dispatch(_deleteProduct(prodId)).then(removed => !removed && dispatch(_showProduct(prodId)))
    }

    return remove()
  }  
}

export const removeCategory = (catId) => {
  return (dispatch) => {
    const remove = async () => {
      dispatch(_hideCategory(catId))
      dispatch(_deleteCategory(catId)).then(removed => !removed && dispatch(_showCategory(catId)))
    }

    return remove()
  }  
}