import React from 'react'

const WaitingForDriver = (props) => {
  return (
     <div>
      <h5 className='p-1 text-center absolute top-0 w-[90%]' onClick={() => {
        props.setWaitingForDriver(false)
      }}>
        <i className="text-3xl text-gray-200 ri-arrow-down-s-fill"></i>
      </h5>
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

       
      </div>
    </div>
  )
}

export default WaitingForDriver