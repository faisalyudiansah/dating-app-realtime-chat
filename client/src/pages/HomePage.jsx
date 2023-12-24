import axios from 'axios';
import Swal from 'sweetalert2';
import React, { useEffect, useState } from 'react';

const HomePage = () => {
  const [userData, setUserData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  async function showUser() {
    try {
      let { data } = await axios({
        method: 'get',
        url: import.meta.env.VITE_BASE_URL + `/users`,
        headers: {
          Authorization: 'Bearer ' + localStorage.access_token,
        },
      });
      setUserData(data.data);
      setLoading(false); // Pindahkan setLoading ke dalam blok try agar tidak terjadi infinite loop
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `${error.response.data.message}`,
      });
    }
  }

  const handleAction = async (action) => {
    try {
      if (action === "skip") {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % userData.length);
      } else {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/users/${action}/${userData[currentIndex].id}`,
          {},
          {
            headers: {
              Authorization: 'Bearer ' + localStorage.access_token,
            },
          }
        );
        setCurrentIndex((prevIndex) => (prevIndex + 1) % userData.length);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: `${error.response.data.message}`,
      });
      setCurrentIndex((prevIndex) => (prevIndex + 1) % userData.length);
    }
  };

  useEffect(() => {
    showUser();
  }, []); // Hapus currentIndex dan userData dari dependencies untuk menghindari pemanggilan berulang

  return (
    <>
      {loading ? (
        <div className="m-10">
          <div className="mockup-window border bg-base-200 p-10 flex flex-col items-center">
            <h2 className="font-bold flex justify-center font-serif mb-7 text-2xl text-primary-500">
              Loading...
            </h2>
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      ) : (
        <section>
          <div className="m-10">
            <div className="mockup-window border bg-base-200 p-10">
              <h2 className="font-bold flex justify-center font-serif mb-7 text-2xl text-primary-500">{userData[currentIndex].UserProfile.fullname}</h2>
            </div>
            <div className="card border lg:card-side mt-4 shadow-xl">
              <figure>
                <img
                  className='w-60'
                  src={userData[currentIndex].UserProfile.profilePicture}
                  alt={userData[currentIndex].username}
                />
              </figure>
              <div className="card-body bg-base-200">
                <h1 className="card-title">{userData[currentIndex].username}</h1>
                <p>{userData[currentIndex].UserProfile.occupation}</p>
                <p>{userData[currentIndex].UserProfile.address}</p>
                <p>{userData[currentIndex].UserProfile.bio}</p>
                <div className="card-actions justify-left">
                  <button
                    onClick={() => handleAction('dislike')}
                    className="btn bg-base-300 hover:bg-base-100 rounded-xl"
                  >
                    Dislike
                  </button>
                  <button
                    onClick={() => handleAction('like')}
                    className="btn bg-base-300 hover:bg-base-100 rounded-xl"
                  >
                    Like
                  </button>
                  <button
                    onClick={() => handleAction('skip')}
                    className="btn bg-base-300 hover:bg-base-100 rounded-xl"
                  >
                    Skip
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default HomePage;