import { useEffect, useState } from "react";

import BookingCard from "../components/BookingCard/BookingCard";

function Booking(){
    const serverUrl = import.meta.env.VITE_API_URL;
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const loadBookings = async() => {
            try {
                const res = await fetch(`${serverUrl}/api/v1/bookings`);

                if(!res.ok){
                    throw new Error ('ошибка обращения к url бронирований')
                }

                const data = await res.json();
                setBookings(data.items)
                
            } catch (error) {
                console.error('ошибка получения бронирований: ', error.status)
            }
        }

        loadBookings();
    }, [serverUrl]) 

    return (
        <div className="my-bookings">
            {bookings.map(booking => (
                <BookingCard 
                    key={booking.id}
                    title={booking.title}
                    startsAt={booking.startsAt}
                    roomName={booking.room?.name}
                />
            ))}
        </div>
    )
}

export default Booking;