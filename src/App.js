import { useEffect } from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { getFavorites } from './store/slices/favorites'
import { fetchCategories } from './store/slices/categories'

// Pages
import Home from './pages/Home'
import Favorites from './pages/Favorites'
import CreateItems from './pages/CreateItems'

// Components
import Header from './components/Header'

function App() {
  const dispatch = useDispatch()
  const { content } = useSelector(state => state.content)

  useEffect(() => {
    dispatch(getFavorites())
    dispatch(fetchCategories())
  }, [dispatch])

  return (
    <div className="App">
      <Header />
      {content === 'home' && (<Home />)}
      {content === 'favorites' && (<Favorites />)}
      {content === 'create' && (<CreateItems />)}

      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar
        newestOnTop
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover={false}
      />
    </div>
  )
}

export default App
