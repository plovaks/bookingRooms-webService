import { useState } from 'react';
import './BookingCard.css'
import roomIcon from "../../assets/roomIcon.svg"
import Skeleton from 'react-loading-skeleton';
import CancelBooking from '../Modals/CancelBooking';

function BookingCard({title, startsAt, roomName, floor, duration, loading, isPast}){
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

    function formatDate(date){
        const newDate = new Date(date);
        return (newDate.toLocaleString('ru-RU', {day:'numeric', month:'long'})).split(' ');
    }
    return(
        <div className="booking-card">
            <div className="booking-date">
                <p className='month'>{loading? <Skeleton width={48} height={10}/> : formatDate(startsAt)[1].toUpperCase()}</p>
                <p className='date'>{loading? <Skeleton width={32} height={24}/> :formatDate(startsAt)[0]}</p>
            </div>
            <div className="booking-info">
                <h3 className="booking-title">{loading? <Skeleton width={400} height={18}/> : title}</h3>
                <div className="booking-room">
                     {loading ? <Skeleton width={100} height={14}/> : (
                        <span className='roomName'>
                            <img src={roomIcon} alt="room icon" />
                            {roomName}
                        </span>
                     )}
                    <span className='greyCircle'></span>
                    <span>{loading ? <Skeleton width={80} height={14}/> : `${floor} этаж`} </span>
                    <span className='greyCircle'></span>
                    <span>{loading ? <Skeleton width={160} height={14}/> : duration}</span>
                </div>
            </div>
            {!isPast && (
                <button 
                    className="btn-cancelBooking"
                    onClick={() => setIsCancelModalOpen(true)}
                >
                        {loading ? <Skeleton width={100} height={38}/> : 'Отменить'}
                </button>
            )}
            
        </div>
    )
}

export default BookingCard;