import './RoomItem.css'

function RoomItem({name, floor, capacity, availability}){
    return(
        <div className='room-card'>
            <div className="card-header">
                <h2 className='room-name'>{name}</h2>
                <p className='room-floor'>{floor} этаж</p>
            </div>
            <div className="room-stats">
                <p className='room-capacity'>Вместимость до: {capacity} человек</p>
                <p className='room-time'>Занята до </p>
            </div>
            <div className="availability-bar">
                <span className='availability-circle'></span>
                <p className='availability-text'>Недоступно на выбранное время</p>
            </div>
            <div className="card-actions">
                <button className='btn-knowMore'>Подробнее</button>
                <button className='btn-book'>Забронировать</button>
            </div>
        </div>
    )
}

export default RoomItem;