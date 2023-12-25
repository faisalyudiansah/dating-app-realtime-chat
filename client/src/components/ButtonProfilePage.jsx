import React from 'react'

const ButtonProfilePage = ({ userProfile, handlePayment }) => {
  return (
    <>
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
    </>
  )
}

export default ButtonProfilePage