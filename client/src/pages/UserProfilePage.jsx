import React, { useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { MdOutlineWork, MdPublic } from "react-icons/md"
import { FaLocationDot } from "react-icons/fa6"
import { FaBirthdayCake, FaEye } from "react-icons/fa";
import { IoMdMale, IoMdFemale } from "react-icons/io";
import { RiGitRepositoryPrivateFill } from "react-icons/ri"

import { useDispatch, useSelector } from 'react-redux'
import { userProfileFetch } from "../store/appSlice"  // panggil function nya

const UserProfilPage = () => {
  let dispatch = useDispatch()
  let { loading, userProfile } = useSelector((state) => state.appReducer)

  function formatterDate(value) {
    let date = new Date(value);
    let year = date.getFullYear();
    let month = `${date.getMonth() + 1}`.padStart(2, '0');
    let day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async function handlePayment() {
    try {
      let { data } = await axios({
        method: 'post',
        url: import.meta.env.VITE_BASE_URL + `/payment/midtrans/token`,
        headers: {
          Authorization: 'Bearer ' + localStorage.access_token,
        },
      })
      window.snap.pay(data.token)
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `${error.response.data.message}`,
      })
    }
  }

  useEffect(() => {
    dispatch(userProfileFetch())
  }, [])
  return (
    <>
      {loading ? (
        <div className="m-10">
          <div className="mockup-window border bg-base-200 p-10 flex flex-col items-center">
            <h2 className="font-bold flex justify-center font-serif mb-7 text-2xl text-primary-500">Loading...</h2>
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl flex items-center h-auto lg:h-screen flex-wrap mx-auto my-32 lg:my-0">

          <div id="profile" className="w-full lg:w-3/5 rounded-xl lg:rounded-l-lg lg:rounded-xl shadow-2xl bg-white opacity-75 mx-6 lg:mx-0">

            <div className="p-4 md:p-12 text-center lg:text-left">
              {userProfile.gender === 'male' ? <IoMdMale /> : <IoMdFemale />}
              <div className="block lg:hidden rounded-full shadow-xl mx-auto -mt-16 h-48 w-48 bg-cover bg-center" style={{ backgroundImage: `url(${userProfile.UserProfile.profilePicture})` }}></div>


              <h1 className="text-3xl font-bold pt-8 text-bg-body-secondary  lg:pt-0">{userProfile.UserProfile.fullname}</h1>
              <div className="mx-auto lg:mx-0 w-4/5 pt-3 border-b-2 border-base opacity-100">
                <p className="text-md text-base">{userProfile.email}</p>
              </div>

              <p className="pt-4 text-base font-bold flex items-center justify-center lg:justify-start">
                <MdOutlineWork />
                <span className='mx-3'>{userProfile.UserProfile.occupation}</span>
              </p>
              <p className="text-base font-bold flex items-center justify-center lg:justify-start">
                <FaLocationDot />
                <span className='mx-3'>{userProfile.UserProfile.address}</span>
              </p>
              <p className="text-base font-bold flex items-center justify-center lg:justify-start">
                <FaBirthdayCake />
                <span className='mx-3'>{formatterDate(userProfile.UserProfile.birthdate)}</span>
              </p>
              <p className="text-base font-bold flex items-center justify-center lg:justify-start">
                <FaEye />
                <span className='mx-3'>Looking for : {userProfile.interest}</span>
              </p>
              {userProfile.show ?
                <p className="text-base font-bold flex items-center justify-center lg:justify-start">
                  <MdPublic />
                  <span className='mx-3'>Public</span>
                </p>
                :
                <p className="text-base font-bold flex items-center justify-center lg:justify-start">
                  <RiGitRepositoryPrivateFill />
                  <span className='mx-3'>Private. Your account does not appear in public</span>
                </p>
              }

              <p className="pt-8 text">Username : {userProfile.username}</p>
              <p className="pt-4 text-md">{userProfile.UserProfile.bio}</p>

              <div className="pt-12 pb-8">
                <a href='/edit-profile' className="bg-base-300 hover:bg-base-100 text-base font-bold py-2 px-4 rounded-full">
                  Edit Profile
                </a>
                {!userProfile.subscription && (
                  <button onClick={handlePayment} className="bg-base-300 hover:bg-base-100 text-base mx-3 font-bold py-2 px-4 rounded-full">
                    Subscription
                  </button>
                )}
              </div>

            </div>
          </div>

          <div className="w-full lg:w-2/5 lg:p-6 bg-base-content rounded-3xl">
            <img src={userProfile.UserProfile.profilePicture} className="rounded-none lg:rounded-lg shadow-2xl hidden lg:block" alt="Profile" />
          </div>

        </div>
      )}
    </>
  );
}

export default UserProfilPage