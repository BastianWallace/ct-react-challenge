import { configureStore } from '@reduxjs/toolkit'

// reducers
import user from './slices/user'
import content from './slices/content'
import categories from './slices/categories'
import favorites from './slices/favorites'

export default configureStore({
  reducer: {
    user,
    content,
    categories,
    favorites
  }
})