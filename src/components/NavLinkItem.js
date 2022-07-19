import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { changeContent } from '../store/slices/content'

const NavLinkItem = (props) => {
  const { item } = props
  const dispatch = useDispatch()
  const { content } = useSelector(state => state.content)

  const handleChangeContent = (event, content) => {
    event.preventDefault()
    dispatch(changeContent(content))
  }

  return (
    <li className="nav-item">
      {content === item.content && (
        <a type="button" className="nav-link active" aria-current="page">{item.title}</a>
      ) || (
        <a type="button" className="nav-link" onClick={event => handleChangeContent(event, item.content)} href="#">{item.title}</a>
      )}
    </li>
  )
}

export default NavLinkItem
