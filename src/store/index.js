import { configureStore } from '@reduxjs/toolkit'

// reducers
import content from './slices/content'
import categories from './slices/categories'
import favorites from './slices/favorites'

export default configureStore({
  reducer: {
    content,
    categories,
    favorites
  }
})