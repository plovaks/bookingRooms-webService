import { useState } from 'react';
import './BookingModal.css'
import infoIcon from "../../assets/info.svg"
import errorImg from "../../assets/roomsErrorAlert.svg"
function BookingModal({roomId, onClose}){
    // стейт для баннера брони
    const [isBookingInfo, setIsBookingInfo] = useState(true);
    // стейт для состояния модалки
    const [status, setStatus] = useState('form');

    const handleOverlayClick = (e) =>
    {
        if (e.target.className === 'modal-overlay'){
            onClose();
        }
    }
    return(
        <div className='modal-overlay' onClick={handleOverlayClick}>
            <div className="modal-content">
                {status === 'form' ? (
                    <>
                        <div className="modal-header">
                    <h2>Новое бронирование</h2>
                    <p>Переговорная: <span className='room-name'>{roomId.name}</span> ({roomId.office?.name}, {roomId.floor} этаж)</p>
                        </div>
                        <div className='form-line'></div>
                        <form className='booking-form'>
                            <div className="form-field">
                                <label htmlFor="textTheme" >Тема встречи*</label>
                                <input type="text" id='textTheme' required/>
                            </div>
                            <div className="form-field-time">
                                <div className="form-date">
                                    <label htmlFor="formDate">Дата</label>
                                    <input type="date" id='formDate'/>
                                </div>
                                <div className="form-time">
                                    <label htmlFor="formTime">Время</label>
                                    <input type="time" id='formTime'/>
                                </div>
                            </div>
                            <div className="form-field">
                                <label htmlFor="duration">Продолжиельность</label>
                                <input type="text" id='duration'/>
                            </div>
                            <div className="form-field">
                                <label htmlFor="comments">Комментарии</label>
                                <textarea
                                    id='comments'
                                    placeholder='Дополнительная информация для участников встречи...'
                                >
                                </textarea>
                                    
                                
                            </div>
                            {isBookingInfo && (
                                <div className="summary-banner">
                                    <img src={infoIcon} alt='info icon' />
                                    <p>Бронирование на Четверг, 24 Октября, 15:00 - 16:00 (1 час)</p>
                                </div>
                            )}
                            
                            <div className="form-actions">
                                <button className='btn-cancel-booking' type='button'>Отмена</button>
                                <button className='button-green btn-book-room'>Забронировать</button>
                            </div>
                        </form>
                    </>
                    
                ) : (
                    <div className='already-booked-container'>
                        <img src={errorImg} alt="error img" />
                        <h2>Время уже занято</h2>
                        <p>Выбранный интервал был забронирован другим сотрудником. Расписание обновлено.</p>
                        <button className='button-green btn-choseTime'>Выбрать другое время</button>
                    </div>
                )
            }
                
            </div>
        </div>
    )
}

export default BookingModal;