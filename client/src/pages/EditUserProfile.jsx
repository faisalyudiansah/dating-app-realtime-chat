import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { saveSubmitUpdated } from "../store/appSlice" 
import socket from "../socket"

const EditUserProfile = () => {
  let navigate = useNavigate()
  let dispatch = useDispatch()
  let { isError, errorMessage, loading } = useSelector((state) => state.appReducer)

  let [waiting, setWaiting] = useState(true)
  let [input, setInput] = useState({
    username: '',
    email: '',
    gender: '',
    interest: '',
    show: '',
    fullname: '',
    birthdate: '',
    profilePicture: '',
    address: '',
    occupation: '',
    bio: ''
  })

  function formatterDate(value) {
    let date = new Date(value);
    let year = date.getFullYear();
    let month = `${date.getMonth() + 1}`.padStart(2, '0');
    let day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async function fetching() {
    try {
      let link = import.meta.env.VITE_BASE_URL + `/users/profile`
      let { data } = await axios({
        method: 'get',
        url: link,
        headers: {
          Authorization: 'Bearer ' + localStorage.access_token
        }
      })
      setInput({
        username: data.username,
        email: data.email,
        gender: data.gender,
        interest: data.interest,
        show: data.show,
        fullname: data.UserProfile.fullname,
        birthdate: formatterDate(data.UserProfile.birthdate),
        profilePicture: data.UserProfile.profilePicture,
        address: data.UserProfile.address,
        occupation: data.UserProfile.occupation,
        bio: data.UserProfile.bio
      })
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.response.data.message}`,
      })
    } finally {
      setWaiting(false)
    }
  }

  let changeInput = (e) => {
    let { name, value } = e.target
    setInput({
      ...input,
      [name]: value
    })
  }

  async function saveSubmit(e) {
    e.preventDefault()
    await dispatch(saveSubmitUpdated(input))
    navigate('/user-profile')
  }

  useEffect(() => {
    socket.auth = {
      access_token : localStorage.access_token
    }
    socket.connect()
    fetching()
  }, [])

  return (
    <>
      {waiting ? (
        <div className="m-10">
          <div className="mockup-window border bg-base-200 p-10 flex flex-col items-center">
            <h2 className="font-bold flex justify-center font-serif mb-7 text-2xl text-primary-500">Loading...</h2>
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-screen">
          <form onSubmit={saveSubmit}>
            <div className="relative flex flex-col bg-base-200 rounded-2xl md:flex-row md:space-y-0">
              <div className="flex flex-col justify-center p-8 md:p-14">
                <span className="mb-3 text-4xl font-bold">Edit Profile</span>

                {isError && (
                  <div role="alert" className="alert mb-2 alert-error">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{errorMessage}</span>
                  </div>
                )}
                <div className="py-1">
                  <span htmlFor='fullname' className="mb-2 text-md">Full Name</span>
                  <input
                    type="text"
                    className="w-full p-2 rounded-md"
                    name="fullname"
                    id="fullname"
                    value={input.fullname}
                    onChange={changeInput}
                  />
                </div>
                <div className="py-1">
                  <span htmlFor='birthdate' className="mb-2 text-md">Birth Date</span>
                  <input
                    type="date"
                    className="w-full p-2 rounded-md"
                    name="birthdate"
                    id="birthdate"
                    value={input.birthdate}
                    onChange={changeInput}
                  />
                </div>
                <div className="py-1">
                  <span htmlFor='username' className="mb-2 text-md">Username</span>
                  <input
                    type="text"
                    className="w-full p-2 rounded-md"
                    name="username"
                    id="username"
                    value={input.username}
                    onChange={changeInput}
                  />
                </div>
                <div className="py-1">
                  <span htmlFor='email' className="mb-2 text-md">Email</span>
                  <input
                    type="email"
                    className="w-full p-2 rounded-md"
                    name="email"
                    id="email"
                    value={input.email}
                    onChange={changeInput}
                  />
                </div>
                <div className="py-1">
                  <span htmlFor='gender' className="mb-2 text-md">Gender</span>
                  <select
                    className="select w-full p-2 rounded-md"
                    name="gender"
                    id="gender"
                    value={input.gender}
                    onChange={changeInput}
                  >
                    <option disabled>Select Gender</option>
                    <option value='male'>Male</option>
                    <option value='female'>Female</option>
                  </select>
                </div>
                <div className="py-1">
                  <span htmlFor='interest' className="mb-2 text-md">Interest</span>
                  <select
                    className="select w-full p-2 rounded-md"
                    name="interest"
                    id="interest"
                    value={input.interest}
                    onChange={changeInput}
                  >
                    <option className='m-10' disabled>Select Interest</option>
                    <option className='m-10' value='male'>Male</option>
                    <option className='m-10' value='female'>Female</option>
                  </select>
                </div>
                <div className="py-1">
                  <span htmlFor='show' className="mb-2 text-md">Show</span>
                  <select
                    className="select w-full p-2 rounded-md"
                    name="show"
                    id="show"
                    value={input.show}
                    onChange={changeInput}
                  >
                    <option className='m-10' disabled>Select show</option>
                    <option className='m-10' value='true'>Public</option>
                    <option className='m-10' value='false'>Private</option>
                  </select>
                </div>

                <div className="py-1">
                  <span htmlFor='address' className="mb-2 text-md">Address</span>
                  <input
                    type="text"
                    className="w-full p-2 rounded-md"
                    name="address"
                    id="address"
                    value={input.address}
                    onChange={changeInput}
                  />
                </div>

                <div className="py-1">
                  <span htmlFor='profilePicture' className="mb-2 text-md">Profile Picture Url</span>
                  <input
                    type="text"
                    className="w-full p-2 rounded-md"
                    name="profilePicture"
                    id="profilePicture"
                    value={input.profilePicture}
                    onChange={changeInput}
                  />
                </div>

                <div className="py-1" >
                  <span htmlFor="bio">Biodata</span>
                  <textarea
                    type="text"
                    className="w-full p-2 rounded-md"
                    placeholder='bio'
                    name="bio"
                    id="bio"
                    value={input.bio}
                    onChange={changeInput}
                  >
                  </textarea>
                </div>

                <div className="py-1">
                  <span htmlFor='occupation' className="mb-2 text-md">Occupation</span>
                  <input
                    type="text"
                    className="w-full p-2 rounded-md"
                    name="occupation"
                    id="occupation"
                    value={input.occupation}
                    onChange={changeInput}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-base-300 mt-4 text-bg-body-secondary p-2 rounded-lg mb-3 hover:bg-base-100"
                >
                  Update
                </button>
                <a
                  href='/user-profile'
                  type="submit"
                  className="w-full bg-base-100 text-center text-bg-body-secondary p-2 rounded-lg mb-6 hover:bg-base-300"
                >
                  Cancel
                </a>
              </div>

              <div className="relative bg-base-300 rounded-md">
                <img
                  src={input.profilePicture}
                  alt="img"
                  className="w-[450px] h-full hidden rounded-r-2xl md:block object-cover"
                />
              </div>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default EditUserProfile