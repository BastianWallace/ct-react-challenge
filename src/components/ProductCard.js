import React, { useState } from 'react'
import { addToFavorites, removeFromFavorites } from '../store/slices/categories'
import { useDispatch, useSelector } from 'react-redux'

const ProductCard = (props) => {
  const { product: { id, name, image, favorite } } = props
  const { list: favorites } = useSelector(state => state.favorites)
  const [ imageLoaded, setImageLoaded ] = useState(false)
  const dispatch = useDispatch()

  const handleAddToFavorite = () => {
    dispatch(addToFavorites(id))
  }

  const handleRemoveFromFavorite = () => {
    dispatch(removeFromFavorites(id))
  }

  return (
    <div className="card p-4" style={{width: '100%'}}>
      <div style={{width: '240px', height: '240px', maxWidth: '100%'}}>
        {!imageLoaded && (
          <div className="placeholder-glow" style={{width: '100%', height: '100%'}}>
            <div className="placeholder" style={{width: '100%', height: '100%'}}></div>
          </div>
        )}
        <img 
          src={`https://firebasestorage.googleapis.com/v0/b/ct-challenge-d7d8e.appspot.com/o/products%2F${image}?alt=media`} 
          className="card-img-top product-image"
          alt={`${name} image`}
          style={{maxWidth: '100%', maxHeight: '100%'}}
          onLoad={() => setImageLoaded(true)}
        />
      </div>
      <h4 className="text-center pt-4">{name}</h4>
      <div>
        {!favorite && !favorites.includes(id) && (
          <span type="button" onClick={handleAddToFavorite}><i className="bi-heart"></i></span>
        ) || (
          <span type="button" onClick={handleRemoveFromFavorite}><i className="bi-heart-fill"></i></span>
        )}
      </div>
    </div>
  )
}

export default ProductCard