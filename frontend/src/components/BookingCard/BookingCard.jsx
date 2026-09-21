
import './BookingCard.css'

function BookingCard({title, startsAt, roomName}){

    function formatDate(date){
        const newDate = new Date(date);
        return (newDate.toLocaleString('ru-RU', {day:'numeric', month:'long'})).split(' ');
    }
    return(
        <div className="booking-card">
            <div className="booking-date">
                <p className='month'>{formatDate(startsAt)[1].toUpperCase()}</p>
                <p className='date'>{formatDate(startsAt)[0]}</p>
            </div>
            <div className="booking-info">
                <h3 className="booking-title">{title}</h3>
                <div className="booking-room">
                    <p className='roomName'>{roomName}</p>
                </div>
            </div>
            <button className="btn-cancelBooking">Отменить</button>
        </div>
    )
}

export default BookingCard;