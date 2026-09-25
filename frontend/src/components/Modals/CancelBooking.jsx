import React from "react";
import * as Dialog from '@radix-ui/react-dialog';
import './CancelBooking.css'
import calendarIcon from "../../assets/calendarIcon.svg"
import roomIcon from "../../assets/roomIcon.svg"


function CancelBooking({bookingTitle, roomName, roomFloor, bookingDate, onClose, onCancelBooking}){

    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('cancel-booking-overlay')){
            onClose();
        }
    }

    return(
        <div className="cancel-booking-overlay" onClick={handleOverlayClick}>
            <div className="cancel-booking-content">
                <div className="cancel-booking__heder">
                    <h2>Отменить бронирование?</h2>
                    <p>Это действие нельзя будет отменить. Освободившееся время станет доступно другим сотрудникам.</p>
                </div>
                <div className="cancel-booking__main">
                    <h3>{bookingTitle}</h3>
                    <div className="cancel-info">
                        <p >
                            <img src={roomIcon} alt="room icon" />
                            <span>Комната '{roomName}', {roomFloor} этаж</span>
                            
                        </p>
                        <p>
                            <img src={calendarIcon} alt="calenadr icon" />
                            <span>{bookingDate}</span>
                            
                        </p>
                    </div>
                </div>
                <div className="cancel-booking__actions">
                    <button 
                        onClick={onClose}
                    >
                        Нет, оставить
                    </button>
                    <button
                        onClick={onCancelBooking}
                    >
                        Да, отменить
                    </button>
                </div>
            </div>
        </div>
        
    )
}

export default CancelBooking;