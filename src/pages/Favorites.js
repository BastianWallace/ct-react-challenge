import React from 'react'
import { useSelector } from 'react-redux'
import CategoryList from '../components/CategoryList'

const Favorites = () => {
  const { list: categories } = useSelector(state => state.categories)
  const { list: favorites } = useSelector(state => state.favorites)

  let data = []

  if(categories.length > 0) {
    data = JSON.parse(JSON.stringify(categories)).filter(category => {
      const prods = category.products.filter(product => {
        const favoriteItem = favorites.find(favorite => favorite.productId === product.id)
        product.addedToFavoritesOn = favoriteItem ? favoriteItem.createdDate : null
        return product.favorite
      })

      if(prods.length > 0) {
        category.products = prods
        return true
      }
    })
  }

  return (
    <div className="container-xxl flex-wrap flex-lg-nowrap">
      {data.length === 0 && (
        <div className="d-flex justify-content-center py-5">You don't products in your favorites list</div>
      ) || (
        <CategoryList categories={data} type="favorites" />
      )}

    </div>
  )
}

export default Favorites
