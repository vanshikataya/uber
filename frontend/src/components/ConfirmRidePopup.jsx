import React from 'react'
import { useState } from 'react'

import { Link } from 'react-router-dom'
const ConfirmRidePopup = (props) => {
const [otp, setOTP] = useState('')



const submitHandler = (e) => {
    e.preventDefault();
}


  return (
     <div >
      <h5 className='p-1 text-center absolute top-0 w-[90%]' onClick={() => {
        props.setRidePopupPanel(false)
      }}>
        <i className="text-3xl text-gray-200 ri-arrow-down-s-fill"></i>
      </h5>

      <h3 className='text-2xl font-semibold mb-5'>Confirm Ride to Start</h3>
<div className='flex items-center justify-between  p-3 bg-yellow-400 rounded-lg mt-4'>
    <div className='flex items-center gap-3'>
        <img className='h-10 rounded-full w-10 object-cover' src='https://tse4.mm.bing.net/th/id/OIP.Tv3oG-Is7dcMNcysxIVwLAHaHa?pid=Api&P=0&h=180'></img>
   <h2 className='text-lg font-medium'>Sagar Gupta</h2>
    </div>
    <h5 className='text-lg font-semibold'>2.2KM</h5>
</div>
      <div className='flex justify-between gap-2 flex-col items-center'>
        
        <div className='w-full mt-5'>
          <div className='flex items-center gap-5 p-3 border-b-2'>
            <i className="text-lg ri-map-pin-2-fill"></i>
            <div>
              <h3 className='text-lg font-medium'>562/11/1</h3>
              <p className='text-sm text-gray-600'>Matka Clock, Kaithal</p>
            </div>
          </div>

          <div className='flex items-center gap-5 p-3 border-b-2'>
            <i className="ri-map-pin-2-line"></i>
            <div>
              <h3 className='text-lg font-medium'>562/11/1</h3>
              <p className='text-sm text-gray-600'>Matka Clock, Kaithal</p>
            </div>
          </div>

          <div className='flex items-center gap-5 p-3 '>
            <i className="ri-currency-fill"></i>
            <div>
              <h3 className='text-lg font-medium'>$20</h3>
              <p className='text-sm text-gray-600'>Cash</p>
            </div>
          </div>
        </div>



      <div className='mt-6 w-full'>
        <form onSubmit={(e)=>{
submitHandler(e)
        }}>
            <input value={otp} onChange={(e)=>setOTP(e.target.value)} type='text' placeholder='Enter OTP' className='w-full px-6 py-4  border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-600 font-mono' />
     <Link to='/captainriding'
        className='w-full  flex justify-center bg-green-600 text-white font-semibold p-3 rounded-lg mt-5'>
          Confirm Ride
        </Link>
         <button onClick={()=>{
         props.setConfirmRidePopupPanel(false)
props.setRidePopupPanel(false)
        }}
        className='w-full bg-red-600 text-white font-semibold p-3 rounded-lg mt-5'>
          Cancel Ride
        </button>
</form>
      </div>
      </div>
    </div>
  )
}

export default ConfirmRidePopup;