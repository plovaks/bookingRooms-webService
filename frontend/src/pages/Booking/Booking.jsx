import { useEffect, useState } from "react";
import { Link } from "react-router";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import BookingCard from "../../components/BookingCard/BookingCard";
import CancelBooking from "../../components/Modals/CancelBooking";
import './Booking.css'
import emptyBookings from "../../assets/emptyBookings.svg"
import errorBookings from "../../assets/roomsErrorAlert.svg"


function Booking(){
    const serverUrl = import.meta.env.VITE_API_URL;
    const [bookings, setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('upcoming');
    const [loading, setLoading] = useState(true);
    const [offices, setOffices] = useState([]);
    const [selectedOffice, setSelectedOffice] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('all');
    const [loadingError, setLoadingError] = useState(false);
    // счетчик попыток для перезагрузке
    const [retryCount, setRetryCount] = useState(0);
    const [bookingToCancel, setBookingToCancel] = useState(null);

    const today = new Date();

    // загрузка бронирований
    useEffect(() => {
        const loadBookings = async() => {
            setLoadingError(false);
            setLoading(true);

            try {
                const res = await fetch(`${serverUrl}/api/v1/bookings?scope=all` + (selectedOffice ? `&officeId=${selectedOffice}` : ''));
                if(!res.ok){
                    throw new Error ('ошибка обращения к url бронирований')
                }

                const data = await res.json();
                setBookings(data.items)
                
            } catch (error) {
                console.error('ошибка получения бронирований: ', error.status);
                setLoadingError(true);
            }
            finally{
                setLoading(false);
            }
        }

        loadBookings();
    }, [serverUrl, selectedOffice, retryCount]) 

    // загрузка офисов
    useEffect(() => {

        const loadOffices = async() => {
            setLoadingError(false);
            try {
                const res  = await fetch(`${serverUrl}/api/v1/offices`);
                if (!res.ok){
                    throw new Error('ошибка обращения к HTTP офисов');
                }

                const data = await res.json();
                setOffices(data.items);
            } catch (error) {
                console.error('ошибка получения офисов: ', error);
                setLoadingError(true);
            }finally{
                setLoading(false);
            }
        }
        loadOffices();
    }, [serverUrl])


    // удаление бронирования 

    const handleCancelBooking = async () => {
        if (!bookingToCancel) return;

        try {
            const res = await fetch(`${serverUrl}/api/v1/bookings/${bookingToCancel.id}`, {
                method: 'DELETE'
            });

            if (!res.ok) {
                throw new Error('Не удалось отменить бронирование');
            }

            setBookings(prevBookings => prevBookings.filter(b => b.id !== bookingToCancel.id));
            setBookingToCancel(null);
            
        } catch (error) {
            console.error('Ошибка при удалении:', error);
        }
    };


    function countDuration(startsAt, endsAt, timezone) {
        const start = new Date(startsAt);
        const end = new Date(endsAt);

        const options = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: timezone 
        };
        const formatter = new Intl.DateTimeFormat('ru-RU', options);
        const startFormatted = formatter.format(start);
        const endFormatted = formatter.format(end);

        const tzOptions = {
            timeZone: timezone,
            timeZoneName: 'short'
        };
        const tzFormatter = new Intl.DateTimeFormat('en-US', tzOptions);
        const tzParts = tzFormatter.formatToParts(start);
        let tzShort = tzParts.find(part => part.type === 'timeZoneName').value;

        if (tzShort === 'GMT+3' || tzShort === 'UTC+3' || timezone === 'Europe/Moscow') {
            tzShort = 'MSK';
        }

        return `${startFormatted} - ${endFormatted} ${tzShort}`;
    }

    const upComingBookings = bookings.filter(booking => new Date(booking.endsAt) >= today);
    const pastBookings = bookings.filter(booking => new Date(booking.endsAt) < today);

    let displayBookings = activeTab === 'upcoming' ? upComingBookings : pastBookings;

    if (selectedPeriod !== 'all') {
        const limitDate = new Date();
    
        if (selectedPeriod === 'week') {
            limitDate.setDate(today.getDate() - 7); 
        } else if (selectedPeriod === 'month') {
            limitDate.setMonth(today.getMonth() - 1); 
        }

        displayBookings = displayBookings.filter(booking => {
            const bookingDate = new Date(booking.startsAt);
        
            if (activeTab === 'past') {
                return bookingDate >= limitDate && bookingDate <= today;
            } else {
            
                const futureLimit = new Date();
                if (selectedPeriod === 'week') futureLimit.setDate(today.getDate() + 7);
                if (selectedPeriod === 'month') futureLimit.setMonth(today.getMonth() + 1);
                
                return bookingDate >= today && bookingDate <= futureLimit;
            }
        });
    }

    return (
        <div className="my-bookings">
            <div className="booking__header">
                <h2>
                    {loading ? <Skeleton width={300} height={36}/> : 'Мои бронирования'}
                </h2>
                <div className="header-filters">
                    {loading ? <Skeleton width={140} height={40}/> : (
                        <select 
                            name="office" 
                            id="office-select"
                            value={selectedOffice}
                            onChange={(e) => setSelectedOffice(e.target.value)}
                        >
                            <option value="">Все офисы</option>
                            {offices.map(office => (
                                <option
                                    key={office.id}
                                    value={office.id}
                                    className="office-option"
                                >
                                    {office.name}
                                </option>
                            ))}
                    </select>
                    )}
                    
                    <div>
                        {loading ? <Skeleton width={160} height={40}/> : (
                            <select 
                                name="period" 
                                id="period-select"
                                value={selectedPeriod}
                                onChange={(e) => setSelectedPeriod(e.target.value)}
                            >
                                <option value="all">За все время</option>
                                <option value="week">За неделю</option>
                                <option value="month">За месяц</option>
                            </select>
                        )}
                    </div>
                </div>
                
            </div>
            
            <div className="tabs-container">
                <button
                    className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
                    onClick={() => setActiveTab('upcoming')}
                >
                    {loading? <Skeleton width={160} height={20}/> : `Предстоящие (${upComingBookings.length})`}
                </button>
                <button
                    className={`tab-btn ${activeTab === 'past' ? 'active' : ''}`}
                    onClick={() => setActiveTab('past')}
                >
                   {loading ? <Skeleton width={120} height={20}/> : 'Прошедшие'} 
                </button>
            </div>

            {loadingError ? (
                <div className="loading-error-wrapper">
                    <div className="loading-error">
                        <img src={errorBookings} alt="error booking" />
                        <h3>Не удалось загрузить данные</h3>
                        <p>Произошла ошибка при загрузке ваших бронирований</p>
                        <button 
                            className="button-green btn-Error"
                            onClick={() => setRetryCount(prev => prev + 1)}
                        >
                            Попробовать снова
                        </button>
                    </div>
                </div>
            ) : (
                displayBookings.length === 0 ? (
                    <div className="empty-bookings-wrapper">
                        <div className="empty-bookings">
                            <img src={emptyBookings} alt="empty icon" />
                            <h3>Нет бронирований</h3>
                            <p>У вас пока нет предстоящих бронирований.Перейдите в раздел переговорных, чтобы забронировать комнату.</p>
                            <Link to="/" className="button-green btn-toRooms">Перейти к переговорным</Link>
                        </div>
                    </div>
                    ): (
                    <div className="booking-cards">
                        {loading ? (
                            Array(3).fill(0).map((_, index) => (
                                <BookingCard key={`skeleton-${index}`} loading={true} />
                            ))
                        ) : (
                            displayBookings.map(booking => (
                                <BookingCard 
                                    key={booking.id}
                                    title={booking.title}
                                    startsAt={booking.startsAt}
                                    roomName={booking.room?.name}
                                    floor={booking.room?.floor}
                                    duration={countDuration(booking.startsAt, booking.endsAt, booking.office?.timezone)}
                                    loading={loading}
                                    isPast={activeTab === 'past'}
                                    onCancelClick={() => setBookingToCancel(booking)}
                                />))
                        )}
                    </div>
                )
            )}
            {bookingToCancel && (
                <CancelBooking
                    bookingTitle={bookingToCancel.title}
                    roomName={bookingToCancel.room?.name}
                    roomFloor={bookingToCancel.room?.floor}
                    bookingDate={`${
                        new Date(bookingToCancel.startsAt).toLocaleString('ru-RU', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'long' 
                        }).replace(/^./, (s) => s.toUpperCase()) 
                    }, ${
                        countDuration(bookingToCancel.startsAt, bookingToCancel.endsAt, bookingToCancel.office?.timezone).slice(0, -4)
                    }`}
                    onClose={() => setBookingToCancel(null)}
                    onCancelBooking={handleCancelBooking}
                />
            )}
            
        </div>
    )
}

export default Booking;