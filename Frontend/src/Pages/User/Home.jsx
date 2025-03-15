import React from 'react'
import Navbar from '../../Components/Navbar'
import Footer from '../../Components/Footer'
import Header from '../../Components/Header'
import FeatureDetails from '../../Components/FeatureDetails'
import Meetings from './Meetings'

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
