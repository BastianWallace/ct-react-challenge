import { collection, getDocs, addDoc, query, where, writeBatch } from '@firebase/firestore'
import { firebaseDB } from '../config'

class Categories {

  categoriesCollectionRef = collection(firebaseDB, 'categories')
  productsCollectionRef = collection(firebaseDB, 'products')
  favoritesCollectionRef = collection(firebaseDB, 'favorites')

  constructor() {}

  getCategories = async () => {
    const categoriesPromise = new Promise((resolve, reject) => {
      getDocs(this.categoriesCollectionRef).then( result => {
        const categories = result.docs.map( doc => ({
          ...doc.data(),
          id: doc.id
        }))

        resolve(categories)
      }).catch( err => {
        reject(err)
      })
    })

    const productosPromise = new Promise((resolve, reject) => {
      getDocs(this.productsCollectionRef).then( result => {
        const productos = result.docs.map( doc => ({
          ...doc.data(),
          id: doc.id
        }))
        resolve(productos)
      }).catch( err => {
        reject(err)
      })
    })

    const favoritesPromise = new Promise((resolve, reject) => {
      getDocs(this.favoritesCollectionRef).then( result => {
        const favorites = result.docs.map( doc => doc.data().productId)
        resolve(favorites)
      }).catch( err => {
        reject(err)
      })
    })

    const [categories, products, favorites] = await Promise.all([categoriesPromise, productosPromise, favoritesPromise])

    const data = categories.map(category => ({
      ...category,
      products: products.filter(prod => prod.categoryId === category.id).map(product => ({
        ...product,
        favorite: favorites.some(fav => fav === product.id)
      }))
    }))

    return data
  }
}

export default new Categories()