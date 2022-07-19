import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changeContent } from '../store/slices/content'

const Header = () => {
  const dispatch = useDispatch()
  const { content } = useSelector(state => state.content)
  const { favorites } = useSelector(state => state.categories)

  const handleChangeContent = (event, content) => {
    event.preventDefault()
    dispatch(changeContent(content))
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-xxl flex-wrap flex-lg-nowrap">
        <span className="navbar-brand">Shopping Demo App</span>
        <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#headerNav" 
            aria-controls="headerNav" 
            aria-expanded="false" 
            aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="headerNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              {content === 'home' && (
                <a type="button" className="nav-link active" aria-current="page" href="#">Home</a>
              ) || (
                <a type="button" className="nav-link" onClick={event => handleChangeContent(event, 'home')} href="#">Home</a>
              )}
              
            </li>
            <li className="nav-item">
              {content === 'favorites' && (
                <a type="button" className="nav-link active" aria-current="page" href="#">Favorites</a>
              ) || (
                <a type="button" className="nav-link" onClick={event => handleChangeContent(event, 'favorites')} href="#">Favorites</a>
              )}
            </li>
          </ul>
        </div>
        <div className="d-flex text-light">
          {favorites.length} in favorites
        </div>
      </div>
    </nav>
  )
}

export default Header

/*<a type="button" className="btn" onClick={event => handleChangeContent(event, 'home')}>Home</a>*/