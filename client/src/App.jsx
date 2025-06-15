import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './conponents/login';
import Dashboard from './conponents/Dashboard';
import Verify from './conponents/Verify';
import CreateProfile from './conponents/CreateProfile';
import ShowProfile from './conponents/ShowProfile';
import Sign from './conponents/Sign';
import ForgotPassword from './conponents/ForgotPassword';
import Assessment from './conponents/Assessment';
import AttendTest from './conponents/AttendTest'; // ✅ Add this import
import EditQuestions from './conponents/EditQuestions';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/sign-in" element={<Sign />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/verify-account" element={<Verify />} />
        <Route path="/create-profile" element={<CreateProfile />} />
        <Route path="/get-Profile" element={<ShowProfile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/create-test" element={<Assessment />} />
        <Route path="/attend-test/:testId" element={<AttendTest />} /> 
        <Route path="/edit-test/:testId" element={<EditQuestions/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
