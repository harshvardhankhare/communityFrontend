import React from 'react'
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home/Home';
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register';
 import FeedPage from './pages/FeedPage/FeedPage';
 import Profile from './pages/Profile/Profile'
// import DirectMessage from './Components/DirectMessage/DirectMessage'
// import AskQuestion from './Components/AskQuestion/AskQuestion'
// import Notification from './Components/Notification/Notification'
// import UpdateProfile from './pages/Update-Profile/UpdateProfile'

// import Test from './Components/Test/Test'
// import ViewProfile from './Components/ViewProfile/ViewProfile'

const App = () => {
  return (
    <div>
      <Toaster  />

      <Routes>
         
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
         <Route path='/feed' element={<FeedPage />} />
          <Route path='/register' element={<Register />} />

       <Route path='/profile' element={<Profile />} />
       {/* <Route path='/directmessage' element={<DirectMessage />} />
        <Route path='/ask' element={<AskQuestion />} />
        <Route path='/notifications' element={<Notification />} />
         <Route path='/editprofile' element={<UpdateProfile />} />
         <Route path='/test' element={<Test />} />
         <Route path="/profile/:id" element={<ViewProfile />} /> */}




      </Routes>


    </div>

  )
}

export default App