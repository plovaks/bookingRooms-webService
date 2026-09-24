import React from "react";
import * as Dialog from '@radix-ui/react-dialog';
import './CancelBooking.css'

function CancelBooking({bookingTitle, roomName, roomFloor, bookingDate}){
    return(
        <div className="cancel-booking">
            <div className="cancel-booking__heder">
                <h2>Отменить бронирование?</h2>
                <p>Это действие нельзя будет отменить. Освободившееся время станет доступно другим сотрудникам.</p>
            </div>
            <div className="cancel-booking__main">
                <h3>{bookingTitle}</h3>
                <div>
                    <p>Комната '{roomName}', {roomFloor} этаж</p>
                    <p>{bookingDate}</p>
                </div>
            </div>
            <div className="cancel-booking__actions"></div>
        </div>
    )
}

export default CancelBooking;