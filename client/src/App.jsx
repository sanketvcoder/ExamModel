import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './conponents/login';
import Dashboard from './conponents/Dashboard';
import Verify from './conponents/Verify'; // Now handles both send + verify
import CreateProfile from './conponents/CreateProfile';
import ShowProfile from './conponents/ShowProfile';
import Sign from './conponents/Sign';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/sign-in" element={<Sign/>} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/verify-account" element={<Verify />} />
        <Route path="/create-profile" element={<CreateProfile/>} />
        <Route path="/get-Profile" element={<ShowProfile/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
