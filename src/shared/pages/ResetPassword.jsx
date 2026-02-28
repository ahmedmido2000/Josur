import React from 'react'
import Navbar from '../components/Navbar'
import ResetPasswordMain from '../components/ResetPasswordMain'

const ResetPassword = () => {
    return (
        <div>
            <div className="login-container position-relative">
                <div className="login-overlay"></div>
                <Navbar />
                <div className="d-flex justify-content-center align-items-center login-padding">
                    <ResetPasswordMain />
                </div>
            </div>
        </div>
    )
}

export default ResetPassword
