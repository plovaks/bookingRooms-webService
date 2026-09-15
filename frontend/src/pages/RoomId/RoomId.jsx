import { useParams } from "react-router";
import { useState, useEffect } from "react";
import RoomDetail from '../../components/RoomDetail/RoomDetail';
import BookingModal from "../../components/Modals/BookingModal";
import './RoomId.css'

function RoomId(){
    const params = useParams();
    const paramId = params.id;
    // const {id} = useParams();
    const serverurl = import.meta.env.VITE_API_URL;
    // стейт для загрузки
    const [loading, isLoading] = useState(true);
    // стейт для ошбки
    const [shceduleError, setSheduleError] = useState(false);
    // стейт для загрузки детальной инф-ии о комнате
    const [roomDetails, setRoomDetails] = useState({});
    // стейт для получения данных о бронированиях
    const [bookings, setBookings] = useState([]);
    // стейт для модального окна бронирования
    const [isModalOpen, setIsModalOpen] = useState(false);

    // получение информации о комнате
    useEffect(() => {
            const uploadRoomDetails = async() => {
    
                try {
                    const res = await fetch(`${serverurl}/api/v1/rooms/${paramId}`);
    
                    if (!res.ok){
                        throw new Error('Ошибка обращения к адресу с детальной информацией о комнате: ', res.status);
                    }
    
                    const data = await res.json();
                    setRoomDetails(data);
                    
                    
                    
                } catch (error) {
                    console.log('произошла ошибка получения данных о комнате: ', error);
                }
                finally{
                    isLoading(false);
                }
            }
    
            uploadRoomDetails(); 


    
    }, [paramId, serverurl]);

    return(
        <div className='room'>
            <RoomDetail 
                roomDetails={roomDetails}
                loading={loading}
                shceduleError={shceduleError}
            />
        </div>
    )
}
    

export default RoomId;


