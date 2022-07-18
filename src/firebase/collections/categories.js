import { collection, getDocs, query, where, orderBy, writeBatch } from '@firebase/firestore'
import { firebaseDB } from '../config'

class Categories {

  categoriesCollectionRef = collection(firebaseDB, 'categories')
  productsCollectionRef = collection(firebaseDB, 'products')
  favoritesCollectionRef = collection(firebaseDB, 'favorites')

  constructor() {}

  getCategories = async (searchValue = null) => {
    const searchValueLower = searchValue ? searchValue.toLowerCase() : null
    const categoriesPromise = new Promise((resolve, reject) => {
      let q = query(this.categoriesCollectionRef, orderBy('name'))

      getDocs(q).then( result => {
        const categories = result.docs.map( doc => ({
          ...doc.data(),
          id: doc.id
        }))

        resolve(categories)
     
      }).catch( err => {
        //console.log(err)
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
        //console.log(err)
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

    let result = JSON.parse(JSON.stringify(data))

    // filter products based on search
    if(searchValueLower) {
      
      // filter categories by name with searchValueLower
      const filteredCategories = data.filter( category => category.name.toLowerCase().includes(searchValueLower) )

      // // loop over all categories that has products matching searchValueLower excluding categories from filteredCategories
      const catsFilteredByProd = JSON.parse(JSON.stringify(data)).filter(category => {
        if( !filteredCategories.some(cat => cat.id === category.id) ) {
          const prods = category.products.filter(product => {
            return product.name.toLowerCase().includes(searchValueLower)
          })

          if(prods.length > 0 && category.id) {
            category.products = prods
            return category
          }
        }
      })

      result = [...filteredCategories, ...catsFilteredByProd]
    }

    return result
  }

  getDataBasedOnSearch = async (searchValue) => {
    return this.getCategories(searchValue)
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