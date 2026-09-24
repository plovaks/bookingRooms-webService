import { Route, Routes } from 'react-router'
import './App.css'
import Booking from './pages/Booking/Booking'
import RoomId from './pages/RoomId/RoomId'
import NotFound from './pages/NotFound'
import Rooms from './pages/Rooms/Rooms'
import Navbar from './components/Navbar'
import { Toaster } from 'react-hot-toast'

function App() {
  
  return (
    <>
      <Navbar/>
      <Toaster/>
      <Routes>
        <Route path="/" element={<Rooms/>}/>
        <Route path="/rooms/:id" element={<RoomId/>}/>
        <Route path="/bookings" element={<Booking/>}/>
        <Route path="*" element={<NotFound/>}/>
      </Routes>
    </>
    
  )
}

export default App
