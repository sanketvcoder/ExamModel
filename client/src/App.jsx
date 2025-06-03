import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './conponents/login';
import Dashboard from './conponents/Dashboard';
import VerifyAccount from './conponents/VerifyAccount';
import Verify from './conponents/Verify';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path= "/verify-account" element={<Verify/>} />
        <Route path= "/send-otp-mail" element={<VerifyAccount/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
