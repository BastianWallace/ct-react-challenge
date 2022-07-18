import React, { useState } from 'react'
import { addToFavorites, removeFromFavorites, changeProdOrder } from '../store/slices/categories'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const ProductCard = (props) => {
  const { 
    product: { 
      id, 
      name, 
      image, 
      favorite, 
      categoryId, 
      orderNumber 
    }, 
    minOrderNumber, 
    maxOrderNumber 
  } = props

  const { list: favorites } = useSelector(state => state.favorites)
  const [ imageLoaded, setImageLoaded ] = useState(false)
  const dispatch = useDispatch()

  const handleAddToFavorite = () => {
    dispatch(addToFavorites(id))
    toast.success('New favorite was added!')
  }

  const handleRemoveFromFavorite = () => {
    dispatch(removeFromFavorites(id))
    toast.success('the product was removed from favorites!')
  }

  const handleSortLeft = () => {
    dispatch(changeProdOrder(categoryId, id, 'left', orderNumber))
  }

  const handleSortRight = () => {
    dispatch(changeProdOrder(categoryId, id, 'right', orderNumber))
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
      
      <div className="d-flex">
        <div className="col-6 d-flex">
          {orderNumber > 1 && orderNumber > minOrderNumber && (
            <button type="button" className="btn btn-outline-secondary mx-2" onClick={handleSortLeft}>
              <i className="bi-arrow-left"></i>
            </button>
          )}

          {orderNumber < maxOrderNumber && (
            <button type="button" className="btn btn-outline-secondary mx-2" onClick={handleSortRight}>
              <i className="bi-arrow-right"></i>
            </button>
          )}

        </div>

        <div className="col-6 text-end">
          {!favorite && !favorites.includes(id) && (
            <button type="button" className="btn btn-outline-secondary" onClick={handleAddToFavorite}>
              <i className="bi-heart"></i>
            </button>
          ) || (
            <button type="button" className="btn btn-outline-secondary" onClick={handleRemoveFromFavorite}>
              <i className="bi-heart-fill"></i>
            </button>
          )}
        </div>
      </div>
      
    </div>
  )
}

export default ProductCard