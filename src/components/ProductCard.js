import React, { useState } from 'react'
import { addToFavorites, removeFromFavorites, changeProdOrder, removeProduct } from '../store/slices/categories'
import { useDispatch, useSelector } from 'react-redux'
import TextTruncate from 'react-text-truncate'
import { toast } from 'react-toastify'
//import 'react-toastify/dist/ReactToastify.min.css'
import Swal from 'sweetalert2/dist/sweetalert2.min.js'

const ProductCard = (props) => {
  const { 
    product: { 
      id, 
      name, 
      image, 
      favorite, 
      categoryId, 
      orderNumber,
      addedToFavoritesOn
    }, 
    minOrderNumber, 
    maxOrderNumber,
    type
  } = props

  const { list: favorites } = useSelector(state => state.favorites)
  const [ imageLoaded, setImageLoaded ] = useState(false)
  const [ loadingAddToFavorites, setLoadingAddToFavorites ] = useState(false)
  const [ loadingMoveLeft, setLoadingMoveLeft ] = useState(false)
  const [ loadingMoveRight, setLoadingMoveRight ] = useState(false)
  const [ loadingDelete, setLoadingDelete ] = useState(false)

  const dispatch = useDispatch()

  const handleAddToFavorite = async () => {
    setLoadingAddToFavorites(true)
    
    dispatch(addToFavorites(id)).then( res => {
      if(res?.meta?.requestStatus === 'fulfilled') {
        toast.success('New favorite was added!')
      } else {
        toast.error(`Could not add it to favorites!`)
      }

      setLoadingAddToFavorites(false)
    })
  }

  const handleRemoveFromFavorite = () => {
    setLoadingAddToFavorites(true)

    dispatch(removeFromFavorites(id)).then( res => {
      if(res?.meta?.requestStatus === 'fulfilled') {
        toast.success('the product was removed from favorites!')
      } else {
        toast.error(`Could not remove it from favorites!`)
      }

      setLoadingAddToFavorites(false)
    })
  }

  const handleSortLeft = () => {
    setLoadingMoveLeft(true)
    const data = {categoryId, prodId:id, direction: 'left', currentOrder:orderNumber}
    dispatch(changeProdOrder(data)).then( res => {
      setLoadingMoveLeft(false)
    })
  }

  const handleSortRight = () => {
    setLoadingMoveRight(true)
    const data = {categoryId, prodId:id, direction: 'right', currentOrder:orderNumber}
    dispatch(changeProdOrder(data)).then( res => {
      setLoadingMoveRight(false)
    })
  }

  const handleDelete = () => {
    setLoadingDelete(true)
    Swal.fire({
      title: 'Do you really want to delete the product?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(removeProduct(id)).then( result => {
          if(result?.meta?.requestStatus !== 'fulfilled') {
            toast.error('the product could not be removed!')
          }
          setLoadingDelete(false)
        })
      } else {
        setLoadingDelete(false)
      }
    })
  }

  return (
    <div className="card p-4" style={{width: '100%'}}>
      <div className="position-relative" style={{width: '240px', height: '240px', maxWidth: '100%'}}>
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

      <div className="card-fav-button">
        {loadingAddToFavorites && (
          <div className="d-flex justify-content-center mt-1">
            <div className="spinner-border text-secondary" role="status" style={{width: '1.5rem', height: '1.5rem'}}>
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) || (
          !favorite && !favorites.includes(id) && (
            <button type="button" className="btn-unstyled fs-4" onClick={handleAddToFavorite} title="Add to Favorites">
              <i className="bi-heart-fill text-white prod-fav-icon-bg"></i>
              <i className="bi-heart prod-fav-icon-body"></i>
            </button>
          ) || (
            <button type="button" className="btn-unstyled fs-4" onClick={handleRemoveFromFavorite} title="Remove from Favorites">
              <i className="bi-heart-fill text-primary"></i>
            </button>
          )
        )}
      </div>
      
      <h5 className="text-center mt-4 mb-3 product-card-name">
        <TextTruncate
          line={3}
          element="div"
          truncateText="…"
          text={name}
        />
      </h5>

      {type === 'favorites' && addedToFavoritesOn && (
        <div className="text-center text-secondary mb-3 fs-xs">Added on {addedToFavoritesOn}</div>
      )}
      
      <div className="d-flex">
        <div className="col-6 d-flex">
          {type !== 'favorites' && orderNumber > 1 && orderNumber > minOrderNumber && (
            loadingMoveLeft && (
              <div className="d-flex justify-content-center mx-2" style={{width: '42px'}}>
                <div className="spinner-border text-secondary" role="status" style={{width: '2.35rem', height: '2.35rem'}}>
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) || (
              <button type="button" className="btn btn-outline-secondary mx-2" onClick={handleSortLeft}>
                <i className="bi-arrow-left"></i>
              </button>
            )
          )}
            
          {type !== 'favorites' && orderNumber < maxOrderNumber && (
            loadingMoveRight && (
              <div className="d-flex justify-content-center mx-2" style={{width: '42px'}}>
                <div className="spinner-border text-secondary" role="status" style={{width: '2.35rem', height: '2.35rem'}}>
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) || (
              <button type="button" className="btn btn-outline-secondary mx-2" onClick={handleSortRight}>
                <i className="bi-arrow-right"></i>
              </button>
            )
          )}

        </div>

        <div className="col-6 d-flex justify-content-end">
          {loadingDelete && (
            <div className="d-flex justify-content-center mx-2" style={{width: '42px'}}>
              <div className="spinner-border text-secondary" role="status" style={{width: '2.35rem', height: '2.35rem'}}>
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) || (
            <button type="button" className="btn btn-outline-secondary mx-2" onClick={handleDelete}>
              <i className="bi-trash3"></i>
            </button>
          )}
        </div>
      </div>
      
    </div>
  )
}

export default ProductCard