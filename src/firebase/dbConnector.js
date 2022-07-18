import Categories from './collections/categories'
import Favorites from './collections/favorites'
import favorites from './collections/favorites'

class dbConnector {

  constructor() {
    //
  }

  getCategories = async () => {
    return await Categories.getCategories()
  }

  getFavorites = async () => {
    return await Favorites.getFavorites()
  }

  saveFavorite = async (prodId) => {
    return await Favorites.saveFavorite(prodId)
  }

  deleteFavorite = async (prodId) => {
    return await Favorites.deleteFavorite(prodId)
  }
}

export default new dbConnector()