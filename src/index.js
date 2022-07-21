import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter } from 'react-router-dom'

// Redux
import { Provider } from 'react-redux'
import store from './store'

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.min.js'

// SweetAlert2
import 'sweetalert2/dist/sweetalert2.min.css'

// ReactToastify
import 'react-toastify/dist/ReactToastify.min.css'

// Custom Styles
import './assets/styles/styles.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<Provider store={store}><BrowserRouter><App /></BrowserRouter></Provider>)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
