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
    const [rooms, setRooms] = useState([]);
    const [selectedOffice, setSelectedOffice] = useState(null);
    const [offices, setOffices] = useState([]);
    const [loading, setIsLoading] = useState(false);

    const serverUrl = import.meta.env.VITE_API_URL;


    // загрузка офисов
    useEffect(() =>{
        const loadOffices = async() => {

            try {
                const res = await fetch(`${serverUrl}/api/vi/offices`);

                if(!res.ok){
                    throw new Error(`ошибка обращения к url офисов ${res.status}`);
                }

                const data = await res.json();
                setOffices(data.items);

                if (data.items.length > 0){
                    setSelectedOffice(data.items[0]);
                }
            } catch (error) {
                console.log('произошла ошибка загрузки офисов: ', error);
            }
        }

        loadOffices();
    }, []);

    // загрузка комнат
    useEffect(() =>{
        const loadRooms = async() => {
            try {
                const res = await fetch(`${serverUrl}/api/vi/`)
            } catch (error) {
                
            }
        }

        loadRooms();
    }, []);


    return (
        <>
            <OfficeSelector/>
            <FiletrBar/>
            <div className="rooms-page-wrapper">
            
            <div className="rooms_main-content__items">
                <RoomItem/>
                <RoomItem/>
                <RoomItem/>
                <RoomItem/>
            </div>
            

        </div>
        </>
        
    )
    
}

export default Rooms;