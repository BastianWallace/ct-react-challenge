import React, {useRef} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { searchByValue } from '../store/slices/categories'

import CategoryItem from './CategoryItem'

const CategoryList = (props) => {
  const { categories, type } = props
  const displaySearch = type === 'all'
  const title = type === 'favorites' ? 'Favorites' : 'Categories'
  const dispatch = useDispatch()
  const searchInputRef = useRef()
  const { searchValue, loadingCategories } = useSelector(state => state.categories)

  const handleSearch = (event) => {
    event.preventDefault()
    dispatch(searchByValue(searchInputRef.current.value))
  }

  return (
    <div id="categoryList">
      <nav className="navbar bg-light mt-5 mb-2">
        <div className="container-fluid justify-content-between align-items-center px-3">
          <h3 className="my-0 py-0 page-title">{title ? title : 'Categories'}</h3>
          {displaySearch && (
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
          )}
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
            return !category.hide && (
              <CategoryItem key={`category-${cIndex}`} category={category} type={type} />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default CategoryList