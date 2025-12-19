import React from 'react';
import {Link} from 'react-router-dom'; 

const start = () => {
return (
    <div>
    <div className="h-screen w-full flex justify-between flex-col pt-8 bg-[url('https://images.unsplash.com/photo-1593950315186-76a92975b60c?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center bg-no-repeat">

        <img className='w-16 ml-8'
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Uber_logo_2018.svg/2560px-Uber_logo_2018.svg.png"
        alt="Uber Logo"
        />
        <div className='bg-white pb-7 py-4 px-4'>
        <h2 className='text-3xl font-bold'>Get Started with Uber</h2>
        <Link to='/login' className='flex items-center justify-center w-full bg-black text-white py-3 rounded mt-5'>Continue</Link>
        </div>
    </div>
    </div>
);
};

export default start;
