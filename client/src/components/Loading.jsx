import React from 'react'

const Loading = () => {
    return (
        <>
            <div className="m-10">
                <div className="mockup-window border bg-base-200 p-10 flex flex-col items-center">
                    <h2 className="font-bold flex justify-center font-serif mb-7 text-2xl text-primary-500">
                        Loading...
                    </h2>
                    <span className="loading loading-spinner loading-lg"></span>
                </div>
            </div>
        </>
    )
}

export default Loading