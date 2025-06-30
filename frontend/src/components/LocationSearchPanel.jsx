import React from 'react'

const LocationSearchPanel = (props) => {
console.log(props)
const locations=[
  "24B, Near Kapoor's cafe",
  "22B, Near mannat hweli",
  "17C, Near DAV school",
  "20C, Near sharma's cafe",
  "14A, Near Koko's cafe",
]




  return (
    <div>
      {
        locations.map(function(elem,idx){
          return  <div key={idx} onClick={()=>{
            props.setVehiclePanelOpen(true)
            props.setPanelOpen(false)
          }}
          className='flex gap-4 border-2 p-3 border-gray-50 active:border-black rounded-xl items-center  my-2 justify-start'>
        <h2 className='bg-[#eee] h-8  flex items-center justify-center w-12'>
          <i className="ri-map-pin-fill"></i>
        </h2>
        <h4 className='font-medium'>{elem}</h4>
      </div>
        })
      }
     
       
    </div>
  )
}

export default LocationSearchPanel