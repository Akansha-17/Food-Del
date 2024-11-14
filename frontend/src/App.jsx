import React, { useState } from 'react'
import Navbar from './Components/Navbar/Navbar'
import { Routes ,Route} from 'react-router-dom'
import Home from './Pages/Home/Home'
import PlaceOrder from './Pages/PlaceOrder/PlaceOrder'
import Cart from './Pages/Cart/Cart'
import Footer from './Components/Footer/Footer'
import LoginPopUp from './Components/LogInPopup/loginpopup'

const App = () => {
  const [showLogin,setshowLogin] = useState(false)

  return (
      <>
      {showLogin?<LoginPopUp setshowLogin={setshowLogin} />:<></>}
        <div className ='app'>
          <Navbar setshowLogin={setshowLogin}/>
          <Routes>
            <Route path='/' element = {<Home/>} />
            <Route path='/cart' element = {<Cart/> } />
            <Route path='/order' element = {<PlaceOrder/>} />
          </Routes>
        </div>
        <Footer/>
      </>
  )
}

export default App
