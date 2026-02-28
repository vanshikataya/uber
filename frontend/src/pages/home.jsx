import React, { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import { SocketContext } from '../context/SocketContext';
import { useContext } from 'react';
import { UserDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import LiveTracking from '../components/LiveTracking';

const home = () => {
    const [ pickup, setPickup ] = useState('')
    const [ destination, setDestination ] = useState('')
    const [ panelOpen, setPanelOpen ] = useState(false)
    const vehiclePanelRef = useRef(null)
    const confirmRidePanelRef = useRef(null)
    const vehicleFoundRef = useRef(null)
    const waitingForDriverRef = useRef(null)
    const panelRef = useRef(null)
    const panelCloseRef = useRef(null)
    const panelOpenRef = useRef(null)
    const bottomSheetRef = useRef(null)
    const [ panelMinimized, setPanelMinimized ] = useState(false)
    const [ vehiclePanel, setVehiclePanel ] = useState(false)
    const [ confirmRidePanel, setConfirmRidePanel ] = useState(false)
    const [ vehicleFound, setVehicleFound ] = useState(false)
    const [ waitingForDriver, setWaitingForDriver ] = useState(false)
    const [ pickupSuggestions, setPickupSuggestions ] = useState([])
    const [ destinationSuggestions, setDestinationSuggestions ] = useState([])
    const [ activeField, setActiveField ] = useState(null)
    const [ fare, setFare ] = useState({})
    const [ vehicleType, setVehicleType ] = useState(null)
    const [ ride, setRide ] = useState(null)
    const [driverMarker, setDriverMarker] = useState(null)
    const [routeCoordinates, setRouteCoordinates] = useState([])
    const [pickupCoords, setPickupCoords] = useState(null)
    const [destinationCoords, setDestinationCoords] = useState(null)
    const pickupTimerRef = useRef(null)
    const destinationTimerRef = useRef(null)

    const navigate = useNavigate()

    const { socket } = useContext(SocketContext)
    const { user } = useContext(UserDataContext)

    // Debug: log driverMarker changes
    useEffect(() => {
        console.log('🎯 driverMarker state updated:', driverMarker)
    }, [driverMarker])

    useEffect(() => {
        socket.emit("join", { userType: "user", userId: user._id })
    }, [ user ])

    useEffect(() => {
        const handleRideConfirmed = (ride) => {
            setVehicleFound(false)
            setWaitingForDriver(true)
            setRide(ride)
            // set driver marker if captain location provided
            try {
                const cap = ride.captain || ride.captainDetails || ride.driver
                if (cap) {
                    let lat, lng
                    if (cap.location && cap.location.ltd) {
                        // Captain model uses 'ltd' for latitude
                        lat = cap.location.ltd
                        lng = cap.location.lng
                    } else if (cap.location && cap.location.coordinates) {
                        // GeoJSON [lng, lat]
                        lng = cap.location.coordinates[0]
                        lat = cap.location.coordinates[1]
                    } else if (cap.location && cap.location.lat && cap.location.lng) {
                        lat = cap.location.lat
                        lng = cap.location.lng
                    }
                    if (lat && lng) setDriverMarker({ lat, lng, popup: cap.fullname?.firstname || 'Driver' })
                }
            } catch (e) {
                console.warn('Could not set driver marker', e)
            }
        }

        const handleCaptainLocation = (data) => {
            if (data && typeof data.lat === 'number' && typeof data.lng === 'number') {
                setDriverMarker(prev => ({
                    lat: data.lat,
                    lng: data.lng,
                    popup: prev?.popup || 'Driver'
                }));
            }
        }

        const handleRideStarted = (ride) => {
            setWaitingForDriver(false)
            navigate('/riding', { state: { ride } })
        }

        socket.on('ride-confirmed', handleRideConfirmed)
        socket.on('captain-location-update', handleCaptainLocation)
        socket.on('ride-started', handleRideStarted)

        return () => {
            socket.off('ride-confirmed', handleRideConfirmed)
            socket.off('captain-location-update', handleCaptainLocation)
            socket.off('ride-started', handleRideStarted)
        }
    }, [socket, navigate])


    const handlePickupChange = (e) => {
        const val = e.target.value;
        setPickup(val);
        
        // Clear previous timer
        if (pickupTimerRef.current) clearTimeout(pickupTimerRef.current);
        
        if (val.length < 3) {
            setPickupSuggestions([]);
            return;
        }
        
        // Debounce: wait 500ms before making API call
        pickupTimerRef.current = setTimeout(() => {
            (async () => {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                        params: { input: val },
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    setPickupSuggestions(response.data);
                } catch (err) {
                    console.warn('Pickup suggestions error:', err.message);
                    setPickupSuggestions([]);
                }
            })();
        }, 500);
    }

    const handleDestinationChange = (e) => {
        const val = e.target.value;
        setDestination(val);
        
        // Clear previous timer
        if (destinationTimerRef.current) clearTimeout(destinationTimerRef.current);
        
        if (val.length < 3) {
            setDestinationSuggestions([]);
            return;
        }
        
        // Debounce: wait 500ms before making API call
        destinationTimerRef.current = setTimeout(() => {
            (async () => {
                try {
                    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                        params: { input: val },
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    setDestinationSuggestions(response.data);
                } catch (err) {
                    console.warn('Destination suggestions error:', err.message);
                    setDestinationSuggestions([]);
                }
            })();
        }, 500);
    }

    const submitHandler = (e) => {
        e.preventDefault()
    }

    useGSAP(function () {
        if (panelOpen) {
            gsap.to(panelRef.current, {
                height: '70%',
                padding: 24,
                duration: 0.4,
                ease: 'power2.out'
            })
            gsap.to(panelCloseRef.current, {
                opacity: 1,
                pointerEvents: 'auto',
                duration: 0.3
            })
            gsap.to(panelOpenRef.current, {
                opacity: 0,
                pointerEvents: 'none',
                duration: 0.3
            })
        } else {
            gsap.to(panelRef.current, {
                height: '0%',
                padding: 0,
                duration: 0.4,
                ease: 'power2.inOut'
            })
            gsap.to(panelCloseRef.current, {
                opacity: 0,
                pointerEvents: 'none',
                duration: 0.3
            })
            gsap.to(panelOpenRef.current, {
                opacity: 1,
                pointerEvents: 'auto',
                duration: 0.3
            })
        }
    }, [ panelOpen ])


    // Minimize / restore the entire bottom sheet
    useGSAP(function () {
        if (!bottomSheetRef.current) return;
        if (panelMinimized) {
            gsap.to(bottomSheetRef.current, {
                y: '100%',
                duration: 0.4,
                ease: 'power2.inOut'
            })
        } else {
            gsap.to(bottomSheetRef.current, {
                y: '0%',
                duration: 0.4,
                ease: 'power2.out'
            })
        }
    }, [ panelMinimized ])

    useGSAP(function () {
        if (vehiclePanel) {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(0)',
                duration: 0.4,
                ease: 'power3.out'
            })
        } else {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(100%)',
                duration: 0.3,
                ease: 'power3.inOut'
            })
        }
    }, [ vehiclePanel ])

    useGSAP(function () {
        if (confirmRidePanel) {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(0)',
                duration: 0.4,
                ease: 'power3.out'
            })
        } else {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(100%)',
                duration: 0.3,
                ease: 'power3.inOut'
            })
        }
    }, [ confirmRidePanel ])

    useGSAP(function () {
        if (vehicleFound) {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(0)',
                duration: 0.4,
                ease: 'power3.out'
            })
        } else {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(100%)',
                duration: 0.3,
                ease: 'power3.inOut'
            })
        }
    }, [ vehicleFound ])

    useGSAP(function () {
        if (waitingForDriver) {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(0)',
                duration: 0.4,
                ease: 'power3.out'
            })
        } else {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(100%)',
                duration: 0.3,
                ease: 'power3.inOut'
            })
        }
    }, [ waitingForDriver ])

    // Demo: auto-accept ride after 3 seconds (for testing without real captains)
    useEffect(() => {
        if (!vehicleFound) return
        const timeout = setTimeout(() => {
            console.log('🎬 DEMO: Auto-accepting ride after 3 seconds...')
            const mockRide = {
                _id: 'mock-ride-' + Date.now(),
                pickup,
                destination,
                fare: fare[vehicleType],
                vehicleType,
                captain: {
                    fullname: { firstname: 'Demo', lastname: 'Driver' },
                    vehicle: { plate: 'DL-01-AB-1234', type: vehicleType },
                    rating: 4.8,
                },
                status: 'confirmed',
                otp: '1234'
            }
            setRide(mockRide)
            
            // Ensure driver marker is set (use cached currentPosition or geolocation)
            const setMarker = (lat, lng) => {
                console.log('📍 Auto-accept: Setting driver marker at', { lat, lng, popup: 'Driver (heading to pickup)' })
                setDriverMarker({ lat, lng, popup: 'Driver (heading to pickup)' })
            }

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        const newLat = pos.coords.latitude + 0.005
                        const newLng = pos.coords.longitude + 0.005
                        setMarker(newLat, newLng)
                    },
                    (err) => {
                        console.warn('⚠️ Auto-accept geolocation failed:', err.message)
                        // Fallback to Delhi area
                        setMarker(28.6139, 77.2090)
                    }
                )
            } else {
                // No geolocation, use fallback
                setMarker(28.6139, 77.2090)
            }
            
            setVehicleFound(false)
            setWaitingForDriver(true)
            console.log('✅ DEMO: Ride confirmed with mock driver:', mockRide)
        }, 3000)

        return () => clearTimeout(timeout)
    }, [vehicleFound, pickup, destination, vehicleType, fare])



    async function findTrip() {
        if (!pickup || !destination) return
        setVehiclePanel(true)
        setPanelOpen(false)

        // Fetch fare
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
                params: { pickup, destination },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setFare(response.data)
        } catch (err) {
            console.error('Fare fetch failed:', err?.response?.status || err.message)
        }

        // Fetch route geometry from backend (avoids CORS issues)
        try {
            const routeRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-route`, {
                params: { pickup, destination },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            if (routeRes.data) {
                setRouteCoordinates(routeRes.data.coordinates || [])
                setPickupCoords(routeRes.data.pickup || null)
                setDestinationCoords(routeRes.data.destination || null)
            }
        } catch (err) {
            console.warn('Route fetch failed:', err.message)
        }
    }

    async function createRide() {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
            pickup,
            destination,
            vehicleType
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })


    }

    // Whether any popup panel is active (to hide input panel behind them)
    const anyPopupActive = vehiclePanel || confirmRidePanel || vehicleFound || waitingForDriver

    return (
        <div className='h-screen relative overflow-hidden'>
            <img className='w-16 absolute left-5 top-5 z-[60]' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
            {/* map container behind everything */}
            <div className='absolute inset-0 z-0'>
                <LiveTracking
                    markers={driverMarker ? [driverMarker] : []}
                    routeCoordinates={routeCoordinates}
                    pickupCoords={pickupCoords}
                    destinationCoords={destinationCoords}
                />
            </div>

            {/* Floating button to restore panel when minimized — centered on screen */}
            {panelMinimized && !anyPopupActive && (
                <button
                    onClick={() => setPanelMinimized(false)}
                    className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-white shadow-lg rounded-full px-5 py-3 flex items-center gap-2 active:scale-95 transition-transform'
                >
                    <i className='ri-arrow-up-s-line text-xl text-gray-700'></i>
                    <span className='font-medium text-sm text-gray-700'>Show panel</span>
                </button>
            )}

            {/* overlay input panel — hidden when any popup is active */}
            <div ref={bottomSheetRef}
                 className={`absolute inset-0 flex flex-col justify-end z-10 ${anyPopupActive ? 'pointer-events-none opacity-0' : ''}`}
                 style={{ transition: 'opacity 0.2s ease' }}>
                <div className='bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] relative pt-2 pb-4 px-5'>
                    {/* Centered drag handle to minimize panel */}
                    <div onClick={() => { setPanelOpen(false); setPanelMinimized(true); }}
                         className='flex justify-center py-2 cursor-pointer'>
                        <div className='w-10 h-1.5 bg-gray-300 rounded-full'></div>
                    </div>
                    <h5 ref={panelCloseRef} onClick={() => {
                            setPanelOpen(false)
                        }} className='absolute right-5 top-4 text-2xl cursor-pointer z-40' style={{ opacity: 0, pointerEvents: 'none' }}>
                            <i className="ri-arrow-down-wide-line text-gray-500"></i>
                        </h5>
                        <h5 ref={panelOpenRef} onClick={() => {
                            setPanelOpen(true)
                        }} className='absolute right-5 top-4 text-2xl cursor-pointer z-40' style={{ opacity: 1, pointerEvents: 'auto' }}>
                            <i className="ri-arrow-up-wide-line text-gray-500"></i>
                        </h5>
                        <h4 className='text-2xl font-semibold'>Find a trip</h4>
                        <form className='relative py-3' onSubmit={(e) => {
                            submitHandler(e)
                        }}>
                            <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
                            <input
                                onClick={() => {
                                    setPanelOpen(true)
                                    setActiveField('pickup')
                                }}
                                value={pickup}
                                onChange={handlePickupChange}
                                className='bg-[#eee] px-12 py-2 text-base rounded-lg w-full'
                                type="text"
                                placeholder='Add a pick-up location'
                            />
                            <input
                                onClick={() => {
                                    setPanelOpen(true)
                                    setActiveField('destination')
                                }}
                                value={destination}
                                onChange={handleDestinationChange}
                                className='bg-[#eee] px-12 py-2 text-base rounded-lg w-full mt-3'
                                type="text"
                                placeholder='Enter your destination' />
                        </form>
                    </div>
                    <div ref={panelRef} className='bg-white h-0 overflow-auto'>
                        <LocationSearchPanel
                            suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
                            setPanelOpen={setPanelOpen}
                            setVehiclePanel={setVehiclePanel}
                            setPickup={setPickup}
                            setDestination={setDestination}
                            activeField={activeField}
                        />
                    </div>
                    {/* Find Trip button - only visible when panel is open with suggestions */}
                    {panelOpen && (
                        <div className='bg-white px-5 pb-5'>
                            <button
                                onClick={findTrip}
                                className='bg-black text-white px-4 py-3 rounded-xl w-full shadow-lg font-medium text-base'
                            >
                                Find Trip
                            </button>
                        </div>
                    )}
                </div>

            {/* Vehicle selection panel */}
            <div ref={vehiclePanelRef} className='fixed w-full z-[30] bottom-0 translate-y-full bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.15)] px-4 py-6 pb-8 max-h-[70vh] overflow-auto'>
                <VehiclePanel
                    selectVehicle={setVehicleType}
                    fare={fare} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} />
            </div>

            {/* Confirm ride panel */}
            <div ref={confirmRidePanelRef} className='fixed w-full z-[40] bottom-0 translate-y-full bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.15)] px-4 py-5 pb-8 max-h-[85vh] overflow-auto'>
                <ConfirmRide
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    setConfirmRidePanel={setConfirmRidePanel} setVehicleFound={setVehicleFound} setDriverMarker={setDriverMarker} />
            </div>

            {/* Looking for driver panel */}
            <div ref={vehicleFoundRef} className='fixed w-full z-[50] bottom-0 translate-y-full bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.15)] px-4 py-5 pb-8 max-h-[85vh] overflow-auto'>
                <LookingForDriver
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    setVehicleFound={setVehicleFound} />
            </div>

            {/* Waiting for driver panel */}
            <div ref={waitingForDriverRef} className='fixed w-full z-[50] bottom-0 translate-y-full bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.15)] px-4 py-5 pb-8 max-h-[85vh] overflow-auto'>
                <WaitingForDriver
                    ride={ride}
                    setVehicleFound={setVehicleFound}
                    setWaitingForDriver={setWaitingForDriver}
                    waitingForDriver={waitingForDriver} />
            </div>
        </div>
    )
}

export default home 