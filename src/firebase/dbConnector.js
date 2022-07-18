import Categories from './collections/categories'
import Favorites from './collections/favorites'
import favorites from './collections/favorites'

class dbConnector {

  constructor() {
    //
  }

  // Categories
  getCategories = async (searchValue) => {
    return await Categories.getCategories(searchValue)
  }

  // getDataBasedOnSearch = async (searchValue) => {
  //   return await Categories.getDataBasedOnSearch(searchValue)
  // }

  saveNewOrder = async (categoryId, prodId, direction, currentOrder) => {
    return await Categories.saveNewOrder(categoryId, prodId, direction, currentOrder)
  }
  //

  // Favorites
  getFavorites = async () => {
    return await Favorites.getFavorites()
  }

  saveFavorite = async (prodId) => {
    return await Favorites.saveFavorite(prodId)
  }

  deleteFavorite = async (prodId) => {
    return await Favorites.deleteFavorite(prodId)
  }
  //
}

export default new dbConnector()