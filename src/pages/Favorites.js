import React from 'react'
import { useSelector } from 'react-redux'
import ProductCard from '../components/ProductCard'

const Favorites = () => {
  const { favorites } = useSelector(state => state.categories)

  return (
    <div className="container-xxl flex-wrap flex-lg-nowrap">
      <h3 className="py-4">Favorite list</h3>

      {
        // THIS IS NEEDED WHEN USE PAGES INSTEAD OF CONTENTS
      // favorites.length === 0 && (
      //   <div className="d-flex justify-content-center pb-4">
      //     <div className="spinner-border text-secondary" role="status" style={{width: '3rem', height: '3rem'}}>
      //       <span className="visually-hidden">Loading...</span>
      //     </div>
      //   </div>
      // )
      }

      {favorites.length === 0 && (
        <div className="d-flex justify-content-center pb-4">You don't products in your favorites list</div>
      )}

      <div className="container">
        <div className="row justify-content-center">
          {favorites.map( (product, pIndex) => {
            return (
              <div key={`product-${pIndex}`} className="col-3">
                <ProductCard product={product} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Favorites
