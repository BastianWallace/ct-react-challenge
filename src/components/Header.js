import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changeContent } from '../store/slices/content'

const Header = () => {
  const dispatch = useDispatch()
  const { content } = useSelector(state => state.content)
  const { favorites } = useSelector(state => state.categories)

  const handleChangeContent = (event, content) => {
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
              <span 
                className={`nav-link ${content === 'home' && 'active'}`}
                type="button" 
                onClick={event => handleChangeContent(event, 'home')}
                {...(content === 'home' && {'aria-current': "page"})} >
                  Home
              </span>
            </li>
            <li className="nav-item">
              <span 
                className={`nav-link ${content === 'favorites' && 'active'}`}
                type="button" 
                onClick={event => handleChangeContent(event, 'favorites')}
                {...(content === 'favorites' && {'aria-current': "page"})} >
                  Favorites
              </span>
            </li>
          </ul>
        </div>
        <div className="d-flex text-light">
          favorites: {favorites.length}
        </div>
      </div>
    </nav>
  )
}

export default Header