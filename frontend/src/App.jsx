import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from "./pages/home";
import Start from "./pages/start";
import UserLogin from "./pages/UserLogin"; 
import UserSignup from "./pages/UserSignup";
import Captainlogin from "./pages/Captainlogin";
import CaptainSignup from "./pages/CaptainSignup";
import UserProtectWrapper from './pages/UserProtectWrapper';
import UserLogout from './pages/UserLogout';
import CaptainHome from './pages/CaptainHome';
import CaptainProtectWrapper from './pages/CaptainProtectWrapper';
import CaptainLogout from './pages/CaptainLogout';
import Riding from './pages/Riding';
import CaptainRiding from './pages/CaptainRiding';



const App = () => {
  return (
    <div >
      <Routes>
        <Route path='/' element={<Start />} />
        <Route path='/login' element={<UserLogin />} />
        <Route path='/riding' element={<Riding />} />
        <Route path='/captain-riding' element={<CaptainRiding />} />
        <Route path='/signup' element={<UserSignup />} />
        <Route path='/captainlogin' element={<Captainlogin />} />
        <Route path='/captainSignup' element={<CaptainSignup />} />
        <Route path='/home' element={
          <UserProtectWrapper>
            <Home />
          </UserProtectWrapper>}  />
< Route path='/users/logout' element={<UserProtectWrapper>
              <UserLogout />
</UserProtectWrapper>
        } />
        <Route path='/captain-home' element=
        { 
        <CaptainProtectWrapper>
          <CaptainHome />
        </CaptainProtectWrapper>
        } />
        < Route path='/captains/logout' element={<CaptainProtectWrapper>
              <CaptainLogout />
</CaptainProtectWrapper>
        } />
      </Routes>
    </div>
  );
};

export default App;

