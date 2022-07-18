import React, {useRef} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { searchByValue } from '../store/slices/categories'
import ProductCard from './ProductCard'

const CategoryList = () => {
  const dispatch = useDispatch()
  const searchInputRef = useRef();
  const { list: categories, searchValue, loadingCategories } = useSelector(state => state.categories)

  const handleSearch = (event) => {
    event.preventDefault()
    dispatch(searchByValue(searchInputRef.current.value))
  }

  return (
    <div id="categoryList">

      <nav className="navbar">
        <div className="container-fluid justify-content-between mt-5">
          <h3>Categories</h3>
          <form className="d-flex col-4" role="search">
            <input 
              type="text" 
              className="form-control me-2" 
              id="searchInput" 
              placeholder="search by product or category"
              ref={searchInputRef} 
              defaultValue={searchValue}
            />
            <button className="btn btn-primary" type="submit" onClick={handleSearch}>Search</button>
          </form>
        </div>
      </nav>

      {loadingCategories && (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-secondary" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {!loadingCategories && categories.length == 0 && (
        <div className="d-flex justify-content-center pb-4">
          No results
        </div>
      )}

      {!loadingCategories && categories.length > 0 && (
        <div className="accordion">
          {categories.map( (category, cIndex) => {
            return (
              <div key={`category-${cIndex}`} className="accordion-item mb-3">
                <div className="accordion-header" id={`panelsStayOpen-heading-${cIndex}`}>
                  <button type="button" 
                          className="accordion-button fs-l py-2" 
                          style={{backgroundColor:`#${category.color}`}} 
                          data-bs-toggle="collapse" 
                          data-bs-target={`#panelsStayOpen-collapse-${cIndex}`} 
                          aria-expanded="true" 
                          aria-controls={`panelsStayOpen-collapse-${cIndex}`}>
                    {category.name}
                  </button>
                </div>
                <div id={`panelsStayOpen-collapse-${cIndex}`} 
                      className="accordion-collapse collapse show" 
                      aria-labelledby={`panelsStayOpen-heading-${cIndex}`}>

                  <div className="accordion-body">
                    <div className="container">
                      <div className="row justify-content-center">
                        {category.products.map( (product, pIndex) => {
                          return (
                            <div key={`product-${pIndex}`} className="col-3">
                              <ProductCard 
                                product={product} 
                                minOrderNumber={category.minOrderNumber} 
                                maxOrderNumber={category.maxOrderNumber} 
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
          })}
        </div>
      )}
    </div>
  )
}

export default CategoryList

/*
.sort((a, b) => {
                          return a.orderNumber - b.orderNumber
                        })
*/