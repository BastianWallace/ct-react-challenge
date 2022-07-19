import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
//import { useAuth } from './firebase/config'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { getFavorites } from './store/slices/favorites'
import { fetchCategories } from './store/slices/categories'

// Pages
import Home from './pages/Home'
//import Login from './pages/Login'
import Favorites from './pages/Favorites'
import CreateItems from './pages/CreateItems'

// Components
import Header from './components/Header'

function App() {
  const dispatch = useDispatch()

  //useAuth() // this return the current User if you want to store it in a variable or constant
  //const user = useSelector(state => state.user)

  const { content } = useSelector(state => state.content)

  useEffect(() => {
    dispatch(getFavorites())
    dispatch(fetchCategories())
  }, [dispatch])

  console.log('App rendered!')

  return (
    <div className="App">
      {/*!user?.email && (
        <Login />
      )
      || && (*/
        <>
          <Header />
          {content === 'home' && (
            <Home />
          )}

          {content === 'favorites' && (
            <Favorites />
          )}

          {content === 'create' && (
            <CreateItems />
          )}

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

          {
            // IF USING PAGES INSTEAD OF CONTENTS
            // <Routes>
            //   <Route exact path="/" element={<Home />} />
            //   <Route exact path="/favorites" element={<Favorites />} />
            // </Routes>
          }
        </>
      //)
      }
      
    </div>
  )
}

export default App
