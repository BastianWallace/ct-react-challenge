import { collection, getDocs, addDoc, query, where, writeBatch } from '@firebase/firestore'
import { firebaseDB } from '../config'

class Favorites {

  categoriesCollectionRef = collection(firebaseDB, 'categories')
  productsCollectionRef = collection(firebaseDB, 'products')
  favoritesCollectionRef = collection(firebaseDB, 'favorites')

  constructor() {}

  getFavorites = async () => {
    const favoritesDocs = await getDocs(this.favoritesCollectionRef)
    return favoritesDocs.docs.map(doc => ({...doc.data()}))
  }

  saveFavorite = async (prodId) => {
    const docId = await addDoc(this.favoritesCollectionRef, {
      productId: prodId
    })

    return docId ? prodId : null
  }

  deleteFavorite = async (prodId) => {
    try {
      // Get a new write batch
      const batch = writeBatch(firebaseDB)

      const q = query(this.favoritesCollectionRef, where("productId", "==", prodId))
      const querySnapshot = await getDocs(q)

      querySnapshot.forEach( doc => {
        // doc.data() is never undefined for query doc snapshots
        batch.delete(doc.ref)
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

export default new Favorites()