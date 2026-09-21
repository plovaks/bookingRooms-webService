import { Link } from 'react-router';
import './RoomItem.css'

function RoomItem({id,name, floor, capacity, availability, busyUntil, officeName}){
    const isAvailable = availability ?? true;

    return(
        <div className={`room-card ${!isAvailable ? "room-card-disabled" : ""}`}>
            <div className="card-header">
                <h2 className='room-name'>{name}</h2>
                <p className='room-floor'>{floor} этаж</p>
            </div>
            <div className="room-stats">
                <p className='room-capacity'>Вместимость до: {capacity} человек</p>
                {busyUntil && <p className='room-time'>Занята до {busyUntil}</p>}
            </div>
            <div className="availability-bar">
                <span className='availability-circle'></span>
                <p className='availability-text'>{isAvailable ? "Доступно на выбранное время" : "Недоступно на выбранное время"}</p>
            </div>
            <div className="card-actions">
                <Link
                    className='More'
                    to={`/rooms/${id}`}
                >
                    Подробнее
                </Link>
                
                <button 
                    className='btn-book'
                    
                >
                        Забронировать
                </button>
            </div>

            
        </div>
    )
}

export default RoomItem;