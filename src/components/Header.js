import React from 'react'
import { useSelector } from 'react-redux'
import NavLinkItem from './NavLinkItem'

const Header = () => {
  const { favorites } = useSelector(state => state.categories)

  const navItems = [
    {title: 'Home', content: 'home'},
    {title: 'Favorites', content: 'favorites'},
    {title: 'Create Items', content: 'create'}
  ]

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
            {navItems.map((item, index) => {
              return (
                <NavLinkItem key={`navLink-${index}`} item={item} />
              )
            })}
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