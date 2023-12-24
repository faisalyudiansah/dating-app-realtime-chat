import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import imageForm from '../assets/login.png'
import { login } from "../store/appSlice"  // panggil function nya
import { useDispatch } from 'react-redux'
import axios from 'axios';
import Swal from 'sweetalert2';

const Login = () => {
  let currentTheme = localStorage.getItem('theme')
  let [input, setInput] = useState()
  let navigate = useNavigate()
  let dispatch = useDispatch()

  let changeInput = (e) => {
    let { name, value } = e.target
    setInput({
      ...input,
      [name]: value
    })
  }

  async function submitLogin(e) {
    e.preventDefault()
    await dispatch(login(input))
    navigate('/user-profile')
  }

  useEffect(() => {
    if (currentTheme) {
      document.documentElement.setAttribute('data-theme', currentTheme)
    }
  }, [currentTheme])

  async function handleCredentialResponse({ credential }) {
    try {
      let { data } = await axios({
        method: 'post',
        url: import.meta.env.VITE_BASE_URL + `/google-login`,
        headers: {
          ['google-token']: credential
        }
      });
      console.log(data)
      localStorage.setItem("access_token", data.access_token)
      navigate("/")
    } catch (error) {
      console.log(error)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `${error.response.data.message}`,
      })
    }
  }

  useEffect(() => {
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(
      document.getElementById("google-login"),
      { theme: "outline", size: "medium" }  // customization attributes
    );
    google.accounts.id.prompt()
  }, [])

  return (
    <>
      <div className="flex items-center justify-center min-h-screen ">
        <form onSubmit={submitLogin}>
          <div className="relative flex flex-col m-6 space-y-8 bg-base-200 shadow-2xl rounded-2xl md:flex-row md:space-y-0">
            <div className="flex flex-col justify-center p-8 md:p-14">
              <span className="mb-3 text-4xl font-bold">Login</span>
              <span className="font-light text-bg-body-secondary">
                Welcome back to Datinger!
              </span>
              <div className="py-4">
                <span htmlFor='email' className="mb-2 text-md">Email</span>
                <input
                  type="text"
                  className="w-full p-2 rounded-md border"
                  name="email"
                  id="email"
                  onChange={changeInput}
                />
              </div>
              <div className="py-4">
                <span htmlFor='password' className="mb-2 text-md">Password</span>
                <input
                  type="password"
                  name="password"
                  id="password"
                  onChange={changeInput}
                  className="w-full p-2 rounded-md border"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-base-300 mt-4 text-bg-body-secondary p-2 rounded-lg mb-6 hover:bg-base-200"
              >
                Login
              </button>

              <div className="text-center text-bg-body-secondary ">
                Don't have an account?
                <a href='/register' className="font-bold mx-2 text-bg-body-secondary hover:text-base-300">Sign up</a>
              </div>
              <div className="text-center justify-content-center  text-bg-body-secondary ">
                <p>OR</p>
                <div id="google-login"></div>
              </div>
            </div>

            <div className="relative bg-base-300 rounded-md">
              <img
                src={imageForm}
                alt="img"
                className="w-[420px] h-full hidden rounded-r-2xl md:block object-cover"
              />
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default Login