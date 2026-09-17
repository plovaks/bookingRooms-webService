import { useState } from 'react';
import './BookingModal.css'
import infoIcon from "../../assets/info.svg"
import errorImg from "../../assets/roomsErrorAlert.svg"
import DatePicker from 'react-datepicker';
import {toast} from "react-hot-toast"
import { registerLocale } from "react-datepicker";
import { ru } from 'date-fns/locale/ru';
import 'react-datepicker/dist/react-datepicker.css'; 
registerLocale('ru', ru);
 

function BookingModal({roomId, onClose}){

    const serverUrl = import.meta.env.VITE_API_URL;

    const [startDate, setStartDate] = useState(new Date());
    const maxBookingDate = new Date();
    maxBookingDate.setDate(maxBookingDate.getDate() + 30);

    // стейт для баннера брони
    const [isBookingInfo, setIsBookingInfo] = useState(true);
    // стейт для состояния модалки
    const [status, setStatus] = useState('form');
    // состояние для ввода темы 
    const [theme, setTheme] = useState('');
    const [themeError, setThemeError] = useState(false);
    // состояние для времени 
    const [time, setTime] =useState('');
    // стейт для длительности
    const [duration, setDuration] = useState(null); 
    const [durationOpen, setDurationOpen] = useState(false);
    // состояние для комментария
    const [comment, setComment] = useState('');
    // стейт для тоста об успешной брони
    const [bookingInfo, setBookingInfo] = useState('');
    

    const handleOverlayClick = (e) =>
    {
        if (e.target.className === 'modal-overlay'){
            onClose();
        }
    }

    // функция для обработки отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();

        if(theme.trim() === ''){
            setThemeError(true);
            return;
        }
        setThemeError(false);


        if(!time || !duration){
            alert('Пожалуйста, выберите время и продолжительность встречи')
            return
        }

        const [hours, minutes] = time.split(':').map(Number);

        const startDateTime = new Date(startDate);
        startDateTime.setHours(hours, minutes, 0, 0);

        const endTimeDate = new Date(startDateTime);
        endTimeDate.setMinutes(endTimeDate.getMinutes() + duration);

        const bookingData = {
            "roomId": roomId.id,
            "title": theme,
            "comment": comment,
            "startsAt": startDateTime.toISOString(),
            "endsAt": endTimeDate.toISOString()
        }

        try {
            const res = await fetch(`${serverUrl}/api/v1/bookings`, {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookingData)
            })

            const result = await res.json();

            if (result.ok){
                setBookingInfo(`${roomId.name}, ${formatSelectedDate(startDate)}`)
                toast.success();
                onClose();
                
            }else if (result.status === 409){
                setStatus('already-booked')
            }else{
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error?.message || 'Не удалось забронировать');
            }
            
        } catch (error) {
            console.log(`Ошибка при отправке формы ${error}`)
        }
    }

    const handleTimeChange = (e) => {
        let input = e.target.value.replace(/\D/g, ""); 
        
        if (input.length > 4) { input = input.substring(0, 4); }
        
        if (input.length >= 2) { 
            let hours = parseInt(input.substring(0,2), 10);
            if (hours > 19) hours = 19; 
            input = String(hours).padStart(2, '0') + input.substring(2);
        }

        if (input.length > 2) {
            let minutesStr = input.substring(2); 
            if (parseInt(minutesStr[0], 10) > 5) {
                minutesStr = "5" + minutesStr.substring(1);
            }

            if (minutesStr.length === 2) {
                let fullMinutes = parseInt(minutesStr, 10);
                if (fullMinutes > 59) minutesStr = "59";
            }
            input = input.substring(0, 2) + ":" + minutesStr;
        }
        
        setTime(input);
    }

    const handleTimeBlur = () => {
        if (!time) return;
        
        let [hours, minutes] = time.split(':');
        
        if (hours) {
            let hoursNum = parseInt(hours, 10);
            if (hoursNum > 19) hoursNum = 19;
            hours = String(hoursNum).padStart(2, '0');
        } else {
            hours = '00';
        }

        if (minutes) {
            if (minutes.length === 1) {
                minutes = minutes + '0'; 
            }
            if (parseInt(minutes, 10) > 59) minutes = '59';
        } else {
            minutes = '00';
        }

        setTime(`${hours}:${minutes}`);
    };

    // генерация длительности
    const getAvailableDurations = () => {
        if (!time || time.length < 5) return [];

        const [hours, minutes] = time.split(':').map(Number);
        const startTotalMinutes = hours * 60 + minutes;
        const endDayMinutes = 20 * 60; 

        const maxAvailableMinutes = endDayMinutes - startTotalMinutes;
        if (maxAvailableMinutes <= 0) return [];

        const list = [];
        const limit = Math.min(maxAvailableMinutes, 300); 

        for (let mins = 15; mins <= limit; mins += 15) {
            const endTotal = startTotalMinutes + mins;
            const endHours = Math.floor(endTotal / 60);
            const endMins = endTotal % 60;
            const formattedEndTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;

            let durationLabel = '';
            if (mins < 60) {
                durationLabel = `${mins} мин`;
            } else {
                const h = Math.floor(mins / 60);
                const m = mins % 60;
                durationLabel = m === 0 ? `${h} час` : `${h} ч ${m} мин`;
            }

            list.push({
                mins: mins,
                label: `${durationLabel} (до ${formattedEndTime})`
            });
        }
        return list;
    };

    const availableDurations = getAvailableDurations();

    const getSelectedDurationLabel = () => {
        const selectedItem = availableDurations.find(item => item.mins === duration);
        return selectedItem ? selectedItem.label : "Выберите продолжительность";
    };

    const formatSelectedDate = (date) => {
      if (!date) return '';
  
        const dayNameRaw = new Intl.DateTimeFormat('ru-RU', { weekday: 'long' }).format(date);
        const dayName = dayNameRaw.charAt(0).toUpperCase() + dayNameRaw.slice(1);
        const dateAndMonth = new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long' }).format(date);

        return `${dayName}, ${dateAndMonth}`;
    };

    const getBannerTimeText = () => {
        if (!time || !duration) return '';
        
        const selectedItem = availableDurations.find(item => item.mins === duration);
        if (!selectedItem) return '';

        const endTimeMatch = selectedItem.label.match(/до (\d{2}:\d{2})/);
        const endTime = endTimeMatch ? endTimeMatch[1] : '';
        
        const durationText = selectedItem.label.split(' (')[0];

        return `, ${time} - ${endTime} (${durationText})`;
    };

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
                        <form className='booking-form' onSubmit={handleSubmit}>
                            <div className={`form-field ${themeError ? "has-error" : ""}`}>
                                <label htmlFor="textTheme" >Тема встречи*</label>
                                <input 
                                    type="text" 
                                    id='textTheme' 
                                    placeholder='Укажите тему встречи'
                                    value={theme}
                                    onChange={(e) => {
                                        setTheme(e.target.value);
                                        if(e.target.value.trim()!== '') setThemeError(false);
                                    }}
                                />
                                {themeError && <span className='error-message'>Обязательное поле</span>}
                            </div>
                            <div className="form-field-time">
                                <div className="form-date">
                                    <label htmlFor="calendar">Дата</label>
                                    <div className="datepicker-wrapper">
                                        <DatePicker
                                            id="calendar"
                                            selected={startDate}
                                            onChange={(date) => setStartDate(date)}
                                            dateFormat="d MMMM, eeeeee" 
                                            locale="ru"
                                            minDate={new Date()}
                                            maxDate={maxBookingDate}
                                            className="calendar-input"
                                            showPopperArrow={false}
                                            placeholderText="Выберите дату"
                                        />
                                    </div>
                                </div>
                                <div className="form-time">
                                    <label htmlFor="time-picker">Время</label>
                                    <div className="time-input-wrapper">
                                        <input 
                                            type="text" 
                                            id="time-picker" 
                                            name="time" 
                                            onChange={handleTimeChange}
                                            placeholder="--:--"
                                            value={time}
                                            className="time-input booking"
                                            onBlur={handleTimeBlur}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-field">
                                <label>Продолжительность</label>
                                <div className="select-custom-wrapper">
                                    <div 
                                        className={`select-custom ${durationOpen ? "open" : ""} ${!time ? "disabled" : ""}`} 
                                        onClick={() => time && setDurationOpen(!durationOpen)}
                                    >
                                        <span>{time ? getSelectedDurationLabel() : "Сначала выберите время начала"}</span>
                                        <div className="select-arrow"></div>
                                    </div>

                                    {durationOpen && availableDurations.length > 0 && (
                                        <div className="select-dropdown">
                                            {availableDurations.map((item) => (
                                                <div
                                                    key={item.mins}
                                                    className={`dropdown-item ${duration === item.mins ? "selected" : ""}`}
                                                    onClick={() => {
                                                        setDuration(item.mins); 
                                                        setDurationOpen(false);
                                                    }}
                                                >
                                                    {item.label}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="form-field">
                                <label htmlFor="comments">Комментарии</label>
                                <textarea
                                    id='comments'
                                    placeholder='Дополнительная информация для участников встречи...'
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                >
                                </textarea>
                                    
                                
                            </div>
                            {isBookingInfo && (
                                <div className="summary-banner">
                                    <img src={infoIcon} alt='info icon' />
                                    <p>Бронирование на {formatSelectedDate(startDate)} {getBannerTimeText()}</p>
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