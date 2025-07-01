import React from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopup from '../components/RidePopup'
import ConfirmRidePopup from '../components/ConfirmRidePopup'
import { useState, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
const CaptainHome = () => {

const [ridePopupPanel, setRidePopupPanel] = useState(true)
const ridePopupPanelRef = useRef(null)
const confirmRidePopupPanelRef = useRef(null)
const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false)

useGSAP(function () {
        if (ridePopupPanel) {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ ridePopupPanel ])
    
useGSAP(function () {
        if (confirmRidePopupPanel) {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ confirmRidePopupPanel ])



  return (
    <div className='h-screen'>
        <div className='fixed p-6 top-0 flex items-center justify-between w-full'>
          <img  className='w-16 'src='https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png' alt='uber'></img>
           <Link to='/home'
                  className='  h-10 w-10 bg-white flex items-center justify-center rounded-full '>
                      <i className="text-lg font-medium ri-logout-box-r-line"></i>
                  </Link>
        </div>
        <div className='h-3/5'>
            <img  className =' h-full w-full object-cover' src="https://miro.medium.com/max/1280/0*gwMx05pqII5hbfmX.gif" alt="" />
        </div>
        <div className='h-2/5 p-6'>
  
<CaptainDetails/>
    </div>
    <div ref={ridePopupPanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-12'>
    <RidePopup setRidePopupPanel={setRidePopupPanel} setConfirmRidePopupPanel={setConfirmRidePopupPanel} />
   </div>
    <div ref={confirmRidePopupPanelRef} className='fixed h-creen w-full z-10 bottom-0 translate-y-full bg-white px-3 py-12'>
    <ConfirmRidePopup setConfirmRidePopupPanel={setConfirmRidePopupPanel} setRidePopupPanel={setRidePopupPanel} />
   </div>
    </div>
  )
}

export default CaptainHome