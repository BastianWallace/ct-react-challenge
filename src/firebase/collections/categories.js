import { collection, getDocs, addDoc, query, where, orderBy, writeBatch } from '@firebase/firestore'
import { firebaseDB } from '../config'

class Categories {

  categoriesCollectionRef = collection(firebaseDB, 'categories')
  productsCollectionRef = collection(firebaseDB, 'products')
  favoritesCollectionRef = collection(firebaseDB, 'favorites')

  constructor() {}

  getCategories = async () => {
    const categoriesPromise = new Promise((resolve, reject) => {
      const q = query(this.categoriesCollectionRef, orderBy('name'))

      getDocs(q).then( result => {
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
      const q = query(this.productsCollectionRef, orderBy('orderNumber'))
      getDocs(q).then( result => {
        const productos = result.docs.map( doc => ({
          ...doc.data(),
          id: doc.id
        }))
        resolve(productos)
      }).catch( err => {
        console.log(err)
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
      })),
      minOrderNumber: Math.min(...products.filter(prod => prod.categoryId === category.id).map(item => item.orderNumber)),
      maxOrderNumber: Math.max(...products.filter(prod => prod.categoryId === category.id).map(item => item.orderNumber))
    }))

    return data
  }

  saveNewOrder = async (categoryId, prodId, direction, currentOrder) => {
    const q = query(this.productsCollectionRef, where("categoryId", "==", categoryId), orderBy('orderNumber'))
    const querySnapshot = await getDocs(q)

    try {
      // Get a new write batch
      const batch = writeBatch(firebaseDB)
      const newOrderNumber = direction === 'left' ? currentOrder - 1 : currentOrder + 1

      querySnapshot.forEach( doc => {
        // doc.data() is never undefined for query doc snapshots
        const prod = {...doc.data(), id: doc.id}
        if(prod.id === prodId) {
          batch.update(doc.ref, {"orderNumber": newOrderNumber});
        
        } else if(prod.orderNumber === newOrderNumber) {
          batch.update(doc.ref, {"orderNumber": currentOrder});
        }
      })

      // Commit the batch
      await batch.commit()

      // Transaction successfully committed!
      return true
    
    } catch (e) {
      // Transaction failed
      return false
    }
  }
}

export default new Categories()