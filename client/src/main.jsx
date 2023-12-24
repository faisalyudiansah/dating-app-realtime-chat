import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import store from './store/index.js'
import { Provider } from 'react-redux'

import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom"
import Swal from 'sweetalert2'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import HomePage from './pages/HomePage.jsx'
import Layout from './Layout.jsx'
import UserProfilePage from './pages/UserProfilePage.jsx'
import EditUserProfile from './pages/EditUserProfile.jsx'
import Matches from './pages/Matches.jsx'

let authHome = () => {
  let access_token = localStorage.access_token
  if (!access_token) {
    throw redirect('/login')
  }
  return null
}

let authLogin = () => {
  let access_token = localStorage.access_token
  if (access_token) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "You are already logged in.",
    })
    throw redirect('/')
  }
  return null
}

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
    loader: authLogin
  },
  {
    path: "/register",
    element: <Register />,
    loader: authLogin
  },
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <HomePage />,
        loader: authHome,
      },
      {
        path: "/user-profile",
        element: <UserProfilePage />,
        loader: authHome,
      },
      {
        path: "/edit-profile",
        element: <EditUserProfile />,
        loader: authHome,
      },
      {
        path: "/matches",
        element: <Matches />,
        loader: authHome,
      },
    ],
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)
