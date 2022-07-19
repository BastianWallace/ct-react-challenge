import Categories from './collections/categories'
import Favorites from './collections/favorites'
import favorites from './collections/favorites'

class dbConnector {

  constructor() {
    //
  }

  // Categories & Products
  getCategories = async (searchValue) => {
    return await Categories.getCategories(searchValue)
  }

  saveNewOrder = async (categoryId, prodId, direction, currentOrder) => {
    return await Categories.saveNewOrder(categoryId, prodId, direction, currentOrder)
  }

  deleteProduct = async (prodId) => {
    return await Categories.deleteProduct(prodId)
  }

  deleteCategory = async (catId) => {
    return await Categories.deleteCategory(catId)
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