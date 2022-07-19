import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { removeCategory } from '../store/slices/categories'
import ProductCard from './ProductCard'

// SweetAlert2
import Swal from 'sweetalert2/dist/sweetalert2.min.js'

const CategoryItem = (props) => {
  const { type, category: {id, name, products, bgColor, textColor, minOrderNumber, maxOrderNumber} } = props
  const [ expanded, setExpanded ] = useState(true)
  const dispatch = useDispatch()

  const handleDelete = () => {
    Swal.fire({
      title: 'Do you really want to delete the category?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(removeCategory(id))
      }
    })
  }

  return (
    <div className="accordion-item mb-3">
      <div className="accordion-header" id={`panelsStayOpen-heading-${id}`}>
        <div className="d-flex px-3 py-2 justify-content-between align-items-center" style={{backgroundColor:`${bgColor}`}}>
          <div className="fs-5" style={{color:`${textColor}`}}>{name}</div>
          <div>
            <button type="button" className="btn-unstyled fs-5 mx-2" style={{color:`${textColor}`}} onClick={handleDelete}>
              <i className="bi-trash3"></i>
            </button>
            <button 
              type="button" 
              className="btn-unstyled fs-5 px-2" 
              data-bs-toggle="collapse" 
              data-bs-target={`#panelsStayOpen-collapse-${id}`} 
              aria-expanded="true" 
              aria-controls={`panelsStayOpen-collapse-${id}`}
              style={{color:`${textColor}`}}
              onClick={() => {setExpanded(!expanded)}}>
                {expanded && (
                  <i className="bi-caret-up-fill"></i>
                ) || (
                  <i className="bi-caret-down-fill"></i>
                )}
            </button>
          </div>
        </div>
        
      </div>
      <div id={`panelsStayOpen-collapse-${id}`} 
        className="accordion-collapse collapse show" 
        aria-labelledby={`panelsStayOpen-heading-${id}`}>

        <div className="accordion-body">
          <div className="container">
            <div className="row justify-content-center">
              {products.map( (product, pIndex) => {
                return !product.hide && (
                  <div key={`product-${pIndex}`} className="col-3">
                    <ProductCard 
                      product={product} 
                      minOrderNumber={minOrderNumber} 
                      maxOrderNumber={maxOrderNumber} 
                      type={type}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryItem
