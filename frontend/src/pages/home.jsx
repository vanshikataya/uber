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
                padding: 24
                // opacity:1
            })
            gsap.to(panelCloseRef.current, {
                opacity: 1
            })
            gsap.to(panelOpenRef.current, {
                opacity: 0
            })
        } else {
            gsap.to(panelRef.current, {
                height: '0%',
                padding: 0
                // opacity:0
            })
            gsap.to(panelCloseRef.current, {
                opacity: 0
            })
            gsap.to(panelOpenRef.current, {
                opacity: 1
            })
        }
    }, [ panelOpen ])


    useGSAP(function () {
        if (vehiclePanel) {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ vehiclePanel ])

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
        setVehiclePanel(true)
        setPanelOpen(false)
        console.log('🚗 Find Trip clicked - vehicle panel should open')

        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
                params: { pickup, destination },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setFare(response.data)
            console.log('📍 Fare fetched:', response.data)
        } catch (err) {
            console.error('❌ Fare fetch failed:', err?.response?.status || err.message)
        }

        // simulate a nearby driver marker so user sees a driver on the map immediately
        try {
            if (navigator.geolocation) {
                console.log('📡 Requesting geolocation...')
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        const lat = pos.coords.latitude + 0.01
                        const lng = pos.coords.longitude + 0.01
                        console.log('✅ Geolocation success - setting driver marker at', { lat, lng })
                        setDriverMarker({ lat, lng, popup: 'Driver (simulated)' })
                    },
                    (err) => {
                        // fallback: use a visible offset from known coordinates
                        console.warn('⚠️ Geolocation denied/failed:', err.message)
                        const fallbackMarker = { lat: 28.6139, lng: 77.2090, popup: 'Driver (simulated - fallback)' }
                        console.log('🚨 Using fallback coordinates:', fallbackMarker)
                        setDriverMarker(fallbackMarker)
                    }
                )
            } else {
                console.warn('❌ Geolocation not supported')
                const fallbackMarker = { lat: 28.6139, lng: 77.2090, popup: 'Driver (simulated - fallback)' }
                setDriverMarker(fallbackMarker)
            }
        } catch (e) {
            console.error('simulate driver failed', e)
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

    return (
        <div className='h-screen relative overflow-hidden'>
            <img className='w-16 absolute left-5 top-5 z-30' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
            {/* map container behind everything */}
            <div className='absolute inset-0 z-0'>
                <LiveTracking markers={driverMarker ? [driverMarker] : []} />
            </div>

            {/* overlay panels and inputs */}
            <div className='absolute inset-0 flex flex-col justify-end z-20'>
                <div className='h-[30%] p-6 bg-white relative z-30'>
                    <h5 ref={panelCloseRef} onClick={() => {
                        setPanelOpen(false)
                    }} className='absolute right-6 top-6 text-2xl cursor-pointer z-40 opacity-0'>
                        <i className="ri-arrow-down-wide-line"></i>
                    </h5>
                    <h5 ref={panelOpenRef} onClick={() => {
                        setPanelOpen(true)
                    }} className='absolute right-6 top-6 text-2xl cursor-pointer z-40 opacity-100'>
                        <i className="ri-arrow-up-wide-line"></i>
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
                            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full'
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
                            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full  mt-3'
                            type="text"
                            placeholder='Enter your destination' />
                    </form>
                    <button
                        onClick={findTrip}
                        className='bg-black text-white px-4 py-2 rounded-lg mt-3 w-full'>
                        Find Trip
                    </button>
                </div>
                <div ref={panelRef} className='bg-white h-0 overflow-auto z-30'>
                    <LocationSearchPanel
                        suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
                        setPanelOpen={setPanelOpen}
                        setVehiclePanel={setVehiclePanel}
                        setPickup={setPickup}
                        setDestination={setDestination}
                        activeField={activeField}
                    />
                </div>
            </div>
            <div ref={vehiclePanelRef} className='fixed w-full z-20 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <VehiclePanel
                    selectVehicle={setVehicleType}
                    fare={fare} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} />
            </div>

            {/* Find Trip fixed button (visible when panel open or suggestions shown) */}
            {(panelOpen && !vehiclePanel && !confirmRidePanel && !vehicleFound && !waitingForDriver) && (
                <div className='fixed left-6 right-6 bottom-28 z-50'>
                    <button
                        onClick={findTrip}
                        className='bg-black text-white px-4 py-3 rounded-lg w-full shadow-lg'
                    >
                        Find Trip
                    </button>
                </div>
            )}

            {/* bottom-center handle */}
            {!panelOpen && (
                <div
                    onClick={() => setPanelOpen(true)}
                    className='fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-white p-2 rounded-full shadow-lg cursor-pointer'
                >
                    <i className='ri-arrow-up-s-line text-3xl'></i>
                </div>
            )}
            <div ref={confirmRidePanelRef} className='fixed w-full z-30 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
                <ConfirmRide
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}

                    setConfirmRidePanel={setConfirmRidePanel} setVehicleFound={setVehicleFound} setDriverMarker={setDriverMarker} />
            </div>
            <div ref={vehicleFoundRef} className='fixed w-full z-30 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
                <LookingForDriver
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    setVehicleFound={setVehicleFound} />
            </div>
            <div ref={waitingForDriverRef} className='fixed w-full z-30 bottom-0 bg-white px-3 py-6 pt-12'>
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