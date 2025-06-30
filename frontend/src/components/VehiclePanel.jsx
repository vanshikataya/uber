import React from 'react'

const VehiclePanel = (props) => {
  return (
    <div><h5 className='p-1 text-center absolute top-0  w-[90%]' onClick={()=>{
      props.setVehiclePanelOpen(false)
    }}><i className=" text-3xl text-gray-200 ri-arrow-down-s-fill"></i></h5>
<h3 className='text-2xl font-semibold mb-5'>Choose a Vehicle</h3>
<div onClick={()=>{
  props.setconfirmRidePanel(true)

}}
className='flex border-2 active:border-black bg-gray-100 mb-2 rounded-xl w-full p-3 items-center justify-between'>
  
  <img className='h-10' src="https://tse1.mm.bing.net/th/id/OIP.90_IXyFPb47LZ_AYAe1ylAHaEK?pid=Api&P=0&h=180" alt='image'></img>
<div className=' w-1/2'>
  <h4 className='font-medium text-base'>
    UberGo <span><i className="ri-user-3-fill"></i>4</span>
  </h4>
  <h5 className='font-medium  text-sm'>2 mins away</h5>
  <p className='font-medium text-sm'>Affordable,compact rides</p>
  <p className='font-normal text-xs text-gray-600'>4 seats available</p>
</div>
<h2 className='text-xl font-semibold'>$20</h2>
</div>
<div onClick={()=>{
  props.setconfirmRidePanel(true)

}}
 className='flex border-2 active:border-black bg-gray-100 mb-2 rounded-xl w-full p-3 items-center justify-between'>
  
  <img className='h-10' src="https://tse4.mm.bing.net/th/id/OIP.znY96OhfmQ9RecEw45FS_AHaE7?pid=Api&P=0&h=180" alt='image'></img>
<div className=' w-1/2'>
  <h4 className='font-medium text-base'>
    Moto <span><i className="ri-user-3-fill"></i>4</span>
  </h4>
  <h5 className='font-medium  text-sm'>3 mins away</h5>
  <p className='font-medium text-sm'>Affordable Motercycle rides</p>

</div>
<h2 className='text-xl font-semibold'>$2</h2>
</div>
<div onClick={()=>{
  props.setconfirmRidePanel(true)

}}
 className='flex border-2 active:border-black bg-gray-100 mb-2 rounded-xl w-full p-3 items-center justify-between'>
  
  <img className='h-10' src="https://tse4.mm.bing.net/th/id/OIP.gERohywpalGF3NjolmHt5wHaE7?pid=Api&P=0&h=180" alt='image'></img>
<div className=' w-1/2'>
  <h4 className='font-medium text-base'>
    Uber Auto <span><i className="ri-user-3-fill"></i>4</span>
  </h4>
  <h5 className='font-medium  text-sm'>10 mins away</h5>
  <p className='font-medium text-sm'>Affordable auto rides</p>

</div>
<h2 className='text-xl font-semibold'>$13</h2>
</div></div>
  )
}

export default VehiclePanel