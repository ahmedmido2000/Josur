import React from 'react'
import Navbar from '../components/Navbar'
import ForgotPasswordMain from '../components/ForgotPasswordMain'

const ForgotPassword = () => {
    return (
        <div>
            <div className="login-container position-relative">
                <div className="login-overlay"></div>
                <Navbar />
                <div className="d-flex justify-content-center align-items-center login-padding">
                    <ForgotPasswordMain />
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
