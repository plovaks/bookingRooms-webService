import { useState, useEffect} from "react";
import OfficeSelector from "../components/OfficeSelector";
import RoomsNoOffices from "../components/RoomsStates/RoomsNoOffices";
import RoomsError from "../components/RoomsStates/RoomsError";
import RoomsEmpty from "../components/RoomsStates/RoomsEmpty";
import RoomLoadingItem from "../components/RoomItem/RoomLoadingItem";
import RoomItem from "../components/RoomItem/RoomItem";
import FiletrBar from "../components/FilterBar"
import './Rooms.css'
function Rooms(){
    const [rooms, setRooms] = useState([]); // переговорки конкретного офиса
    const [selectedOffice, setSelectedOffice] = useState(null); // выбранный офис
    const [offices, setOffices] = useState([]); // все офисы 
    const [loading, setIsLoading] = useState(false); // состояние загрузки переговорок
    const [error, setError] = useState(false); // состояние для ошибки загрузки
    
    const serverUrl = import.meta.env.VITE_API_URL;


    
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
        if (!selectedOffice) return; 

        const loadRooms = async() => {
            setIsLoading(true);
            setError(false);

            try {
                const res = await fetch(`${serverUrl}/api/v1/rooms?officeId=${selectedOffice.id}`)

                if(!res.ok){
                    throw new Error(`ошибка обращения к url: ${res.status}` );
                    
                }
                
                const data = await res.json();
                setRooms(data.items);
            

            } catch (error) {
                console.log('ошибка: ', error.status);
                setError(true);
            }finally{
                setIsLoading(false);
            }
        }

        loadRooms();
    }, [selectedOffice, serverUrl]);


    return (
        <div className="rooms-page-wrapper">
           <OfficeSelector
            selectedOffice={selectedOffice}
            onOfficeChange={setSelectedOffice}
            offices={offices}
           />
           <FiletrBar
            selectedOffice={selectedOffice}
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
                                    name={room.name}
                                    floor={room.floor}
                                    capacity={room.capacity}
                                    availability={room.available}
                                />
                        ))}
                    </div>
            </>) : (
                <RoomsEmpty/>
            )
            )}
            
            
           </div>
        </div>
        
    )
    
}

export default Rooms;