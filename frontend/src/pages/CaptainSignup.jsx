import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom' 
import {CaptainDataContext} from '../context/CaptainContext'
import {useNavigate} from 'react-router-dom'
import axios from 'axios';


const CaptainSignup = () => {

const navigate = useNavigate();


   const[email,setEmail]=useState('')
    const [password, setPassword] = useState('')
    const [firstname, setfirstname] = useState('')
    const [lastname, setlastname] = useState('')
    const [ vehicleColor, setVehicleColor ] = useState('')
  const [ vehiclePlate, setVehiclePlate ] = useState('')
  const [ vehicleCapacity, setVehicleCapacity ] = useState('')
  const [ vehicleType, setVehicleType ] = useState('')



  const {captain, setCaptain} = React.useContext(CaptainDataContext)



    const handleSubmit= async (e)=>{
      e.preventDefault();
      const captainData={
       fullname:{
        firstname: firstname,
        lastname: lastname
       },
       email: email,
       password: password,
        vehicle: {
          color: vehicleColor,
          plate: vehiclePlate,
          capacity: vehicleCapacity,
          vehicleType: vehicleType
        }
  
      };
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/captains/register`, captainData) 
      if(response.status === 201){
        const data = response.data;
        setCaptain(data.captain);
        localStorage.setItem('token', data.token);
        navigate('/captain-home');
      }
       
      setEmail('')
      setPassword('')
      setfirstname('')
      setlastname('')
      setVehicleColor('')
      setVehiclePlate('')
      setVehicleCapacity('')
      setVehicleType('')
    }
  return (
     <div className=' py-5 px-5 p-7 h-screen flex flex-col justify-between'>
      <div>
<img className=' w-16 mb-10'src="https://www.svgrepo.com/show/505031/uber-driver.svg" alt="uber" />
      <form onSubmit={(e)=>handleSubmit(e)} 
      className='bg-white pb-7 py-4 px-4'>
        <h3 className='text-lg w-full font-medium mb-2'>What's our Captain's  Name</h3>
        <div className='flex gap-4 mb-5'>
           <input required 
       value={firstname}
       onChange={(e)=>setfirstname(e.target.value)}

        className='bg-[#eeeeee] w-1/2  rounded px-4 py-2 border  text-lg placeholder:text-base'
        type="text" placeholder="First name" />
         <input required 
       value={lastname}
       onChange={(e)=>setlastname(e.target.value)}


        className='bg-[#eeeeee] w-1/2 rounded px-4 py-2 border text-lg placeholder:text-base'
        type="text" placeholder="Last name" />
        </div>
        <h3 className='text-lg font-medium mb-2'>What's our Captain's email</h3>
        <input required 
         value={email}
       onChange={(e)=>setEmail(e.target.value)}

        className='bg-[#eeeeee] mb-5 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
        type="text" placeholder="email@example.com" />
        <h3 className='text-lg font-mediummb-2'>Enter your password</h3>
        <input required
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
       

       
        className='bg-[#eeeeee] mb-5 rounded px-4 py-2 border w-full text-lg placeholder:text-base'
        type="password" placeholder="password" />
      
      <h3 className='text-lg font-medium mb-2'>Vehicle Information</h3>
          <div className='flex gap-4 mb-7'>
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              type="text"
              placeholder='Vehicle Color'
              value={vehicleColor}
              onChange={(e) => {
                setVehicleColor(e.target.value)
              }}
            />
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              type="text"
              placeholder='Vehicle Plate'
              value={vehiclePlate}
              onChange={(e) => {
                setVehiclePlate(e.target.value)
              }}
            />
          </div>
          <div className='flex gap-4 mb-7'>
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              type="number"
              placeholder='Vehicle Capacity'
              value={vehicleCapacity}
              onChange={(e) => {
                setVehicleCapacity(e.target.value)
              }}
            />
            <select
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-lg placeholder:text-base'
              value={vehicleType}
              onChange={(e) => {
                setVehicleType(e.target.value)
              }}
            >
              <option value="" disabled>Select Vehicle Type</option>
              <option value="car">Car</option>
              <option value="auto">Auto</option>
              <option value="moto">Moto</option>
            </select>
          </div>

        <button className='bg-[#111]  text-white font-semibold mb-7 rounded px-4 py-2  w-full text-lg placeholder:text-base'>Create Captain Account</button>
     <p>Already have a account?
      <Link to='/captain-login' className='text-blue-600'>Login here</Link>
      </p>
      </form>
      </div>
      
      <div>
      
         <p className='text-[10px] leading-tight'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy
            Policy</span> and <span className='underline'>Terms of Service apply</span>.</p>
    
      </div>
    </div>
  )
}

export default CaptainSignup