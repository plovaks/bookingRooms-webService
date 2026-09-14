import { useParams } from "react-router";
import { useState, useEffect } from "react";
import './RoomId.css'
import calendarIcon from "../../assets/calendarIcon.svg"

function RoomId(){
    const params = useParams();
    const paramId = params.id;
    // const {id} = useParams();
    const serverurl = import.meta.env.VITE_API_URL;

    const [roomDetails, setRoomDetails] = useState({});
    // дата для расписания
    const today = new Date();
    const dayLong = today.toDateString('ru-RU', { weekday: 'long' }).toLocaleUpperCase();
    const monthLong = today.toDateString('ru-RU', { month: 'long' }).toLocaleUpperCase();
    const day = today.getDate();
    const currentDate = dayLong + "," + day + monthLong;
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
                console.log(data?.features)
                
            } catch (error) {
                console.log('произошла ошибка получения данных о комнате: ', error);
            }
        }

        uploadRoomDetails(); 

    }, [paramId]);

    return (
        <div className="room-detail">
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
                    <button
                        className={`button-green btn-book`}
                    >
                        Забронировать переговорную
                    </button>
                </div>
            </div>
        </div>
    )
}
    

export default RoomId;