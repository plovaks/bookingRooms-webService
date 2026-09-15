import './BookingModal.css'

function BookingModal({roomId}){
    return(
        <div className='modal-overlay'>
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Новое бронирование</h2>
                    <p>Переговорная: <span className='room-name'>{roomId.name}</span> ({roomId.office?.name}, {roomId.floor} этаж)</p>
                </div>
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
                            type="textarea" 
                            placeholder='Дополнительная информация для участников встречи...'
                        >
                        </textarea>
                            
                        
                    </div>
                </form>
            </div>
        </div>
    )
}

export default BookingModal;