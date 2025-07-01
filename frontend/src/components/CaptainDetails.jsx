
import React from 'react'

const CaptainDetails = () => {
  return (
    <div>
        <div className='flex items-center justify-between'>
  <div className='flex items-center gap-3 justify-start'>
    <img className='h-10 w-10 rounded-full object-cover' src=" https://tse4.mm.bing.net/th/id/OIP.Tv3oG-Is7dcMNcysxIVwLAHaHa?pid=Api&P=0&h=180" alt=''></img>
    <h4 className='text-lg font-medium '>Sagar Gupta</h4>
  </div>
<div>
     <h4 className='text-xl font-semibold'>$23</h4>
<p className='text-sm  text-gray-600'>Earned</p> 
</div>
</div> 
<div className='flex p-3 mt-6 bg-gray-100 rounded-xl justify-center gap-5 items-start'>
 
  <div className='text-center'>
    <i className=" text-3xl mb-2 font-thin ri-timer-line"></i>
    <h5 className='text-lg font-medium'>10.2</h5>
    <p className='text-sm text-gray-600'>Hours Online</p>
  </div>
  <div className='text-center'>
    <i className=" text-3xl mb-2 font-thin ri-speed-up-line"></i>
    <h5 className='text-lg font-medium'>10.2</h5>
    <p className='text-sm text-gray-600'>Hours Online</p>
  </div>
  <div className='text-center'>
    <i className=" text-3xl mb-2 font-thin ri-sticky-note-line"></i>
    <h5 className='text-lg font-medium'>10.2</h5>
    <p className='text-sm text-gray-600'>Hours Online</p>
    </div>     
        </div>
    </div>
  )
}

export default CaptainDetails