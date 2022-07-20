import { collection, getDocs, addDoc, query, where, writeBatch, serverTimestamp } from '@firebase/firestore'
import { firebaseDB } from '../config'

class DbFavorites {

  categoriesCollectionRef = collection(firebaseDB, 'categories')
  productsCollectionRef = collection(firebaseDB, 'products')
  favoritesCollectionRef = collection(firebaseDB, 'favorites')

  constructor() {}

  getFavorites = async () => {
    const favoritesDocs = await getDocs(this.favoritesCollectionRef)
    try {
      return favoritesDocs.docs.map(doc => ({
        ...doc.data(),
        createdDate: doc.data().createdDate.toDate().toDateString()
      }))
    } catch (e) {
      console.log(e)
    }
  }

  saveFavorite = async (prodId, rejectWithValue) => {
    // await new Promise(resolve => {
    //   setTimeout(() => {
    //     resolve('resolved')
    //   }, 2000);
    // })

    try{
      const docId = await addDoc(this.favoritesCollectionRef, {
        productId: prodId,
        createdDate: serverTimestamp()
      })

      return docId ? prodId : rejectWithValue("UNKNOWN_ERROR")
    
    } catch (err) {
      return rejectWithValue("UNKNOWN_ERROR")
    }
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

export default new DbFavorites()