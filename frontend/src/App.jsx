import { Route, Routes } from 'react-router'
import './App.css'
import Booking from './pages/Booking'
import RoomId from './pages/RoomId/RoomId'
import NotFound from './pages/NotFound'
import Rooms from './pages/Rooms'
import Navbar from './components/Navbar'

function App() {
  
  return (
    <>
      <Navbar/>
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
