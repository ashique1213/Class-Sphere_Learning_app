import React from 'react'
import Navbar from '../../Components/Layouts/Navbar'
import Footer from '../../Components/Layouts/Footer'
import Header from '../../Components/Layouts/Header'
import FeatureDetails from '../../Components/Layouts/FeatureDetails'

const Home = () => {
  return (
    <div>
      <Navbar />
      <Header />
      <FeatureDetails/>
      <Footer/>
    </div>
  )
}

export default Home
