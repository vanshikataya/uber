import React from 'react'
import{ Link } from 'react-router-dom'
const Riding = () => {
  return (
    <div className='h-screen'>
        <Link to='/home'
        className='fixed  right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full '>
            <i className="text-lg font-medium ri-home-3-line"></i>
        </Link>
        <div className='h-1/2'>
            <img  className =' h-full w-full object-cover' src="https://miro.medium.com/max/1280/0*gwMx05pqII5hbfmX.gif" alt="" />
        </div>
        <div className='h-1/2 p-4'>
        <div className='flex items-center justify-between'>
   <img className='h-20' src='https://tse1.mm.bing.net/th/id/OIP.90_IXyFPb47LZ_AYAe1ylAHaEK?pid=Api&P=0&h=180' alt='vehicle' />
<div className='text-right'>
  <h2 className='text-lg font-medium'>Saket</h2>
  <h4 className='text-xl font-semibold -mt-1 -md-1'>HR08 BC 6757</h4>
  <p className='text-sm text-gray-600'>Swift Desire</p>
</div>
</div>
     

      <div className='flex justify-between gap-2 flex-col items-center'>
      

        <div className='w-full mt-5'>
          

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

       
      </div>

        <button  className='w-full bg-green-600 text-white font-semibold p-2 rounded-lg mt-5'>Make a payment</button>
        </div>
    </div>
  )
}

export default Riding