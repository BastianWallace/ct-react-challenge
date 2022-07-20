import { collection, doc, addDoc, getDocs, query, where, orderBy, limit, writeBatch, deleteDoc } from '@firebase/firestore'
import { ref, uploadBytes, deleteObject } from 'firebase/storage'
import { firebaseDB } from '../config'
import { storage } from '../config'
import { v4 } from 'uuid'

class DbCategories {

  categoriesCollectionRef = collection(firebaseDB, 'categories')
  productsCollectionRef = collection(firebaseDB, 'products')
  favoritesCollectionRef = collection(firebaseDB, 'favorites')

  constructor() {}

  newCategory = async (data, rejectWithValue) => {
    const { name, bgColor, textColor } = data
    const q = query(this.categoriesCollectionRef, where("name", "==", name))
    const querySnapshot = await getDocs(q)

    if(querySnapshot.size === 0) {
      const docRef = await addDoc(collection(firebaseDB, "categories"), {
        name: name,
        bgColor: bgColor,
        textColor: textColor
      })

      if(!docRef.id) {
        return rejectWithValue("UNKNOWN_ERROR")
      }

      return docRef.id

    } else {
      return rejectWithValue("REPEATED_NAME")
    }
  }

  newProduct = async (data, rejectWithValue) => {
    const { name, categoryId, image } = data

    const q = query(this.productsCollectionRef, where("name", "==", name))
    const querySnapshot = await getDocs(q)

    if(querySnapshot.size === 0) {
      const imageRef = ref(storage, `products/product-${v4()}`)

      try{
        const q2 = query(this.productsCollectionRef, where("categoryId", "==", categoryId), orderBy('orderNumber', 'desc'), limit(1))
        const querySnapshot2 = await getDocs(q2)

        let orderNumber = 1

        if(querySnapshot2.docs.length === 1) {
          orderNumber = querySnapshot2.docs[0].data().orderNumber + 1
        }

        await uploadBytes(imageRef, image).then( async (res) => {
          const imagePath = res.ref.fullPath.split('/')[1]

          const docRef = await addDoc(collection(firebaseDB, "products"), {
            name: name,
            categoryId: categoryId,
            image: imagePath,
            orderNumber: orderNumber
          })

          if(!docRef.id) {
            return rejectWithValue("UNKNOWN_ERROR")
          }

          return docRef.id

        }).catch( err => {
          return rejectWithValue("UPLOAD_ERROR")
        })
      
      } catch (e) {
        return rejectWithValue("CREATE_ERROR")
      }

    } else {
      return rejectWithValue("REPEATED_NAME")
    }
  }

  getCategories = async (searchValue = null) => {
    const searchValueLower = searchValue ? searchValue.toLowerCase() : null
    const categoriesPromise = new Promise((resolve, reject) => {
      let q = query(this.categoriesCollectionRef, orderBy('name'))

      getDocs(q).then( result => {
        const categories = result.docs.map( document => ({
          ...document.data(),
          id: document.id
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
        const productos = result.docs.map( document => ({
          ...document.data(),
          id: document.id
        }))

        resolve(productos)
      
      }).catch( err => {
        //console.log(err)
        reject(err)
      })
    })

    const favoritesPromise = new Promise((resolve, reject) => {
      getDocs(this.favoritesCollectionRef).then( result => {
        const favorites = result.docs.map( document => document.data().productId)
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

  saveNewOrder = async (data) => {
    const {categoryId, prodId, direction, currentOrder} = data
    const q = query(this.productsCollectionRef, where("categoryId", "==", categoryId), orderBy('orderNumber'))
    const querySnapshot = await getDocs(q)

    try {
      // Get a new write batch
      const batch = writeBatch(firebaseDB)
      const newOrderNumber = direction === 'left' ? currentOrder - 1 : currentOrder + 1

      querySnapshot.forEach( document => {
        const prod = {...document.data(), id:  document.id}
        
        if(prod.id === prodId) {
          batch.update(document.ref, {"orderNumber": newOrderNumber});
        
        } else if(prod.orderNumber === newOrderNumber) {
          batch.update(document.ref, {"orderNumber": currentOrder});
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

  deleteProduct = async (prodId, rejectWithValue) => {
    try {
      const batch = writeBatch(firebaseDB)
      const queryProduct = query(this.productsCollectionRef, where("__name__", "==", prodId), limit(1))
      const queryProductSnapshot = await getDocs(queryProduct)

      if(queryProductSnapshot.size === 1) {
        const queryFavorites = query(this.favoritesCollectionRef, where("productId", "==", prodId))
        const queryFavoritesSnapshot = await getDocs(queryFavorites)
        
        const document = queryProductSnapshot.docs[0]
        const imageName = document.data().image
        const imageRef = ref(storage, `products/${imageName}`)

        await deleteObject(imageRef).then(() => {

          for ( const favDocument of queryFavoritesSnapshot.docs ) {
            // Add the favorite into the batch to be deleted
            batch.delete(favDocument.ref)
          }

          batch.delete(document.ref)

        }).catch((err) => {
          return rejectWithValue('CANT_DELETE_IMAGE')
        })

        try {
          await batch.commit()
          return true
        
        } catch (err) {
          return rejectWithValue('CANT_DELETE_PRODUCT')
        }
      }
    
    } catch (err) {
      // Transaction failed
      return rejectWithValue('CANT_DELETE_PRODUCT')
    }
  }

  deleteCategory = async (catId, rejectWithValue) => {
    try {
      // Get a new write batch
      const batch = writeBatch(firebaseDB)

      // Get the category by id
      const queryCategory = query(this.categoriesCollectionRef, where("__name__", "==", catId))
      const queryCategorySnapshot = await getDocs(queryCategory)

      // Get all products where categoryId is the one to be deleted
      const queryProducts = query(this.productsCollectionRef, where("categoryId", "==", catId))
      const queryProductsSnapshot = await getDocs(queryProducts)

      const productIdList = []

      for ( const document of queryProductsSnapshot.docs ) {
        productIdList.push(document.id)
        const imageName = document.data().image
        const imageRef = ref(storage, `products/${imageName}`)

        // wait for image delete process to continue with product document
        await deleteObject(imageRef).then(() => {
          // File deleted successfully, proceed to add the product into the batch to be deleted
          batch.delete(document.ref)

        }).catch((error) => {
          return rejectWithValue('CANT_DELETE_IMAGE')
        })
      }

      // Get all favorites where productId is in the list productIdList
      const queryFavorites = query(this.favoritesCollectionRef, where('productId', 'in', productIdList))
      const queryFavoritesSnapshot = await getDocs(queryFavorites)

      for ( const document of queryFavoritesSnapshot.docs ) {
        // Add the favorite into the batch to be deleted
        batch.delete(document.ref)
      }

      // add the category into the batch to be deleted
      for ( const document of queryCategorySnapshot.docs ) {
        batch.delete(document.ref)
      }

      // Commit the batch
      try {
        await batch.commit()
        return true
      
      } catch (err) {
        return rejectWithValue('CANT_DELETE_DATA')
      }
    
    } catch (e) {
      // Transaction failed
      return rejectWithValue('CANT_DELETE_DATA')
    }
  }
}

export default new DbCategories()