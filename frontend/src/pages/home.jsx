import React,{useState,useRef } from 'react'
import {useGSAP} from '@gsap/react'
import gsap from 'gsap'
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel'
import VehiclePanel from '../components/VehiclePanel' 
import ConfirmedRide from '../components/ConfirmedRide'
import LookingForDriver from '../components/LookingForDriver'
import WaitingForDriver from '../components/WaitingForDriver'


const Home = () => {
  const [pickup, setPickup] = useState('')
  const [destination, setDestination] = useState('')
  const [panelOpen, setPanelOpen] = useState(false)
  const panelRef = useRef(null)
  const vehiclePanelRef = useRef(null)
  const waitingForDriverRef = useRef(null)
  const confirmRidePanelRef = useRef(null)
    const vehicleFoundRef = useRef(null)
const panelCloseRef = useRef(null)
const [VehiclePanelOpen, setVehiclePanelOpen] = useState(false)
const [confirmRidePanel, setConfirmRidePanel] = useState(false)
const [vehicleFound, setVehicleFound] = useState(false)
const [waitingForDriver, setWaitingForDriver] = useState(false)


  const submitHandler = (e) => {
e.preventDefault();
  }
useGSAP(function(){
 if(panelOpen){
  gsap.to(panelRef.current, {
    height: '70%',
    padding:24
  //  opacity:1
  })
  gsap.to(panelCloseRef.current, {
    opacity:1
  }

  )
}else{
  gsap.to(panelRef.current, {
    height: '0%',
    // opacity:0
    padding:0
  })
 gsap.to(panelCloseRef.current, {
    opacity:0
  })
}
},[panelOpen])

useGSAP(function(){
if(VehiclePanelOpen){
  gsap.to(vehiclePanelRef.current, {
  transform:'translateY(0)'
 
})
}
else{
  gsap.to(vehiclePanelRef.current, {
    transform:'translateY(100%)'
  })
}
},[VehiclePanelOpen])

 useGSAP(function () {
        if (confirmRidePanel) {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ confirmRidePanel ])

    useGSAP(function () {
        if (vehicleFound) {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ vehicleFound ])
  useGSAP(function () {
        if (waitingForDriver) {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ waitingForDriver ])
  return (
    <div className='h-screen relative overflow-hidden'>
          <img  className =' w-16 absolute left-5 top-5'src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
   
   <div 
   className='h-screen w-screen'>
 <img  className =' h-full w-full object-cover' src="https://miro.medium.com/max/1280/0*gwMx05pqII5hbfmX.gif" alt="" />
</div>
   <div className='flex flex-col justify-end h-screen absolute top-0  w-full '>
   <div className='h-[30%] p-5 bg-white'>
   <h5 ref={panelCloseRef} onClick={() => {
                        setPanelOpen(false)
                    }} className='absolute opacity-0 right-6 top-6 text-2xl'>
                        <i className="ri-arrow-down-wide-line"></i>
                    </h5>
     <h4 className='text-2xl font-semibold'>Find a Trip</h4>
    <form onSubmit={(e)=>{
      submitHandler(e)
    }}>
      <div className="line absolute h-16 w-1 top-[85%] left-2 bg-gray-900 rounded-full"></div>
      <input 
      onClick={() => setPanelOpen(true)}
      value={pickup}
      onChange={(e) => setPickup(e.target.value)}
      className="bg-[#eee]
px-12 py-2  text-lg  rounded-lg w-full mt-5 "
      type="text" placeholder='Add a pickup location'></input>
     <input 
      onClick={() => setPanelOpen(true)}
      value={destination}
      onChange={(e) => setDestination(e.target.value)}
        className="bg-[#eee]
px-12 py-2  text-lg  rounded-lg w-full mt-3 " type="text" placeholder='Enter your Destination'></input>
    </form>
   </div >
   <div  ref={panelRef} className=' h-0 bg-white '>
<LocationSearchPanel  setPanelOpen={setPanelOpen} setVehiclePanelOpen={setVehiclePanelOpen}/>
   </div>
   </div>
  
   <div ref={vehiclePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-8'>
    <VehiclePanel  setconfirmRidePanel={setConfirmRidePanel} setVehiclePanelOpen={setVehiclePanelOpen} />
   </div>
   <div ref={confirmRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-8'>
    <ConfirmedRide setVehiclePanelOpen={setVehiclePanelOpen} setVehicleFound={setVehicleFound} setConfirmRidePanel={setConfirmRidePanel}/>
   </div>
   <div ref={vehicleFoundRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-8'>
    <LookingForDriver setVehicleFound={setVehicleFound}/>
   </div>
   <div ref={waitingForDriverRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-8'>
    <WaitingForDriver  setWaitingForDriver={setWaitingForDriver}/>
   </div>
    </div>
   

   
  )
}

export default Home