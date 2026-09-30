import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import OfficeSelector from "../../components/OfficeSelector";
import RoomsNoOffices from "../../components/RoomsStates/RoomsNoOffices";
import RoomsError from "../../components/RoomsStates/RoomsError";
import RoomsEmpty from "../../components/RoomsStates/RoomsEmpty";
import RoomLoadingItem from "../../components/RoomItem/RoomLoadingItem";
import RoomItem from "../../components/RoomItem/RoomItem";
import FiletrBar from "../../components/FilterBar"
import BookingModal from "../../components/Modals/BookingModal";
import { Toaster } from "react-hot-toast";
import './Rooms.css'
const OFFICE_STORAGE_KEY = 'selectedOfficeId';

function Rooms(){
    const [rooms, setRooms] = useState([]); // переговорки конкретного офиса
    const [offices, setOffices] = useState([]); // все офисы 
    const [loading, setIsLoading] = useState(false); // состояние загрузки переговорок
    const [error, setError] = useState(false); // состояние для ошибки загрузки
    
    const [searchParams, setsearchParams] = useSearchParams();
    const officeIdFromUrl = searchParams.get("officeId");

    const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);

    const handleOpenBooking = (room) => {
        setSelectedRoomForBooking({ ...room, officeName: selectedOffice?.name });
    };

    const handleCloseBooking = () => setSelectedRoomForBooking(null);

    const parseLocalDate = (str) => {
        const [y, m, d] = str.split('-').map(Number);
        return new Date(y, m - 1, d);
    };

    const serverUrl = import.meta.env.VITE_API_URL;

    const [filters, setFilters] = useState(() => {
    const now = new Date();
    const minutes = Math.ceil(now.getMinutes() / 15) * 15;
    
    if (minutes === 60) now.setHours(now.getHours() + 1);
    now.setMinutes(minutes % 60);

    return {
        date: now.toLocaleDateString('en-CA'), 
        time: now.toTimeString().slice(0, 5),   
        duration: 30,                           
        capacity: null
    }})

    const selectedOffice = offices.find(office => office.id === officeIdFromUrl);

    const handleOfficeChange = (office) => {
        if (office){
            setsearchParams({officeId:office.id});
            localStorage.setItem(OFFICE_STORAGE_KEY, office.id);
        }else{
            setsearchParams({});
            localStorage.removeItem(OFFICE_STORAGE_KEY);
        }
    }

    
    useEffect(() => {
        if (officeIdFromUrl) return;
        const savedOfficeId = localStorage.getItem(OFFICE_STORAGE_KEY);
        if (savedOfficeId) {
            setsearchParams({ officeId: savedOfficeId }, { replace: true });
        }
    }, [officeIdFromUrl, setsearchParams]);

    const isEventOverlappingUserTime = (eventStartsAt, eventEndsAt) => {
    
    if (!filters.date || !filters.time || filters.time.length !== 5 || !filters.duration) return false;

    const userStart = parseLocalDate(filters.date);
    const [hours, minutes] = filters.time.split(':').map(Number);
    userStart.setHours(hours, minutes, 0, 0);
    const userStartIso = userStart.toISOString();
    const userEndIso = new Date(userStart.getTime() + filters.duration * 60000).toISOString();

    return (userStartIso < eventEndsAt && userEndIso > eventStartsAt);
};

    useEffect(() => {
        const loadOffices = async () => {
            try {
                const res = await fetch(`${serverUrl}/api/v1/offices`);

                if (!res.ok) {
                    throw new Error(`Ошибка обращения к url офисов ${res.status}`);
                }

                const data = await res.json();
                setOffices(data.items);
                
            } catch (error) {
                console.log('Произошла ошибка загрузки офисов: ', error);
            }
        }
        loadOffices();
    }, [serverUrl]);


    // загрузка переговорок выбранного офиса
    useEffect(() =>{
         if (!selectedOffice) {
            setRooms([]); 
            return; 
        }

        const loadRooms = async() => {
            setIsLoading(true);
            setError(false);

            try {
                let url = `${serverUrl}/api/v1/rooms?officeId=${selectedOffice.id}`;

                if(filters.capacity){
                    url+=`&minCapacity=${filters.capacity}`;
                }

                if (filters.date && filters.time && filters.duration){
                    const fromDate = parseLocalDate(filters.date);
                    const [hours, minutes] = filters.time.split(':').map(Number);

                    fromDate.setHours(hours, minutes, 0, 0);

                    const toDate = new Date(fromDate.getTime() + filters.duration * 60000);
                    const fromIso = encodeURIComponent(fromDate.toISOString());
                    const toIso = encodeURIComponent(toDate.toISOString());

                    url+=`&from=${fromIso}&to=${toIso}`
                }

                const res = await fetch(url);

                if(!res.ok){
                    throw new Error(`ошибка обращения к url: ${res.status}` );
                    
                }
                
                const data = await res.json();
                setRooms(data.items);
            

            } catch (error) {
                console.log('ошибка загрузки переговорных: ', error);
                setError(true);
            }finally{
                setIsLoading(false);
            }
        }

        loadRooms();
    }, [selectedOffice, filters.capacity, filters.date, filters.duration, filters.time, serverUrl, reloadKey]);

    useEffect(() => {
        if (!selectedOffice) return;

        const ws = new WebSocket(`${serverUrl.replace('http', 'ws')}/api/v1/ws`);

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);

            if (message.type === 'room.availability_changed' && message.data) {
                const { roomId, officeId, startsAt, endsAt, available } = message.data;

                if (officeId != selectedOffice.id) return;

                const isOverlap = isEventOverlappingUserTime(startsAt, endsAt);

                if (isOverlap) {
                    setRooms(prevRooms => prevRooms.map(room => {
                        if (roomId != room.id) return room; 

                        const endDate = new Date(endsAt);
                        const formattedTime = `${String(endDate.getHours()).padStart(2, '0')}:${String(endDate.getMinutes()).padStart(2, '0')}`;

                        return {
                            ...room,
                            available: available, 
                            busyUntil: !available ? formattedTime : null 
                        };
                    }));
                }
            }

            if (message.type === 'data.reset') {
                localStorage.removeItem(OFFICE_STORAGE_KEY);
                setsearchParams({});
                setRooms([]);
                setSelectedRoomForBooking(null);
            }
        };

        return () => {
            ws.close();
        };
        
    }, [selectedOffice, filters.date, filters.time, filters.duration, serverUrl]);


    return (
        <div className="rooms-page-wrapper">
           <Toaster position="top-center" />
           <OfficeSelector
            selectedOffice={selectedOffice}
            onOfficeChange={handleOfficeChange}
            offices={offices}
           />
           <FiletrBar
            selectedOffice={selectedOffice}
            filters={filters}
            setFilters={setFilters}
           />
           <div className="rooms_main-content">
            {!selectedOffice && <RoomsNoOffices/>}
            {selectedOffice && (
                loading  ?  (
                <>
                    <h2 className="selectedOffice__header">Загрузка переговорных...</h2>
                    <div className="rooms_main-content__items">
                        {[1,2,3,4].map((item) => (
                            <RoomLoadingItem key={item}/>
                        ))}
                    </div>
                </>
            ): error ? (
                <RoomsError/>
            ) : rooms.length > 0 ? (<>
                    <h2 className="selectedOffice__header">Доступные переговорные в этом офисе</h2>
                    <div className="rooms_main-content__items">
                            {rooms.map((room) => (
                                <RoomItem
                                    key={room.id}
                                    id={room.id}
                                    name={room.name}
                                    floor={room.floor}
                                    capacity={room.capacity}
                                    availability={room.available}
                                    busyUntil={room.busyUntil}
                                    officeName={selectedOffice?.name}
                                    onBookClick={() => handleOpenBooking(room)}
                                />
                        ))}
                    </div>
            </>) : (
                <RoomsEmpty/>
            )
            )}
            
            {selectedRoomForBooking && (
                <BookingModal
                    room={selectedRoomForBooking}
                    initialFilters={filters}
                    onClose={handleCloseBooking}
                    onSuccess={() => setReloadKey((k) => k + 1)}
                />
            )}
           </div>
        </div>
    )
    
}

export default Rooms;