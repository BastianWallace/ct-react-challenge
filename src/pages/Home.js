import React from 'react'
import { useSelector } from 'react-redux'
import CategoryList from '../components/CategoryList'

const Home = () => {

  const { list: categories } = useSelector(state => state.categories)

  return (
    <div className="container-xxl flex-wrap flex-lg-nowrap">
      <CategoryList categories={categories} type="all" />
    </div>
  )
}

export default Home