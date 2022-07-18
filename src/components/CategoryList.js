import React from 'react'
import {useSelector } from 'react-redux'
import ProductCard from './ProductCard'

const CategoryList = () => {
  const { list: categories } = useSelector(state => state.categories)

  return (
    <div id="categoryList">
      <h3 className="py-4">Categories</h3>

      {categories.length === 0 && (
        <div className="d-flex justify-content-center pb-4">
          <div className="spinner-border text-secondary" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      <div className="accordion">
        {categories.map( (category, cIndex) => {
          return (
            <div key={`category-${cIndex}`} className="accordion-item mb-3">
              <div className="accordion-header" id={`panelsStayOpen-heading-${cIndex}`}>
                <button className="accordion-button fs-l py-2" style={{backgroundColor:`#${category.color}`}} type="button" data-bs-toggle="collapse" data-bs-target={`#panelsStayOpen-collapse-${cIndex}`} aria-expanded="true" aria-controls={`panelsStayOpen-collapse-${cIndex}`}>
                  {category.name}
                </button>
              </div>
              <div id={`panelsStayOpen-collapse-${cIndex}`} className="accordion-collapse collapse show" aria-labelledby={`panelsStayOpen-heading-${cIndex}`}>
                <div className="accordion-body">
                  <div className="container">
                    <div className="row justify-content-center">
                      {
                      category.products.map( (product, pIndex) => {
                        return (
                          <div key={`product-${pIndex}`} className="col-3">
                            <ProductCard product={product} />
                          </div>
                        )
                      })
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default CategoryList