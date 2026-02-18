import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Why from '../components/Why'
import RequestMechanism from '../components/RequestMechanism'
import Services from '../components/Services'
import Trucks from '../components/Trucks'
import TruckDriver from '../components/TruckDriver'
import Parteners from '../components/Parteners'
import DownloadApp from '../components/DownloadApp'
import Footer from '../components/Footer'
const Home = () => {
  return (
    <div>
      <div className="home-container position-relative">
        <Navbar />
        <Hero />
      </div>
        <Why />
        <RequestMechanism />
        <Services />
        <Trucks />
        <TruckDriver />
        <Parteners />
        <DownloadApp />
        <Footer />
    </div>
  )
}

export default Home
