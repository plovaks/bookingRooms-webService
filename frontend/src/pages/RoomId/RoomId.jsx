import { useParams } from "react-router";
import { useState, useEffect, useCallback } from "react";
import RoomDetail from '../../components/RoomDetail/RoomDetail';
import BookingModal from "../../components/Modals/BookingModal";
import './RoomId.css';

function RoomId() {
    const params = useParams();
    const paramId = params.id;
    const serverurl = import.meta.env.VITE_API_URL;

    const [loading, setLoading] = useState(true);
    const [shceduleError, setSheduleError] = useState(false);
    const [roomDetails, setRoomDetails] = useState({});
    const [bookings, setBookings] = useState([]);
    const [scheduleDate, setScheduleDate] = useState(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);

    useEffect(() => {
        const loadMe = async () => {
            try {
                const res = await fetch(`${serverurl}/api/v1/me`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const me = await res.json();
                setCurrentUserId(me.id);
            } catch (e) {
                console.error('Не удалось получить текущего пользователя:', e);
            }
        };
        loadMe();
    }, [serverurl]);

    useEffect(() => {
        const uploadRoomDetails = async () => {
            try {
                const res = await fetch(`${serverurl}/api/v1/rooms/${paramId}`);

                if (!res.ok) {
                    throw new Error(`Ошибка загрузки комнаты: HTTP ${res.status}`);
                }

                const data = await res.json();
                setRoomDetails(data);
            } catch (error) {
                console.log('произошла ошибка получения данных о комнате: ', error);
            } finally {
                setLoading(false);
            }
        };

        if (paramId) uploadRoomDetails();
    }, [paramId, serverurl]);

    function handleBookRoom() {
        setIsModalOpen(true);
    }

    const loadBookingsschedule = useCallback(async () => {
        if (!paramId) return;

        setSheduleError(false);

        try {
            const from = new Date(scheduleDate);
            from.setHours(9, 0, 0, 0);

            const to = new Date(scheduleDate);
            to.setHours(19, 59, 59, 999);

            const res = await fetch(
                `${serverurl}/api/v1/rooms/${paramId}/bookings?from=${from.toISOString()}&to=${to.toISOString()}`
            );

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            const data = await res.json();
            setBookings(data.items ?? data);
        } catch (error) {
            console.error('ошибка загрузки расписания: ', error);
            setSheduleError(true);
        }
    }, [paramId, scheduleDate, serverurl]);

    useEffect(() => {
        loadBookingsschedule();
    }, [loadBookingsschedule]);

    function handleChangeDate(newDate) {
        const d = new Date(newDate);
        d.setHours(0, 0, 0, 0);
        setScheduleDate(d);
    }

    function handleBookingSuccess() {
        loadBookingsschedule();
        setIsModalOpen(false);
    }

    return (
        <div className='room'>
            <RoomDetail
                bookings={bookings}
                roomDetails={roomDetails}
                currentDate={scheduleDate}
                loading={loading}
                shceduleError={shceduleError}
                onClick={handleBookRoom}
                currentUserId={currentUserId}
                onChangeDate={handleChangeDate}
            />

            {isModalOpen && (
                <BookingModal
                    roomId={roomDetails}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={handleBookingSuccess}
                />
            )}
        </div>
    );
}

export default RoomId;