import React, { useState } from 'react';
import{ Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CaptainDataContext } from '../context/CapatainContext';


const Captainlogin = () => {
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');

        const { captain , setCaptain } = React.useContext(CaptainDataContext);
        const navigate = useNavigate()
        const submitHandler = async (e) => {
            e.preventDefault();
            const captainData = {
                email: email,
                password: password,
            }
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`, captainData)
            if (response.status === 200) {
                const data = response.data;
                setCaptain(data.captain);
                localStorage.setItem('token', data.token);
                navigate('/captain-home');
            }

            setEmail('');
            setPassword('');
    
        }
return (
    <div className='p-7 h-screen flex flex-col justify-between'>
        <div>
            <img className='w-20 mb-2'
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSVCO4w_adxK32rCXFeKq3_NbLcR9b_js14w&s"
        alt="Uber Logo"
        />
    <form onSubmit = {(e)=> {submitHandler(e)} } >
    <h3 className='text-lg mb-2 font-medium'>What's your email</h3>
    <input
    type="email" 
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className='bg-[#eeeeee] rounded px-4 py-2 border w-full text-lg placeholder:text-base'
    placeholder="email@example.com" 
    required />

    <h3 className='text-lg font-medium mb-2'>Enter password</h3>

    <input 
    type="password" 
    placeholder="password"
    className='bg-[#eeeeee] rounded px-4 py-2 border w-full text-lg placeholder:text-base' 
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required />
    <button 
    className='mt-4 bg-[#111] text-white rounded px-4 py-2 font-semibold mb-3 w-full text-lg placeholder:text-base'
    >Login</button>

    <p className='text-center'>Join a fleet? <Link to ='/captainsignup' className='text-blue-600'>Register as a Captain</Link></p>
    
    </form>
        </div>
        <div>
            <Link to = '/login'
            className='mt-4 flex items-center justify-center bg-[#d5622d] text-white rounded px-4 py-2 font-semibold mb-5 w-full text-lg placeholder:text-base'
            >Sign in as User</Link>
        </div>
    </div>
);
}
export default Captainlogin;
