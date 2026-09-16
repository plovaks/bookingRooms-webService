import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import './RoomDetail.css'
import calendarIcon from "../../assets/calendarIcon.svg"
import arrowRight from "../../assets/arrowRight.svg"
import errorImg from '../../assets/roomsErrorAlert.svg'

function RoomDetail({roomDetails, loading, shceduleError, onClick}){
    // дата для расписания
    const today = new Date();
    
    const currentDate = today.toLocaleString('ru-RU', {
        weekday: 'long',
        day: 'numeric',
        month:'long'
    }).replace(/^./, str => str.toUpperCase());

    const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

    if (loading) {
        return (
            <div className="room-detail">
                <div className="room-detail-header">
                    <Skeleton width={100} height={14} />
                    <img src={arrowRight} alt="right arrow" />
                    <Skeleton width={80} height={14} />
                    <img src={arrowRight} alt="right arrow" />
                    <Skeleton width={120} height={14} />
                </div>
                
                <div className="detail-columns">
                    {/* левая колонка */}
                    <div className="left-info-column">
                        <h2 className="room-info-name" style={{ margin: 0 }}>
                            <Skeleton width={160} height={24} />
                        </h2>
                        <p className="room-info-office" style={{ marginTop: '12px', marginBottom: '20px' }}>
                            <Skeleton width={240} height={14} />
                        </p>
                        <div className="room-info-line" style={{display:'block',backgroundColor: 'rgba(226, 232, 240, 1)', height: '1px' }}></div>
                        <ul className="room-info-features">
                            {[1, 2, 3, 4].map((item) => (
                                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                                    <Skeleton width="1rem" height="1rem" borderRadius={4} />
                                    <Skeleton width={342} height={14} />
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* правая колонка */}
                    <div className="right-schedule-column">
                        <div className="schedule__header">
                            <div className="schedule__header--date">
                                <div style={{ height: '24px', marginBottom: '4px' }}>
                                    <Skeleton width={200} height={20} />
                                </div>
                                <Skeleton width={140} height={14} />
                            </div>
                            <Skeleton width={140} height={39} borderRadius="0.5rem" />
                        </div>
                        <div className="timeline-container">
                            <div className="timeline-grid">
                                {timeSlots.map(time => (
                                    <div key={time} className="timeline-hour-row">
                                        <span className="timeline-hour-label">{time}</span>
                                        <div className="timeline-hour-line"></div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="schedule-action">
                            <Skeleton width={200} height={39} borderRadius="0.5rem" />
                        </div>
                    </div>
                </div>
            </div>
            
        )
    }
    return (
        <div className="room-detail">
            <div className="room-detail-header">
                <span>Переговорные</span>
                <img src={arrowRight} alt="right arrow" />
                <span>{roomDetails.office?.name}</span>
                <img src={arrowRight} alt="right arrow" />
                <span>Комната '{roomDetails.name}'</span>
            </div>
            <div className="detail-columns">
                <div className="left-info-column">
                    <h2 className="room-info-name">{roomDetails.name}</h2>
                    <p className="room-info-office">
                        {roomDetails?.office?.name}
                        <span className="info-office-circle"></span>
                        {roomDetails?.office?.address.split(',').slice(1)}
                    </p>
                    <ul className="room-info-features">
                        <li className="room-info-capacity">Вместимость: до {roomDetails.capacity} человек</li>
                        {roomDetails.features?.map(feature => (
                            <li 
                                key={feature.code}
                                className={`room-info-feature feature-${feature.code}`}
                            >
                                {feature.name}
                            </li>
                        ))}
                    </ul>
                </div>
                {shceduleError ? 
                     (
                        <div className='errorBlock'>
                            <img src={errorImg} alt="room error alert" />
                                <div className="text-group">
                                    <h2>Не удалось загрузить данные</h2>
                                    <p>Произошла ошибка при загрузке расписания переговорной</p>
                                </div>
                                <button className='button-green'>Попробовать снова</button>
                        </div>
                    ) 
                    : (
                        <div className="right-schedule-column">
                        <div className="schedule__header">
                            <div className="schedule__header--date">
                                <h3>Расписание на день</h3>
                                <p className="schedule-date">{currentDate}</p>
                            </div>
                            <button className="btn-choseDate">
                                <img src={calendarIcon} alt="calenadr icon" />
                                Выбрать дату
                            </button>
                        </div>
                        <div className="timeline-container">
                            <div className="timeline-grid">
                                {timeSlots.map(time => (
                                    <div key={time} className="timeline-hour-row">
                                        <span className="timeline-hour-label">{time}</span>
                                        <div className="timeline-hour-line"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="schedule-action">
                            <button
                                className={`button-green btn-book`}
                                onClick={onClick}
                            >
                                Забронировать переговорную
                            </button>
                        </div>
                    </div>
                    )
                }
                
            </div>
        </div>
    )
}

export default RoomDetail;