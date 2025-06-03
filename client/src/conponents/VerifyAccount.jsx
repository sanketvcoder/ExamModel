import React, { useEffect, useState } from 'react'

import { useNavigate} from 'react-router-dom'

import axios from 'axios'

const VerifyAccount = () => {
    const navigate = useNavigate();
    const sendVerificationOtp = async()=>{
        try {
            const res = await axios.post(
                'http://127.0.0.1:5001/api/auth/send-verify-otp',
                {},
                { withCredentials: true }
            )
    
            if(res.status === 200){
                navigate('/verify-account')
            }
            
        } catch (error) {
            console.error(error);
            alert('Failed to send OTP.');
        }
    }

    useEffect(()=>{
        sendVerificationOtp();
    },[])
  return (
    <div style={{ padding: '2rem' }}>
        <h2>Enter the OTP sent to your email</h2>
    </div>
  )
}

export default VerifyAccount
